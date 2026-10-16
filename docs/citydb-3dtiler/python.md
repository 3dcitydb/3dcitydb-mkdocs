---
title: Python setup
description: Running citydb-3dtiler in a Python virtual environment
tags:
  - citydb-3dtiler
  - Python
  - setup
---

As an alternative to [Docker](docker.md), `citydb-3dtiler` can be run directly in a Python environment on your
computer. This is useful for development or when Docker is not available.

## Requirements

- [Python](https://www.python.org/downloads/){target="blank"} `3`. The Docker images use Python `3.12`.
- The PostgreSQL command-line client `psql`, which must be available on your `PATH`
- The [pg2b3dm](https://github.com/Geodan/pg2b3dm/releases){target="blank"} executable for your operating system

## Setup

1. Download the [latest release](https://github.com/tum-gis/citydb-3dtiler/releases){target="blank"} or the `main`
   branch of the [GitHub repository](https://github.com/tum-gis/citydb-3dtiler){target="blank"} and extract it.
   Change to the extracted folder, e.g. `citydb-3dtiler-main`.

2. Download pg2b3dm and extract the executable to the `tiler_app` folder of the repository. Alternatively, use the
   [`--tilers-path`](cli.md#generator-options) option to point to another folder.

3. Create and activate a virtual environment:

    === "Linux"

        ```bash
        python3 -m venv env
        source env/bin/activate
        ```

    === "Windows"

        ```powershell
        python -m venv env
        .\env\Scripts\Activate
        ```

    !!! tip
        If activating the virtual environment fails in Windows PowerShell, allow running scripts for the current
        session first with `Set-ExecutionPolicy Unrestricted -Scope Process`, and then try again.

4. Install the required Python packages:

    ```bash
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    ```

5. Run `citydb-3dtiler` to show the help message:

    === "Linux"

        ```bash
        python3 citydb-3dtiler.py --help
        ```

    === "Windows"

        ```powershell
        python citydb-3dtiler.py --help
        ```

## Working directory

When running in a Python environment, `citydb-3dtiler` uses the `shared` folder in the repository as working directory.
Place a custom [materials file](tile.md#custom-materials) in this folder, and find the `advice.yml` file and the
generated 3D Tiles there. Always run `citydb-3dtiler.py` from the root folder of the repository.
