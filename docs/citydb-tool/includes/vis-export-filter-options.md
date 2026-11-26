| Option                                                                   | Description                                                                                         | Default value |
|--------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|---------------|
| `-t`, <code>--type-name=<[prefix:]name><br/>[,<[prefix:]name>...]</code> | Names of the features to process.                                                                   |               |
| `-f`, `--filter=<cql2-text>`                                             | Filter to apply when retrieving features. Use the extended CQL2 filtering language of the 3DCityDB. |               |
| `--filter-crs=<crs>`                                                     | SRID or identifier of the CRS to use for geometries in the filter expression.                       | 3DCityDB CRS  |
| `--sql-filter=<sql>`                                                     | SQL query expression to use as filter.                                                              |               |
| `--limit=<count>`                                                        | Maximum number of features to process.                                                              |               |
| `--start-index=<index>`                                                  | Index within the input set from which features are processed.                                       |               |
| `-l`, <code>--lod=&lt;lod><br/>[,&lt;lod>...]</code>                     | Export geometries with a matching LoD.                                                              |               |
| `--lod-mode=<mode>`                                                      | LoD filter mode: `or`, `and`, `minimum`, `maximum`.                                                 | `or`          |
| <code>--lod-search-depth=<0..n&#124;all></code>                          | Levels of sub-features to search for matching LoDs.                                                 | 0             |
| `--no-appearances`                                                       | Do not process appearances.                                                                         |               |
| `-a`, <code>--appearance-theme=&lt;theme><br/>[,&lt;theme>...]</code>    | Process appearances with a matching theme. Use `none` for the null theme.                           |               |
