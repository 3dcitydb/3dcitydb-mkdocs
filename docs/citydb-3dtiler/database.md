---
title: Database connection
description: Connecting citydb-3dtiler to a 3DCityDB v5 instance
tags:
  - citydb-3dtiler
  - database
  - PostgreSQL
---

`citydb-3dtiler` reads the features to be tiled directly from a 3DCityDB `v5` instance. The connection details are
provided as global options of the main command and are therefore available for both the [`advise`](advise.md) and
[`tile`](tile.md) commands.

!!! tip
    If you do not have a 3DCityDB `v5` instance yet, see [here](../first-steps/setup.md) for how to set one up, or use
    the [3DCityDB Docker images](../3dcitydb/docker.md) to get started in minutes.

## Database connection options

| Option                             | Description                                                | Default value |
|------------------------------------|------------------------------------------------------------|---------------|
| `-H`, `--db-host=<host>`           | Name or IP address of the database server.                 |               |
| `-P`, `--db-port=<port>`           | Port of the database server.                               | `5432`        |
| `-d`, `--db-name=<database>`       | Name of the 3DCityDB database to connect to.               |               |
| `-S`, `--db-schema=<schema>`       | Schema to use when connecting to the 3DCityDB.             | `citydb`      |
| `-u`, `--db-username=<user>`       | Name of the user to connect to the 3DCityDB.               |               |
| `-p`, `--db-password=<password>`   | Password of the database user.                             |               |

## Usage

The `--db-host` option takes the host name or IP address of the database server, for example `--db-host my.host.de`
or `--db-host 192.168.2.3`. The `--db-port` option specifies the port the database server listens on. When running
the 3DCityDB in a Docker container, this is the port published on the host.

The `--db-schema` option is only required if the 3DCityDB was set up in a schema other than the default `citydb`
schema.

```bash
python3 citydb-3dtiler.py \
  --db-host my.host.de --db-port 5432 \
  --db-name citydb --db-schema citydb \
  --db-username postgres --db-password changeMe \
  advise
```

!!! warning
    `citydb-3dtiler` creates helper tables and views for the materials and the tiling in the 3DCityDB schema. Make sure
    the database user has the privileges required to create database objects in this schema.

### Connecting to a 3DCityDB Docker container

When both the 3DCityDB and `citydb-3dtiler` run in Docker containers, `localhost` inside the `citydb-3dtiler`
container does not refer to your host machine. Use the host name or IP address of your machine instead, or attach both
containers to the same [Docker network](../citydb-tool/docker.md#networking-preparation) and use the container name of the 3DCityDB as host.

If the published database port does not work in your environment, you can look up the IP address of the 3DCityDB
container with `docker inspect <container-name>` and connect to it directly using the internal PostgreSQL port, for
example `--db-host 172.17.0.2 --db-port 5432`. The same check can be done with other database clients such as
[pgAdmin](https://www.pgadmin.org/){target="blank"}.
