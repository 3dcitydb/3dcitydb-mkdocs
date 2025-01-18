---
# title: Docker
subtitle: CityDB tool Docker documentation
description: CityDB tool Docker documentation and usage examples
icon: fontawesome/brands/docker
status: wip
tags:
  - docker
  - citydb-tool
---

<!--

<eMailaddr>
<link>
<link in new tab>{target="_blank"}
[Open Link](https://www.werder.de)
[Open in new tab](https://www.werder.de){target="_blank"}

# Admonitions
[!!!|???] note|abstract|info|tip|success|question|warning|failure|danger|bug|example|quote [inline|inline end] "Der Title statt Note|..."
    Content content

# Images
![Image title](https://dummyimage.com/600x400/eee/aaa){ align=left }

![Image title](https://dummyimage.com/600x400/){ width="300" }
/// caption
Image caption
///

# Figures
![Image title](https://dummyimage.com/600x400/){ width="300" }
/// figure-caption
Image caption
///

-->

# Using CityDB tool with Docker

The CityDB tool Docker images expose the capabilities of the [`citydb-tool`](../citydb-tool/index.md) CLI for dockerized applications and workflows. Using Docker is the quickest way to get started with CityDB tool, as no setup and installed Java runtime are required. See [here](../first-steps/docker.md#get-docker) for more on how to get Docker.

!!! warning "Docker image compatibility"

    3DCityDB `v5` introduces a substantially changed database schema, that requires a new set of tools.

    :warning:    Currently, __only__ [CityDB tool](../citydb-tool/index.md) is compatible with 3DCityDB `v5`.    :warning:

    Usage of 3DCityDB `v4` tools ([3DCityDB Importer/Exporter](https://3dcitydb-docs.readthedocs.io/en/latest/impexp/docker.html), [3D Web Map Client](https://3dcitydb-docs.readthedocs.io/en/latest/webmap/docker.html){target="blank"}, [3DCityDB Web Feature Service (WFS)](https://3dcitydb-docs.readthedocs.io/en/latest/wfs/docker.html){target="blank"}) is still possible by migrating data to a 3DCityDB `v4`. See [here](../compatibility.md) for more details on compatibility of CityGML versions and 3DCityDB tools, and how to migrate data between versions.

## TL;DR

``` bash

docker run --rm --name citydb-tool [-i -t] \
    [-e CITYDB_HOST=the.host.de] \
    [-e CITYDB_PORT=5432] \
    [-e CITYDB_NAME=theDBName] \
    [-e CITYDB_SCHEMA=theCityDBSchemaName] \
    [-e CITYDB_USERNAME=theUsername] \
    [-e CITYDB_PASSWORD=theSecretPass] \
    [-v /my/data/:/data] \
  3dcitydb/citydb-tool[:TAG] COMMAND
```

!!! tip

    Use the `help` command to list all CLI parameters and arguments. For subcommands (e.g. `import citygml`) us this syntax `import help citygml` to show CLI options.

## Image versions

The CityDB tool Docker images are based on [Eclpise Temurin JRE 21](https://hub.docker.com/_/eclipse-temurin){target="blank"}.
They are available from [3DCityDB DockerHub](https://hub.docker.com/r/3dcitydb/citydb-tool){target="blank"} or [Github Container registry (ghcr.io)](https://github.com/3dcitydb/citydb-tool/pkgs/container/citydb-tool){target="blank"}.

=== "Dockerhub"

    ``` bash
    docker pull 3dcitydb/citydb-tool
    ```

=== "ghcr.io"

    ``` bash
    docker pull ghcr.io/3dcitydb/citydb-tool
    ```

### Tags

We publish images for two types of events. For each __release__ on Github (e.g. `v1.2.3`) we provide a set images using the _CityDB tool version_ as tag.
The tags composed of `<major>.<minor>` and `<major>` are volatile and point to the latest CityDB tool release. For instance, `1` and `1.2` will point to `1.2.3`, if this is the latest version. This is useful if you want automatic updates for minor or micro releases. The `latest` tag points alway to the latest release version.

=== "Dockerhub"

    ``` bash
    docker pull 3dcitydb/citydb-tool:1.0.0
    docker pull 3dcitydb/citydb-tool:1.0
    docker pull 3dcitydb/citydb-tool:1
    docker pull 3dcitydb/citydb-tool:latest
    ```

=== "ghcr.io"

    ``` bash
    docker pull ghcr.io/3dcitydb/citydb-tool:1.0.0
    docker pull ghcr.io/3dcitydb/citydb-tool:1.0
    docker pull ghcr.io/3dcitydb/citydb-tool:1
    docker pull ghcr.io/3dcitydb/citydb-tool:latest
    ```

For each push to the _main_ branch of the [CityDB tool repository](https://github.com/3dcitydb/citydb-tool){target="blank"} we publish a fresh version of the __edge__ image tag.

!!! warning
    The `edge` images contain the latest state of development. It may contain bugs and should not be used for production purposes. Only use these images if you have a specific reason, e.g. test an unreleased feature.

=== "Dockerhub"

    ``` bash
    docker pull 3dcitydb/citydb-tool:edge
    ```

=== "ghcr.io"

    ``` bash
    docker pull ghcr.io/3dcitydb/citydb-tool:edge
    ```

### Version overview

Following table gives an overview on the available image versions.

|   Tag  | Build status | Size |
| :------ | :---------------- | :---------------- |
| __edge__ | [![build-edge](https://img.shields.io/github/actions/workflow/status/%0A3dcitydb/citydb-tool/docker-build-push-edge.yml?%0Astyle=flat-square&amp;logo=Docker&amp;logoColor=white)](https://hub.docker.com/r/3dcitydb/citydb-tool/tags?name=edge){target="blank"} | [![size-edge](https://img.shields.io/docker/image-size/%0A3dcitydb/citydb-tool/edge?label=image%20size&amp;logo=Docker&amp;logoColor=white&amp;style=flat-square)](https://hub.docker.com/r/3dcitydb/citydb-tool/tags?name=edge){target="blank"} |
| __latest__ | [![build-latest](https://img.shields.io/github/actions/workflow/status/%0A3dcitydb/citydb-tool/docker-build-push-release.yml?%0Astyle=flat-square&amp;logo=Docker&amp;logoColor=white)](https://hub.docker.com/r/3dcitydb/citydb-tool/tags?name=latest){target="blank"} | [![size-latest](https://img.shields.io/docker/image-size/%0A3dcitydb/citydb-tool/latest?label=image%20size&amp;logo=Docker&amp;logoColor=white&amp;style=flat-square)](https://hub.docker.com/r/3dcitydb/citydb-tool/tags?name=latest){target="blank"} |
| __1.0.0__ | [![build-latest](https://img.shields.io/github/actions/workflow/status/%0A3dcitydb/citydb-tool/docker-build-push-release.yml?%0Astyle=flat-square&amp;logo=Docker&amp;logoColor=white)](https://hub.docker.com/r/3dcitydb/citydb-tool/tags?name=1.0.0){target="blank"} | [![size-latest](https://img.shields.io/docker/image-size/%0A3dcitydb/citydb-tool/1.0.0?label=image%20size&amp;logo=Docker&amp;logoColor=white&amp;style=flat-square)](https://hub.docker.com/r/3dcitydb/citydb-tool/tags?name=1.0.0){target="blank"} |

!!! note

    Minor releases are not listed in this table.

    The latest 3DCityDB tool version is: [![version-badge-github](https://img.shields.io/github/v/release/3dcitydb/citydb-tool?include_prereleases&logo=github
    )](https://github.com/3dcitydb/citydb-tool/releases){target="blank"}

    The latest image version on DockerHub is:
    [![version-badge-dockerhub](https://img.shields.io/docker/v/3dcitydb/citydb-tool?label=Docker%20Hub&logo=docker&logoColor=white&sort=semver)](https://hub.docker.com/r/3dcitydb/citydb-tool/tags){target="blank"}

## Usage and configuration

The CityDB tool Docker images do not require configuration for most use cases and allow the usage of the  [`citydb-tool`](../citydb-tool/index.md) CLI out of the box. Simply append the CityDB tool command you want to execute to the `docker run` command line. The commands of `citydb-tool` are documented [here](../citydb-tool/index.md).

``` bash
docker run -i -t --rm --name citydb-tool 3dcitydb/citydb-tool COMMAND
```

### Help and CLI documentation

Use the `help` command to see the CLI documentation and list all available commands:

``` bash
docker run -i -t --rm 3dcitydb/citydb-tool help
```

Run `help COMMAND` to see the CLI documentation for a specific command:

``` bash
docker run -i -t --rm 3dcitydb/citydb-tool help import
docker run -i -t --rm 3dcitydb/citydb-tool help export
docker run -i -t --rm 3dcitydb/citydb-tool help delete
# ...
```

To see the usage description of a subcommand, use the `help` function of the top level command:

``` bash
docker run -i -t --rm 3dcitydb/citydb-tool import help citygml
```

### Mounts for data import and export

All import and export operations require a mounted directory for exchanging data between the host system and the container. Use the `-v` or `--mount` options of the `docker run` command to mount a directory or file. The default working directory inside the container is `/data`.

=== "Mount a folder"

    ``` bash

    # mount /my/data/ on the host system to /data
    docker run -i -t --rm --name citydb-tool \
        -v /my/data/:/data \
      3dcitydb/citydb-tool COMMAND
    ```

=== "Mount current working directory"

    ``` bash
    # Mount the current working directory on the host system to /data
    docker run -i -t --rm --name citydb-tool \
        -v $(pwd):/data \
      3dcitydb/citydb-tool COMMAND
    ```

!!! tip

    Watch out for __correct paths__ when working with mounts! All paths passed to the CityDB tool CLI have to be specified from the container's perspective. If you are not familiar with Docker volumes and bind mounts go through the [Docker volume guide](https://docs.docker.com/storage/volumes/){target="blank"}.

In order to allocate an interactive console session for the container process, you must use the `docker run` options `-i` and `-t` together. This comes in handy, for instance, if you don't want to pass the password for the 3DCityDB connection on the command line but rather want to be prompted to enter it interactively on the console. You must use the `-p` option of the CityDB tool CLI without a value for this purpose as shown in the example below.

    docker run -i -t --rm --name citydb-tool \
        -v /my/data/:/data \
      3dcitydb/citydb-tool import \
        -H my.host.de -d citydb -u postgres -p \
        bigcity.gml

The `docker run` command offers further options to configure the container process. Please check the [official reference](https://docs.docker.com/engine/reference/run/){target="blank"} for more information.

### Environment variables

The CityDB tool Docker images support the following environment variables to set the credentials for the connection to a 3DCityDB instance. A detailed documentation of the environment variables is available [here](../citydb-tool/db-connection.md#using-environment-variables-for-database-connection).

!!! warning

    When running the CityDB tool on the command line, the values of these variables will be used as input if a corresponding CLI option is __not__ available. The CLI options always take precedence over the environmental variables.

`CITYDB_HOST=hostname or ip`

:   Name of the host or IP address on which the 3DCityDB is running.

`CITYDB_PORT=port`

:   Port of the 3DCityDB to connect to. Default is _5432_, the default PostgreSQL port.

`CITYDB_NAME=DB name`

:   Name of the 3DCityDB database to connect to. Default is `postgres`.

`CITYDB_SCHEMA=citydb`

:   Schema to use when connecting to the 3DCityDB (default: `citydb` or `username`).

`CITYDB_USERNAME=username`

:   Username to use when connecting to the 3DCityDB.

`CITYDB_PASSWORD=thePassword`

Password to use when connecting to the 3DCityDB.

### User management and file permissions

When exchanging files between the host system and the CityDB tool container, it is import to make sure that files and directories have permissions set correctly. For security reasons (see [here](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user){target="blank"}) the CityDB tool runs as non-root user by default inside the container. The default user is named `impexp` with user and group identifier (uid, gid) = `1000`.

``` bash
docker run --rm --entrypoint bash 3dcitydb/citydb-tool \
    -c "cat /etc/passwd | grep ubuntu"
# ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash
```

As 1000 is the default uid/gid for the first user on many Linux distributions in most cases you won't notice this, as the user on the host system is going to have the same uid/gid as inside the container. However, if you are facing file permission issues, you can run the CityDB tool container as another user with the `-u` option of the
`docker run` command. This way you can make sure, that the right permissions are set on generated files in the mounted directory.

The following example illustrates how to use the `-u` option to pass the user ID of your current host's user.

``` bash hl_lines="2"
docker run --rm --name citydb-tool \
    -u $(id -u):$(id -g) \
    -v /my/data/:/data \
  3dcitydb/citydb-tool COMMAND
```

## Build your own images

3DCityDB CityDB tool images are easy to build on your own. The image supports two build arguments:

`BUILDER_IMAGE_TAG='21-jdk-noble'`

:   Tag off the image to use for the build stage. This is usually not required to set. All available Eclipse Temurin image tags can be found [here](https://hub.docker.com/_/eclipse-temurin){target="blank"}.

`RUNTIME_IMAGE_TAG='21-jre-noble'`

:   Tag off the image to use for the runtime stage. This is usually not required to set. It can be used to set a specific base image version. All available Eclipse Temurin image tags can be found [here](https://hub.docker.com/_/eclipse-temurin){target="blank"}.

### Build process

1. Clone the [CityDB tool Github repository](https://github.com/3dcitydb/citydb-tools) and navigate to the cloned repo:

    ``` bash
    git clone https://github.com/3dcitydb/citydb-tool.git
    cd citydb-tool
    ```

2. Build the image using [`docker build`](https://docs.docker.com/engine/reference/commandline/build/){target="blank"}:

    ``` bash
    docker build -t 3dcitydb/citydb-tool .
    ```

## Examples

For the following examples we assume that a 3DCityDB instance with the following settings is running:

    DB HOSTNAME   my.host.de
    DB PORT       5432
    DB NAME       citydb
    DB USERNAME   postgres
    DB PASSWORD   changeMe

### Importing CityGML

This section provides some examples for importing CityGML datasets. Refer to [`import`](./import.md) for a detailed description of the CityDB tool CLI import command.

Import the CityGML dataset `/home/me/mydata/bigcity.gml` on you host system into the DB given above:

``` bash
docker run --rm --name citydb-tool \
    -v /home/me/mydata/:/data \
  3dcitydb/citydb-tool import citygml \
    -H my.host.de -d citydb -u postgres -p changeMe \
    bigcity.gml
```

!!! note

    Since the host directory `/home/me/mydata/` is mounted to the default
    working directory `/data` inside the container, you can simply reference
    your input file by its filename instead of using an absolute path.

Import all CityGML datasets from `/home/me/mydata/` on your host system into the DB given above:

``` bash
docker run --rm --name citydb-tool \
    -v /home/me/mydata/:/data \
  3dcitydb/citydb-tool import citygml \
    -H my.host.de -d citydb -u postgres -p changeMe \
    /data/
```

### Exporting CityGML

This section provides some examples for exporting CityGML datasets. Refer to [`export`](./export_citygml.md) for a detailed description of the CityDB tool CLI export command.

Export all data from the DB given above to `/home/me/mydata/output.gml`:

``` bash
docker run --rm --name citydb-tool \
    -v /home/me/mydata/:/data \
  3dcitydb/citydb-tool export \
    -H my.host.de -d citydb -u postgres -p changeMe \
    -o output.gml
```

### CityDB tool Docker combined with 3DCityDB Docker

This example shows how to use the 3DCityDB and CityDB tool Docker images in conjunction. We will download a CityGML 2.0 test dataset, create a 3DCityDB, import the test data and create a CityGML 3.0 export.

#### Data preparation

Let's begin by downloading a test dataset: [:material-download: Railway Scene LoD3 dataset](https://github.com/3dcitydb/importer-exporter/raw/master/resources/samples/Railway%20Scene/Railway_Scene_LoD3.zip)

For this example we assume the downloaded data is at your current working directory. We use the well known `$PWD` environment variable to specify all paths in the following, e.g. `$PWD/Railway_Scene_LoD3.zip`. Below are some examples for common Linux tools to download the file, but you can use the URL above too.

=== "`wget`"

    ``` bash
    wget "https://github.com/3dcitydb/importer-exporter/raw/master/resources/samples/Railway%20Scene/Railway_Scene_LoD3.zip"
    ```

=== "`curl`"

    ``` bash
    curl -LO "https://github.com/3dcitydb/importer-exporter/raw/master/resources/samples/Railway%20Scene/Railway_Scene_LoD3.zip"
    ```

The test dataset uses following coordinate reference system:

    SRID        3068
    GMLSRSNAME  urn:ogc:def:crs,crs:EPSG::3068,crs:EPSG::5783

#### Networking preparation

First, let's bring up a Docker network called `citydb-net`. We will attach all containers in this example to this network using the `--network` option of `docker run`.
This will allow us to use container names as hostnames.

``` bash
# docker network remove citydb-net
docker network create citydb-net
```

#### 3DCityDB creation

Now let's create a a 3DCityDB instance using the [3DCityDB Docker images](../3dcitydb/docker.md). As the emphasized lines show, we name the container `citydb`, attach to the network created above, and use the SRID of our test dataset.

``` bash hl_lines="2 3 6" linenums="1"
# docker rm -f -v citydb
docker run -t -d --name citydb \
    --network citydb-net \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=changeMe \
    -e SRID=3068 \
  3dcitydb/3dcitydb-pg-v5:edge-alpine
```

We now have a 3DCityDB instance running with these properties:

    3DCityDB Version    5.0.0
    SRID                3068
    GMLSRSNAME          urn:ogc:def:crs,crs:EPSG::3068,crs:EPSG::5783
    DBNAME              postgres
    SCHEMA NAME         citydb
    DBUSER              postgres
    DBPASSWORD          changeMe

#### Import data

The next step is to import our data to the 3DCityDB. Therefore, we need to mount our data directory to the container, as shown in line 3. The emphasized lines show how to use
the container name from the first step as hostname when both containers are attached to the same Docker network.

``` bash hl_lines="5"
docker run -i -t --rm --name citydb-tool \
    --network citydb-net \
    -v /citydb/:/data \
  3dcitydb/citydb-tool:edge import citygml \
    -H citydb \
    -d postgres \
    -u postgres \
    -p changeMe \
    "Railway_Scene_LoD3/Railway_Scene_LoD3.gml"
```

!!! tip

    There are many other networking options to connect Docker containers.
    Take a look at the Docker [networking
    overview](https://docs.docker.com/network/){target="blank"} to learn more.

Now, with our data inside the 3DCityDB, let's use the CityDB tool
to create a `visualization export <impexp_cli_export_vis_command>`. We
are going to export all Buildings in LoD 2 as binary glTF with embedded
textures and draco compression enabled. All Buildings will be translated
to elevation 0 to fit in a visualization without terrain model.

    docker run -i -t --rm --name citydb-tool \
        --network citydb-net \
        -v /d/temp:/data \
      3dcitydb/citydb-tool:latest-alpine export-vis \
        -H citydb \
        -d postgres \
        -u postgres \
        -p changeMe \
        -l 2 \
        -D collada \
        -G \
        --gltf-binary \
        --gltf-embed-textures \
        --gltf-draco-compression \
        -O globe \
        -o /data/building_glTf.kml

The export file are now available in `/d/temp`.

    $ ls -lhA /d/temp

    drwxrwxrwx 1 theUser theUser 4.0K May  6 17:51 Tiles/
    -rwxrwxrwx 1 theUser theUser 1.4K May  6 17:55 building_glTf.kml*
    -rwxrwxrwx 1 theUser theUser  310 May  6 17:55 building_glTf_collada_MasterJSON.json*
    -rwxrwxrwx 1 theUser theUser 3.2M May  5 16:25 buildings.gml*

As we are done now, the 3DCityDB container and the network are no longer
needed and can be removed:

    docker rm -f -v citydb
    docker network rm citydb-net
