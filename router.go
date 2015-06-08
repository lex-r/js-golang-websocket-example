package main
import (
	"encoding/json"
	"fmt"
)

type Router struct {
	routes map[string]func(interface{}, *connection)
}

func NewRouter() *Router {
	return &Router{
		routes: make(map[string]func(interface{}, *connection)),
	}
}

func (r *Router) Add(name string, function func(interface{}, *connection)) {
	r.routes[name] = function
}

func (r *Router) Dispatch(data []byte, c *connection) {
	req := &Request{}
	err := json.Unmarshal(data, req)

	if err != nil {
		fmt.Printf("Request unmarshal error: %v\n", err)
		return
	}

	method, ok := r.routes[req.Method]

	if !ok {
		fmt.Printf("Method '%v' not found\n", req.Method)
		return
	}

	method(req.Player, c)
}

var router = NewRouter()

