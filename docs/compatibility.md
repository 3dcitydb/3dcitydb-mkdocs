---
title: Compatibility and data migration
description: Which CitGML versions and tools are compatible
# icon: material/emoticon-happy
tags:
  - 3dcitydb
  - citydb-tool
  - importer-exporter
  - 3d-web-map-client
  - wfs
  - 3dcitydb v4
  - 3dcitydb v5
  - CityGML 1.0
  - CityGML 2.0
  - CityGML 3.0
  - CityJSON 1.0
  - CityJSON 2.0
  - data migration
  - database migration
  - legacy support
---

CityGML 3.0 was officially released as a standard by the [Open Geospatial Consortium (OGC)](https://www.ogc.org/de/publications/standard/citygml/){target="blank"} in
September 2021. It is an evolution of CityGML 2.0 and 1.0 and introduces significant modifications and improvements to
the data model. These major changes led to a complete re-implementation of
3D City Database (3DCityDB) and the toolset that comes with it. Compared to 3DCityDB `v4`, `v5` features a
substantially simplified [database schema](./3dcitydb/relational-schema.md). CityGML 3.0 and its encodings are supported only by 3DCityDB `v5`.

This page provides information on the compatibility of CityGML versions and their encodings with different 3DCityDB
versions, along with the tools available for each database version. The table below offers a
[compatibility overview](#compatibility-overview), and we also provide guidance on migrating between
[CityGML versions](#migrate-citygml-or-cityjson-data) and between [3DCityDB versions](#migrate-3dcitydb-database-instances)
`v4` and `v5`.

## Compatibility overview

The following table outlines the compatibility between __3DCityDB__ versions, __citydb-tool__ versions
(including the legacy [Importer-Exporter](https://3dcitydb-docs.readthedocs.io/en/latest/impexp/index.html)), and the supported data formats and their versions. The 3DCityDB `v3`
is included for reference but is no longer recommended for production use.

| 3DCityDB version | Tool version                     | Supported standards and encodings | Supported standard/encoding versions                           |
|------------------|----------------------------------|-----------------------------------|----------------------------------------------------------------|
| __5.0.x__        | __citydb-tool 1.0.x__            | CityGML, CityJSON                 | CityGML: __3.0__, 2.0, 1.0</br>CityJSON: __2.0__, __1.1__, 1.0 |
| 4.x              | Importer-Exporter 5.x            | CityGML, CityJSON                 | CityGML: 2.0, 1.0</br>CityJSON: 1.0                            |
| 3.x              | Importer-Exporter 4.3 and higher | CityGML, CityJSON                 | CityGML: 2.0, 1.0</br>CityJSON: 1.0                            |

!!! tip "Backwards compatibility"
    All previous 3DCityDB versions and tools remain fully usable with the CityGML versions they support. However, to
    benefit from CityGML 3.0, the simplified database schema, and new features of 3DCityDB `v5`, a database
    migration to the 3DCityDB `v5` is required.

    __Currently, only [citydb-tool](./citydb-tool/index.md) and [citydb-3dtiler](./citydb-3dtiler/index.md) are compatible with 3DCityDB `v5`.__ If you want to
    use legacy 3DCityDB `v4` tools such as the [Importer/Exporter](https://3dcitydb-docs.readthedocs.io/en/latest/impexp/docker.html){target="blank"},
    or the [Web Feature Service (WFS)](https://3dcitydb-docs.readthedocs.io/en/latest/wfs/docker.html){target="blank"},
    your data must first be imported into a 3DCityDB `v4`.

## CityGML and CityJSON support in 3DCityDB `v5`

[3DCityDB `v5`](3dcitydb/index.md) supports __all versions of CityGML__. Although the database schema is
designed with CityGML 3.0 in mind, 3DCityDB `v5` remains backwards compatible, offering full support for CityGML 2.0 and 1.0.
Data can be managed without loss in 3DCityDB `v5` as long as the same CityGML version
is used for both import and export. Changing the CityGML version between import and export may result in
data loss, as CityGML 3.0 is not fully backwards compatible with versions 2.0 and 1.0.

For example, when importing CityGML 2.0 data into 3DCityDB `v5`, you can be confident that it can be exported
back as CityGML 2.0 without loss. However, exporting to CityGML 3.0 might lead to data loss due to differences
in data models and supported features between the two versions. The [citydb-tool](./citydb-tool/index.md)
automatically converts data between versions where possible and offers additional options to handle
differences on-the-fly when automatic conversion is not feasible (see [below](#handle-citygml-version-differences)).

The same applies to CityJSON: Data can be managed without loss when using the same CityJSON version for both import and
export. However, changing versions may result in data loss unless automatic conversion is possible.

!!! note
    Note that CityJSON is a JSON-based encoding of a subset of the CityGML data model. As such, it is less expressive
    than the GML/XML encoding of CityGML, which may also contribute to data loss when switching between
    CityJSON and GML/XML.

## Migrate CityGML or CityJSON data

To convert CityGML data between versions and encodings, we recommend using [3DCityDB `v5`](3dcitydb/index.md)
and [citydb-tool](./citydb-tool/index.md). The workflow is the same for all version up- or downgrades,
or encoding changes.

1. Create a 3DCityDB `v5` instance.
2. Import your CityGML or CityJSON encoded dataset.
3. Export your CityGML dataset in the desired encoding and version.

For both CityGML and CityJSON encoding, the citydb-tool `-v` option can be used to specify the desired target version
for the export.

| Encoding            | Option                               | Description                                                    | Default |
|---------------------|--------------------------------------|----------------------------------------------------------------|---------|
| CityGML</br>`xml`   | `-v`, `--citygml-version=<version>`  | Specify the CityGML version for the export: 3.0, 2.0, or 1.0.  | 3.0     |
| CityJSON</br>`json` | `-v`, `--cityjson-version=<version>` | Specify the CityJSON version for the export: 2.0, 1.1, or 1.0. | 2.0     |

### Handle CityGML version differences

CityGML 3.0 introduces significant changes to the data model that cannot be transferred one-to-one between
versions 2.0/1.0 and 3.0. The most important changes include:

- __New feature types and concepts:__ CityGML 3.0 introduces many new feature types, data types, attributes,
  and concepts that are not available in previous versions.
- __Refined LoD concept:__ The LoD model has been standardized across all feature types. Some LoD levels and
  geometry representations from CityGML 2.0 are no longer present in version 3.0.
- __LoD-independent interior modeling:__ Interiors can now be modeled independently of LoD levels. As a result,
  `LoD4` of CityGML 2.0 no longer exists in version 3.0.

As mentioned above, these differences are only relevant when switching between CityGML versions during import and
export. When possible, the citydb-tool applies automatic conversions to prevent data loss. For cases
where automatic conversion is not feasible, the following options are provided to help __upgrade__ deprecated
CityGML 2.0 structures to valid representations in version 3.0.

| Option                 | Description                                                                                       |
|------------------------|---------------------------------------------------------------------------------------------------|
| `--use-lod4-as-lod3`   | __LoD4__ geometries are mapped onto __LoD3__, replacing any existing LoD3 geometries in the data. |
| `--map-lod0-roof-edge` | __LoD0 roof edge geometries__ are mapped onto __roof surfaces__ with LoD0 surface geometry.       |
| `--map-lod1-surface`   | __LoD1 multi-surfaces__ are mapped onto __generic thematic surfaces__ with LoD1 surface geometry. |

!!! warning
    The citydb-tool does not provide options for downgrading CityGML 3.0 content to versions 2.0 or 1.0.
    Therefore, CityGML 3.0-specific features, geometries, or attributes stored in 3DCityDB `v5` will be lost
    when exporting to earlier versions unless an automatic conversion is possible.

!!! tip "When to use the upgrade options"
    The decision to apply upgrade options depends on which CityGML version serves as the primary and leading
    version in your 3DCityDB `v5`.

    - __CityGML 3.0 (recommended):__ Apply upgrade options when importing CityGML 2.0/1.0 data,
      provided the data contains corresponding content. Exporting to CityGML 2.0/1.0 might lead to data loss unless
      automatic conversion is possible.
    - __CityGML 2.0:__ Import CityGML 2.0/1.0 data as-is without using upgrade options. Avoid importing CityGML 3.0
      data if it contains features not avaialble in CityGML 2.0. Upgrade options can be used
      when exporting data in CityGML 3.0 format if explicitly required.

### Examples

The following examples demonstrate how to migrate data between CityGML versions. We use the [3DCityDB](3dcitydb/docker.md) and
[citydb-tool](citydb-tool/docker.md) Docker images in the examples. However, migration can also be performed with
[bare metal database](first-steps/setup.md) installations; the only difference is in how the database is created.
For this example we use the test dataset available [here](citydb-tool/docker.md#data-preparation) and assume your data
is located in the current working directory (`$PWD`).

    SRID        3068
    SRS_NAME    urn:ogc:def:crs,crs:EPSG::3068,crs:EPSG::5783

1. For all version up- or downgrades we first create a 3DCItyDB `v5` instance and a Docker network.

    === "Linux"

        ```bash
          # docker network remove citydb-net
          docker network create citydb-net

          # docker rm -f -v citydb
          docker run -t -d --name citydb \
            --network citydb-net \
            -e POSTGRES_PASSWORD=changeMe \
            -e SRID=3068 \
            -e SRS_NAME="urn:ogc:def:crs,crs:EPSG::3068,crs:EPSG::5783" \
          3dcitydb/3dcitydb:5-alpine
        ```

    === "Windows CMD"

        ```bash
          # docker network remove citydb-net
          docker network create citydb-net

          # docker rm -f -v citydb
          docker run -t -d --name citydb ^
            --network citydb-net ^
            -e POSTGRES_PASSWORD=changeMe ^
            -e SRID=3068 ^
            -e SRS_NAME="urn:ogc:def:crs,crs:EPSG::3068,crs:EPSG::5783" ^
          3dcitydb/3dcitydb-pg:5-alpine
        ```

2. Import your dataset to the new database.

    === "Linux"

        ```bash
        docker run -i -t --rm --name citydb-tool \
          --network citydb-net \
          -v "$PWD:/data" \
        3dcitydb/citydb-tool:edge import citygml \
          -H citydb \
          -d postgres \
          -u postgres \
          -p changeMe \
          "Railway_Scene_LoD3.zip"
        ```

    === "Windows CMD"

        ```bash
        docker run -i -t --rm --name citydb-tool ^
          --network citydb-net ^
          -v "$PWD:/data" ^
        3dcitydb/citydb-tool:edge import citygml ^
          -H citydb ^
          -d postgres ^
          -u postgres ^
          -p changeMe ^
          "Railway_Scene_LoD3.zip"
        ```

3. Export your dataset in the desired version. Use the `-v` option of citydb-tool (see above) to specify the version you want.

    === "Linux"

        ```bash hl_lines="10"
        docker run -i -t --rm --name citydb-tool \
          -u "$(id -u):$(id -g)" \
          --network citydb-net \
          -v "$PWD:/data" \
        3dcitydb/citydb-tool:edge export citygml \
          -H citydb \
          -d postgres \
          -u postgres \
          -p changeMe \
          -v "3.0" \
          -o "Railway_Scene_LoD3_CityGML_v3.gml"
        ```

    === "Windows CMD"

        ```bash hl_lines="10"
        docker run -i -t --rm --name citydb-tool ^
          -u "$(id -u):$(id -g)" ^
          --network citydb-net ^
          -v "$PWD:/data" ^
        3dcitydb/citydb-tool:edge export citygml ^
          -H citydb ^
          -d postgres ^
          -u postgres ^
          -p changeMe ^
          -v "3.0" ^
          -o "Railway_Scene_LoD3_CityGML_v3.gml"
        ```

This is it! You have now migrated your CityGML dataset to the version you need. Keep in mind to check if additional
upgrade options for handling [CityGML version differences](#handle-citygml-version-differences) are required.

## Migrate 3DCityDB database instances

Migration between 3DCityDB `v5` and older versions is performed by exporting data to a compatible CityGML version and
then re-importing it into the target 3DCityDB version.

1. Check 3DCityDB and CityGML compatibility in the [table above](#compatibility-overview).
2. Migrate you dataset to a compatible CityGML version of your target database version, as described in [data migration above](#migrate-citygml-or-cityjson-data).
3. Create a 3DCityDB instance in your target version using [Docker](3dcitydb/docker.md) or [bare metal setup](first-steps/setup.md).
4. Import your dataset to the 3DCityDB with your target version. For 3DCityDB `v5` use [citydb-tool](citydb-tool/import.md), for older
   3DCityDB versions use the [Importer/Exporter](https://3dcitydb-docs.readthedocs.io/en/latest/impexp/index.html){target="blank"}.

If 3DCityDB `v5` is your target database, ensure that you follow the guidance above on selecting a primary CityGML
version and applying upgrade options, if necessary, when re-importing the data.
