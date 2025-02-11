---
title: Import
description: Import
# icon: material/emoticon-happy
status: wip
---

# CityGML-Specific Import Options

The **import** command imports one or more CityGML files into the 3D City Database.


To import your files to the 3D City Database it is necessary to give along the information for the connection. Look up [Database connection](db-connection.md) for further information.

Use `citydb import citygml [OPTIONS] <file>` to import one or more citygml files from a directory into the database.

The command provides a range of [OPTIONS] to adapt the import process.

## Better Practice
You can use a textfile to combine and outsource commands and the link to the config.json to keep a better overview of issued commands. Save the textfile in the same folder as the config.json.

```bash
citydb import citygml <file> @options.txt
```

## Options Table

### Import Data


Command | Description | Default Value
------------ | ------------- | -------------
`@<filename>...` | One or more argument files containing options.
`<file>...` | One or more files and directories to process (globpatterns allowed).
`--input-encoding= <encoding>` |  Encoding of input file(s).
`--fail-fast` | Fail fast on errors.
`--temp-dir= <dir>` | Store temporary files in this directory.
`--threads=<threads>`| Number of threads to use for parallel processing.
`--preview`| Run in preview mode. Features will not be imported.
`--index-mode=<mode>` | Index mode: keep, drop, drop_create Consider dropping indexes when processing large quantities of data. | keep
`--compute-extent` | Compute and overwrite extents of features.
`--import-xal-source` | Import XML snippets of xAL address elements.
`-x`, `--xsl-transform=<stylesheet>[,<stylesheet>...]` | Apply XSLT stylesheets to transform input.
`--log-file=<file>`| Write log messages to this file.
`--pid-file=<file>` | Create a file containing the process ID.
`--plugins=<dir>` | Load plugins from this directory.
`--use-plugins=<plugin[=true|false][,<plugin[=true|false]...]` | Enable or disable plugins with a matching fully qualified class name | true

### Example

Running the import in a preview mode to check the metadata in the commandline

```bash
citydb import citygml generic_citygml.gml --preview @options.txt
```

Import a CityGML file and create file in a separate folder with log message

```bash
citydb import citygml generic_citygml.gml --log-file=.\log @options.txt
```


## Handling with duplicate features

There are different options for the import to handle duplicate features based on the feature ID (i.e., gml:id).

Command | Description | Default Value
------------ | ------------- | -------------
`-m, --import-mode=<mode>` | Import mode: skip, terminate, delete, import_all | import_all

skip -->        Duplicates in the input file are not imported into the database.

terminate -->   Duplicates in the database are terminated before importing the input file.

delete -->      Duplicates in the database are deleted before importing the input file.

import_all -->  All features from the input file are imported without checking for duplicates.

### Example

If you want to check if the files are already imported to the database you can use the import-mode skip to check on it.

```bash
citydb import citygml generic_citygml.gml --import-mode=skip @options.txt
```

## Filter Options
Command | Description | Default Value
------------ | ------------- | -------------
`-t`, `--type-name=<[prefix:]name>[,<[prefix:]name>...]`| Names of the features to process.
`-i`, `--id=<id>[,<id>...]` |  Identifiers of the features to process.
`-b`, `--bbox=<x_min,y_min,x_max,y_max,srid>` | Bounding box to use as spatial filter.
`--bbox-mode=<mode>` |  Bounding box mode: intersects, contains, on_tile | intersects
`--limit=<count>` | Maximum number of features to process.
`-a`, `--appearance-theme=<theme>[,<theme>...]` | Process appearances with a matching theme. Use 'none' for the null theme.

### Example

Limit the amount of features that will be imported from a file.

```bash
citydb import citygml generic_citygml.gml --limit=2 @options.txt
```

Create a bounding box and import the features from the file that intersects (default).

```bash
citydb import citygml generic_citygml.gml --bbox=367123,5807268,367817,5807913,25833 @options.txt
```

## Upgrade options for CityGML 2.0 and 1.0
Option / Command | Description | Default Value
------------ | ------------- | -------------
`--use-lod4-as-lod3` |  Use LoD4 as LoD3, replacing an existing LoD3.
`--map-lod0-roof-edge` |  Map LoD0 roof edges onto roof surfaces.
`--map-lod1-surface` | Map LoD1 multi-surfaces onto generic thematic surfaces.
