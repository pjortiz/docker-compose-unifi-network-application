# docker-compose-unifi-network-application

## Quick reference

- [linuxserver/unifi-network-application](https://hub.docker.com/r/linuxserver/unifi-network-application) Official Image
- [Mongo](https://hub.docker.com/_/mongo) Official Image
- Docker compose build [wiki](https://docs.docker.com/compose/compose-file/build/)

## Why?

(Rant, please feel free to skip ahead..)

While I myself am a person in the tech industry and deal with similar systems and tools on my day to day, I found the Linuxserver instructions in their README vary vague and required a high bar to entry in comparison to the simple plug and play effort that was required for the now deprecated [Unifi Controller](https://hub.docker.com/r/linuxserver/unifi-controller). I understand there were some issues maintaining the single image with the Unifi software and MongoDB, but by not specifying a recommended or suggested Mongo version, this now requires the end user to understand the nuances across the many compatible version. The biggest being, the changes between Mongo versions 5 to 6, on how the `mongo` command was change to `mongosh`. In addition, while should not be terribly difficult access the Docker host filesystem, having to prepare the init script and attach it as a volume just adds another thing for the end user to manage and think about. All of these nuances can compound into multifaceted issues that the user now need to debug. I understand it is not reasonable to expect Linuxserver, or any other developer, to cater to every possible end user's use-case, we could at least expect a base example that covers 80-90% of them. Anyway, this compose file aims to do just that While still attempting to support all the Mongo versions[^1].

## Requirements

- A system with Docker and Docker Compose installed and working.
- A basic understanding on how to deploy docker-compose.yml files.

## Quick Start

```Shell
echo MONGO_PASS=changeme > .env && curl -Lf -o docker-compose.yml https://raw.githubusercontent.com/pjortiz/docker-compose-unifi-network-application/main/docker-compose.yml && docker compose --env-file .env up --detach
```

## Adding your own scripts
If you need a custom script based on your needs. After forking/clone this repo create a directory under `scripts` with your specific Mongo version tag, then add your script(s) in that new directory. Then update the `build.context` in `docker-compose.yml` to either `.` for local execution or the url of your forked repo.

## Footnotes

[^1]: I have not verified that all version are working for myself. But version 5 and 6 seem to be working during my testing.
