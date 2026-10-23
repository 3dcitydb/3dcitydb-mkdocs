---
# title: Docker
description: citydb-3dtiler CLI Overview
tags:
  - CLI
  - citydb-3dtiler
  - commands
---

# CLI Overview

citydb-3dtiler is the main command of the application. When run with the Docker container, this main command is automatically invoked, so there is no need to retype it. However, when running in a Python environment, the main command must be typed. Besides the main command, there are two subcommands: `advise` and `tile`. The `--help` option provides explanatory information about the typed command and, depending on the command, other options that can be used.

??? tip "Where can i find installation instructions in more detail?"
    If you are planning to install citydb-3dtiler on a Python Virtual Environment and are looking for a more detailed instruction, visit this page: [How to use with Python Virtual Environment?](includes/how_to_use_w_venv.md){:target="_blank"}. Docker usage is briefly explained here and also described in more detail on the [citydb-3dtiler Docker](docker.md){:target="_blank"} page.

## Synopsis

=== "in the Python Env."

    ```bash
    python3 citydb-3dtiler.py [MAIN OPTIONS] SUBCOMMAND [OPTIONS] ARGUMENTS
    ```


=== "within the Docker Container"

    ```bash
    docker run [DOCKER OPTIONS] [MAIN OPTIONS] SUBCOMMAND [OPTIONS] ARGUMENTS
    ```


## Options of the main command (citydb-3diler)

| **Option** | **Description** | **Default value** |
|---|---|---|
| [-h, --help](#usage-syntax) | shows a help message and exit the program |  |
| [--tiler-app](main_options.md#-tiler-app) | choose one of the compatible 3D Tile Generator app | pg2b3dm |
| [--tilers-path](main_options.md#-tilers-path) | sets the absolute/relative path of the selected 3D Tile Generator software. | tiler_app/ |
| [--separate-tilesets](main_options.md#-separate-tilesets) | exports separate tilesets for each objectclass or namespace |  |
| [(Database Connection Options)](db_con_options.md) | This group is expressed as a placeholder to collectively represent the options used for configuring database connections. Options are as follows: `--db-host`,`--db-port`, `--db-name`, `--db-schema`, `--db-username`, `--db-password` |  |
| [(Filter Options)](filter_options.md) | This group is expressed as a placeholder to collectively represent the options used for filtering the existing features. Filtering options are as follows: `--limit`, `--start-index`, `--id`, `--type-name`, `--bbox`, `--bbox-mode`, `--filter` (CQL2), `--sql-filter` |  |

??? tip "Check all the subcommands and the options in one diagram"
    If you want to see all the subcommands and the options with possible arguments in one diagram, visit this page : [citydb-3dtiler Functionality Matrix](includes/functionality_matrix.md){:target="_blank"}


## Commands

| **Command** | **Description** |
|---|---|
| [help](#usage-syntax) | The help output shows the usage syntax and available arguments. |
| [advise](advise.md) | Test connection to the database. Available options are as follows: `--ignore-thematic-features`, `--output-file` |
| [tile](tile.md) | Show database contents and summary information. Tiling options are as follows : `--style-mode`, `--style-absence-behaviour`, `--output-folder`, `--transparency`, `--custom-style`, `--attributes`, `--selected-attributes`, `--attribute-structure`, `--attribute-structure`, `--vertical-offset` |

## Usage Syntax

The usage syntax of the main options and the subcommands `advice` and `tile` are as follows. To see this usage syntax on the command line interface (CLI), you can type `-h` or `--help` immediately after the main command (`citydb-3dtiler`) or the docker (run) command. If you want to see the options of the subcommands `advice` and `tile`, click on the relevant links in the [Commands table](#commands).

```bash
citydb-3dtiler [-h] [--tilers-path [File Path of the 3D Tiler]] \
    [--tiler-app {pg2b3dm,py3dtiles}] \
    [--separate-tilesets [{objectclass,namespace}]] \
    [-H Hostname] [-P Port Number] [-d Database Name] \
    [-S Schema] [-u Username] [-p Password] \
    [--limit Limit] [--start-index Start Index] [-i ID Number(s)] \
    [-t Type Name(s) / Objectclasses] \
    [-b Boundary Box] [--bbox-mode Boundary Box Mode] \
    [-f CQL2 Filter] [--sql-filter SQL Filter] \
    {advise,tile} ...
```


Some sample commands given in the code blocks below.

=== "within the Docker container"

    ```bash
    docker run --rm --interactive --tty --name tiler \
        --volume ./:/home/tester/citydb-3dtiler/shared:rw \
        citydb-3dtiler:latest \
        --db-host localhost --db-port 9876 \
        --db-name luebbecke_3d \
        --db-schema citydb \
        --db-username tester --db-password louvre \
        tile \
        --vertical-offset 0.5
    ```

=== "in the Python Env."

    ```bash
    python3 citydb-3dtiler.py \
        --db-host localhost --db-port 9876 \
        --db-name luebbecke_3d \
        --db-schema citydb \
        --db-username tester --db-password louvre \
        tile \
        --vertical-offset 0.5
    ```

??? tip "What is the purpose of the backslash (\\) character in the code block?"
    - When typing commands, the caret (^), backtick (\`), and backslash (\\) are "escape characters" that tell the computer to handle the next symbol as plain text, not as a command.
    - Windows CMD uses ^, PowerShell uses \`, and Linux Bash uses \\ because each system speaks a slightly different language. 
    - Alternatively, you can copy these commands into a text editor and delete both the escape characters and the new line characters (\\n) to turn the command into a single line.