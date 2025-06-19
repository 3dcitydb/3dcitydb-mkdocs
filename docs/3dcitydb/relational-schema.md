---
# title: Relational schema overview
description: 3DCityDB v5 database schema
tags:
  - 3dcitydb
  - relational schema
  - overview
---

# Relational schema overview

The 3D City Database `v5` is a major revision of the previous `v4` release. The database schema has been
completely redesigned, significantly simplified, and restructured. Unlike `v4`, it no longer uses individual feature
tables with dedicated attribute columns. Instead, the schema is streamlined with fewer tables, including a single
`FEATURE` table for storing all features and objects, and a single `PROPERTY` table that holds most attributes and
associations.

The following figure illustrates the complete 3DCityDB `v5` relational database schema.

![relational schema](assets/relational-schema.png)
/// figure-caption
Relation schema of the 3DCityDB `v5`.
///

All tables of the relation schema are logically grouped into five modules, which are discussed in the
following chapters:

- [**Feature module**](feature-module.md): Contains the core tables for storing feature information, excluding geometry and appearance data.
- [**Geometry module**](geometry-module.md): Contains tables for storing both explicit and implicit geometry data.
- [**Appearance module**](appearance-module.md): Contains tables for storing appearance information.
- [**Metadata module**](metadata-module.md): Holds meta-information about features and their properties.
- [**Codelist module**](codelist-module.md): Stores codelists with their corresponding values.

!!! note
    Although conceptually the database model is applicable to any database system, this chapter uses
    PostgreSQL-specific figures and examples.
