---
title: Import CityJSON
description: Importing CityJSON data
# icon: material/emoticon-happy
status: wip
tags:
  - citydb-tool
  - CityJSON
  - import
---

The **import** command imports one or more CityGML or CityJSON files into the 3D City Database.

## Usage

To import your files to the 3D City Database it is necessary to give along the information for the connection. Look up [Database connection](db-connection.md) for further information.

Use `citydb import cityjson [OPTIONS] <file>` to import one or more citygml files from a directory into the database.

The command provides a range of [OPTIONS] to adapt the import process.

The different commands are identical to the import of CityGML up to one command.

## options table

OPTION / command | discription | default
------------ | ------------- | -------------
`--[no-]map-unknown-objects` |  Map city objects from unsupported extensions onto generic city objects. | true
