---
title: Docker
description: citydb-3dtiler Docker documentation and usage examples
icon: material/docker
tags:
  - citydb-3dtiler
  - docker
---

The `citydb-3dtiler` Docker images expose the capabilities of the [`citydb-3dtiler`](index.md) CLI for dockerized
applications and workflows. Using Docker is the quickest way to get started, as the images include Python, the
PostgreSQL client and the 3D Tiles generator [pg2b3dm](https://github.com/Geodan/pg2b3dm){target="blank"}. See
[here](../first-steps/docker.md#get-docker) for more on how to get Docker.

## TL;DR

=== "Linux"

    ```bash
    docker run --rm --name citydb-3dtiler [-i -t] \
      [-v /my/data/:/home/tester/citydb-3dtiler/shared:rw] \
    tumgis/citydb-3dtiler[:TAG] \
      [--db-host the.host.de] [--db-port 5432] \
      [--db-name theDBName] [--db-schema theCityDBSchemaName] \
      [--db-username theUsername] [--db-password theSecretPass] \
      COMMAND [OPTIONS]
    ```

=== "Windows CMD"

    ```bat
    docker run --rm --name citydb-3dtiler [-i -t] ^
      [-v "c:\users\me\mydata:/home/tester/citydb-3dtiler/shared:rw"] ^
    tumgis/citydb-3dtiler[:TAG] ^
      [--db-host the.host.de] [--db-port 5432] ^
      [--db-name theDBName] [--db-schema theCityDBSchemaName] ^
      [--db-username theUsername] [--db-password theSecretPass] ^
      COMMAND [OPTIONS]
    ```

=== "PowerShell"

    ```powershell
    docker run --rm --name citydb-3dtiler [-i -t] `
      [-v "c:\users\me\mydata:/home/tester/citydb-3dtiler/shared:rw"] `
    tumgis/citydb-3dtiler[:TAG] `
      [--db-host the.host.de] [--db-port 5432] `
      [--db-name theDBName] [--db-schema theCityDBSchemaName] `
      [--db-username theUsername] [--db-password theSecretPass] `
      COMMAND [OPTIONS]
    ```

## Image versions

The `citydb-3dtiler` images are available from two registries:

- Docker Hub: [`tumgis/citydb-3dtiler`](https://hub.docker.com/r/tumgis/citydb-3dtiler){target="blank"}
- GitHub Container Registry: [`ghcr.io/3dcitydb/citydb-3dtiler`](https://github.com/3dcitydb/citydb-3dtiler/pkgs/container/citydb-3dtiler){target="blank"}

Both registries provide the same images, so you can use them interchangeably in all examples. The following tags are
available:

| Tag       | Description                                                                                       |
|-----------|---------------------------------------------------------------------------------------------------|
| `latest`  | Latest image built from the `main` branch of the [GitHub repository](https://github.com/3dcitydb/citydb-3dtiler){target="blank"}. |
| `x.y.z`   | Image of a specific release, e.g. `0.9.4`. See the [releases](https://github.com/3dcitydb/citydb-3dtiler/releases){target="blank"} for available versions. |

```bash
docker pull tumgis/citydb-3dtiler:latest
docker pull ghcr.io/3dcitydb/citydb-3dtiler:latest
```

## Usage and configuration

### Help and CLI documentation

The image runs the `citydb-3dtiler` main command automatically. To show the help message, run the image with the
`--help` option, optionally after the name of a command:

```bash
docker run --rm tumgis/citydb-3dtiler --help
docker run --rm tumgis/citydb-3dtiler tile --help
```

See the [CLI documentation](cli.md) for all available options and commands.

### Mounts for input and output files

The container uses the folder `/home/tester/citydb-3dtiler/shared` as working directory for input and output files.
Mount a folder of your host system to this path to:

- provide a custom [materials file](tile.md#custom-materials) (`materials_for_features.csv`),
- read and keep the `advice.yml` file created by the [`advise`](advise.md) command, and
- retrieve the generated 3D Tiles.

The examples on this page mount the current directory `./`. If no `materials_for_features.csv` file is found in the
mounted folder, the default materials included in the image are used.

!!! note
    If your Docker version does not accept relative paths like `./` for bind mounts, use an absolute path instead,
    e.g. `$(pwd)` on Linux, `%cd%` on Windows CMD or `${PWD}` in PowerShell.

### Database connection

The connection to the 3DCityDB is configured with the [database connection options](database.md). When the 3DCityDB
runs in a Docker container on the same machine, `localhost` does not refer to your host inside the `citydb-3dtiler`
container. See [here](database.md#connecting-to-a-3dcitydb-docker-container) for hints.

## Examples

### Create an advice file

=== "Linux"

    ```bash
    docker run --rm -i -t --name citydb-3dtiler \
      -v ./:/home/tester/citydb-3dtiler/shared:rw \
    tumgis/citydb-3dtiler:latest \
      --db-host my.host.de --db-port 5432 \
      --db-name citydb --db-schema citydb \
      --db-username postgres --db-password changeMe \
      advise
    ```

=== "Windows CMD"

    ```bat
    docker run --rm -i -t --name citydb-3dtiler ^
      -v ./:/home/tester/citydb-3dtiler/shared:rw ^
    tumgis/citydb-3dtiler:latest ^
      --db-host my.host.de --db-port 5432 ^
      --db-name citydb --db-schema citydb ^
      --db-username postgres --db-password changeMe ^
      advise
    ```

=== "PowerShell"

    ```powershell
    docker run --rm -i -t --name citydb-3dtiler `
      -v ./:/home/tester/citydb-3dtiler/shared:rw `
    tumgis/citydb-3dtiler:latest `
      --db-host my.host.de --db-port 5432 `
      --db-name citydb --db-schema citydb `
      --db-username postgres --db-password changeMe `
      advise
    ```

### Generate 3D Tiles

=== "Linux"

    ```bash
    docker run --rm -i -t --name citydb-3dtiler \
      -v ./:/home/tester/citydb-3dtiler/shared:rw \
    tumgis/citydb-3dtiler:latest \
      --db-host my.host.de --db-port 5432 \
      --db-name citydb --db-schema citydb \
      --db-username postgres --db-password changeMe \
      tile
    ```

=== "Windows CMD"

    ```bat
    docker run --rm -i -t --name citydb-3dtiler ^
      -v ./:/home/tester/citydb-3dtiler/shared:rw ^
    tumgis/citydb-3dtiler:latest ^
      --db-host my.host.de --db-port 5432 ^
      --db-name citydb --db-schema citydb ^
      --db-username postgres --db-password changeMe ^
      tile
    ```

=== "PowerShell"

    ```powershell
    docker run --rm -i -t --name citydb-3dtiler `
      -v ./:/home/tester/citydb-3dtiler/shared:rw `
    tumgis/citydb-3dtiler:latest `
      --db-host my.host.de --db-port 5432 `
      --db-name citydb --db-schema citydb `
      --db-username postgres --db-password changeMe `
      tile
    ```

See [here](examples.md) for more examples.

### Inspect the container

To investigate the contents of the image, for example for development purposes, override the entrypoint and start an
interactive shell:

```bash
docker run --rm -i -t --name citydb-3dtiler \
  -v ./:/home/tester/citydb-3dtiler/shared:rw \
  --entrypoint /bin/bash \
tumgis/citydb-3dtiler:latest
```

## Build your own images

To build an image from source, clone the [GitHub repository](https://github.com/3dcitydb/citydb-3dtiler){target="blank"}
and run `docker build` in the repository root:

```bash
git clone https://github.com/3dcitydb/citydb-3dtiler.git
cd citydb-3dtiler
docker build -t citydb-3dtiler:custom-build .
```

The resulting image is used just like the published images, e.g. `docker run --rm citydb-3dtiler:custom-build --help`.

## Cleanup

All `citydb-3dtiler` images and containers are labeled with `composition=citydb-3dtiler`. Use this label to remove
them, for example to update to the latest image:

=== "Containers and images"

    ```bash
    docker rm --force $(docker ps --all --quiet --filter label=composition=citydb-3dtiler)
    docker rmi --force $(docker image ls --quiet --filter label=composition=citydb-3dtiler)
    ```

=== "Containers only"

    ```bash
    docker rm --force $(docker ps --all --quiet --filter label=composition=citydb-3dtiler)
    ```

=== "Images only"

    ```bash
    docker rmi --force $(docker image ls --quiet --filter label=composition=citydb-3dtiler)
    ```

!!! tip
    Alternatively, update an image to the latest version with `docker pull tumgis/citydb-3dtiler:latest`.
