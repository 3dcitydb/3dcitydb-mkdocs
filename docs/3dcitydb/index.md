---
title: 3D City Database
description: Intro to 3DCityDB.
tags:
  - 3dcitydb
  - CityGML data
  - features
---

The **3D City Database `v5`** (3DCityDB) is a free 3D geo database to store, represent, and manage
virtual 3D city models within a standard spatial relational database. The database model contains
semantically rich, hierarchically structured, multi-scale urban objects, facilitating complex GIS
modeling and analysis tasks, far beyond visualization.

The database schema of the 3DCityDB `v5` results from a systematic mapping and complete implementation
of the data model defined in the [OGC CityGML 3.0 Conceptual Model](https://www.ogc.org/standard/citygml/){target="blank"},
an international standard for representing and exchanging virtual 3D city models, issued by the
[Open Geospatial Consortium (OGC)](https://www.ogc.org/){target="blank"}.

The 3DCityDB is open source and hosted on [GitHub](https://github.com/3dcitydb). You can download the 3DCityDB `v5`
software packages by following the [download instructions](../download.md). We also offer
[Docker support](../first-steps/docker.md), making it easy to get a 3DCityDB `v5` instance up and running
in just a few seconds.

## Key features of 3DCityDB v5

- Full support for CityGML versions 3.0, 2.0 and 1.0
- Complex thematic modeling including support for Application Domain Extensions (ADE)
- Four (CityGML 3.0) or five (CityGML 2.0 and 1.0) different Levels of Detail (LoDs)
- Appearance information (textures and materials)
- Digital terrain models (DTMs) represented as TINs
- Representation of generic and prototypical 3D objects
- Free, also recursive aggregation of geo objects
- Flexible 3D geometries such as Solid, CompositeSolid, MultiSurface, CompositeSurface,
  Polygon, TINs, MultiCurve, CompositeCurve, LineString, Point, and MultiPoint
- Database functions to delete complex objects including all their nested
  sub-objects and geometries. As an alternative, objects can only be marked as terminated,
  which leaves them in the database but sets their termination date timestamps accordingly.
  This realizes a simple but powerful historization / versioning mechanism.
- [`citydb-tool`](../citydb-tool/index.md) for importing and exporting CityGML datasets of any size, supporting both
  GML and CityJSON encodings. It works with CityGML versions 3.0, 2.0, and 1.0, as well as CityJSON versions 2.0, 1.1,
  and 1.0. Additionally, it enables seamless on-the-fly upgrading and downgrading between different versions.

## Changes with respect to 3DCityDB v4

**Streamlined and optimized schema:** Compared to the earlier versions of the 3DCityDB `v4`, more generic rules have been
applied in the mapping of the CityGML 3.0 data model onto the [relational schema](relational-schema.md),
resulting in a significant reduction of the number of database tables.

**Efficient geometry management:** [Geometry objects](geometry-module.md) are now directly mapped onto corresponding
data types provided by PostGIS; i.e., Solids, MultiSurfaces, CompositeSurfaces, TINs, etc. are no longer
split into their individual polygons and stored in separate rows as was done in 3DCityDB `v4`.
This makes it much easier to express spatial queries in SQL, faster to evaluate such queries,
and also to directly connect to the 3DCityDB from geoinformation systems
like QGIS, FME, or ArcGIS and utilize the spatial objects.

**New database client:** `citydb-tool` is the new default command-line client for 3DCityDB `v5`, designed to import and
export city model data as well as perform data and database operations. Its command-line interface
enables easy automation, integration with other software, and efficient use in workflows and pipelines.
Unlike the previous [Importer/Exporter](https://github.com/3dcitydb/importer-exporter) tool for 3DCityDB `v4`, it no
longer provides a graphical user interface.

**Work-in-progress visualization support:** A tool for exporting 3DCityDB `v5` content in visualization formats like KML,
COLLADA, or glTF, as was possible with the Importer/Exporter, is not available yet. However, we are actively working on
a solution to export data in the OGC 3D Tiles format. For this purpose, we are
evaluating open-source tools such as [pg2b3dm](https://github.com/Geodan/pg2b3dm){target="blank"}
to work directly with the 3DCityDB `v5`. We also plan to publish the export tool as a customized Docker image.
Stay tuned!

!!! info "3DCityDB `v4` and legacy tool support"
    The 3DCityDB `v4` and its tools remain functioning and are still available. They will be maintained for an extended
    period to give users enough time to migrate to the new version. Please note that `v4` tools are not compatible with
    3DCityDB `v5` (see our [compatibility and data migration](../compatibility.md) guide).
    If you are currently using or interested in using the previous version and its tools, please refer to the
    [3DCityDB `v4` suite](https://github.com/3dcitydb/3dcitydb-suite){target="blank"} package. The documentation
    of the 3DCityDB `v4` suite is still [available here](https://3dcitydb-docs.readthedocs.io/en/latest/){target="blank"}.

## Who is using the 3DCityDB?

The 3D City Database `v4` is in use in real life production systems in many places around the world
such as Berlin, Potsdam, Hamburg, Munich, Frankfurt, Dresden, Rotterdam, Vienna, Helsinki,
Singapore, Zurich, and is also being used in a number of research projects.
With the release of 3DCityDB `v5`, we expect that most users of `v4` will
migrate to the new version in the future.

The companies [Virtual City Systems](../contributors/vcs.md) and [M.O.S.S.](../contributors/moss.md),
who are also partners in development, use the 3DCityDB at the core of their
commercial products and services to create, maintain, visualize, transform, and export
virtual 3D city models. Furthermore, the state mapping agencies of the federal states in Germany
store and manage the nation-wide collected 3D city models, including approximately 56 million building models
and bridges in CityGML LoD1 and LoD2, using the 3DCityDB.

## Where to find CityGML data?

An excellent list of open data 3D city models, especially also represented using CityGML,
can be found in the [Awesome CityGML](https://github.com/OloOcki/awesome-citygml) list.
Currently, datasets from 21 countries and 65 regions/cities can be downloaded for free,
with a total of >210 million semantic 3D building models. All the provided CityGML files
can be loaded, analyzed, and managed using the 3DCityDB.
