---
title: Connect to your 3DCityDB
description: Connect citydb-3dtiler to a 3DCityDB v5 database
tags:
  - citydb-3dtiler
  - database
  - docker
---

`citydb-3dtiler` reads your city model directly from a 3DCityDB `v5`. You tell it where the database is with the
connection options, which always come *before* the command (`advise` or `tile`).

## Connect to a database server

Provide the host, database name, user and password. Add `-P` if the database does not use the default port `5432`,
and `-S` if your 3DCityDB schema is not named `citydb`.

```bash
-H my.host.de -P 5432 -d citydb -S citydb -u postgres -p changeMe \
tile
```

See the [CLI reference](../reference/cli.md#database-connection-options) for the long names of these options.

!!! note
    The database user must be allowed to create tables and views in the 3DCityDB schema, because `citydb-3dtiler`
    stores helper objects there while tiling.

## Connect to a 3DCityDB running in Docker

When `citydb-3dtiler` runs in a Docker container, `localhost` refers to the container itself, not to your computer.
The easiest way to connect to a 3DCityDB container is a shared Docker network:

1. Create a network, if you do not have one yet:

    ```bash
    docker network create citydb-net
    ```

2. Start the 3DCityDB container in this network, or connect an existing one with
   `docker network connect citydb-net <container-name>`.

3. Run `citydb-3dtiler` in the same network and use the name of the 3DCityDB container as host:

    ```bash
    docker run -i -t --rm --network citydb-net \
      -v "$PWD:/home/tester/citydb-3dtiler/shared" \
    tumgis/citydb-3dtiler \
      -H citydb -d postgres -u postgres -p changeMe \
      tile
    ```

The [tutorial](../tutorial.md) shows this setup step by step.

!!! tip
    If you published the database port on your computer instead (e.g., `-p 5432:5432`), you can also use the IP
    address or host name of your computer as host. `docker inspect <container-name>` shows the internal IP address of
    a container.

## Next steps

- [Tile only part of your data](filter.md)
- [Change the colors](style.md)
