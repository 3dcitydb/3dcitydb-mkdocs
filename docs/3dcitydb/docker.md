---
title: 3DCityDB Docker
description: Usage of the 3D City Database with Docker
icon: material/docker
tags:
  - 3dcitydb
  - docker
  - image
  - postgresql
  - postgis
  - performance tuning
---

The 3DCityDB Docker images are available for _PostgreSQL/PostGIS_. The PostgreSQL/PostGIS version is based on the official [PostgreSQL](https://github.com/docker-library/postgres/){target="blank"} and [PostGIS](https://github.com/postgis/docker-postgis/){target="blank} Docker images.

![3D City Database on Docker](./assets/citydb-docker-logo.png){ width="100" }
/// caption
///

The images described here are available for 3DCityDB version `v5.0.0` and newer. Images for 3DCityDB `v4.x.x` and tools are documented [here](https://3dcitydb-docs.readthedocs.io/en/latest/){target="blank"}. Images for older 3DCityDB versions are available from [TUM-GIS 3DCityDB Docker images](https://github.com/tum-gis/3dcitydb-docker-postgis/){target="blank"}.

!!! info "Docker image versions and compatibility"
    The 3DCityDB Docker images for `>= v5.x.x` are __only__ available for PostgreSQL/PostGIS and are only compatible with
    the [citydb-tool](../citydb-tool/docker.md) images, as of writing this (2025-01). See [here](../compatibility.md) for more on CityGML version and 3DCityDB tools compatibility.

When designing the images we tried to stay as close as possible to the behavior of the base images and the [3DCityDB Shell scripts](../first-steps/setup.md). Thus, all configuration options you may be used to from the base images, are available for the 3DCityDB Docker images as well.

!!! tip "Performance tuning for large datasets"
    The configuration of the PostgreSQL database has significant impact on performance, e.g. for data [`import`](../citydb-tool/import.md) and [`export`](../citydb-tool/export.md) operations. See [Performance tuning for PostgreSQL/PostGIS](#performance-tuning) for more.

## TL;DR

=== "Linux"

    ``` bash
    docker run --name 3dciytdb -p 5432:5432 -d \
        -e POSTGRES_PASSWORD=<theSecretPassword> \
        -e SRID=<EPSG code> \
        [-e HEIGHT_EPSG=<EPSG code>] \
        [-e SRS_NAME=<mySrsName>] \
        [-e POSTGRES_DB=<database name>] \
        [-e POSTGRES_USER=<username>] \
        [-e POSTGIS_SFCGAL=<true|false|yes|no>] \
    3dcitydb/3dcitydb-pg
    ```

=== "Windows CMD"

    ``` bat
    docker run --name 3dciytdb -p 5432:5432 -d ^
        -e POSTGRES_PASSWORD=<theSecretPassword> ^
        -e SRID=<EPSG code> ^
        [-e HEIGHT_EPSG=<EPSG code>] ^
        [-e SRS_NAME=<mySrsName>] ^
        [-e POSTGRES_DB=<database name>] ^
        [-e POSTGRES_USER=<username>] ^
        [-e POSTGIS_SFCGAL=<true|false|yes|no>] ^
    3dcitydb/3dcitydb-pg
    ```

## Image variants and versions

The images are available in various _variants_ and _versions_. The PostgreSQL/PostGIS images are available based on _Debian_ and _Alpine Linux_. For the Alpine Linux images `-alpine` is appended to the image tag. The table below gives an overview on the available image versions.

!!! info
    Depending on the base image variant and version, different versions of PostGIS dependencies (e.g. geos, gdal, proj, sfcgal) are shipped in the base images. Make sure to check the [official PostGIS Docker](https://hub.docker.com/r/postgis/postgis){target="blank"} page for details, if you have specific version requirements.

    As of 2025-01 the __recommended version__ with latest dependencies (geos=3.12.2, gdal=3.9.2, proj=9.4, and sfcgal=1.5.1) is: `latest-alpine` :material-arrow-right: `5.0.0-alpine`, `17-3.5-5.0.0-alpine` or `17-3.5-4.4.0-alpine` for 3DCityDB `v4`.

The `edge` images are automatically built and published on every push to the _master_ branch of the [3DCityDB Github repository](https://github.com/3dcitydb/3dcitydb){target="blank"} using the latest stable version of the base images. The `latest` and _release_ image versions are only built when a new release is published on Github. The `latest` tag will point to the most recent release version using the latest base image version.

|   Tag  | PostGIS (Debian) | PostGIS (Alpine) |
| :------ | :---------------- | :---------------- |
|  __edge__  | [![psql-deb-build-edge](https://img.shields.io/github/actions/workflow/status/3dcitydb/3dcitydb/psql-docker-build-push-edge.yml?label=Debian&style=flat-square&logo=Docker&logoColor=white)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg/tags?page=1&ordering=last_updated)[![psql-deb-size-edge](https://img.shields.io/docker/image-size/3dcitydb/3dcitydb-pg/edge?label=image%20size&logo=Docker&logoColor=white&style=flat-square)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg/tags?page=1&ordering=last_updated) | [![psql-alp-build-edge](https://img.shields.io/github/actions/workflow/status/3dcitydb/3dcitydb/psql-docker-build-push-edge.yml?label=Alpine&%0Astyle=flat-square&logo=Docker&logoColor=white)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg/tags?page=1&ordering=last_updated) [![psql-alp-size-edge](https://img.shields.io/docker/image-size/3dcitydb/3dcitydb-pg/edge-alpine?label=image%20size&logo=Docker&logoColor=white&%0Astyle=flat-square)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg/tags?page=1&ordering=last_updated) |
| __latest__ | [![psql-deb-size-latest](https://img.shields.io/docker/image-size/3dcitydb/3dcitydb-pg/latest?label=image%20size&logo=Docker&logoColor=white&style=flat-square)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg/tags?page=1&ordering=last_updated) | [![psql-alp-size-latest](https://img.shields.io/docker/image-size/3dcitydb/3dcitydb-pg/latest-alpine?label=image%20size&logo=Docker&logoColor=white&%0Astyle=flat-square)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg/tags?page=1&ordering=last_updated)                |
|  __5.0.0__ | [![psql-deb-size-v5.0.0](https://img.shields.io/docker/image-size/3dcitydb/3dcitydb-pg/5?label=image%20size&logo=Docker&logoColor=white&style=flat-square)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg) | [![psql-alp-size-v5.0.0](https://img.shields.io/docker/image-size/3dcitydb/3dcitydb-pg/5-alpine?label=image%20size&logo=Docker&logoColor=white&%0Astyle=flat-square)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg) |
|  __4.0.0__ | [![psql-deb-size-v4.0.0](https://img.shields.io/docker/image-size/3dcitydb/3dcitydb-pg/14-3.2-4.0.0?label=image%20size&logo=Docker&logoColor=white&style=flat-square)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg) | [![psql-alp-size-v4.0.0](https://img.shields.io/docker/image-size/3dcitydb/3dcitydb-pg/14-3.2-4.0.0-alpine?label=image%20size&logo=Docker&logoColor=white&%0Astyle=flat-square)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg) |

/// table-caption
Overview 3DCityDB Docker image variants and versions.
///

!!! note
    Minor releases are not listed in this table.The latest 3DCityDB version is:

    [![version-badge-github](https://img.shields.io/github/v/release/3dcitydb/3dcitydb?label=Github&logo=github)](https://github.com/3dcitydb/3dcitydb/releases){ target="blank" }

    The latest image version is:

    [![version-badge-dockerhub](https://img.shields.io/docker/v/3dcitydb/3dcitydb-pg?label=Docker%20Hub&logo=docker&logoColor=white&sort=semver)](https://hub.docker.com/r/3dcitydb/3dcitydb-pg/tags){ target="blank" }

    The latest `v5-beta` image versions are:

    [![version badge v5](https://ghcr-badge.egpl.dev/3dcitydb/3dcitydb-pg-v5/tags?color=%2344cc11&ignore=latest&n=4&label=image+tags&trim=)](https://github.com/3dcitydb/3dcitydb/pkgs/container/3dcitydb-pg-v5)

## Get the images

The PostgreSQL/PostGIS images are available from [3DCityDB
DockerHub](https://hub.docker.com/r/3dcitydb/3dcitydb-pg){target="blank"} and [Github
container
registry](https://github.com/3dcitydb/3dcitydb/pkgs/container/3dcitydb-pg){target="blank"}.

=== "Dockerhub"

    ``` shell
    docker pull 3dcitydb/3dcitydb-pg
    ```

=== "ghcr.io"

    ``` shell
    docker pull ghcr.io/3dcitydb/3dcitydb-pg
    ```

## Tags

3DCityDB Docker offers a wide set of image variants and versions for different purposes that can be accessed using the image tag.

=== "Dockerhub"

    ``` shell
    docker pull 3dcitydb/3dcitydb-pg[:TAG]
    ```

=== "ghcr.io"

    ``` shell
    docker pull ghcr.io/3dcitydb/3dcitydb-pg[:TAG]
    ```

### Short tags

For each _release_ of 3DCityDB on Github (e.g. `5.x.x`) a set of images using the _3DCityDB version_ and the _image variant_ as tag are released. These versions use the latest base image available. The tags compose of `<major>.<minor>[-<image variant>]` and `<major>[-<image variant>]` are volatile and point to the latest 3DCityDB release. For instance, `5` and `5.1` will point to `5.1.x`, if it is the latest version. This is handy, when you want automatic updates for minor or micro releases.

=== "Dockerhub"

    ``` shell
    docker pull 3dcitydb/3dcitydb-pg:5
    docker pull 3dcitydb/3dcitydb-pg:5.0
    docker pull 3dcitydb/3dcitydb-pg:5.0.0
    docker pull 3dcitydb/3dcitydb-pg:latest

    docker pull 3dcitydb/3dcitydb-pg:5-alpine
    docker pull 3dcitydb/3dcitydb-pg:5.0-alpine
    docker pull 3dcitydb/3dcitydb-pg:5.0.0-alpine
    docker pull 3dcitydb/3dcitydb-pg:latest-alpine
    ```

=== "ghcr.io"

    ``` shell
    docker pull ghcr.io/3dcitydb-pg:5
    docker pull ghcr.io/3dcitydb-pg:5.0
    docker pull ghcr.io/3dcitydb-pg:5.0.0
    docker pull ghcr.io/3dcitydb-pg:latest

    docker pull ghcr.io/3dcitydb-pg:5-alpine
    docker pull ghcr.io/3dcitydb-pg:5.0-alpine
    docker pull ghcr.io/3dcitydb-pg:5.0.0-alpine
    docker pull ghcr.io/3dcitydb-pg:latest-alpine
    ```

### Version specific tags

Besides the shorthand tags listed above, version specific tags including the base image version are released. This is helpful, if you want to use a specific PostgreSQL or PostGIS version.

The image tags are compose of the _base image version_, the _3DCityDB version_ and the _image variant_, `<base image version>-<3DCityDB version>-<image variant>`. The base image version is inherited from the [PostGIS Docker
images](https://hub.docker.com/r/postgis/postgis/tags), e.g. `16-3.4`. Debian is the default image variant, where no image variant is appended to the tag. For the Alpine Linux images `-alpine` is appended. Currently supported base image versions are listed in in the table below.

| PSQL version :material-arrow-down: <br> PostGIS version :material-arrow-right:  |   3.0  |   3.1  |   3.2  |   3.3  |   3.4  | 3.5    |
|:--:|:------:|:------:|:------:|:------:|:------:|--------|
| 13 | 13-3.0 | 13-3.1 | 13-3.2 | 13-3.3 | 13-3.4 | 13-3.5 |
| 14 |        | 14-3.1 | 14-3.2 | 14-3.3 | 14-3.4 | 14-3.5 |
| 15 |        |        |        | 15-3.3 | 15-3.4 | 15.3.5 |
| 16 |        |        |        | 16-3.3 | 16-3.4 | 16-3.5 |
| 17 |        |        |        |        | 17-3.4 | 17-3.5 |

/// table-caption
Overview on supported PostgreSQL/PostGIS versions.
///

The full list of available images can be found on [DockerHub](https://hub.docker.com/r/3dcitydb/3dcitydb-pg/tags?page=1&ordering=last_updated){target="blank"} or [Github](https://github.com/3dcitydb/3dcitydb/pkgs/container/3dcitydb-pg){target="blank"}.

Here are some examples for full image tags:

=== "Dockerhub"

    ``` bash
    docker pull 3dcitydb/3dcitydb-pg:9.5-2.5-4.4.0
    docker pull 3dcitydb/3dcitydb-pg:13-3.2-4.4.0
    docker pull 3dcitydb/3dcitydb-pg:13-3.2-4.4.0-alpine
    docker pull 3dcitydb/3dcitydb-pg:17-3.5-4.4.0-alpine
    ```

=== "ghcr.io"

    ``` bash
    docker pull ghcr.io/3dcitydb/3dcitydb-pg:9.5-2.5-4.4.0
    docker pull ghcr.io/3dcitydb/3dcitydb-pg:13-3.2-4.4.0
    docker pull ghcr.io/3dcitydb/3dcitydb-pg:13-3.2-4.4.0-alpine
    docker pull ghcr.io/3dcitydb/3dcitydb-pg:17-3.5-4.4.0-alpine
    ```

## Usage and configuration

A 3DCityDB container is configured by settings environment variables inside the container. For instance, this can be done using the `-e VARIABLE=VALUE` flag of [`docker run`](https://docs.docker.com/engine/containers/run/#environment-variables). The 3DCityDB Docker images introduce the variables `SRID`, `HEIGHT_EPSG` and `SRS_NAME`. Furthermore, some variables inherited from the base images offer important configuration options.
Refer to the documentation of the official [PostgreSQL](https://hub.docker.com/_/postgres){target="blank"} and [PostGIS](https://registry.hub.docker.com/r/postgis/postgis/){target="blank"} Docker images for much more configuration options.

!!! tip
    All variables besides `POSTGRES_PASSWORD` and `SRID` are optional.

| Environment variable | Description |
| -------- | -------- |
| `SRID`              | EPSG code for the coordinate reference system (CRS) to be used for the 3DCityDB instance. If the `SRID` is not set, the 3DCityDB instance will not be created, and you will end up with a plain PostgreSQL/PostGIS Docker container. |
| `HEIGHT_EPSG`       | EPSG code of the height system. You may omit it or use 0 (default value), if the value is unknown or the above `SRID` is already 3D.|
| `SRS_NAME`          | The srsName to be used in CityGML exports. If this variable is not set, its value will be automatically created in the form `urn:ogc:def:crs,crs:EPSG::<SRID>[,crs:EPSG::<HEIGHT_EPSG>]` based on the values of the above `SRID` and `HEIGHT_EPSG` variables. |
| `CHANGELOG`         | __yes__ or __no__ (default value) to specify whether the changelog extension should be created in the 3DCityDB instance to be created.|
| `POSTGRES_USER`     | The database username of the 3DCityDB instance to be created. The default value is `postgres`. |
| `POSTGRES_DB`       | The database name of the 3DCityDB instance to be created. If not set, the database name is identical to the value of the above `POSTGRES_USER` variable. |
| `POSTGRES_PASSWORD` | The database password of the 3DCityDB instance to be created. Please note that this variable is __mandatory__.|
| `POSTGIS_SFCGAL`    | __true__ or __false__ (default) to enabled or disable the PostgreSQL extension `postgis_sfcgal`. __Note:__ SFCGAL may not be available in some older Alpine based images (PostgresSQL `< v12`). Refer to the [official PostGIS Docker docs](https://registry.hub.docker.com/r/postgis/postgis/){target="blank"} for more details. Setting the variable on those images will have no effect. |
| `PROJ_NETWORK`     | Since a recent change in the PostGIS base images, coordinate transformation grid files are no longer downloaded automatically. For normal 3DCityDB operation this is not needed, so you can leave this option untouched. If you perform coordinate transformations on the database, this option should be set to `PROJ_NETWORK=on`. |

## How to build images

This section describes how to build 3DCityDB Docker images on your own. We have one build argument to set the tag of the base image that is used.

`BASEIMAGE_TAG=tag of the base image`

:   Tag of the base image that is used for the build. Available tags can be found on DockerHub for the [PostgreSQL/PostGIS images](https://registry.hub.docker.com/r/postgis/postgis/tags?page=1&ordering=last_updated){target="blank"}.

### Build process

The images are build by cloning the 3DCityDB Github repository and running [`docker build`](https://docs.docker.com/reference/cli/docker/buildx/build/){target="blank"}:

1. Clone 3DCityDB Github repository and navigate to the `postgresql` folder in the repo:

    ``` bash
    git clone https://github.com/3dcitydb/3dcitydb.git
    cd 3dcitydb/postgresql/
    ```

2. Checkout the release version, branch, or commit you want to build form. Available [release tags](https://github.com/3dcitydb/3dcitydb/tags){target="blank"}, [branches](https://github.com/3dcitydb/3dcitydb/branches){target="blank"}, and [commits](https://github.com/3dcitydb/3dcitydb/commits/){target="blank"} can be found on Github.

    ``` bash
    git checkout [TAG|BRANCH|COMMIT]
    ```

3. Build the PostgreSQL/PostGIS image using  [`docker build`](https://docs.docker.com/reference/cli/docker/buildx/build/):

    === "Linux"

        ``` bash
        docker build -t 3dcitydb/3dcitydb-pg .

        # or with a specific base image tag
        docker build . -t 3dcitydb/3dcitydb-pg \
            --build-arg BASEIMAGE_TAG=17-3.5
        ```

    === "Windows CMD"

        ``` bat
        docker build -t 3dcitydb/3dcitydb-pg .

        # or with a specific base image tag
        docker build . -t 3dcitydb/3dcitydb-pg ^
            --build-arg BASEIMAGE_TAG=17-3.5
        ```

### Include data in an image

In general, it is __not recommended__ to store data directly inside a Docker image and use [docker volumes](https://docs.docker.com/storage/volumes/){target="blank"} instead. Volumes are the preferred mechanism for persisting data generated by and used by Docker containers. However, for some use-cases it can be very handy to create a Docker image including data. For instance, if you have
automated tests operating on the exact same data every time or you want to prepare a 3DCityDB image including data for a lecture or workshop, that will run out of the box, without having to import data first.

!!! warning
    The practice described here has many drawbacks and is a potential security threat. It should not be performed with sensitive data!

#### Image creation process

1. Choose a 3DCityDB image that is suitable for you purpose. You will not be able to change the image version later, as you could easily do when using volumes (the default). Available versions are listed in [Image variants and versions](#image-variants-and-versions). To update an image with data, it has to be recreated from scrap using the desired/updated base image.

2. Create a Docker network and start a 3DCityDB Docker container:

    === "Linux"

        ``` bash
        docker network create citydb-net
        docker run -d --name citydbTemp \
        --network citydb-net \
        -e "PGDATA=/mydata" \
        -e "POSTGRES_PASSWORD=changeMe" \
        -e "SRID=25832" \
        3dcitydb/3dcitydb-pg:17-3.5-5.0.0
        ```

    === "Windows CMD"

        ``` bat
        docker network create citydb-net
        docker run -d --name citydbTemp ^
        --network citydb-net ^
        -e "PGDATA=/mydata" ^
        -e "POSTGRES_PASSWORD=changeMe" ^
        -e "SRID=25832" ^
        3dcitydb/3dcitydb-pg:17-3.5-5.0.0
        ```

    !!! warning
        The database credentials and settings provided in this step cannot be changed when later on creating containers from this image!

    Note down the database connection credentials (db name, username,  password) or you won't be able to access the content later.

3. Import data to the container. For this example we are using the [:material-download: LoD3 Railway dataset](https://github.com/3dcitydb/importer-exporter/raw/master/resources/samples/Railway%20Scene/Railway_Scene_LoD3.zip){target="blank"} and the [citydb-tool](../citydb-tool/import.md).

    === "Linux"

        ``` bash
        docker run -i -t --rm \
            --network citydb-net \
            -v /d/temp:/data \
        3dcitydb/citydb-tool import \
            -H citydbTemp \
            -d postgres \
            -u postgres \
            -p changeMe \
            /data/Railway_Scene_LoD3.zip
        ```

    === "Windows CMD"

        ``` bat
        docker run -i -t --rm ^
            --network citydb-net ^
            -v "d:\temp:/data" ^
        3dcitydb/citydb-tool import ^
            -H citydbTemp ^
            -d postgres ^
            -u postgres ^
            -p changeMe ^
            /data/Railway_Scene_LoD3.zip
        ```

4. Stop the running 3DCityDB container, remove the network and commit it to an image:

    ``` bash
    docker stop citydbTemp
    docker network rm citydb-net
    docker commit citydbTemp 3dcitydb/3dcitydb-pg:17-3.5-5.0.0-railwayScene_LoD3
    ```

5. Remove the 3DCityDB container:

    ``` bash
    docker rm -f -v citydbTemp
    ```

    We have now created a 3DCityDB image that contains data that can e.g. be pushed to a Docker registry or exported as TAR. When creating containers from this image, it is not required to specify any configuration parameter as you usually would, when creating a fresh 3DCityDB container.

    === "Linux"

        ``` bash
        docker run --name cdbWithData --rm -p 5432:5432 \
        3dcitydb/3dcitydb-pg:17-3.5-5.0.0-railwayScene_LoD3
        ```

    === "Windows CMD"

        ``` bat
        docker run --name cdbWithData --rm -p 5432:5432 ^
        3dcitydb/3dcitydb-pg:17-3.5-5.0.0-railwayScene_LoD3
        ```

    To connect to the database, use the credentials you set in step 2. The
    following example lists the tables of the DB running in the container
    using `psql`.

    ``` bash
    export PGPASSWORD=postgres
    query='SELECT COUNT(*) FROM citydb.cityobject;'
    psql -h localhost -p 5432 -U postgres -d postgres -c "$query"

    # count
    # -------
    #   231
    # (1 row)
    ```

## Performance tuning

The configuration of the PostgreSQL database has significant impact on performance, e.g. for data [`import`](../citydb-tool/import.md) and [`export`](../citydb-tool/export.md) operations. PostgreSQL databases offer a wide range of configuration parameters that affect database performance and enable e.g. parallelization of queries. Database optimization is a complex topic but using [PGTune](https://pgtune.leopard.in.ua){target="blank"} you can easily get a set of configuration options, that may help to increase database performance.

1. Visit the [PGTune website](https://pgtune.leopard.in.ua/){target="blank"}, fill in the form and generate a set of parameters for your system. You will get something like this:

    ``` text
    # DB Version: 13
    # OS Type: linux
    # DB Type: mixed
    # Total Memory (RAM): 8 GB
    # CPUs num: 8
    # Connections num: 20
    # Data Storage: ssd

    max_connections = 20
    shared_buffers = 2GB
    effective_cache_size = 6GB
    maintenance_work_mem = 512MB
    checkpoint_completion_target = 0.9
    wal_buffers = 16MB
    default_statistics_target = 100
    random_page_cost = 1.1
    effective_io_concurrency = 200
    work_mem = 13107kB
    min_wal_size = 1GB
    max_wal_size = 4GB
    max_worker_processes = 8
    max_parallel_workers_per_gather = 4
    max_parallel_workers = 8
    max_parallel_maintenance_workers = 4
    ```

2. Pass these configuration parameters to `postgres` (see emphasized line) using the `-c` option when starting your 3DCityDB container with [`docker run`](https://docs.docker.com/engine/reference/run){target="blank"}.

    === "Linux"

        ``` bash hl_lines="4-20"
        docker run -d -i -t --name citydb -p 5432:5342 \
        -e SRID=25832 \
        -e POSTGRES_PASSWORD=changeMe \
        3dcitydb/3dcitydb-pg postgres \
        -c max_connections=20 \
        -c shared_buffers=2GB \
        -c effective_cache_size=6GB \
        -c maintenance_work_mem=512MB \
        -c checkpoint_completion_target=0.9 \
        -c wal_buffers=16MB \
        -c default_statistics_target=100 \
        -c random_page_cost=1.1 \
        -c effective_io_concurrency=200 \
        -c work_mem=13107kB \
        -c min_wal_size=1GB \
        -c max_wal_size=4GB \
        -c max_worker_processes=8 \
        -c max_parallel_workers_per_gather=4 \
        -c max_parallel_workers=8 \
        -c max_parallel_maintenance_workers=4
        ```

    === "Windows CMD"

        ``` bat hl_lines="4-20"
        docker run -d -i -t --name citydb -p 5432:5342 ^
        -e SRID=25832 ^
        -e POSTGRES_PASSWORD=changeMe ^
        3dcitydb/3dcitydb-pg postgres ^
        -c max_connections=20 ^
        -c shared_buffers=2GB ^
        -c effective_cache_size=6GB ^
        -c maintenance_work_mem=512MB ^
        -c checkpoint_completion_target=0.9 ^
        -c wal_buffers=16MB ^
        -c default_statistics_target=100 ^
        -c random_page_cost=1.1 ^
        -c effective_io_concurrency=200 ^
        -c work_mem=13107kB ^
        -c min_wal_size=1GB ^
        -c max_wal_size=4GB ^
        -c max_worker_processes=8 ^
        -c max_parallel_workers_per_gather=4 ^
        -c max_parallel_workers=8 ^
        -c max_parallel_maintenance_workers=4
        ```

### Hints for highly parallel systems

If you are running 3DCityDB Docker on a server with many CPUs, a lot of queries can run in parallel, if you apply suitable tuning options as described above. For highly parallel queries PostgreSQL might exceed shared memory space. Thus, it is recommended to increase Docker shared memory size using the [`--shm-size`](https://docs.docker.com/reference/cli/docker/container/run/#options){target="blank"} option of [`docker run`](https://docs.docker.com/reference/cli/docker/container/run/){target="blank"}. Make sure PostgreSQL's [`shared_buffers`](https://www.postgresql.org/docs/current/runtime-config-resource.html) option is increased accordingly, as shown in the example below. Testing indicates that increasing the PostgreSQL [`max_locks_per_transaction`](https://www.postgresql.org/docs/current/runtime-config-locks.html) option is necessary too for large performance gains.

Let's assume a server with following configuration:

``` text hl_lines="4 5"
# DB Version: 17
# OS Type: linux
# DB Type: dw
# Total Memory (RAM): 32 GB
# CPUs num: 16
# Connections num: 100
# Data Storage: ssd

max_connections = 100
shared_buffers = 8GB
effective_cache_size = 24GB
maintenance_work_mem = 2GB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 500
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 36157kB
huge_pages = try
min_wal_size = 4GB
max_wal_size = 16GB
max_worker_processes = 16
max_parallel_workers_per_gather = 8
max_parallel_workers = 16
max_parallel_maintenance_workers = 4
```

=== "Linux"

    ``` bash hl_lines="2 7 23"
    docker run -d -i -t --name citydb -p 5432:5342 \
        --shm-size=8g \
        -e SRID=25832 \
        -e POSTGRES_PASSWORD=changeMe \
    3dcitydb/3dcitydb-pg postgres \
        -c max_connections=100 \
        -c shared_buffers=8GB \
        -c effective_cache_size=24GB \
        -c maintenance_work_mem=2GB \
        -c checkpoint_completion_target=0.9 \
        -c wal_buffers=16MB \
        -c default_statistics_target=500 \
        -c random_page_cost=1.1 \
        -c effective_io_concurrency=200 \
        -c work_mem=36157kB \
        -c huge_pages=try \
        -c min_wal_size=4GB \
        -c max_wal_size=16GB \
        -c max_worker_processes=16 \
        -c max_parallel_workers_per_gather=8 \
        -c max_parallel_workers=16 \
        -c max_parallel_maintenance_workers=4 \
        -c max_locks_per_transaction=1024
    ```

=== "Windows CMD"

    ``` bash hl_lines="2 7 23"
    docker run -d -i -t --name citydb -p 5432:5342 ^
        --shm-size=8g ^
        -e SRID=25832 ^
        -e POSTGRES_PASSWORD=changeMe ^
    3dcitydb/3dcitydb-pg postgres ^
        -c max_connections=100 ^
        -c shared_buffers=8GB ^
        -c effective_cache_size=24GB ^
        -c maintenance_work_mem=2GB ^
        -c checkpoint_completion_target=0.9 ^
        -c wal_buffers=16MB ^
        -c default_statistics_target=500 ^
        -c random_page_cost=1.1 ^
        -c effective_io_concurrency=200 ^
        -c work_mem=36157kB ^
        -c huge_pages=try ^
        -c min_wal_size=4GB ^
        -c max_wal_size=16GB ^
        -c max_worker_processes=16 ^
        -c max_parallel_workers_per_gather=8 ^
        -c max_parallel_workers=16 ^
        -c max_parallel_maintenance_workers=4 ^
        -c max_locks_per_transaction=1024
    ```
