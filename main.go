package main

import (
	"net/http"
	"github.com/gorilla/websocket"
	"log"
	"fmt"
	"encoding/json"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func handler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	c := &connection{send: make(chan []byte, 256), ws: conn}
	h.register <- c
	go c.writePump()
	c.readPump()
}

var players = make([]*player, 0)

func main() {

	router.Add("register", func(data interface{}, c *connection) {
		player := data.(player)

		if player.Id == 0 {
			player.Id = int32(len(players) + 1)
			player.c = c
			players = append(players, &player)

			response := Response{
				Method: "register",
				Player: player,
			}

			resp, err := json.Marshal(response)

			if err != nil {
				fmt.Errorf("Error marshal response %v\n", err)
				return
			}

			player.c.send <- resp
			h.broadcast <- resp
		}

		fmt.Printf("Player %v\n", player)
	})

	router.Add("move", func(data interface{}, c *connection) {
		player := data.(player)

		respponse := Response{
			Method: "move",
			Player: player,
		}

		resp, err := json.Marshal(respponse)

		if err != nil {
			fmt.Errorf("Error marshal response %v\n", err)
			return
		}

		h.broadcast <- resp
	})

	//playersPool := make([]*player, 0)
	go h.run()
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/ws", handler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
