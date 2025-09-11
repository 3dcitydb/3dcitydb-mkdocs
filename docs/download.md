---
title: Get the software
description: Download 3DCityDB and citydb-tool
# icon: material/emoticon-happy
tags:
  - 3dcitydb
  - citydb-tool
  - download
---

The 3D City Database (3DCityDB) is hosted on [:fontawesome-brands-github: GitHub](https://github.com/3dcitydb){target="blank"}, where we
regularly publish new releases, including new features and bug fixes, for the 3DCityDB and its tools. Development takes
place in separate repositories on GitHub, with software release packages available for download in the _Releases_
section of each repository. All notable changes in new releases are documented in changelogs, which are maintained
in the repositories and referenced in the release notes.

There are three options to get 3DCityDB:

- Download a stable release from the [releases](https://github.com/3dcitydb/3dcitydb/releases){target="blank"} section and follow the [setup steps](./first-steps/setup.md#3dcitydb-setup-steps) in the user manual.
- Use a [:fontawesome-brands-docker: Docker image](./3dcitydb/docker.md) to run a 3DCityDB via [this guide](./first-steps/docker.md). This is the quickest and easiest way to get started.
- Clone the [GitHub repository](https://github.com/3dcitydb/3dcitydb) and use it as source. You must first _build_ the setup scripts as described in the [build documentation](https://github.com/3dcitydb/3dcitydb#building){target="blank"}.

!!! tip
    It is recommended to download and use __stable release__ packages. However, if you wish to access the latest developments or bug fixes that have not yet been published, you can clone the source code from GitHub and build the software package yourself. Each GitHub repository includes the necessary build instructions, including `Dockerfiles` for creating your own Docker images, where applicable.

    Note that building from `master` or using the `edge` Docker images gives you the latest, unpublished developments. Use it at your own risk.

## 3DCityDB database scripts

The 3DCityDB software package includes all the database scripts for setting up and running a 3DCityDB `v5` instance on PostgreSQL/PostGIS.

- GitHub repository: [https://github.com/3dcitydb/3dcitydb](https://github.com/3dcitydb/3dcitydb){target="blank"}
- Release download page: [https://github.com/3dcitydb/3dcitydb/releases](https://github.com/3dcitydb/3dcitydb/releases){target="blank"}
- Issue tracker: [https://github.com/3dcitydb/3dcitydb/issues](https://github.com/3dcitydb/3dcitydb/issues){target="blank"}

A step-by-step guide on setting up a 3DCityDB using the database scripts is available in the [first steps](first-steps/setup.md) chapter. For complete documentation of the 3DCityDB and its relational schema, refer to the [3D City Database section](3dcitydb/index.md).

## `citydb-tool` database client

`citydb-tool` is the default command-line client for the 3DCityDB, used to import and export city model data as well as
perform data and database operations. Java is required to be installed on your system in order to run citydb-tool.

- GitHub repository: [https://github.com/3dcitydb/citydb-tool](https://github.com/3dcitydb/citydb-tool){target="blank"}
- Release download page: [https://github.com/3dcitydb/citydb-tool/releases](https://github.com/3dcitydb/citydb-tool/releases){target="blank"}
- Issue tracker: [https://github.com/3dcitydb/citydb-tool/issues](https://github.com/3dcitydb/citydb-tool/issues){target="blank"}

Check out the [first steps](first-steps/citydb-tool.md) and the [complete documentation](citydb-tool/index.md) to learn
more about using citydb-tool.

!!! tip
    citydb-tool requires a matching version of the 3DCityDB `v5`. To ensure compatibility, the latest stable release of 3DCityDB
    at the time of a citydb-tool release is always included in the citydb-tool package. This means you can use the 3DCityDB
    scripts bundled with citydb-tool instead of downloading them separately, ensuring you have the correct version of
    3DCityDB.

## 3DCityDB-Web-Map-Client

The 3DCityDB-Web-Map-Client is a web-based viewer designed for high-performance 3D visualization and interactive
exploration of geospatial data, including 3D city models exported from the 3DCityDB. It is built on top of the
[Cesium Virtual Globe](https://cesium.com/) platform.

- GitHub repository: [https://github.com/3dcitydb/3dcitydb-web-map](https://github.com/3dcitydb/3dcitydb-web-map){target="blank"}
- Release download page: [https://github.com/3dcitydb/3dcitydb-web-map/releases](https://github.com/3dcitydb/3dcitydb-web-map/releases){target="blank"}
- Issue tracker: [https://github.com/3dcitydb/3dcitydb-web-map/issues](https://github.com/3dcitydb/3dcitydb-web-map/issues){target="blank"}

The complete documentation of the 3DCityDB-Web-Map-Client is available [here](https://3dcitydb-docs.readthedocs.io/en/latest/webmap/index.html){target="blank"}. We are in the process of including it in this documentation.

!!! note
    Currently, we do not offer a tool to export city model data from the 3DCityDB `v5` in KML, COLLADA, or 3D Tiles format, which is required for visualization in the 3DCityDB-Web-Map-Client. __This feature is a work in progress, so stay tuned for future updates!__
