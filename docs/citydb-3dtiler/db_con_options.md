---
# title: Database Connection Options
description: The options must be used to connect to the database
tags:
  - database
  - citydb-3dtiler
  - postgresql
---

# Database Connection Options

This section lists the options that can be used to connect to the 3DCityDB (v5.x) database.

- If you do not have a 3DCityDB (v5) installation, visit the relevant section on the [main documentation page](https://docs.3dcitydb.org){:target="_blank"}.

## --db-host (-H)

`-H` or `--db-host` is used for specifying the computer name or the IP address of the database instance.

- example: `--db-host COMP01` or `--db-host 192.168.2.3`)

## --db-port (-P)

`-P` or `--db-port` is used to specify the port number that was defined during the database installation or forwarded by the 3DCityDB docker container

??? tip "What if the forwarded port of the 3DCityDB does not work?"

    If you notice that the forwarded database port of the 3DCityDB (might be running as a Docker container) is not working in your environment, or let's say if you are not sure about the port number, try using the docker inspect [Container Name] command to expose the IP address and port of the running container. Then you can try changing the computer name or the IP address or even the port number with the exposed values (for example: `--db-host 172.17.0.2 --db-port 5432`). The same test can also be performed using other database clients such as pgAdmin.

## --db-name (-d)

`-d` or `--db-name` is used to specify the database name. 

## --db-schema (-S)

`-S` or `--db-schema` is used to specify the schema name of the 3DCityDB instance. If the schema name was not changed for a specific purpose during the installation, you do not need to use this option.

- Default value is "**citydb**".

## --db-username (-u)

`-u` or `--db-username` is used to specify the database username.

## --db-password (-p)

`-p` or `--db-password` is used to specify the database password.

