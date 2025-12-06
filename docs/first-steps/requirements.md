---
# title: Requirements
description: What do I need for the installation
# icon: material/emoticon-happy
tags:
  - 3dcitydb
  - requirements
  - postgresql
  - postgis
  - oracle
---

# System requirements

## 3D City Database

Setting up an instance of the 3D City Database requires an existing installation of
a [PostgreSQL](https://www.postgresql.org/) database with [PostGIS](https://postgis.net/) extension or using our [Docker images](../3dcitydb/docker.md).
We recommend checking data and database [compatibility](../compatibility.md) first.

!!! info
    We are expanding support to include more database systems, starting with __Oracle Database__. Stay tuned!

Supported PostgreSQL versions include __PostgreSQL 14__ and higher, with __PostGIS 3.1__ and higher. Make sure to check
the [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/) to determine which PostgreSQL versions are actively maintained or have
reached end-of-life. The [PostGIS support matrix](https://trac.osgeo.org/postgis/wiki/UsersWikiPostgreSQLPostGIS) provides details on which PostgreSQL versions are supported
by specific PostGIS versions and whether any particular version of PostGIS has reached end-of-life.

The SQL scripts for setting up a 3D City Database schema are designed to be executed by the default command-line client
of the respective database system – specifically, `psql` for PostgreSQL. These scripts include meta-commands specific to
these clients and may not work properly with other client software. Therefore, ensure that `psql` is installed on the
machine from which you plan to set up the 3D City Database before proceeding with the [setup instructions](setup.md).

!!! tip
    It is recommended to always install the latest patches, minor releases, and security updates for your database
    system. The 3D City Database does not support database versions that have reached end-of-life.

## `citydb-tool` database client

`citydb-tool` is the default command-line client for the 3D City Database, used to import and export city model data
as well as perform data and database operations. It is implemented as a Java application and can be run on any platform
that supports __Java 17__ and higher.

To use `citydb-tool` on your machine, ensure that a matching Java Runtime Environment (JRE) is installed. Java
installation packages are available from various vendors and for different platforms. The following is a non-exhaustive
list of Java distributions that are free to download and use:

* [Eclipse Temurin](https://adoptium.net/de/)
* [Amazon Coretto](https://aws.amazon.com/corretto/)
* [Oracle Java](https://www.oracle.com/java/technologies/downloads/)
* [OpenJDK](https://openjdk.org/)

Follow the installation instructions for your operating system. Note that starting with Java 17 LTS, Oracle Java is
released under a no-fee, free-to-use license. However, previous versions of Oracle Java are
available only under a fee-based subscription license. Similarly, Java binaries from other vendors may require a license
for commercial use or access to updates. Please review the license terms and conditions provided by the vendors
carefully.
