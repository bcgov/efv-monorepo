package main

import (
	"fmt"
	"log"
	"net/http"

	"efv-api/internal/handlers"
	"efv-api/internal/router"
)

func main() {
	// Initialize router
	r := router.NewRouter()

	// Setup routes
	handlers.RegisterRoutes(r)

	// Start server
	port := ":8080"
	fmt.Printf("Starting server on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}
