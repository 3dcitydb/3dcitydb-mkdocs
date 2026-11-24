| Option                                                   | Description                                                                               | Default value |
|----------------------------------------------------------|-------------------------------------------------------------------------------------------|---------------|
| `-o`, `--output=<file>`                                  | Name of the output file.                                                                  |               |
| `--output-encoding=<encoding>`                           | Encoding to use for the output file.                                                      |               |
| `--fail-fast`                                            | Fail fast on errors.                                                                      |               |
| `--temp-dir=<dir>`                                       | Store temporary files in this directory.                                                  |               |
| `--texture-buckets=<number>`                             | Distribute texture files over this number of subfolders.                                  | 0             |
| `--threads=<threads>`                                    | Number of threads to use for parallel processing.                                         |               |
| `--crs=<crs>`                                            | SRID or identifier of the CRS to use for the coordinates of geometries.                   | 3DCityDB CRS  |
| `--crs-name=<name>`                                      | Name of the CRS to use in the output file.                                                |               |
| <code>--transform=&lt;m0,m1,...,m11&#124;swap-xy></code> | Transform coordinates using a 3x4 matrix in row-major order. Use `swap-xy` as a shortcut. |               |
