---
title: Report configuration
description: Description of the JSON configuration for generating a database report
tags:
  - citydb-tool
  - info
  - report
  - config
---

The configuration settings for generating a database report using the `info` command are shown below.

!!! tip
    The names and purposes of the JSON properties align closely with their counterparts in the command-line options. Where
    applicable, the description of each JSON property links to the command-line option for more details.

## Report options

```json
{
  "reportOptions": {
    "numberOfThreads": 4,
    "featureScope": "all",
    "compact": false,
    "includeGenericAttributes": true,
    "includeDatabaseSize": true
  }
}
```

| <div style="width:200px;">Property</div>                             | Description                                                                                              | Default value |
|----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------------|
| [`"numberOfThreads"`](info.md#controlling-the-report-process)        | Number of threads to use for parallel processing.                                                        |               |
| [`"featureScope"`](info.md#feature-scope)                            | Feature scope: `all`, `active`. For `active`, only properties of non-terminated features are considered. | `all`         |
| [`"compact"`](info.md#report-contents)                               | Only generate a compact overview.                                                                        | `false`       |
| [`"includeGenericAttributes"`](info.md#including-generic-attributes) | Include generic attributes and their data types.                                                         | `false`       |
| [`"includeDatabaseSize"`](info.md#including-database-size-metrics)   | Include database size metrics.                                                                           | `false`       |