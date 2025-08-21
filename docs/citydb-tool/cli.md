---
title: CLI overview
description: Using the CLI of citydb-tool
tags:
  - citydb-tool
  - command-line interface
  - CLI
---

`citydb` is the main command of citydb-tool. It requires a [subcommand](#commands) to perform a specific operation on a
3DCityDB `v5` instance, such as importing, exporting, and deleting city model data. It also defines common options
that apply to all subcommands.

## Synopsis

```bash
citydb [OPTIONS] COMMAND
```

## Options

--8<-- "docs/citydb-tool/includes/global-options.md"

## Commands

| Command                               | Description                                                                          |
|---------------------------------------|--------------------------------------------------------------------------------------|
| [`help`](#help-and-cli-documentation) | [Display help information about the specified command.](#help-and-cli-documentation) |
| [`connect`](connect.md)               | [Test connection to the database.](connect.md)                                       |
| [`info`](info.md)                     | [Show database contents and summary information.](info.md)                           |
| [`import`](import.md)                 | [Import data in a supported format.](import.md)                                      |
| [`export`](export.md)                 | [Export data in a supported format.](export.md)                                      |
| [`delete`](delete.md)                 | [Delete features from the database.](delete.md)                                      |
| [`index`](index-command.md)           | [Perform index operations.](index-command.md)                                        |

!!! note
    If [plugins](#plugins) are registered for citydb-tool, they may extend the command list by adding their own
    commands to the CLI.

## Usage

### Version and 3DCityDB support

The `--version` option displays the version of citydb-tool along with the supported 3DCityDB versions. A `+` sign next
to a 3DCityDB version indicates that support starts with that version and includes all subsequent patch updates. Below
is an example output.

```shell
$ citydb --version
citydb-tool version 1.0.0
Supported 3DCityDB versions: 5.0.0+
(C) 2022-2025 virtualcitysystems GmbH
```

### Help and CLI documentation

To get help for a specific command, use the `--help` option. This will display a help message, including the
command's synopsis and its available options. If the command has subcommands, the `--help` option applies to the
command immediately preceding it. Alternatively, you can use the `help` command followed by the desired `COMMAND`,
which can also be a subcommand, to get the same information.

=== "Help option"

    ```bash
    citydb --help
    citydb import --help
    citydb import citygml --help
    # ...
    ```

=== "Help command"

    ```bash
    citydb help
    citydb help import
    citydb import help citygml
    # ...
    ```

### Logging

citydb-tool logs events such as activities, warnings and errors to the console. Each log entry contains a timestamp,
a severity level, and a descriptive message. The logging output is controlled using the `--log-level` option,
which defines the minimum severity of events that are shown. All messages of that severity or higher are
included.

The available log levels, ordered from highest to lowest severity, are:

- `fatal`: Critical errors causing immediate termination
- `error`: Non-recoverable errors
- `warn`: Warnings about potential issues
- `info`: General operational messages (default)
- `debug`: Detailed debugging information
- `trace`: Most detailed logs for troubleshooting

All console log messages are written to `stderr`, regardless of the selected log level. This design ensures that
structured output (for example, JSON returned by commands such as `info` or `connect`) written to `stdout` remains
clean and uncorrupted by log entries. This separation makes it possible, for example, to pipe structured output to
another program while log messages remain visible in the terminal.

The `--quiet` option disables log messages on the console entirely. With this option, only the structured output on
`stdout` is printed. Although not strictly required due to the separation of `stdout` and `stderr`, it is useful when
a completely silent console is desired except for structured output.

Log messages can also be recorded in a log file specified with the `--log-file` option. The log level set with the
`--log-level` option also applies to the log file.

!!! note
    The log file will be truncated at startup if it already exists.

### Configuration files

Options and settings for executing a citydb-tool command can also be loaded from a JSON-encoded configuration file
specified with `--config-file`. Configuration files override default settings and can be used alongside command-line
options for flexibility. However, command-line options always take precedence. Each CLI command defines its own JSON
structure. For more information, see the [JSON configuration](config.md) chapter.

=== "Linux"

    ```bash
    ./citydb export citygml [...] \
        --config-file=/path/to/my-config.json
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] ^
        --config-file=C:\path\to\my-config.json
    ```

!!! note
    Some commands may provide options exclusively in the JSON configuration, without corresponding command-line options.

### Plugins

citydb-tool provides a flexible plugin mechanism for adding custom functionality, allowing plugins to introduce new
commands or extend existing ones. Plugins are typically distributed as a ZIP package containing the plugin's 
Java Archive (JAR) file and any additional resources.

To install a plugin, unzip it (if necessary) and place the files in the `plugins` subfolder within the citydb-tool
installation directory. For better organization, it is recommended to create a separate subfolder for each plugin.
citydb-tool will automatically detect and load the plugins from this location, logging successfully loaded plugins
separately in the console. To uninstall a plugin, simply delete its folder from the `plugins` subfolder.

The `--plugins` option allows you to specify a different location for loading plugins. To enable or disable plugins, use
the `--use-plugin` option followed by the fully qualified Java class name and a value of `true` (enable) or `false`
(disable) (default: `true`). Disabled plugins will not be loaded. Multiple plugins can be specified as a comma-separated
list as shown below.

=== "Linux"

    ```bash
    ./citydb export citygml [...] \
        --plugins=/path/to/my/plugins \
        --use-plugin=com.example.PluginA=true,com.example.PluginB=false
    ```

=== "Windows CMD"

    ```bat
    citydb export citygml [...] ^
        --plugins=/path/to/my/plugins ^
        --use-plugin=com.example.PluginA=true,com.example.PluginB=false
    ```

!!! tip
    Refer to the plugin's documentation for details on its functionality, available CLI commands, options, and the fully
    qualified class name for the `--use-plugin` option. The class name will also be printed to the console when the plugin
    is loaded by citydb-tool.

### Exit codes

citydb-tool uses exit codes to indicate the success or failure of an operation. These codes help users and scripts
determine whether the execution was successful or if an error occurred. Below are the exit codes used by citydb-tool:

- `0`: The operation completed successfully without errors
- `1`: The operation terminated abnormally due to errors or issues
- `2`: Invalid input for an option or parameter
- Greater than `2`: Specific operation errors

## CLI tips and tricks

### Specifying options

Options that take a value can be specified using an equal sign (`=`) or a space. This applies to both short and long
options. Short options that do not take a value can be grouped behind a single `-` delimiter, followed by at most one
short option that requires a value.

The following generic examples are all equivalent, assuming `-f` is a short form for `--file`:

```bash
<command> -a -b -c --file=my-file.txt 
<command> -ab -c --file my-file.txt 
<command> -abc -f my-file.txt 
<command> -abcf=my-file.txt 
```

Multi-value options, such as `--use-plugin`, can accept one or more values. If multiple values are needed, they can either
be provided as a comma-separated list or by specifying the option multiple times.

The following examples are all valid:

```bash
citydb --use-plugin=com.example.PluginA,com.example.PluginB=false
citydb --use-plugin=com.example.PluginA --use-plugin=com.example.PluginB=false
```

### Double dash delimiter

citydb-tool supports the `--` delimiter to separate options from positional arguments. Any argument after `--` is
treated as a positional parameter, even if it matches an option name.

For example, consider the following `import citygml` command to import the CityGML file `my-city.gml`:

```bash
citydb import citygml [...] --db-password my-city.gml
```

The `--db-password` option of citydb-tool either takes a password as a value or, if left empty, prompts the user for input.
In this example, the user intended to be prompted for a password. However, `my-city.gml` will instead be interpreted as
the password rather than the input file. To prevent this, use the `--` delimiter:

```bash
citydb import citygml [...] --db-password -- my-city.gml
```

### Abbreviated options and commands

To simplify CLI usage, citydb-tool provides short forms for some options (e.g., `-h` for `--help`). Additionally, long
options without a specific short form can be abbreviated by using the initial letter(s) of the first component and
optionally of one or more subsequent components of the option name. "Components" are separated by `-` (dash) characters
or by case. For example, both `--camelCase` and `--kebab-case` consist of two components.

The following are valid abbreviations for `--super-long-option`, which has three components:

```bash
--sup, --sLO, --s-l-o, --s-lon, --s-opt, --sLon, --sOpt, --soLoOp (...)
```

The same abbreviation syntax can also be used for command names. However, abbreviations for both options and commands
must be unambiguous. For example, the command `import city` could be interpreted as both `import citygml` and
`import cityjson`, leading to a conflict. In such cases, citydb-tool will abort and display an error message to
prevent ambiguity.

### Argument files

When a command line includes many options or long arguments, system limitations on command length may become an issue.
Argument files (`@-files`) help overcome this limitation by allowing arguments to be stored in a separate file. You can
specify one or more argument files by prefixing their filenames with `@` on the command line. The contents of each `@-file`
are automatically expanded into the argument list.

Arguments in an `@-file` can be separated by spaces or newlines. Arguments containing spaces must be enclosed in
double (`"`) or single (`'`) quotes. Within quoted values, quotes are escaped with a backslash (`\`), and backslashes are
escaped by doubling them (`\\`). Lines starting with `#` are comments and are ignored. The argument file can also
contain references to additional `@-files`, which will be processed recursively.

For example, suppose an `@-file` exists at `/home/foo/args`, containing the following logging and database connection
options:

```bash
# This line is a comment and is ignored
--log-level=debug
--log-file=/path/to/my/logfile.log
--db-host=localhost
--db-name=citydb
--db-user=citydb_user
--db-password=changeMe
```

This `@-file` can be used with a citydb-tool command as shown below. The specified path can be either absolute or
relative to the current directory.

```bash
citydb index status @/home/foo/args 
```

You can also use multiple `@-files` on the command line to logically group their contents.

```bash
citydb index status @/home/foo/db-args @/home/foo/logging-args 
```

!!! tip
    Although `@-files` are intended for a different purpose, they can be used similarly to configuration files to execute
    commands with different options depending on the scenario or use case. However, it is recommended to use configuration
    files whenever possible.

!!! warning
    Argument files have a limitation: parameter or option values enclosed in quotes must not be preceded by an equal sign.
    For example, `--my-option="foo bar"` will not work inside an argument file. To work around this, either omit the equal sign
    (`--my-option "foo bar"`) or enclose the entire expression in quotes (`"--my-option=\"foo bar\""`).