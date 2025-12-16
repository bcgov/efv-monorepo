package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

// RegisterRoutes registers all API routes
func RegisterRoutes(r *mux.Router) {
	// Health check endpoint
	r.HandleFunc("/health", HealthCheck).Methods("GET")
	
	// API routes will be added here
	api := r.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/data", GetMockData).Methods("GET")
}

// HealthCheck handles health check requests
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
	})
}

// GetMockData handles requests for mock data
func GetMockData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Mock data endpoint",
	})
}
