# CleanCloud

CleanCloud is a web application targeting companies constructing datacenters. It allows the user to find a location for their datacenter with the smallest carbon footprint. To achieve that, we use data from [ElectricityMaps](https://www.electricitymaps.com). The user can create multiple datacenters and specify their projected power consumption in order to see estimates regarding total C0<sub>2</sub> production and electricity cost. The configuration of the datacenters can be saved and shared with other users.

CleanCloud was created by a group of students from Berlin University of Technology as a project assignment in a course. The goal was to create a 'dashboard' for accessing data related to carbon intesity of electricity production and build a real-world use case around it, focusing on software engineering processes, such as working in an agile way with modern technologies, Git, and DevOps. Carbon emissions data is sourced from ElectricityMaps and energy prices are calculated based on hand picked statistical data found online.

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

## Running and building

### Server

```bash
$ cd server/
```

#### Environment variables

Copy `.env.example` to `.env` and fill in the values.

```bash
$ cp .env.example .env
```

#### Installation

```bash
$ npm i
```

#### Running the server

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod

# build
$ npm run build
```

### Client

```bash
$ cd client/
```

#### Installation

```bash
$ npm i
```

#### Running the client

```bash
# development
$ npm run dev

# build
$ npm run build
```

## Our git workflow

![git_flow](https://github.com/mcankudis/CleanCloud/blob/develop/git_flow.png?raw=true)
