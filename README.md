# Book Management

## Description
A full-stack application that allows users to manage books using MongoDB for storage and Elasticsearch for powerful full-text search capabilities.

## Features
- **Add** books to the collection.
- **View** details of books.
- **Search** books using Elasticsearch for fast, full-text search.
- **Delete** books from the collection.

## Technologies
- **Frontend**: Next.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Search Engine**: Elasticsearch
- **Deployment**: Docker (for local development and containerization)

## Setup Instructions

### Prerequisites
Before setting up the project, ensure you have the following installed on your machine:
- **Docker**: [Download Docker](https://www.docker.com/get-started)
- **Git**: [Download Git](https://git-scm.com/downloads)

### Steps to Set Up

1. **Clone the repository** to your local machine:
    ```bash
    git clone https://github.com/codewithjk/books-management.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd books-management
    ```

3. **Build and start Docker containers** using Docker Compose:
    ```bash
    docker-compose up --build
    ```
    - This will automatically set up the necessary containers for MongoDB, Elasticsearch, the backend, and the frontend.

4. **Access the application**:
    - Frontend (React): [http://localhost:3000](http://localhost:3000)
    - Backend (Node.js/Express): [http://localhost:8000](http://localhost:8000)

> Note: The backend and frontend will be available on the respective ports, and the Docker Compose file will ensure they communicate with each other.

## Database and Elasticsearch Setup
- MongoDB and Elasticsearch are automatically set up using **Docker Compose**. This allows for quick local development without manual setup.
- **Persistent Volumes**:
  - `mongodata` for MongoDB
  - `esdata` for Elasticsearch
  - These ensure that your data persists across container restarts.

## API Documentation
- The API documentation for all available routes and endpoints can be found in the [API Documentation](https://documenter.getpostman.com/view/32775869/2sAYQcFANr).


Feel free to reach out if you have any questions or issues!

