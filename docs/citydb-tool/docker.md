---
# title: Docker
description: citydb-tool Docker documentation and usage examples
icon: fontawesome/brands/docker
status: wip
tags:
  - docker
  - citydb-tool
---

# Using citydb-tool with Docker

The citydb-tool Docker images expose the capabilities of the [`citydb-tool`](../citydb-tool/index.md) CLI for dockerized applications and workflows. Using Docker is the quickest way to get started with citydb-tool, as no setup and installed Java runtime are required. See [here](../first-steps/docker.md#get-docker) for more on how to get Docker.

!!! warning "Docker image compatibility"

    3DCityDB `v5` introduces a substantially changed database schema, that requires a new set of tools.

    :warning:    Currently, __only__ [citydb-tool](../citydb-tool/index.md) is compatible with 3DCityDB `v5`.    :warning:

    Usage of 3DCityDB `v4` tools ([3DCityDB Importer/Exporter](https://3dcitydb-docs.readthedocs.io/en/latest/impexp/docker.html), [3D Web Map Client](https://3dcitydb-docs.readthedocs.io/en/latest/webmap/docker.html){target="blank"}, [3DCityDB Web Feature Service (WFS)](https://3dcitydb-docs.readthedocs.io/en/latest/wfs/docker.html){target="blank"}) is still possible by migrating data to a 3DCityDB `v4`. See [here](../compatibility.md) for more details on compatibility of CityGML versions and citydb-tools, and how to migrate data between versions.

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

The citydb-tool Docker images are based on [Eclpise Temurin JRE 21](https://hub.docker.com/_/eclipse-temurin){target="blank"}.
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

We publish images for two types of events. For each __release__ on Github (e.g. `v1.2.3`) we provide a set images using the _citydb-tool version_ as tag.
The tags composed of `<major>.<minor>` and `<major>` are volatile and point to the latest citydb-tool release. For instance, `1` and `1.2` will point to `1.2.3`, if this is the latest version. This is useful if you want automatic updates for minor or micro releases. The `latest` tag points alway to the latest release version.

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

For each push to the _main_ branch of the [citydb-tool repository](https://github.com/3dcitydb/citydb-tool){target="blank"} we publish a fresh version of the __edge__ image tag.

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

    The latest citydb-tool version is: [![version-badge-github](https://img.shields.io/github/v/release/3dcitydb/citydb-tool?include_prereleases&logo=github
    )](https://github.com/3dcitydb/citydb-tool/releases){target="blank"}

    The latest image version on DockerHub is:
    [![version-badge-dockerhub](https://img.shields.io/docker/v/3dcitydb/citydb-tool?label=Docker%20Hub&logo=docker&logoColor=white&sort=semver)](https://hub.docker.com/r/3dcitydb/citydb-tool/tags){target="blank"}

## Usage and configuration

The citydb-tool Docker images do not require configuration for most use cases and allow the usage of the  [`citydb-tool`](../citydb-tool/index.md) CLI out of the box. Simply append the citydb-tool command you want to execute to the `docker run` command line. The commands of `citydb-tool` are documented [here](../citydb-tool/index.md).

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

    Watch out for __correct paths__ when working with mounts! All paths passed to the citydb-tool CLI have to be specified from the container's perspective. If you are not familiar with Docker volumes and bind mounts go through the [Docker volume guide](https://docs.docker.com/storage/volumes/){target="blank"}.

In order to allocate an interactive console session for the container process, you must use the `docker run` options `-i` and `-t` together. This comes in handy, for instance, if you don't want to pass the password for the 3DCityDB connection on the command line but rather want to be prompted to enter it interactively on the console. You must use the `-p` option of the citydb-tool CLI without a value for this purpose as shown in the example below.

    docker run -i -t --rm --name citydb-tool \
        -v /my/data/:/data \
      3dcitydb/citydb-tool import \
        -H my.host.de -d citydb -u postgres -p \
        bigcity.gml

The `docker run` command offers further options to configure the container process. Please check the [official reference](https://docs.docker.com/engine/reference/run/){target="blank"} for more information.

### Environment variables

The citydb-tool Docker images support the following environment variables to set the credentials for the connection to a 3DCityDB instance. A detailed documentation of the environment variables is available [here](../citydb-tool/db-connection.md#using-environment-variables-for-database-connection).

!!! warning

    When running the citydb-tool on the command line, the values of these variables will be used as input if a corresponding CLI option is __not__ available. The CLI options always take precedence over the environmental variables.

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

When exchanging files between the host system and the citydb-tool container, it is import to make sure that files and directories have permissions set correctly. For security reasons (see [here](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user){target="blank"}) the citydb-tool runs as non-root user by default inside the container. The default user is named `impexp` with user and group identifier (uid, gid) = `1000`.

``` bash
docker run --rm --entrypoint bash 3dcitydb/citydb-tool \
    -c "cat /etc/passwd | grep ubuntu"
# ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash
```

As 1000 is the default uid/gid for the first user on many Linux distributions in most cases you won't notice this, as the user on the host system is going to have the same uid/gid as inside the container. However, if you are facing file permission issues, you can run the citydb-tool container as another user with the `-u` option of the
`docker run` command. This way you can make sure, that the right permissions are set on generated files in the mounted directory.

The following example illustrates how to use the `-u` option to pass the user ID of your current host's user.

``` bash hl_lines="2"
docker run --rm --name citydb-tool \
    -u $(id -u):$(id -g) \
    -v /my/data/:/data \
  3dcitydb/citydb-tool COMMAND
```

## Build your own images

3DCityDB citydb-tool images are easy to build on your own. The image supports two build arguments:

`BUILDER_IMAGE_TAG='21-jdk-noble'`

:   Tag off the image to use for the build stage. This is usually not required to set. All available Eclipse Temurin image tags can be found [here](https://hub.docker.com/_/eclipse-temurin){target="blank"}.

`RUNTIME_IMAGE_TAG='21-jre-noble'`

:   Tag off the image to use for the runtime stage. This is usually not required to set. It can be used to set a specific base image version. All available Eclipse Temurin image tags can be found [here](https://hub.docker.com/_/eclipse-temurin){target="blank"}.

### Build process

1. Clone the [citydb-tool Github repository](https://github.com/3dcitydb/citydb-tools) and navigate to the cloned repo:

    ``` bash
    git clone https://github.com/3dcitydb/citydb-tool.git
    cd citydb-tool
    ```

2. Checkout the release version, branch, or commit you want to build form. Available [release tags](https://github.com/3dcitydb/citydb-tool/tags){target="blank"}, [branches](https://github.com/3dcitydb/citydb-tool/branches){target="blank"}, and [commits](https://github.com/3dcitydb/citydb-tool/commits/){target="blank"} can be found on Github.

    ``` bash
    git checkout [TAG|BRANCH|COMMIT]
    ```

3. Build the image using [`docker build`](https://docs.docker.com/engine/reference/commandline/build/){target="blank"}:

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

This section provides some examples for importing CityGML datasets. Refer to [`import`](./import.md) for a detailed description of the citydb-tool CLI import command.

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

This section provides some examples for exporting CityGML datasets. Refer to [`export`](./export_citygml.md) for a detailed description of the citydb-tool CLI export command.

Export all data from the DB given above to `/home/me/mydata/output.gml`:

``` bash
docker run --rm --name citydb-tool \
    -v /home/me/mydata/:/data \
  3dcitydb/citydb-tool export \
    -H my.host.de -d citydb -u postgres -p changeMe \
    -o output.gml
```

### citydb-tool Docker combined with 3DCityDB Docker

This example shows how to use the 3DCityDB and citydb-tool Docker images in conjunction. We will download a CityGML 2.0 test dataset, create a 3DCityDB, import the test data, and create a CityGML 3.0 and CityJSON export.

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
    SRS_NAME    urn:ogc:def:crs,crs:EPSG::3068,crs:EPSG::5783

You can read this information from the unpacked CityGML `.gml` files `srsName` property or extract it with a text search utility like `grep`.

``` bash
grep -i -m 1 srsName Railway_Scene_LoD3_exp.gml
```

#### Networking preparation

The next step is to bring up a Docker network called `citydb-net`. We will attach all containers in this example to this network using the `--network` option of `docker run`. This will allow us to use container names as hostnames for connecting `citydb-tool` to the database.

``` bash
# docker network remove citydb-net

docker network create citydb-net
```

!!! tip

    There are many other networking options to connect Docker containers. Take a look at the Docker [networking overview](https://docs.docker.com/network/){target="blank"} to learn more.

#### 3DCityDB creation

Now let's create a a 3DCityDB instance using the [3DCityDB Docker images](../3dcitydb/docker.md). We name the container `citydb` (line 3), attach it to the network created above (line 4), and use the `SRID` and `SRS_NAME` of our test dataset (line 6-7).

``` bash linenums="1"
# docker rm -f -v citydb

docker run -t -d --name citydb \
    --network citydb-net \
    -e POSTGRES_PASSWORD=changeMe \
    -e SRID=3068 \
    -e SRS_NAME="urn:ogc:def:crs,crs:EPSG::3068,crs:EPSG::5783" \
  3dcitydb/3dcitydb-pg-v5:edge-alpine
```

We now have a 3DCityDB instance running with these properties:

    3DCityDB Version    5.0.0
    SRID                3068
    SRS_NAME            urn:ogc:def:crs,crs:EPSG::3068,crs:EPSG::5783
    DBNAME              postgres
    SCHEMA NAME         citydb
    DBUSER              postgres
    DBPASSWORD          changeMe

To verify this, you can check the console log of the database container:

``` bash
docker logs citydb
```

#### Import data

The next step is to import our data to the 3DCityDB. Therefore, we need to mount our working directory (`$PWD`) containing the downloaded `.zip` file to the container, as shown in line 3. The emphasized line shows how to use the container name from the first step as hostname when both containers are attached to the same Docker network.

``` bash hl_lines="5" linenums="1"
docker run -i -t --rm --name citydb-tool \
    --network citydb-net \
    -v "$PWD:/data" \
  3dcitydb/citydb-tool:edge import citygml \
    -H citydb \
    -d postgres \
    -u postgres \
    -p changeMe \
    "Railway_Scene_LoD3.zip"
```

#### Export CityGML v3.0

Now, with our data inside the 3DCityDB, let's use the citydb-tool to create a CityGML 3.0 export of the entire dataset. As CityGML 3.0 is the default export option, there are no additional options required for the export command. Same as for the [import](#import-data) step above, we mount our current working directory for data exchange with the container. Additionally, we add the `-o` option to specify an output file name `Railway_Scene_LoD3_CityGML_v3.gml` (line 10) and set the container to run as the current user and group to make sure we have sufficient permissions for writing the output file (line 2, see [here](#user-management-and-file-permissions) for more on permissions).

``` bash linenums="1"
docker run -i -t --rm --name citydb-tool \
    -u "$(id -u):$(id -g)" \
    --network citydb-net \
    -v "$PWD:/data" \
  3dcitydb/citydb-tool:edge export citygml \
    -H citydb \
    -d postgres \
    -u postgres \
    -p changeMe \
    -o "Railway_Scene_LoD3_CityGML_v3.gml"
```

#### Export CityJSON

Creating a CityJSON export works the same way as described above for CityGML. The only differences are the changed `citydb-tool` command and export file name, as shown in the highlighted lines.

``` bash linenums="1" hl_lines="5 10"
 docker run -i -t --rm --name citydb-tool \
    -u "$(id -u):$(id -g)" \
    --network citydb-net \
    -v "$PWD:/data" \
  3dcitydb/citydb-tool:edge export cityjson \
    -H citydb \
    -d postgres \
    -u postgres \
    -p changeMe \
    -o "Railway_Scene_LoD3_CityJSON.json"
```

#### Cleanup

If you no longer need the 3DCityDB, its container, data volume, and the network can be disposed.

``` bash
docker rm -f -v citydb
docker network rm citydb-net
```
