---
title: Install citydb-3dtiler
description: Run citydb-3dtiler with Docker or in a Python environment
tags:
  - citydb-3dtiler
  - setup
  - docker
  - Python
---

`citydb-3dtiler` can be run with Docker or in a Python environment. Docker is the easiest option, because the image
already contains everything the tool needs.

## Option 1: Use Docker (recommended)

1. [Get Docker](../../first-steps/docker.md#get-docker) if you do not have it yet.
2. Pull the image:

    ```bash
    docker pull tumgis/citydb-3dtiler
    ```

3. Check that it works by showing the help:

    ```bash
    docker run --rm tumgis/citydb-3dtiler --help
    ```

To run a command, mount a folder of your computer to `/home/tester/citydb-3dtiler/shared`. `citydb-3dtiler` reads
its input files from this folder and writes its results to it:

=== "Linux"

    ```bash
    docker run -i -t --rm --name citydb-3dtiler \
      -v "$PWD:/home/tester/citydb-3dtiler/shared" \
    tumgis/citydb-3dtiler \
      -H my.host.de -d citydb -u postgres -p changeMe \
      tile
    ```

=== "Windows CMD"

    ```bat
    docker run -i -t --rm --name citydb-3dtiler ^
      -v "%cd%:/home/tester/citydb-3dtiler/shared" ^
    tumgis/citydb-3dtiler ^
      -H my.host.de -d citydb -u postgres -p changeMe ^
      tile
    ```

!!! warning "Image versions"
    As of October 2026, the published images differ in features:

    - `tumgis/citydb-3dtiler:latest` (Docker Hub) and `0.9.3` work, but do __not__ include the
      [filter options](filter.md).
    - `ghcr.io/tum-gis/citydb-3dtiler:latest` and `0.9.4` include the filter options, but fail to start with
      `ModuleNotFoundError: No module named 'cql2'`.

    If you need the filter options, [build a fixed image](troubleshooting.md#modulenotfounderror-no-module-named-cql2)
    or use the Python setup below. See the [Docker image reference](../reference/docker.md) for all images and tags.

## Option 2: Use Python

1. Install [Python 3](https://www.python.org/downloads/){target="blank"} and the PostgreSQL command-line client `psql`.
   Make sure `psql` is available on your `PATH`.
2. Download the `citydb-3dtiler` [source code](https://github.com/tum-gis/citydb-3dtiler){target="blank"} and extract
   it, or clone it with Git.
3. Download [pg2b3dm](https://github.com/Geodan/pg2b3dm/releases){target="blank"} for your operating system and
   extract the `pg2b3dm` executable to the `tiler_app` folder of the source code.
4. Open a terminal in the source code folder, then create a virtual environment and install the dependencies:

    === "Linux"

        ```bash
        python3 -m venv env
        source env/bin/activate
        pip install -r requirements.txt
        ```

    === "Windows"

        ```powershell
        python -m venv env
        .\env\Scripts\Activate
        pip install -r requirements.txt
        ```

5. Check that it works by showing the help:

    ```bash
    python citydb-3dtiler.py --help
    ```

When running with Python, `citydb-3dtiler` uses the `shared` folder in the source code as working folder. Put your
input files there, and find the results there. Always start `citydb-3dtiler.py` from the source code folder.

!!! tip
    If activating the virtual environment fails in Windows PowerShell, run
    `Set-ExecutionPolicy Unrestricted -Scope Process` first and try again.

## Update or remove the Docker image

To update to the latest image, pull it again with `docker pull tumgis/citydb-3dtiler`. To remove all
`citydb-3dtiler` containers and images from your computer, use their `composition=citydb-3dtiler` label:

```bash
docker rm --force $(docker ps --all --quiet --filter label=composition=citydb-3dtiler)
docker rmi --force $(docker image ls --quiet --filter label=composition=citydb-3dtiler)
```
