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
networks:
  # ---------------------------------------------------------------------------
  # Optional: Use this network or your own if you intend to configure the 
  #           unifi-network-application container through a revers proxy, 
  #           otherwise not needed.
  # ---------------------------------------------------------------------------
  # proxy-network: 
  #   external: true

  # ---------------------------------------------------------------------------
  # Recommended: Use macvlan network in conjuction with the internal network in 
  #              order to allow the unifi-network-application container to 
  #              communicate with your unifi devices and restrict access to 
  #              unifi-mongo container, otherwise you may need to use host 
  #              network mode for both containers.
  # ---------------------------------------------------------------------------
  unifi-internal:
    internal: true
  unifi-external: 
    driver: macvlan
    driver_opts:
      parent: ${MAC_VLAN_PARENT:-eth0}               # replace with your hosts interface 
    ipam:
      config:
        - subnet: ${MAC_VLAN_SUBNET:-192.168.1.0/24} # replace with your network subnet
          gateway: ${MAC_VLAN_GATEWAY:-192.168.1.1}  # replace with your network gateway

volumes: 
  unifi_mongo_data:
  unifi-config:
  
services:
  unifi-mongo:
    # ---------------------------------------------------------------------------
    # IMPORTANT: DO NOT use 'latest' tag for mongo image to avoid unintentional
    #            updates that may break the unifi-network-application container.
    #            If you have watchtower, disable auto update for this container.
    # ---------------------------------------------------------------------------
    image: portiz93/unifi-mongo:${MONGO_VERSION:-}    # Required MONGO_VERSION
    container_name: unifi-mongo
    environment:
      - MONGO_USER=${MONGO_USER:-unifi}                     # Default "unifi"
      - MONGO_PASS=${MONGO_PASS:?Mongo Password Required}   # Required
      - MONGO_DBNAME=${MONGO_DBNAME:-unifi}                 # Default "unifi"
      # -------------------------------------------------------------------------
      # Note: For mongodb version 6.0 and above, do not set MONGO_INITDB_ROOT_USERNAME
      #       and MONGO_INITDB_ROOT_PASSWORD as they are not required. 
      #       See official Mongo image for details.
      # -------------------------------------------------------------------------
      # - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME:-root}
      # - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD:?Root Password Required}
    volumes:
      - unifi_mongo_data:/data/db
    # ports: # Optional, only port if needed outside of unifi app
    #   - 27017:27017
    networks:
      - unifi-internal
    restart: unless-stopped

  unifi-network-application:
    image: linuxserver/unifi-network-application:latest
    container_name: unifi-network-application
    depends_on: 
      unifi-mongo: 
        condition: service_healthy
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - MONGO_USER=${MONGO_USER:-unifi}                     # Required, Default "unifi"
      - MONGO_PASS=${MONGO_PASS:?Mongo Password Required}   # Required, Note some special charactor could cause failure to connect to MondoDB
      - MONGO_DBNAME=${MONGO_DBNAME:-unifi}                 # Required, Default "unifi"
      - MONGO_HOST=unifi-mongo                              # Required, must match the mongo container name
      - MONGO_PORT=27017                                    # Required, Must be that same as the mongo container defined port
      # - MEM_LIMIT=1024                                    # optional
      # - MEM_STARTUP=1024                                  # optional
      # - MONGO_TLS=                                        # optional
      # - MONGO_AUTHSOURCE=                                 # optional
    volumes:
      - unifi-config:/config
    ports:
      - 8443:8443          # Unifi web admin port
      # - 3478:3478/udp      # Unifi STUN port, required for remote access.
      - 10001:10001/udp    # Required for AP discovery
      - 8080:8080          # Required for device communication
      - 1900:1900/udp      # Required for Make controller discoverable on L2 network option
      # - 8843:8843          # optional Unifi guest portal HTTPS redirect port
      # - 8880:8880          # optional Unifi guest portal HTTP redirect port
      # - 6789:6789          # optional For mobile throughput test
      # - 5514:5514/udp      # optional Remote syslog port
    networks:
      # proxy-network:       # optional
      unifi-internal:
      unifi-external:
        ipv4_address: ${UNIFI_STATIC_IP:-192.168.1.11}         # Set a static IP address, must be in the subnet of the macvlan network 
        mac_address: ${UNIFI_MAC_ADDRESS:-"02:42:c0:a8:01:64"} # optional, set a static MAC address if needed
    restart: unless-stopped
```

_______________________________________

## Quick Start

Copy the below command into any CLI. [^2]

Make sure to change `MONGO_PASS` and set `MONGO_VERSION` as needed.

[^2]: For the `printf` , `curl` and `rm` commands, Windows users may need to have GitBash installed or similar that provide these CLI commands.

```Shell
cat > .env <<EOF
MONGO_PASS=changeme
MONGO_VERSION=
MAC_VLAN_PARENT=
MAC_VLAN_SUBNET=
MAC_VLAN_GATEWAY=
UNIFI_STATIC_IP=
UNIFI_MAC_ADDRESS=
EOF
curl -Lf -o docker-compose.yml https://raw.githubusercontent.com/pjortiz/docker-compose-unifi-network-application/main/docker-compose.yml
docker compose -p unifi-network-application --env-file .env up --detach
```

Note: this `docker-compose.yml` uses Mongo version `` by default, so specifying `MONGO_VERSION` above with the same is technically redundant.

_______________________________________

## Step by step

### Create a new project directory

Create a new project directory and name it `unifi-network-application`. Here you will place the `.env` and `docker-compose.yml` files as detailed in the next steps.

### Create the .env file

Download the `.env.template` file and rename it to `.env` or create an empty file.

Add/Change the following:

```bash:.env
MONGO_PASS=changeme             # Required
MONGO_VERSION=
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
