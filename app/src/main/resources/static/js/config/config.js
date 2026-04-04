// config.js

/**
 * Configuration file for defining global constants and environment-specific settings.
 *
 * API_BASE_URL:
 * - Base URL for all API requests made from the frontend.
 * - Easily switchable for different environments (development, staging, production).
 *
 * Example usage:
 *   fetch(`${API_BASE_URL}/api/appointments`)
 */

// FIX: was 8080, but application.properties sets server.port=9090
export const API_BASE_URL = "http://localhost:9090";