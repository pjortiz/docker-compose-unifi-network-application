# docker-compose-unifi-network-application <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->

- [Quick reference](#quick-reference)
- [Why?](#why)
- [Requirements](#requirements)
- [Docker Compose File](#docker-compose-file)
- [Quick Start](#quick-start)
- [Step by step](#step-by-step)
  - [Create a new project directory](#create-a-new-project-directory)
  - [Create the .env file](#create-the-env-file)
  - [Download Docker Compose Configuration File](#download-docker-compose-configuration-file)
  - [Launch Docker Containers](#launch-docker-containers)
  - [Open Web App](#open-web-app)
- [Remove/Uninstall](#removeuninstall)

_______________________________________

## Quick reference

- [pjortiz/docker-unifi-mongo](https://github.com/pjortiz/docker-unifi-mongo)
- [linuxserver/unifi-network-application](https://hub.docker.com/r/linuxserver/unifi-network-application) Official Image
- [Mongo](https://hub.docker.com/_/mongo) Official Image

_______________________________________

## Why?

This compose file aims to make the deployment as painless and easy as possable while still attempting to support all the Mongo versions[^1].

[^1]: I have not verified that all version are working for myself. But version 5 and 6 seem to be working during my testing.
_______________________________________

## Requirements

- A system with Docker and Docker Compose installed and working.
- A basic understanding on how to deploy docker-compose.yml files.

_______________________________________

## Docker Compose File

```yaml:docker-compose.yml
${DOCKER_COMPOSE}
```

_______________________________________

## Quick Start

Copy the below command into any CLI. [^2]

Make sure to change `MONGO_PASS` and set `MONGO_VERSION` as needed.

[^2]: For the `printf` , `curl` and `rm` commands, Windows users may need to have GitBash installed or similar that provide these CLI commands.

```Shell
cat > .env <<EOF
MONGO_PASS=changeme
MONGO_VERSION=${LATEST_VERSION}
MAC_VLAN_PARENT=
MAC_VLAN_SUBNET=
MAC_VLAN_GATEWAY=
UNIFI_STATIC_IP=
UNIFI_MAC_ADDRESS=
EOF
curl -Lf -o docker-compose.yml https://raw.githubusercontent.com/pjortiz/docker-compose-unifi-network-application/main/docker-compose.yml
docker compose -p unifi-network-application --env-file .env up --detach
```

Note: this `docker-compose.yml` uses Mongo version `${LATEST_VERSION}` by default, so specifying `MONGO_VERSION` above with the same is technically redundant.

_______________________________________

## Step by step

### Create a new project directory

Create a new project directory and name it `unifi-network-application`. Here you will place the `.env` and `docker-compose.yml` files as detailed in the next steps.

### Create the .env file

Download the `.env.template` file and rename it to `.env` or create an empty file.

Add/Change the following:

```bash:.env
MONGO_PASS=changeme             # Required
MONGO_VERSION=${LATEST_VERSION}
MAC_VLAN_PARENT=
MAC_VLAN_SUBNET=
MAC_VLAN_GATEWAY=
UNIFI_STATIC_IP=
UNIFI_MAC_ADDRESS=
```

Change the `MONGO_PASS` to what every you want. And set the `MONGO_VERSION` to meet your needs or leave default. The rest you can set to meet your needs, otherwise should be fine to leave as is, as long as your subnet matchs above and the default static IP is not in use.

### Download Docker Compose Configuration File

Either download through your browser or using the command below:

```bash
curl -Lf -o docker-compose.yml https://raw.githubusercontent.com/pjortiz/docker-compose-unifi-network-application/main/docker-compose.yml
```

### Launch Docker Containers

Open a CLI and make sure your working directory is in the same and the `.env` and `docker-compose.yml`, then run the this command:

```bash
docker compose -p unifi-network-application --env-file .env up --detach
```

### Open Web App

Open your web browser and navigate to `https://localhost:8443` or the IP/Domain of your host system.

_______________________________________

## Remove/Uninstall

To remove run the following command:

```Shell
docker compose -p unifi-network-application rm --stop
```

Add option `--volumes` after `rm` to remove volumes as well.
