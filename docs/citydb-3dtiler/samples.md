---
# title: Sample Commands & Tests
description: Sample Commands & Tests
tags:
  - Samples
  - citydb-3dtiler
  - Tests
---

# Samples

## Difference between the Docker and Python Env. Usage

There are two main ways to use the citydb-3dtiler application: The first and relatively easier one is to run it inside a container using the Docker image. It does not require any installation other than Docker, but the parameters specified in the documentation must be used. The second way is to set up a Python virtual environment and run the application within that environment. It requires installation, but the commands are shorter. For this reason, we will list the Python commands in the example commands below. If you want to run the example commands below using a Docker container, all you need to do is simply replace the `python3 citydb-3dtiler.py` expression in the commands with the `docker run ...` expression.

Here below there are examples for such a replacement:

=== "Take report within Python setup"
    ```bash
    python3 citydb-3dtiler.py \
    --db-host localhost --db-port 9876 \
    --db-name citydb-visualizer \
    --db-schema citydb \
    --db-username tester --db-password louvre \
    advise
    ```

=== "Take report using Docker"
    ```bash
    docker run \
    --rm --interactive --tty \
    --name citydb-3dtiler \
    --volume ./:/home/tester/citydb-3dtiler/shared:rw \
    citydb-3dtiler:latest \
    --db-host localhost --db-port 9876 \
    --db-name citydb-visualizer --db-schema citydb \
    --db-username tester --db-password louvre \
    advise
    ```

