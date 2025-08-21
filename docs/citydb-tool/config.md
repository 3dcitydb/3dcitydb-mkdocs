---
title: JSON configuration
description: Overview of the JSON configuration of citydb-tool
tags:
  - citydb-tool
  - JSON
  - config
---

# JSON configuration

The options and settings for executing a citydb-tool command can be defined in a JSON-encoded configuration file,
offering an alternative to manually specifying them via the command line. The configuration file organizes
options into functional sections, with each command using one or more sections based on its specific task
and operation.

The example below illustrates the basic structure of the configuration file, highlighting the main sections.
A configuration file can include all sections for reusability across different commands, or it may contain only the
sections needed for a specific command.

```json
{
  "databaseOptions": {...},
  "importOptions": {...},
  "readOptions": {...},
  "exportOptions": {...},
  "writeOptions": {...},
  "deleteOptions": {...},
  ...
}
```

## Configuration sections

The purpose of each configuration section is outlined below. Their content and usage for different citydb-tool commands are
explained in more detail in the following chapters.

| <div style="width:130px;">Section</div>                      | Description                                                                                                               |
|--------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| [`"databaseOptions"`](database.md#using-configuration-files) | Defines connection details for one or more 3DCityDB instances, usable by all commands that require a database connection. |
| [`"importOptions"`](import-config.md#import-options)         | Defines options for controlling the import process.                                                                       |
| [`"readOptions"`](import-config.md#read-options)             | Specifies settings for reading input files, including format-specific options.                                            |
| [`"exportOptions"`](export-config.md#export-options)         | Defines options for controlling the export process.                                                                       |
| [`"writeOptions"`](export-config.md#write-options)           | Specifies settings for writing output files, including format-specific options.                                           |
| [`"deleteOptions"`](delete-config.md)                        | Defines options for controlling the delete process.                                                                       |
| [`"reportOptions"`](report-config.md)                        | Defines options for controlling the database report generation.                                                           |

You can load configuration files using the [`--config-file`](cli.md#configuration-files) option when executing
citydb-tool commands.

=== "Linux"

    ```bash
    ./citydb import citygml \
        --config-file=/path/to/my-config.json \
        my-city.gml
    ```

=== "Windows CMD"

    ```bat
    citydb import citygml ^
        --config-file=C:\path\to\my-config.json ^
        my-city.gml
    ```

!!! tip
    - Configuration files can be used alongside command-line options for flexibility. However, command-line options always
      take precedence.
    - Some commands may provide options exclusively in the JSON configuration, without corresponding command-line options.
    - If [plugins](cli.md#plugins) are registered for citydb-tool, they may extend the configuration by adding their
      own sections.