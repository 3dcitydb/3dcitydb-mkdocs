---
title: Troubleshooting
description: Solutions for common problems with citydb-3dtiler
tags:
  - citydb-3dtiler
  - troubleshooting
---

## `ModuleNotFoundError: No module named 'cql2'`

Some published Docker images (`ghcr.io/3dcitydb/citydb-3dtiler:latest` and `0.9.4`, as of October 2026) are missing
a Python package and fail at startup. Until fixed images are published, build a fixed image yourself:

1. Create a file named `Dockerfile` in an empty folder with the following content:

    ```dockerfile title="Dockerfile"
    FROM ghcr.io/3dcitydb/citydb-3dtiler:0.9.4
    USER root
    RUN pip install "cql2==0.6.0"
    USER tester
    ```

2. Build the image in this folder:

    ```bash
    docker build -t citydb-3dtiler:fixed .
    ```

3. Use `citydb-3dtiler:fixed` instead of `tumgis/citydb-3dtiler` in your commands.

## `Permission denied` when writing files

On Linux, the container runs as a user with ID `1000`. If your user has a different ID, the container cannot write to
the mounted folder, and you see errors like `[Errno 13] Permission denied: '.../shared/advice.yml'`. Run the container
with your own user ID instead:

```bash
docker run -i -t --rm --user "$(id -u):$(id -g)" \
  -v "$PWD:/home/tester/citydb-3dtiler/shared" \
tumgis/citydb-3dtiler \
  -H my.host.de -d citydb -u postgres -p changeMe \
  tile
```

## `invalid choice` or `expected one argument`

- `argument command: invalid choice: ...`: The image you use does not know the option before the value, typically a
  [filter option](filter.md) in an older image. See the [install guide](install.md#option-1-use-docker-recommended)
  for which images support which options.
- `argument -b/--bbox: expected one argument`: A value that starts with a minus sign is mistaken for an option. Write
  the option with an equals sign, e.g. `--bbox=-500,450,-300,600`.

## The filter fails with an SQL error

- Make sure every attribute used in `-f` or `--sql-filter` is also selected with `--attributes selected` and
  `--selected-attributes` after the `tile` command.
- With CQL2, add the SRID as fifth value to `BBOX(...)`. Otherwise, PostGIS reports
  `Operation on mixed SRID geometries`.
- Enclose the whole filter expression in double quotes, and text values in single quotes.

## Separate tilesets fail

See the known issues in [Create one tileset per object class](output.md#create-one-tileset-per-object-class).

## Cannot connect to the database

When both the 3DCityDB and `citydb-3dtiler` run in Docker, `localhost` does not work as host. See
[Connect to a 3DCityDB running in Docker](connect.md#connect-to-a-3dcitydb-running-in-docker).

## Still stuck?

Report the problem on [GitHub](https://github.com/3dcitydb/citydb-3dtiler/issues){target="blank"} and include the
command you used (without your password) and the error message.
