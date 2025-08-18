# 3D City Database (3DCityDB) v5 documentation

Welcome to the repository of the 3D City Database and tool documentation starting from version `5`.

This page is dedicated to developers. Go to the page below to see the documentation.

:rocket: https://docs.3dcitydb.net/ :rocket:

## Releases and versioning

This documentation uses a branch-based versioning system with automated deployment via GitHub Actions.

### VERSION file

The `VERSION` file in the repository root contains the semantic version number (e.g., `1.0.1`) for the current documentation version. This file:

- Must follow semantic versioning format (`X.Y.Z`)
- Is automatically validated during CI/CD pipeline
- Determines the version used for documentation deployment

### Release workflow

The documentation deployment follows this workflow:

1. **Main branch (`main`)**:
   - Automatically deploys as `edge` version
   - Represents the latest development documentation

2. **Release branches (`release/X.Y.Z`)**:
   - Must be named with semantic version format (e.g., `release/1.0.1`)
   - Automatically deploys versioned documentation
   - The highest semantic version among all release branches becomes the `latest` version
   - The `latest` alias points to the most recent stable release

### CI/CD behavior

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:

- Reads version from the `VERSION` file
- Validates semantic version format
- Scans all `release/**` branches to determine the latest version
- Deploys documentation using [mike](https://github.com/jimporter/mike) for version management
- Updates the `latest` alias to point to the highest version number
- Sets the default documentation version to `latest`

### Version management

To create a new documentation release:

1. Update the `VERSION` file with the new semantic version
2. Create a new branch named `release/X.Y.Z` (matching the VERSION file)
3. Push the branch - CI will automatically deploy the new version
4. If this is the highest version number, it will become the new `latest`

#### Updating content of an existing release

To update documentation content for an existing release version:

1. **Switch to the release branch**: Check out the specific `release/X.Y.Z` branch you want to update
2. **Make your changes**: Edit the documentation files in the `docs/` directory as needed
3. **Commit changes**: Commit your updates to the release branch
4. **Push updates**: Push the changes to the remote repository
5. **Automatic redeployment**: The CI workflow will automatically trigger and redeploy the updated documentation for that version

**Important notes:**

- The `VERSION` file should remain unchanged when updating content (only change it for new releases)
- Content updates preserve the existing version number and aliases
- The documentation will be redeployed with the same version identifier
- If updating the current `latest` version, the changes will be immediately visible on the default documentation site
