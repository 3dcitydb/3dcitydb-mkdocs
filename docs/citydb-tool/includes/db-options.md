| Option                                                                       | Description                                                                  | Default value        |
|------------------------------------------------------------------------------|------------------------------------------------------------------------------|----------------------|
| `--db-type=<type>`                                                           | Database system of the 3DCityDB.                                             | PostgreSQL           |
| `-H`, `--db-host=<host>`                                                     | Name of the host on which the 3DCityDB is running.                           |                      |
| `-P`, `--db-port=<port>`                                                     | Port of the 3DCityDB server.                                                 | database default     |
| `-d`, `--db-name=<database>`                                                 | Name of the 3DCityDB database to connect to.                                 |                      |
| `-S`, `--db-schema=<schema>`                                                 | Schema to use when connecting to the 3DCityDB.                               | `citydb` or username |
| `-u`, `--db-username=<user>`                                                 | Username to use when connecting to the 3DCityDB.                             |                      |
| `-p`, <code>--db-password<br/>[=&lt;password>]</code>                        | Password to use when connecting to the 3DCityDB. Leave empty to be prompted. |                      |
| <code>--db-property=&lt;property=value><br/>[,&lt;property=value>...]</code> | Database-specific connection properties.                                     |                      |
