---
# title: Docker
description: citydb-3dtiler Docker documentation and usage examples
icon: material/docker
tags:
  - docker
  - citydb-3dtile
---

# How to use with Docker?

## 1. Set the Feature Materials/Colors (Optional)

Download and customize the "materials_for_features" file with one of office software (LibreOffice, OpenOffice or OnlyOffice) by changing the color values in the first sheet (sheet name: "materials").

- [materials_for_features.ods](https://github.com/3dcitydb/citydb-3dtiler/blob/main/materials_for_features/materials_for_features.ods){:target="_blank"}

??? tip "If you do not want to customize"

    If you do not want to customize the feature colors (materials), proceed to Step 4. Otherwise, follow the next instructions.

??? info "Alternatively ..."
    Open the document in LRZ Sync & Share and copy the document for yourself so you can create your own CSV file: <a href="https://syncandshare.lrz.de/getlink/fiWEn4L2VBQwFyVeqqFmRH/materials_for_features.ods" target="_blank">syncandshare.lrz.de/getlink/fiWEn4L2VBQwFyVeqqFmRH/materials_for_features.ods</a> </br> </br>
    If you customized the colors in the first sheet ("materials") using RGBA hex color codes, then you can check the colors and transparency colors with internal JS Macro. Go to View > Macros and Click to Run to update all the colors avaialble in the 3th sheet ("Colors").


## 2. Save the ODS file as CSV

Save only the first sheet (materials) as a CSV file. 

???+ warning "Pay attention to the following"
    While exporting the table as CSV file : </br>
    - Field delimiters must be commas (,) </br>
    - Do not force text to be quoted with apostrophes (")

??? tip "You can save multiple CSV files with custom names"

    If you prefer to create multiple CSV files with custom names, you can still use one of them using "--custom-style" argument with the "tile" command.

## 3. Start the Terminal/Shell

Using your preferred CLI tool (Terminal/Shell), navigate to the same folder with the materials_for_features.csv. You can use the ```cd <FOLDERNAME>``` command to navigate to the folder.

## 4. Take an Advice for the Dataset (Optional)

(Optional) Create an advice file using the software. This advice file will summarize the existing object classes in your database and calculate the maximum features per tile.

=== "Powershell"

    ```powershell
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    ghcr.io/3dcitydb/citydb-3dtiler:latest `
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
    ghcr.io/3dcitydb/citydb-3dtiler:latest \
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
    ghcr.io/3dcitydb/citydb-3dtiler:latest ^
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
    ghcr.io/3dcitydb/citydb-3dtiler:latest \
    --db-host 10.162.246.888 --db-port 9876 \
    --db-name citydb-visualizer --db-schema citydb \
    --db-username tester2 --db-password louvre \
    advise
    ```


??? tip "Alternative Docker Registry"

    Alternatively, you can use the Docker Hub registry by changing the image location in the above commands (ghcr.io/3dcitydb/citydb-3dtiler:latest <> tumgis/citydb-3dtiler:latest) or by first pulling the same image with the following command: ```docker pull tumgis/citydb-3dtiler:latest```

## 5. Generate the 3DTiles

Generate 3DTiles using the default configuration by typing the following command: 

??? info "How the application checks the material file?"
    The program automatically checks whether the “materials_for_features.csv” file is present in the current folder. If the file is not present in the current folder, it uses the predefined materials stored internally (in the Docker image). If you have renamed the file, you can use the “--custom-style” argument after the ‘tile’ command.


=== "Powershell"

    ```powershell
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    ghcr.io/3dcitydb/citydb-3dtiler:latest `
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
    ghcr.io/3dcitydb/citydb-3dtiler:latest \
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
    ghcr.io/3dcitydb/citydb-3dtiler:latest ^
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
    ghcr.io/3dcitydb/citydb-3dtiler:latest \
    --db-host 10.162.246.888 --db-port 9876 \
    --db-name citydb-visualizer --db-schema citydb \
    --db-username tester2 --db-password louvre \
    tile
    ```



## All available Commands, Arguments & Options

??? example "citydb-3dtiler Usage"

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

## Remove the Docker Images (Optional)

If you want to delete all of the downloaded Docker images, you can use the following command:

```bash
docker rmi --force $(docker image ls -q -f label=composition=citydb-3dtiler)
```

??? tip "How to update the docker image on my machine?"

    To update the docker image to latest version, delete all the existing docker images using the command given above and run the docker run command again.

## Tips for Docker Usage

### Build


=== "Pattern"
    ```bash
    docker build --tag IMAGENAME:VERSIONorTAG .
    ```

=== "Sample"
    ```bash
    docker build -t citydb-3dtiler:custom-build .
    ```

### Run the Container (once)

=== "Powershell"
    ```powershell
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    citydb-3dtiler:latest `
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
    citydb-3dtiler:latest \
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
    citydb-3dtiler:latest ^
    --db-host <IP-or-COMP-NAME> --db-port <PORT-NUMBER> ^
    --db-name <DATABASE-NAME> --db-schema <SCHEMA-NAME> ^
    --db-username <USER-NAME> --db-password <DATABASE-PASSWORD> ^
    advise
    ```

=== "Sample Command"
    ```bash
    docker run \
    --rm --interactive --tty \
    --name citydb-3dtiler07 \
    --volume ./:/home/citydb-3dtiler/shared:rw \
    citydb-3dtiler:latest \
    -H 10.162.246.888 -P 9876 -d citydb-visualizer \
    -S citydb -u tester -p 123456 \
    advise
    ```


### Check the container contents (for development purposes)

Following commands will execute the container with bash, so you can investigate the contents of the container:

=== "Powershell"
    ```powershell
    docker run `
    --rm --interactive --tty `
    --name citydb-3dtiler `
    --volume ./:/home/tester/citydb-3dtiler/shared:rw `
    --entrypoint /bin/bash `
    citydb-3dtiler:latest `
    ```

=== "Linux Terminal"
    ```bash
    docker run \
    --rm --interactive --tty \
    --name citydb-3dtiler \
    --volume ./:/home/tester/citydb-3dtiler/shared:rw \
    --entrypoint /bin/bash \
    citydb-3dtiler:latest
    ```

=== "Command Prompt (CMD)"
    ```bash
    docker run ^
    --rm --interactive --tty ^
    --name citydb-3dtiler ^
    --volume ./:/home/tester/citydb-3dtiler/shared:rw ^
    --entrypoint /bin/bash ^
    citydb-3dtiler:latest
    ```

=== "Sample Command"
    ```bash
    docker run --rm --interactive --tty \
    --volume ./:/home/citydb-3dtiler/shared:rw \
    --name citydb-3dtiler:latest \
    --entrypoint /bin/bash \
    citydb-3dtiler:latest
    ```

### Remove all at once

Remove all the relevant containers and images at once:

```bash
docker rm --force $(docker ps --all --quiet --filter label=composition=citydb-3dtiler) \
&& docker rmi --force $(docker image list --quiet --filter label=composition=citydb-3dtiler)
```
<details>
<summary>Remove only containers:</summary>

```bash
docker rm --force $(docker ps --all --quiet --filter label=composition=citydb-3dtiler)
```

</details>

<details>
<summary>Remove only images:</summary>

```bash
docker rmi --force $(docker image list --quiet --filter label=composition=citydb-3dtiler)
```

</details>
