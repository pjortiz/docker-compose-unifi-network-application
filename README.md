# docker-compose-unifi-network-application <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->

- [Quick reference](#quick-reference)
- [Why?](#why)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Step by step](#step-by-step)
  - [Create a new project directory](#create-a-new-project-directory)
  - [Create the .env file](#create-the-env-file)
  - [Download Docker Compose Configuration File](#download-docker-compose-configuration-file)
  - [Launch Docker Containers](#launch-docker-containers)
  - [Open Web App](#open-web-app)
- [Adding your own scripts](#adding-your-own-scripts)
- [Remove/Uninstall](#removeuninstall)

_______________________________________

## Quick reference

- [linuxserver/unifi-network-application](https://hub.docker.com/r/linuxserver/unifi-network-application) Official Image
- [Mongo](https://hub.docker.com/_/mongo) Official Image
- Docker compose build [wiki](https://docs.docker.com/compose/compose-file/build/)

_______________________________________

## Why?

(Rant, please feel free to skip ahead..)

While I myself am a person in the tech industry and deal with similar systems and tools on my day to day, I found the Linuxserver instructions in their README vary vague and required a high bar to entry in comparison to the simple plug and play effort that was required for the now deprecated [Unifi Controller](https://hub.docker.com/r/linuxserver/unifi-controller). I understand there were some issues maintaining the single image with the Unifi software and MongoDB, but by not specifying a recommended or suggested Mongo version, this now requires the end user to understand the nuances across the many compatible version. The biggest being, the changes between Mongo versions 5 to 6, on how the `mongo` command was change to `mongosh`. In addition, while should not be terribly difficult access the Docker host filesystem, having to prepare the init script and attach it as a volume just adds another thing for the end user to manage and think about. All of these nuances can compound into multifaceted issues that the user now need to debug. I understand it is not reasonable to expect Linuxserver, or any other developer, to cater to every possible end user's use-case, we could at least expect a base example that covers 80-90% of them. Anyway, this compose file aims to do just that while still attempting to support all the Mongo versions[^1].

[^1]: I have not verified that all version are working for myself. But version 5 and 6 seem to be working during my testing.
_______________________________________

## Requirements

- A system with Docker and Docker Compose installed and working.
- A basic understanding on how to deploy docker-compose.yml files.
_______________________________________

## Quick Start

Copy the below command into any CLI. [^2]

Make sure to change `MONGO_PASS` and set `MONGO_VERSION` as needed.

[^2]: For the `printf` , `curl` and `rm` commands, Windows users may need to have GitBash installed or similar that provide these CLI commands.

```Shell
printf "MONGO_VERSION=6.0.15\nMONGO_PASS=changeme" > .env && curl -Lf -o docker-compose.yml https://raw.githubusercontent.com/pjortiz/docker-compose-unifi-network-application/main/docker-compose.yml && docker compose -p unifi-network-application --env-file .env up --detach
```

Note: this `docker-compose.yml` uses Mongo version `6.0.15` by default, so specifying `MONGO_VERSION` above with the same is technically redundant.

Clean up left over files if needed with below command.

```
rm -f .env docker-compose.yml
```

_______________________________________

## Step by step

### Create a new project directory

Create a new project directory and all it unifi-network-application. Here you will place the `.env` and `docker-compose.yml` files as detailed in the next steps.

### Create the .env file

Download the `.env.template` file and rename it to `.env` or create an empty.

Add/Change the following:

```
MONGO_VERSION=6.0.15    # Optional, if not provided uses default
MONGO_PASS=changeme     # Required
```

Change the `MONGO_PASS` to what every you want. And set the `MONGO_VERSION` to meet your needs or leave default.

### Download Docker Compose Configuration File

Either download through your browser or using the command below:

```
curl -Lf -o docker-compose.yml https://raw.githubusercontent.com/pjortiz/docker-compose-unifi-network-application/main/docker-compose.yml
```

### Launch Docker Containers

Open a CLI and make sure your working directory is in the same and the `.env` and `docker-compose.yml`, then run the this command:

```
docker compose -p unifi-network-application --env-file .env up --detach
```

### Open Web App

Open your web browser and navigate to `https://localhost:8443` or the IP/Domain of your host system.

_______________________________________

## Adding your own scripts

If you need a custom script based on your needs. After forking/clone this repo create a directory under `scripts` with your specific Mongo version tag, then add your script(s) in that new directory. Then update the `build.context` in `docker-compose.yml` to either `.` for local execution or the url of your forked repo.

## Remove/Uninstall
To remove run the following command:

```Shell
docker compose -p unifi-network-application rm --stop
```

Add option `--volumes` after `rm` to remove volumes as well.


[def]: #docker-compose-unifi-network-application