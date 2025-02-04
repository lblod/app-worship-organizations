# Worship Organizations

Backend for the worship organizations application, based on the mu.semte.ch microservices stack.

## Running and maintaining

General information on running, maintaining and installing the stack.

### How to setup the stack

> **Prerequisites**
> - [docker](https://docs.docker.com/get-docker/), [docker-compose](https://docs.docker.com/get-docker/) and [git](https://git-scm.com/downloads) are installed on your system
> - [cloned the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

#### Running the dev. setup

Move in to the directory:
```shell
cd app-worship-organizations
```
Start the system:
```shell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```
> docker-compose **up** CLI [reference](https://docs.docker.com/compose/reference/up/).

Wait for everything to boot to ensure clean caches. You may choose to monitor the migrations service in a separate terminal to and wait for the overview of all migrations to appear:

```shell
docker-compose logs -f --tail=100 migrations
```
> docker-compose **logs** CLI [reference](https://docs.docker.com/compose/reference/logs/).

You might find the above `docker-compose up` command tedious. To simplify it's usage we can define the `COMPOSE_FILE` variable in our environment.

Create an `.env` file in the root of the project with the following contence:
```shell
COMPOSE_FILE=docker-compose.yml:docker-compose.dev.yml
```
> docker-compose CLI env. vars. [reference](https://docs.docker.com/compose/reference/envvars/)

Start the system:
```shell
docker-compose up
```

## Ingesting data

The app comes with no data, because it depends on external datasources.
  *  [Administrative units and mandates (sourced by OP)](https://organisaties.abb.vlaanderen.be)
  *  [Positions and personal information (sourced by loket)](https://loket.lokaalbestuur.vlaanderen.be/)

The ingestion should be a one time operation per deployment, and is currenlty semi-automatic for various reasons (mainly related to performance)
The ingestion is disabled by default.

To proceed:
1. Make sure the app is up and running and the migrations have run
2. In docker-compose.override.yml (preferably), override the following parameters for the two consumers:
```
# (...)
  worship-services-sensitive-consumer:
    environment:
      DCR_SYNC_BASE_URL: 'https://loket.lblod.info/' # The endpoint of your choice (see later what to choose)
      DCR_SYNC_LOGIN_ENDPOINT: 'https://loket.lblod.info/sync/worship-services-sensitive-deltas/login'
      DCR_SECRET_KEY: "the-key-of-interest"
      DCR_LANDING_ZONE_DATABASE: "triplestore"
      DCR_REMAPPING_DATABASE: "triplestore"
      DCR_DISABLE_DELTA_INGEST: "true"
      DCR_DISABLE_INITIAL_SYNC: "false"
  worship-posts-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://organisaties.abb.lblod.info/"
      DCR_LANDING_ZONE_DATABASE: "triplestore"
      DCR_REMAPPING_DATABASE: "triplestore"
      DCR_DISABLE_DELTA_INGEST: "true"
      DCR_DISABLE_INITIAL_SYNC: "false"
```

1. `docker-compose up -d worship-services-sensitive-consumer worship-posts-consumer` should start the ingestion. This might take a while if you ingest production data.

2. Check the logs, at some point this message should show up for the two consumers: `Proceeding in Normal operation mode: ingest deltas`

3. The dispatching service `positions-dispatcher` should now start being active (check for log `Initial syncs done, starting initial dispatch`), dispatching the initial data and then the live sync data.

4. Once everything is done, you can set up the live sync
```
# (...)
  worship-services-sensitive-consumer:
    environment:
      DCR_LANDING_ZONE_DATABASE: "db"
      DCR_REMAPPING_DATABASE: "db"
      DCR_DISABLE_DELTA_INGEST: "false"
      DCR_DISABLE_INITIAL_SYNC: "false"
  worship-posts-consumer:
    environment:
      DCR_LANDING_ZONE_DATABASE: "db"
      DCR_REMAPPING_DATABASE: "db"
      DCR_DISABLE_DELTA_INGEST: "false"
      DCR_DISABLE_INITIAL_SYNC: "false"
```
