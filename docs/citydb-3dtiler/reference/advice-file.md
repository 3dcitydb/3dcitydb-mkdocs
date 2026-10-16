---
title: Advice file
description: Format of the advice.yml file written by citydb-3dtiler
tags:
  - citydb-3dtiler
  - advise
  - YAML
  - reference
---

The `advise` command writes the advice file `advice.yml` to the working folder. The `tile` command reads it to size
the tiles, to resolve the CRS of bounding boxes without SRID, and to find the available attributes.

## Entries

| Entry                                        | Description                                                                                      |
|----------------------------------------------|--------------------------------------------------------------------------------------------------|
| `commandset`                                 | All options the command was run with.                                                            |
| `max_features`                               | Recommended maximum number of features per tile for the whole dataset. Empty with separate tilesets. |
| `objectclasses`                              | List of the object classes in the database.                                                      |
| `objectclasses[].name`                       | Object class name, as used with `--type-name`.                                                   |
| `objectclasses[].properties`                 | [Attribute names](../explanation.md#attribute-names) available for this class.                   |
| `objectclasses[].objectclass_recommendations`| Recommended maximum number of features per tile for this class. Only with `--separate-tilesets objectclass`. |
| `used_crs_code`                              | SRID of the 3DCityDB.                                                                            |

!!! danger "Contains your password"
    `commandset` includes the database password given with `--db-password` in plain text. Remove it before sharing
    the file.

## Example

```yaml
commandset:
    command: advise
    consider_thematic_features: false
    db_host: citydb
    db_name: postgres
    db_password: changeMe
    db_port: 5432
    db_schema: citydb
    db_username: postgres
    output_file: advice.yml
    separate_tilesets: null
    tiler_app: pg2b3dm
    tilers_path: tiler_app/
max_features: 7
objectclasses:
-   name: Bridge
    properties:
    - brid_class
    - brid_function
    - core_appearance
    - core_name
    - core_relativetoterrain
-   name: BuildingInstallation
    properties:
    - bldg_function
    - con_relationtoconstruction
    - core_name
used_crs_code: 3068
```
