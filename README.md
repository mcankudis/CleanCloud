![cleancloud_logo](https://github.com/mcankudis/CleanCloud/blob/develop/client/public/banner.png?raw=true)

# CleanCloud

Visit our app at [https://cleancloud-4le4sfhova-ew.a.run.app/](https://cleancloud-4le4sfhova-ew.a.run.app/)

CleanCloud is a web application targeting companies constructing datacenters. It allows the user to find a location for their datacenter with the smallest carbon footprint. To achieve that, we use data from [ElectricityMaps](https://www.electricitymaps.com). The user can create multiple datacenters and specify their projected power consumption in order to see estimates regarding total C0<sub>2</sub> production and electricity cost. The configuration of the datacenters can be saved and shared with other users.

CleanCloud was created by a group of students from Berlin University of Technology as a project assignment in a course. The goal was to create a 'dashboard' for accessing data related to carbon intesity of electricity production and build a real-world use case around it, focusing on software engineering processes, such as working in an agile way with modern technologies, Git, and DevOps. Carbon emissions data is sourced from ElectricityMaps and energy prices are calculated based on hand picked statistical data found online.

## Our git workflow

![git_flow](https://github.com/mcankudis/CleanCloud/blob/develop/git_flow.png?raw=true)

We use conventional commits to automatically generate changelogs and version numbers.

The reason for having three permanent branches (release, main, develop) is our versioning and build flow. `Release` is protected and can only be altered by pull requests approved by a code owner, which is a standard practice, as it is automatically deployed to production. We needed the `main` branch to not be protected though, in order to run automatic versioning with a GitHub Action against it. As of writing this, GitHub Actions cannot push directly to protected branches (which is a shame, they should be able to run with the rights of the person whose action triggered the workflow). At the same time, that versioning action is why we have `develop`. Running automatic build off of `main` caused the build to trigger twice on each push, since the action's push would trigger it again.

## Infrastructure overview

The app is built in a simple client-server architecture, with a NodeJS + NestJS + MongoDB backend and a React + Vite + TailwindCSS frontend.

Using Docker, the client and server are compiled into one image, where the server, alongside handling REST API requests, serves the client's static files.

The image is built automatically by Google Cloud Build on push to `release` branch, pushed to Google Artifact Registry and run by Google Cloud Run.

A development image is built and deployed on push to `develop` branch aswell.

The MongoDB database is hosted on MongoDB Atlas.

## Organization / tickets

We use GitHub Projects to organize our work. To view the project, click [here](https://github.com/users/TeoDevGerman/projects/1/views/1). Don't use the "Projects" tab on the repository, since it links to nowerhere due to a repository transfer.

## Running and building

The project requires NodeJS > 16 to run.

For development, you will need to have a running MongoDB instance (either local or in cloud). Specify the connection string in the `.env` file in the `server` directory to connect to it.

Alternatively, you can use Docker to run the project. You will need to have Docker installed and running on your machine. MongoDB is still needed if you want to use Docker. The client will be served by the server. Fill out the env variables berfore building the image (see below).

Unless you provide the PORT environment variable, the app will run on port 3545.

### Docker (server + client)

In the root directory, run:

```bash
docker build --tag=<image-tag,f.e.cleancloud> .
docker run -it -d -p 3545:3545 cleancloud
```

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
