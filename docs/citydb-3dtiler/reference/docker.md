---
title: Docker image
description: Reference of the citydb-3dtiler Docker images
icon: material/docker
tags:
  - citydb-3dtiler
  - docker
  - reference
---

## Registries

| Registry                  | Image                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------|
| Docker Hub                | [`tumgis/citydb-3dtiler`](https://hub.docker.com/r/tumgis/citydb-3dtiler){target="blank"}                                |
| GitHub Container Registry | [`ghcr.io/3dcitydb/citydb-3dtiler`](https://github.com/3dcitydb/citydb-3dtiler/pkgs/container/citydb-3dtiler){target="blank"} |

## Tags

Both registries provide the same images and tags.

| Tag      | Filter options | Status                                                                                                          |
|----------|----------------|-----------------------------------------------------------------------------------------------------------------|
| `latest` | yes            | Works. Built from the `main` branch.                                                                            |
| `0.9.4`  | yes            | Fails at startup, see [troubleshooting](../how-to/troubleshooting.md#modulenotfounderror-no-module-named-cql2). |
| `0.9.3`  | no             | Works.                                                                                                          |

See the [releases](https://github.com/3dcitydb/citydb-3dtiler/releases){target="blank"} for the changes of each version.

## Image details

| Property         | Value                                                         |
|------------------|---------------------------------------------------------------|
| Entrypoint       | `python3 ./citydb-3dtiler.py`                                 |
| Default command  | `--help`                                                      |
| Working folder   | `/home/tester/citydb-3dtiler/shared`, mount your folder here  |
| User             | `tester` (UID `1000`)                                         |
| Bundled software | Python `3.12`, PostgreSQL client `psql`, pg2b3dm `2.26.0`     |
| Label            | `composition=citydb-3dtiler`                                  |

## Build your own image

The `Dockerfile` in the [source repository](https://github.com/3dcitydb/citydb-3dtiler){target="blank"} builds the
image with `docker build -t citydb-3dtiler:custom .`.
