# Spotify_clone

This project is a Spotify-like application with a modern UI and a robust backend designed using a microservice architecture. The backend is built with NestJS and leverages Prisma ORM, supporting both MySQL and PostgreSQL databases.

## Features

- **Microservice Architecture**: Each core feature is implemented as a separate NestJS service for scalability and maintainability.
- **Prisma ORM**: Database access is managed via Prisma, supporting both MySQL and PostgreSQL.
- **WebSocket Support**: Real-time messaging and song commenting using WebSocket.
- **RESTful APIs**: All core functionalities are exposed via RESTful endpoints.
- **JWT Authentication**: Secure authentication and authorization using JSON Web Tokens.
- **ELK Stack Integration**: Centralized logging and monitoring using Elasticsearch, Logstash, and Kibana (see `be_spotify/docker-compose.yml` and `be_spotify/logstash.conf`).
- **Docker Support**: Each service can be run in a Docker container for easy deployment and scaling. And the whole project can be run using `docker-compose` for local development.

## Backend Services

- **api_gateway**: Handles API routing and authentication.
- **service_user**: Manages user accounts and authentication.
- **service_song**: Handles song data and operations.
- **service_playlist**: Manages playlists.
- **service_comment**: Real-time comments on songs (WebSocket enabled).
- **service_message**: Real-time messaging between users (WebSocket enabled).
- **service_friend**: Friend management and social features.
- **service_follow**: User following system.

## Frontend

The frontend is located in the `FE_spotify` directory and provides a modern, responsive UI for the Spotify-like experience.

## Getting Started

1. **Clone the repository**
2. **Install dependencies** for each service and the frontend.
3. **Configure environment variables** for database connections (MySQL/PostgreSQL).
4. **Run the backend services** (see each service's README for details).
5. **Run the frontend** from the `FE_spotify` directory.

## Demo

- [YouTube Demo](https://youtu.be/F-yJoAs25vUv)

---

For more details, see the README files in each service directory.
