---
title: citydb-3dtiler
description: Introduction to citydb-3dtiler
tags:
  - citydb-3dtiler
  - 3D Tiles
  - overview
  - features
---

`citydb-3dtiler` is a command-line tool that generates [3D Tiles](https://www.ogc.org/standards/3dtiles/){target="blank"}
`1.0` and `1.1` from city objects stored in a 3DCityDB `v5`. It reads the features directly from the database, styles them
with simple colors or PBR materials, and passes them to [pg2b3dm](https://github.com/Geodan/pg2b3dm){target="blank"}
to create the tilesets. The resulting 3D Tiles can be streamed and visualized in web-based clients such as
[CesiumJS](https://cesium.com/platform/cesiumjs/){target="blank"} or the 3DCityDB-Web-Map-Client.

!!! warning "Testing phase"
    `citydb-3dtiler` is still in the testing phase. Please be careful when using it in production. Feedback is always
    welcome: create an [issue on GitHub](https://github.com/tum-gis/citydb-3dtiler/issues){target="blank"} or get in
    touch with the developer at murat.kendir(at)tum.de.

![Sample 3D Tiles from Leipzig](assets/sample_3dtiles_leipzig.jpg)
/// figure-caption
3D Tiles generated with `citydb-3dtiler` from the city objects of Leipzig.
///

## Key features

- Generation of 3D Tiles `1.0` and `1.1` from features stored in a 3DCityDB `v5`
- Creation of a single tileset or separate tilesets per object class
- Analysis of the database content and recommendation of tiling parameters with the [`advise`](advise.md) command
- Styling with simple colors or PBR materials based on object classes or property values
- Customizable materials defined in a simple CSV file
- Filtering of features by ID, type name, bounding box, limit and start index
- Advanced filtering with [OGC CQL2](https://www.ogc.org/publications/standard/cql2/){target="blank"} or SQL expressions
- Selection of feature attributes to embed in the tiles, either flattened or as nested structures
- Easy deployment and execution in a [Docker](docker.md) container

!!! note "Not supported yet"
    - Feature textures
    - Implicit geometries (features represented in local coordinate systems)

## How it works

`citydb-3dtiler` connects to a 3DCityDB `v5` instance populated with CityGML `3.0` or `2.0` data, for example using
[citydb-tool](../citydb-tool/import.md). It prepares the geometries, materials and attributes of the selected features
in the database and calls the 3D Tiles generator pg2b3dm to write the tilesets. The figure below shows how
`citydb-3dtiler` fits into the 3DCityDB software family.

![citydb-3dtiler in the 3DCityDB software family](assets/citydb-3dtiler-overview.png){ width="400" }
/// figure-caption
`citydb-3dtiler` in the 3DCityDB software family.
///

The tool provides two commands, which are usually run one after the other:

| Command               | Description                                                                                                       |
|-----------------------|-------------------------------------------------------------------------------------------------------------------|
| [`advise`](advise.md) | Analyzes the database content and writes a report (`advice.yml`) with the recommended tiling parameters.          |
| [`tile`](tile.md)     | Generates 3D Tiles from the features in the database. Runs `advise` automatically if no advice file exists yet. |

## Quick start

The quickest way to get started is the `citydb-3dtiler` [Docker image](docker.md), which bundles all dependencies
including pg2b3dm. All you need is a running 3DCityDB `v5` instance. See [here](../first-steps/docker.md) for how to
set one up with Docker.

1. Open a shell and change to an empty working directory. This directory is mounted into the container, and all
   generated files are written to it.
2. Optionally, [customize the materials](tile.md#custom-materials) of the features by placing a
   `materials_for_features.csv` file in the working directory.
3. Optionally, run the [`advise`](advise.md) command to analyze your data:

    === "Linux"

        ```bash
        docker run --rm -i -t --name citydb-3dtiler \
          -v ./:/home/tester/citydb-3dtiler/shared:rw \
        ghcr.io/tum-gis/citydb-3dtiler:latest \
          --db-host my.host.de --db-port 5432 \
          --db-name citydb --db-schema citydb \
          --db-username postgres --db-password changeMe \
          advise
        ```

    === "Windows CMD"

        ```bat
        docker run --rm -i -t --name citydb-3dtiler ^
          -v ./:/home/tester/citydb-3dtiler/shared:rw ^
        ghcr.io/tum-gis/citydb-3dtiler:latest ^
          --db-host my.host.de --db-port 5432 ^
          --db-name citydb --db-schema citydb ^
          --db-username postgres --db-password changeMe ^
          advise
        ```

    === "PowerShell"

        ```powershell
        docker run --rm -i -t --name citydb-3dtiler `
          -v ./:/home/tester/citydb-3dtiler/shared:rw `
        ghcr.io/tum-gis/citydb-3dtiler:latest `
          --db-host my.host.de --db-port 5432 `
          --db-name citydb --db-schema citydb `
          --db-username postgres --db-password changeMe `
          advise
        ```

4. Generate the 3D Tiles using the [`tile`](tile.md) command with the default settings:

    === "Linux"

        ```bash
        docker run --rm -i -t --name citydb-3dtiler \
          -v ./:/home/tester/citydb-3dtiler/shared:rw \
        ghcr.io/tum-gis/citydb-3dtiler:latest \
          --db-host my.host.de --db-port 5432 \
          --db-name citydb --db-schema citydb \
          --db-username postgres --db-password changeMe \
          tile
        ```

    === "Windows CMD"

        ```bat
        docker run --rm -i -t --name citydb-3dtiler ^
          -v ./:/home/tester/citydb-3dtiler/shared:rw ^
        ghcr.io/tum-gis/citydb-3dtiler:latest ^
          --db-host my.host.de --db-port 5432 ^
          --db-name citydb --db-schema citydb ^
          --db-username postgres --db-password changeMe ^
          tile
        ```

    === "PowerShell"

        ```powershell
        docker run --rm -i -t --name citydb-3dtiler `
          -v ./:/home/tester/citydb-3dtiler/shared:rw `
        ghcr.io/tum-gis/citydb-3dtiler:latest `
          --db-host my.host.de --db-port 5432 `
          --db-name citydb --db-schema citydb `
          --db-username postgres --db-password changeMe `
          tile
        ```

!!! tip
    `citydb-3dtiler` can also be run without Docker in a Python environment. See [here](python.md) for the setup.

## Acknowledgements

`citydb-3dtiler` bridges the gap between CityGML and 3D Tiles and builds on two important components: the
[3DCityDB `v5`](../3dcitydb/index.md) and [pg2b3dm](https://github.com/Geodan/pg2b3dm){target="blank"}. We would like to
take this opportunity to thank Bert Temme, the developer of pg2b3dm, and all 3DCityDB developers.

`citydb-3dtiler` is developed by the [Chair of Geoinformatics](https://www.asg.ed.tum.de/en/gis/){target="blank"} at the
Technical University of Munich (TUM). The source code is available on
[GitHub](https://github.com/tum-gis/citydb-3dtiler){target="blank"}.
