# All Commands & Samples

## All available Commands, Arguments & Options

???+ example "citydb-3dtiler Usage"

    --help </br>
    --db-.. </br>
    ??? example "Database Connection Arguments"
        --db-host </br>
        --db-port (default: 5432) </br>
        --db-name </br>
        --db-schema (default: citydb) </br>
        --db-username </br>
        --db-password </br>
    --separate-tilesets
    ??? info "Separate Tilesets Options"
        None (Default) </br>
        objectclass
    --tiler-app (default: pg2b3dm) </br>
    --tilers-path (default: tiler_app) </br>
    advise </br>
    ??? example "Advise Arguments"
        --help </br>
        --consider-thematic-features (default: False) </br>
        --output-file (default: advice.yml)
    tile
    ??? example "Tile Arguments"
        --help </br>
        --custom-style (default: materials_for_features.csv) </br>
        --style-mode
        ??? info "Style Mode Options"
            property-based </br>
            objectclass-based (default) </br>
            no-style
        --style-absence-behavior
        ??? info "Style Absence Behavior"
            falldown (default) </br>
            riseup
        --transparency-mode
        ??? info "Transparency Options"
            Blend </br>
            Opaque (default)
        --output-folder (default: current folder in host)


## Help commands

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

## Sample Commands

### Take report (advice document) for the existing dataset to generate a single tileset

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
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    citydb-3dtiler:latest `
    --db-host localhost --db-port 9876 `
    --db-name citydb-visualizer --db-schema citydb `
    --db-username tester --db-password louvre `
    advise
    ```

### Take report (advice document) for the existing dataset to generate separate tilesets

=== "Take report for separate tilesets within Python setup"
    ```bash
    python3 citydb-3dtiler.py \
    --db-host localhost --db-port 9876 \
    --db-name citydb-visualizer \
    --db-schema citydb \
    --db-username tester --db-password louvre \
    --separate-tilesets objectclass \
    advise
    ```

=== "Take report for separate tilesets using Docker"
    ```bash
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    citydb-3dtiler:latest `
    --db-host localhost --db-port 9876 `
    --db-name citydb-visualizer --db-schema citydb `
    --db-username tester --db-password louvre `
    --separate-tilesets objectclass `
    advise
    ```

### Generate 3DTiles using property-based styling

#### "How to assign custom property values to set the materials/colors?"

To set such a color/material set, you have to check the existing properties in your dataset. To see the available properties, you can also check the advice document created by the advise command. However, you still need to find the value sets for the existing dataset. After that you can add the property names and the values to the materials document like below:

 namespace_of_classname | classname | namespace_of_property | property_name | column_name_of_property_value | property_value | emmisive_color | pbr_metallic_roughness_base_color 
---|---|---|---|---|---|---|---
 bldg | Building |  |  |  |  |  | #00E5EE80 
 bldg | Building | bldg | roofType | val_string | flat |  | #66DEF3FC 
 bldg | Building | bldg | roofType | val_string | gabled |  | #F35FCBFC 


??? info "Style-Modes"
    Default style-mode is objectclass-based. Check the materials_for_features.csv table to view existing objectclasses.

=== "Generate 3DTiles within Python setup"
    ```bash
    python3 citydb-3dtiler.py \
    --db-host localhost --db-port 9876 \
    --db-name citydb-visualizer \
    --db-schema citydb \
    --db-username tester --db-password louvre \
    tile \
    --style-mode property-based
    ```

=== "Generate 3DTiles using Docker"
    ```bash
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    citydb-3dtiler:latest `
    --db-host localhost --db-port 9876 `
    --db-name citydb-visualizer --db-schema citydb `
    --db-username tester --db-password louvre `
    tile `
    --style-mode property-based 
    ```

### Generate separated 3DTiles using objectclass-based separation and property-based styling

=== "Generate separated 3DTiles within Python setup"
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

=== "Generate separated 3DTiles using Docker"
    ```bash
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    citydb-3dtiler:latest `
    --db-host localhost --db-port 9876 `
    --db-name citydb-visualizer --db-schema citydb `
    --db-username tester --db-password louvre `
    --separate-tilesets objectclass `
    tile `
    --style-mode property-based 
    ```


