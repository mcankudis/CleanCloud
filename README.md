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

We use conventional commits to automatically generate changelogs and version numbers.

## Infrastructure overview

The app is built in a simple client-server architecture, with a NodeJS + NestJS + MongoDB backend and a React + Vite + TailwindCSS frontend.

Using Docker, the client and server are compiled into one image, where the server, alongside handling REST API requests, serves the client's static files.

The image is built automatically by Google Cloud Build on push to `release` branch, pushed to Google Artifact Registry and run by Google Cloud Run.

A development image is built and deployed on push to `develop` branch aswell.

The MongoDB database is hosted on MongoDB Atlas.

## Organization / tickets

We use GitHub Projects to organize our work. To view the project, click [here](https://github.com/users/TeoDevGerman/projects/1/views/1). Don't use the "Projects" tab on the repository, since it links to nowerhere due to a repository transfer.
