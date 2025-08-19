| Option                                                                                          | Description                                                           | Default value |
|-------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|---------------|
| `[@<filename>...]`                                                                              | One or more argument files containing options.                        |               |
| `-h`, `--help`                                                                                  | Show a help message and exit.                                         |               |
| `-V`, `--version`                                                                               | Print version information and exit.                                   |               |
| `--config-file=<file>`                                                                          | Load configuration from this file.                                    |               |
| `-L`, `--log-level=<level>`                                                                     | Log level: `fatal`, `error`, `warn`, `info`, `debug`, `trace`.        | `info`        |
| `--log-file=<file>`                                                                             | Write log messages to this file.                                      |               |
| `--quiet`                                                                                       | Disable console log messages.                                         |               |
| `--pid-file=<file>`                                                                             | Create a file containing the process ID.                              |               |
| `--plugins=<dir>`                                                                               | Load plugins from this directory.                                     |               |
| <code>--use-plugin=&lt;plugin[=true&#124;false]><br/>[,&lt;plugin[=true&#124;false]>...]</code> | Enable or disable plugins with a matching fully qualified class name. | `true`        |