??? tip "What is the purpose of the backslash (\\) character in the code block?"
    - When typing commands, the caret (^), backtick (\`), and backslash (\\) are "escape characters" that tell the computer to handle the next symbol as plain text, not as a command.
    - Windows CMD uses ^, PowerShell uses \`, and Linux Bash uses \\ because each system speaks a slightly different language. 
    - Alternatively, you can copy these commands into a text editor and delete both the escape characters and the new line characters (\\n) to turn the command into a single line.

## Help (-h) commands

You can use the help command for both main commands and subcommands.

=== "General help document"
    ```bash
    python3 citydb-3dtiler.py --help
    ```

=== "Help doc for advise command"
    ```bash
    python3 citydb-3dtiler.py advise --help
    ```

=== "Help doc for tile command"
    ```bash
    python3 citydb-3dtiler.py tile --help
    ```

## Filtering Samples

### General Filters

#### Filter by IDs (citydb.feature.objectid)

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--id _20210907161723_295,_20210907161723_1,_20210907161723_220 \
tile
```

#### Filter by type-name (citydb.objectclass & citydb.feature.objectclass_id)

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--type-name WallSurface,OuterFloorSurface,OuterCeilingSurface \
tile
```

#### Limit the features

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--limit 1000 \
tile
```

#### Specify the start-index (Offset)

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--start-index 200000 \
tile
```

#### Use the Limitation and start-index within the same command

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--limit 100000 --start-index 200000 \
tile \
--tiles-version 1.0
```

#### Use the Limitation, start-index and type-name filters together

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--limit 100000 --start-index 200000 \
tile
```

### Spatial Filtering

#### Use Bbox for filtering

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--bbox 564822,5932935,566924,5934737,25832 \
tile
```

??? tip "Remember the purpose the 5th element!"
    5th argument of the bbox is an optional value that used to specify the CRS/SRS code of the given boundary box coordinates. For more information about that visit [Filter Options](filter_options.md/#-bbox-b) page.

#### Use Bbox for filtering without specifying the CRS code

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--bbox 564822,5932935,566924,5934737 \
tile
```

#### Use Bbox for filtering in intersects-precise mode
```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--bbox 564822,5932935,566924,5934737,25832 \
--bbox-mode intersects-precise \
tile
```

#### Use bbox for filtering with contains mode

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--bbox 564822,5932935,566924,5934737,25832 \
--bbox-mode contains \
tile
```

#### Use bbox for filtering with contains-precise mode

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--bbox 564822,5932935,566924,5934737,25832 \
--bbox-mode contains-precise \
tile
```

### Query-based Filtering

#### CQL2 Filter Sample using quantitative attributes

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--filter "gen_revision_jahr >= 2021" \
tile \
--attributes selected \
--selected-attributes gen_dach_min
```

??? warning "Do not forget to add the attribute to the tileset"
    If you would like to use one or more attributes in the CQL2 filter (`--filter`) expression, than you have to add these attributes to the 3DTiles. This is a known issue in the application for the moment.

## Advise command samples

### Take an advice for the existing dataset to generate a single tileset

```bash
python3 citydb-3dtiler.py \
--db-host localhost --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
advise
```

### Take an advice for the existing dataset to generate separate tilesets


```bash
python3 citydb-3dtiler.py \
--db-host localhost --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
--separate-tilesets objectclass \
advise
```


## Tile command samples

### Styling

#### Generate 3DTiles using property-based styling

??? tip "How to assign custom property values to set the materials/colors?"

    To set such a color/material set, you have to check the existing properties in your dataset. To see the available properties, you can also check the advice document created by the advise command. However, you still need to find the value sets for the existing dataset. After that you can add the property names and the values to the materials document like below:

     namespace of classname | classname | namespace of property | property name | column name of property value | property value | pbr metallic roughness base color 
    ---|---|---|---|---|---|---
     bldg | Building |  |  |  |  | #00E5EE80 
     bldg | Building | bldg | roofType | val_string | flat | #66DEF3FC 
     bldg | Building | bldg | roofType | val_string | gabled | #F35FCBFC 

??? info "Style-Modes"
    Default style-mode is objectclass-based. Check the materials_for_features.csv table to view existing objectclasses.

```bash
    python3 citydb-3dtiler.py \
    --db-host localhost --db-port 9876 \
    --db-name citydb-visualizer \
    --db-schema citydb \
    --db-username tester --db-password louvre \
    tile \
    --style-mode property-based
```

#### Generating separated 3DTiles using objectclass-based separation and property-based styling

```bash
    python3 citydb-3dtiler.py \
    --db-host localhost --db-port 9876 \
    --db-name citydb-visualizer \
    --db-schema citydb \
    --db-username tester --db-password louvre \
    --separate-tilesets objectclass \
    tile \
    --style-mode property-based
```

#### Change the style-absence-behaviour if needed

```bash
    python3 citydb-3dtiler.py \
    --db-host localhost --db-port 9876 \
    --db-name citydb-visualizer \
    --db-schema citydb \
    --db-username tester --db-password louvre \
    tile \
    --style-mode property-based \
    --style-absence-behaviour rise-up
```

#### Activate the transparency

```bash
python3 citydb-3dtiler.py \
    --db-host localhost --db-port 9876 \
    --db-name citydb-visualizer \
    --db-schema citydb \
    --db-username tester --db-password louvre \
    tile \
    --style-mode property-based \
    --transparency blend
```

### Attributes

#### Generate a Tileset by adding all the available attributes

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
tile \
--attributes all
```

#### Generate a Tileset by selecting a subset of the attributes

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
tile \
--attributes selected \
--selected-attributes core_name,gen_objektart,con_height
```

#### Generate a Tileset that shows the attributes as (JSON-like) nested objects

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
tile \
--attributes all \
--attribute-structure nested
```

### Others

#### Generate a Tileset in the 3DTiles v1.0 standard

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
tile \
--tiles-version 1.0
```

#### Add (+/-) Vertical Offset for all the features

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
tile \
--vertical-offset 3.5
```

#### Specify a custom folder for the tileset

```bash
python3 citydb-3dtiler.py \
--db-host 10.162.246.195 --db-port 9876 \
--db-name citydb-visualizer \
--db-schema citydb \
--db-username tester --db-password louvre \
tile \
--output-folder lubbecke-3d
```