# Server Documentation

## Overview

The server is designed to fetch data from the external Mastodon API and save the necessary data in the Gun.js database. The API includes getting specific account information, account searches/finds, follower/following lists, post lists, and post details. OpenAPI 3 standard Documentation provides instructions and examples for these APIs at [/api/v1/docs/](http://localhost:10000/api/v1/docs/).

## How to run

### Running on local machine with npm installed

```bash
cd server
npm install
node server.js
```

Note: by default, the port is set to 10000.

### Running with a Docker Image as a container

```bash
cd server
docker build -t tdd/server .
docker run -p 8080:10000 -d tdd/server
```

Note: the number 8080 can be replaced with any port number on local machine.

## Future Work

- Create structured data models for accounts, posts, etc. and integrate with the Gun.js database

- Develop controllers for data management -- save, access and update

- Detailed documentation of each API route -- error handling, expected response, parameters. Make sure easy to understand
