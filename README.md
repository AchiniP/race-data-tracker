# race-data-tracker
The main purpose of this repository is to fetch data from an external API and save in mongo DB.

# Table of contents:
- [Pre-reqs](#pre-reqs)
- [Getting started](#getting-started)
- [Dependencies](#dependencies)
- [Assumptions](#assumptions)

# Pre-reqs
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [Docker](https://docs.docker.com/get-docker/)

# Getting started

- Clone the repository
```
git clone https://github.com/AchiniP/race-data-tracker.git <project_name>
```

- Install dependencies
```
cd <project_name>
npm install
```

- Build and run the project
```
npm run execute
```

- To start the project in docker environment
```
docker-compose up --build
```

- To run the unit tests
```
npm run test
```
# Dependencies
### Additional Libraries added
- axios (Promise based HTTP client)
- mongoose (mongoDB ODM)  
- dotenv (Loads environment variables from .env file)
- winston (logger library)
  
#### dev dependencies
- babel (transpiler)
- eslint (for linting)
- jest (for TDD - unit testing)
- mongodb-memory-server (mongodb mock server for testing) 
  <br>
  <br>


# Assumptions
### Design Assumptions

Since we dont have any visibility on the server app, Client side polling is implemented. 
For this kind of scenario where we need to publish and subscripe the events, using websockets/server sent Events (when browser is the client)
would be ideal.
