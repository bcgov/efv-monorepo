package router

import (
	"github.com/gorilla/mux"
)

// NewRouter creates and returns a new router instance
func NewRouter() *mux.Router {
	r := mux.NewRouter()
	r.StrictSlash(true)
	return r
}
