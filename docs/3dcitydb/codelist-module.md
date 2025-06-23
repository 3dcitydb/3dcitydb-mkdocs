---
title: Codelist module
description: Tables for storing codelists
tags:
  - 3dcitydb
  - relational schema
  - codelist
---

The Codelist module in 3DCityDB `v5` adds support for storing codelists, which are tables of values with corresponding
descriptions or definitions. Many CityGML properties are designed to take values from codelists, as defined in the
[CityGML 3.0 Conceptual Model (CM)](https://docs.ogc.org/is/20-010/20-010.html). Codelists may be required, recommended,
or suggested by an authority within an organization or community, or more informally defined and used within an
application domain.

![codelist module](assets/codelist-module.png)
/// figure-caption
Codelist module of the 3DCityDB `v5` relational schema.
///

## `CODELIST` table

The `CODELIST` table is used to register codelists. Each codelist is assigned a URL as a unique identifier, which is
stored in the `url` column.

In case the `url` points to an existing external file, the `mime_type` column should specify the
MIME type of the referenced codelist to ensure it can be processed correctly according to its format. CityGML does not
prescribe specific formats for codelists but suggests using GML, JSON, and CSV-based encodings (see
[here](https://docs.ogc.org/is/21-006r2/21-006r2.html#annex-codelist-usage)).

The `codelist_type` column specifies the CityGML data type associated with the codelist. It stores the qualified
classname of the data type as defined in the CityGML CM, such as `core:RelationTypeValue` or`bldg:BuildingClassValue`.

There is no foreign key connecting the `CODELIST` table with the [`PROPERTY`](feature-module.md#property-table) table
to directly link a codelist with a property that uses values from it. Instead, properties that reference codelists are
typically of type `core:Code`, which includes a `codeSpace` attribute stored in the `val_codespace` column. This `codeSpace`
typically points to the URL identifying the codelist from which the property value is taken. The corresponding codelist in
the `CODELIST` table can be identified by matching the `codeSpace` value with the `url` column.

!!! note
    Multiple codelists can be registered for the same `codelist_type`, such as codelists from different
    authorities or communities. In these cases, the combination of `codelist_type` and `url` should be unique across
    all entries in the `CODELIST` table.

## `CODELIST_ENTRY` table

The `CODELIST_ENTRY` tables stores the values of the registered codelists. Each value is linked to a
codelist through the `codelist_id` foreign key, which references an entry in the `CODELIST` table.

The code for each permissible codelist value, along with its definition or description, is stored in the `code` and
`definition` columns, respectively. This setup allows for easy lookup of the definition for a code that is stored as
property value in the `PROPERTY` table, and vice versa.

!!! tip
    Besides using the codelist tables to look up or validate property values associated with a codelist during data import
    and export, they can also be used to build a web service that provides stored codelists as files or serves as a lookup and
    validation service for individual codelist values. Tools for building such services are not included in the
    3DCityDB `v5`, though.