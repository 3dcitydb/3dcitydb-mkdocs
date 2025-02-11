---
title: Shared Export Options
description: General Options for CityGML and CityJSON
# icon: material/tools
status: wip
tags:
  - citydb-tool
  - export
---

Both **CityGML** and **CityJSON** exporters in the **citydb-tool** share a common set of options.
These options allow users to customize the export process, including output configuration, query and
filter parameters, and tiling for large datasets.

---

## General options

| Option                        | Description                                              | Default Value |
|-------------------------------|----------------------------------------------------------|---------------|
| `-o`, `--output=<file>`       | Name of the output file.                                 |               |
| `--output-encoding=<encoding>`| Specify the encoding for the output file.                |               |
| `--fail-fast`                 | Stop execution immediately upon encountering an error.  |               |
| `--temp-dir=<dir>`            | Directory for storing temporary files.                  |               |
| `--threads=<threads>`         | Number of threads for parallel processing.              |               |
| `--crs=<crs>`                 | SRID or CRS identifier for geometry coordinates.         | storage CRS   |
| `--crs-name=<name>`           | Name of the CRS to include in the output.               |               |
| `--no-appearances`            | Exclude appearances from the export.                    |               |
| `--pretty-print`              | Format and indent the output file (default: true).      | true          |
| `--config-file=<file>`        | Load configuration options from the specified file.     |               |
| `-L`, `--log-level=<level>`   | Set the logging level: fatal, error, warn, info, debug, trace. | info      |
| `--log-file=<file>`           | Write log messages to the specified file.               |               |
| `--pid-file=<file>`           | Create a process ID file.                               |               |
| `--plugins=<dir>`             | Load plugins from the specified directory.              |               |
| `--use-plugins=<plugin>`      | Enable/disable plugins using their fully qualified names. | true          |

---

## Query and filter options

| Option                        | Description                                              | Default Value      |
|-------------------------------|----------------------------------------------------------|--------------------|
| `-t`, `--type-name=<name>`    | Specify feature names to process. Example: `CityFurniture`. | None               |
| `-f`, `--filter=<cql2-text>`  | Apply a CQL2 filter to retrieve specific features.       | None               |
| `--filter-crs=<crs>`          | SRID or CRS identifier for the filter geometries.        | Storage CRS        |
| `--sql-filter=<sql>`          | Use an SQL query expression to filter features.          | None               |
| `-s`, `--sort-by=<property>`  | Sort features by the specified property. Example: `height`. | None               |
| `--limit=<count>`             | Limit the number of features processed. Example: `5`.    | No limit           |
| `--start-index=<index>`       | Start processing features from the specified index.      | `0`                |
| `-l`, `--lod=<lod>`           | Export geometries with a matching Level of Detail (LoD). | None               |
| `--lod-mode=<mode>`           | LoD filter mode: `or`, `and`, `minimum`, `maximum`.      | `or`               |
| `--lod-search-depth=<depth>`  | Levels of sub-features to search for matching LoDs.      | `0`                |
| `-a`, `--appearance-theme=<theme>` | Export appearances with a matching theme. Use `none` for null themes. | None               |

---

## Tiling options

Tiling options allow users to divide the output data into smaller tiles for improved performance and scalability.

| Option                          | Description                                              | Default Value |
|---------------------------------|----------------------------------------------------------|---------------|
| `--tile-matrix=<columns,rows>`  | Export data in a grid of specified dimensions. Example: `2,2`. |               |
| `--tile-dimension=<width,height>`| Define tile dimensions in the database CRS grid.         |               |
| `--tile-extent=<extent>`        | Define the tiling extent: `x_min,y_min,x_max,y_max[,srid]`. |               |
| `--tile-origin=<origin>`        | Tile origin for indexing: `top_left`, `bottom_left`. | top_left |

---

## Database connection options

The citydb-tool requires a connection to a 3DCityDB database for all operations, including the delete command.
Database connection details, such as host, port, schema, and credentials, must be provided to ensure the
tool can interact with the database successfully.

These options are shared across all commands in the citydb-tool, as a connection is essential every time data
is queried, deleted, imported, or exported.

For details on how to configure database connections, including host, port, schema, and credentials,
refer to the [Database Connection Options](db-connection.md). This section provides a comprehensive explanation of
all available connection parameters.

## Examples

### Basic export

Export using default settings and specifying an output file:

```bash
citydb export citygml -o output.gml
citydb export cityjson -o output.json
```

### Stop execution on errors (--fail-fast)

Stop the export process immediately upon encountering an error:

```bash
citydb export citygml -o output.gml --fail-fast
citydb export cityjson -o output.json --fail-fast
```

### Exporting with custom temporary directory

Specify a custom directory for storing temporary files during the export:

```bash
citydb export citygml -o output.gml --temp-dir=/path/to/temp
citydb export cityjson -o output.json --temp-dir=/path/to/temp
```

### Export with custom CRS and CRS name

Export data using a custom CRS and include the CRS name in the output:

```bash
citydb export citygml -o output.gml --crs=4326 --crs-name=WGS84
citydb export cityjson -o output.json --crs=4326 --crs-name=WGS84
```

### Using query and filter options

Export only CityFurniture features with a limit of 5:

```bash
citydb export citygml -t CityFurniture --limit=5 -o filtered_output.gml
citydb export cityjson -t CityFurniture --limit=5 -o filtered_output.json
```

### Using tiling options

Export data into a 2x2 grid of tiles:

```bash
citydb export citygml --tile-matrix=2,2 -o tiled_output.gml
citydb export cityjson --tile-matrix=2,2 -o tiled_output.json
```

### Using configuration files

Store export options in a file and reference it in the command:

```bash
citydb export citygml --config-file=export_config.json
citydb export cityjson --config-file=export_config.json
```
