# CleanCloud

## Server

```bash
$ cd server/
```

### Installation

```bash
$ npm i
```

### Environment variables

Copy `.env.example` to `.env` and fill in the values.

```bash
$ cp .env.example .env
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```

## Client

```bash
$ cd client/
```

### Installation

```bash
$ npm i
```

### Running the app

```bash
# development
$ npm run dev

# build
$ npm run build
```

## Our git workflow

![git_flow](https://github.com/mcankudis/CleanCloud/blob/develop/git_flow.png?raw=true)

## Infrastructure overview

The app is built in a simple client-server architecture, with a NodeJS + NestJS + MongoDB backend and a React + Vite + TailwindCSS frontend.

Using Docker, the client and server are compiled into one image, where the server, alongside handling REST API requests, serves the client's static files.

The image is built automatically by Google Cloud Build on push to `release` branch, pushed to Google Artifact Registry and run by Google Cloud Run.

A development image is built and deployed on push to `develop` branch aswell.

The MongoDB database is hosted on MongoDB Atlas.
