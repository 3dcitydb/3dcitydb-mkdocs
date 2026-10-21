---
title: citydb-3dtiler
description: Introduction to citydb-3dtiler
tags:
  - citydb-3dtiler
  - overview
  - features
---

!!! warning "This application is in the testing phase"
    This application is still in the testing phase. Please exercise caution when using it in production. Therefore, feedback is always welcome. Please feel free to create an issue on the GitHub page or contact me: murat.kendir(At)tum.de

<figure style="width:100%;text-align: center;">
  <img src="images/sample_3dtiles_leipzig.jpg" alt="Sample 3DTiles from Leipzig" style="border:3px solid #4CAE4F"/>
  <figcaption>A 3DTiles sample represents the city objects of <a href="https://tinyurl.com/leipzig3d" target="_blank">Leipzig city</a></figcaption>
</figure>


`citydb-3dtiler` can generate 3DTiles (v 1.0 and 1.1) by reading features (formerly known as "cityobject"s) from 3DCityDB (v5.x), a database application that can import CityGML 2.0 or 3.0-based datasets. The application's key features are as follows:

## Key features

- creates singular or separate 3DTiles (based on object classes) by reading the features from the 3DCityDBv5.
- generates report (advice.yml) about the existing data in the database and calculate the most efficient configuration parameters for creating 3D Tiles.
- can assign simple colors or PBR materials based on object classes or the specified property values of features.
- The PBR Materials of the 3D Tilesets can be customized with a CSV file by listing objectclasses and properties.
- features can be filtered using SQL or CQL2 expressions
- filters the features using different criterias such as id, limit, start-index, boundary box or type-name (object class)
- filters the relevant attributes and can flatten the structure of complex attributes (such as con:Height)
- supports 3DTiles v1.0 and v1.1
- The Execution Times of the tiling mechanism depends on the given command, available dataset and the hardware. If you are curious about the execution times of some previously generated test visit [this page](https://www.3dcitydb.net/3dcitydb/fileadmin/public/kendir/bern_full_procedure/execution_times.md){:target="_blank"}.

## Special Thanks

This application is based on two important concepts and aims to bridge the gap between the concepts 3DTiles and CityGML.
To bridge this gap, two main elements have been used in this software: [3DCityDB v5](https://docs.3dcitydb.org/edge/){:target="_blank"}, [pg2b3dm](https://github.com/Geodan/pg2b3dm){:target="_blank"}

*We would like to take this opportunity to thank **Bert Temme**, the developer of the pg2b3dm library, and all **3DCityDB developers**.*

## Simple Usage (via Docker)


There are two different ways to use citydb-3dtiler: using Docker containers and setting up a Python environment on the local computer to run the application. Both methods are explained in more detail on the relevant pages ([How to use with Docker](docker.md), [How to use with Python Env](includes/how_to_use_w_venv.md)). Below, Docker usage will be explained with only the fundamental steps.

### Step-1 : Customization of the Materials (Optional)

??? tip "If you do not want to customize"

    If you do not want to customize the feature colors (materials), proceed to Step 4. Otherwise, follow the next instructions.

Download and customize the "materials_for_features" file with one of office software (LibreOffice, OpenOffice or OnlyOffice) by changing the color values in the first sheet (sheet name: "materials").
[materials_for_features.ods](https://github.com/tum-gis/citydb-3dtiler/blob/main/materials_for_features/materials_for_features.ods){:target="_blank"}

??? tip "Activate the internal Macro if you need to see the colors immediately"
    When you open the shared ODS file (compatible with LibreOffice, OpenOffice, OnlyOffice etc.), your Office application will ask whether you want to enable the Macro contained in the file. This macro is used as a color picker and displays the entered color code (RGBA hexadecimal codes) on an additional sheet, so you can see the colors and transparency levels directly on the document.
    
    ![Materials for Features File in Office](images/sample_from_material_table.png)

### Step-2 : Export as CSV (Optional)

Save only the first sheet (materials) as a CSV file. 

??? warning "Pay attention to the following issues"
    While exporting the table as CSV file : </br>
    - Field delimiters must be commas (,) </br>
    - Do not force text to be quoted with apostrophes (")

### Step-3 : Start the Terminal/Shell

Using your preferred CLI tool (Terminal/Shell), navigate to the same folder with the materials_for_features.csv. You can use the ```cd <FOLDERNAME>``` command to navigate to the folder.

### Step-4 : Take an Advice for the Dataset (Optional)

(Optional) Create an advice file using the software. This advice file will list the existing object classes and their attributes in your database, and calculate the maximum number of features per tile.

=== "Powershell"

    ```powershell
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    ghcr.io/tum-gis/citydb-3dtiler:latest `
    --db-host <IP-or-COMP-NAME> --db-port <PORT-NUMBER> `
    --db-name <DATABASE-NAME> --db-schema <SCHEMA-NAME> `
    --db-username <USER-NAME> --db-password <DATABASE-PASSWORD> `
    advise
    ```

=== "Linux Terminal"

    ```bash
    docker run \
    --rm --interactive --tty \
    --name citydb-3dtiler \
    --volume ./:/home/tester/citydb-3dtiler/shared:rw \
    ghcr.io/tum-gis/citydb-3dtiler:latest \
    --db-host <IP-or-COMP-NAME> --db-port <PORT-NUMBER> \
    --db-name <DATABASE-NAME> --db-schema <SCHEMA-NAME> \
    --db-username <USER-NAME> --db-password <DATABASE-PASSWORD> \
    advise
    ```

=== "Command Prompt (CMD)"

    ```bash
    docker run ^
    --rm --interactive --tty ^
    --name citydb-3dtiler ^
    --volume ./:/home/tester/citydb-3dtiler/shared:rw ^
    ghcr.io/tum-gis/citydb-3dtiler:latest ^
    --db-host <IP-or-COMP-NAME> --db-port <PORT-NUMBER> ^
    --db-name <DATABASE-NAME> --db-schema <SCHEMA-NAME> ^
    --db-username <USER-NAME> --db-password <DATABASE-PASSWORD> ^
    advise
    ```

=== "Sample Command"

    ```bash
    docker run \
    --rm --interactive --tty \
    --name citydb-3dtiler \
    --volume ./:/home/tester/citydb-3dtiler/shared:rw \
    ghcr.io/tum-gis/citydb-3dtiler:latest \
    --db-host 10.162.246.888 --db-port 9876 \
    --db-name citydb-visualizer --db-schema citydb \
    --db-username tester2 --db-password louvre \
    advise
    ```

### Step-5 Generate the 3DTiles

Generate 3DTiles using the default configuration by typing the following command: 

??? info "How the application checks the 'materials_for_features.csv' file?"
    The program automatically checks whether the “materials_for_features.csv” file is present in the current folder. If the file is not present in the current folder, it uses the predefined materials stored internally (in the Docker image). If you have renamed the file, you can use the `--custom-style` option after the `tile` command.


=== "Powershell"

    ```powershell
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    ghcr.io/tum-gis/citydb-3dtiler:latest `
    --db-host <IP-or-COMP-NAME> --db-port <PORT-NUMBER> `
    --db-name <DATABASE-NAME> --db-schema <SCHEMA-NAME> `
    --db-username <USER-NAME> --db-password <DATABASE-PASSWORD> `
    tile
    ```

=== "Linux Terminal"

    ```bash
    docker run \
    --rm --interactive --tty \
    --name citydb-3dtiler \
    --volume ./:/home/tester/citydb-3dtiler/shared:rw \
    ghcr.io/tum-gis/citydb-3dtiler:latest \
    --db-host <IP-or-COMP-NAME> --db-port <PORT-NUMBER> \
    --db-name <DATABASE-NAME> --db-schema <SCHEMA-NAME> \
    --db-username <USER-NAME> --db-password <DATABASE-PASSWORD> \
    tile
    ```

=== "Command Prompt (CMD)"

    ```bash
    docker run ^
    --rm --interactive --tty ^
    --name citydb-3dtiler ^
    --volume ./:/home/tester/citydb-3dtiler/shared:rw ^
    ghcr.io/tum-gis/citydb-3dtiler:latest ^
    --db-host <IP-or-COMP-NAME> --db-port <PORT-NUMBER> ^
    --db-name <DATABASE-NAME> --db-schema <SCHEMA-NAME> ^
    --db-username <USER-NAME> --db-password <DATABASE-PASSWORD> ^
    tile
    ```

=== "Sample Command"

    ```bash
    docker run \
    --rm --interactive --tty \
    --name citydb-3dtiler \
    --volume ./:/home/tester/citydb-3dtiler/shared:rw \
    ghcr.io/tum-gis/citydb-3dtiler:latest \
    --db-host 10.162.246.888 --db-port 9876 \
    --db-name citydb-visualizer --db-schema citydb \
    --db-username tester2 --db-password louvre \
    tile
    ```
