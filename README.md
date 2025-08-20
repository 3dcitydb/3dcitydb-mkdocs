# 3D City Database (3DCityDB) v5 documentation

Welcome to the repository of the 3D City Database and software tools documentation starting from version `5`.

This page is dedicated to developers. Please find the live version of the user manual here:

:rocket: [docs.3dcitydb.org](https://docs.3dcitydb.org/) :rocket:

## What's included

This documentation covers the 3D City Database (3DCityDB) v5, a free and open-source package for managing virtual 3D city models:

- 🏗️ **Database schema** with Feature, Geometry, Appearance, Metadata, and Codelist modules explained.
- 🛠️ **citydb-tool** for data import/export, database operations, ...
- 📄 **Format support** for CityGML and CityJSON with CQL2 query language support.
- 🐳 **Docker integration** for containerized deployment of database and tools.
- 🚀 **Getting started guides** with setup instructions and migration from previous versions.
- 🔄 **Compatibility guide** covering CityGML version migration, database upgrades, and format conversion between CityGML 1.0/2.0/3.0 and CityJSON.

## Releases and versioning

This documentation uses a branch-based versioning system with automated deployment via GitHub Actions.

### Branch naming convention

The version information is derived directly from the branch name, following this pattern:

- **Main branch (`main`)**: Deploys as `edge` version (latest development documentation)
- **Release branches (`release-X.Y`)**: Deploy versioned documentation using `major.minor` format only

Examples:

- `release-1.0` → Documentation version `1.0`
- `release-2.3` → Documentation version `2.3`
- `release-10.15` → Documentation version `10.15`

### Release workflow

The documentation deployment follows this workflow:

1. **Main branch (`main`)**:
   - Automatically deploys as `edge` version
   - Represents the latest development documentation

2. **Release branches (`release-X.Y`)**:
   - Must be named with major.minor version format (e.g., `release-1.0`, `release-2.3`)
   - Automatically deploys versioned documentation
   - Creates or updates corresponding GitHub releases with tag `vX.Y`
   - The highest version number among all release branches becomes the `latest` version
   - The `latest` alias points to the most recent stable release

### CI/CD behavior

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:

- Extracts version from the branch name (main → edge, release-X.Y → X.Y)
- Validates branch naming format
- Scans all `release-*` branches to determine the latest version
- Deploys documentation using [mike](https://github.com/jimporter/mike) for version management
- Creates GitHub releases with appropriate tags (vX.Y) for release branches
- Updates the `latest` alias to point to the highest version number
- Sets the default documentation version to `latest`
- Manages GitHub release "latest" flag to match the highest version

### Version management

To create a new documentation release:

1. Create a new branch named `release-X.Y` (e.g., `release-1.0`, `release-2.5`)
2. Push the branch - CI will automatically:
   - Deploy the new documentation version
   - Create a GitHub release with tag `vX.Y`
   - If this is the highest version number, mark it as the new `latest`

#### GitHub Releases

The CI automatically creates GitHub releases for each release branch:

- **Tag format**: `vX.Y` (e.g., `v1.0`, `v2.5`)
- **Release name**: `Release vX.Y`
- **Latest flag**: Automatically set for the highest version number
- **Release notes**: Include links to documentation and version information
- **Tag updates**: Tags are automatically updated to point to the latest commit on release branches
- **No releases for edge**: Main branch (`edge`) does not create GitHub releases

#### Updating content of an existing release

To update documentation content for an existing release version:

1. **Switch to the release branch**: Check out the specific `release-X.Y` branch you want to update
2. **Make your changes**: Edit the documentation files in the `docs/` directory as needed
3. **Commit changes**: Commit your updates to the release branch
4. **Push updates**: Push the changes to the remote repository
5. **Automatic redeployment**: The CI workflow will automatically trigger and:
   - Redeploy the updated documentation for that version
   - Update the git tag to point to the latest commit
   - Update the corresponding GitHub release

**Important notes:**

- The version is automatically derived from the branch name
- GitHub releases and git tags are created/updated automatically for release branches
- Git tags are force-updated to always point to the latest commit on release branches
- Content updates preserve the existing version number and aliases
- The documentation will be redeployed with the same version identifier
- If updating the current `latest` version, the changes will be immediately visible on the default documentation site
