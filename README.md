# 3D City Database (3DCityDB) v5 documentation

Welcome to the repository of the 3D City Database and tool documentation starting from version `5`.

This page is dedicated to developers. Go to the page below to see the documentation.

:rocket: [docs.3dcitydb.net](https://docs.3dcitydb.net/) :rocket:

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
   - The highest version number among all release branches becomes the `latest` version
   - The `latest` alias points to the most recent stable release

### CI/CD behavior

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:

- Extracts version from the branch name (main → edge, release-X.Y → X.Y)
- Validates branch naming format
- Scans all `release-*` branches to determine the latest version
- Deploys documentation using [mike](https://github.com/jimporter/mike) for version management
- Updates the `latest` alias to point to the highest version number
- Sets the default documentation version to `latest`

### Version management

To create a new documentation release:

1. Create a new branch named `release-X.Y` (e.g., `release-1.0`, `release-2.5`)
2. Push the branch - CI will automatically deploy the new version
3. If this is the highest version number, it will become the new `latest`

#### Updating content of an existing release

To update documentation content for an existing release version:

1. **Switch to the release branch**: Check out the specific `release-X.Y` branch you want to update
2. **Make your changes**: Edit the documentation files in the `docs/` directory as needed
3. **Commit changes**: Commit your updates to the release branch
4. **Push updates**: Push the changes to the remote repository
5. **Automatic redeployment**: The CI workflow will automatically trigger and redeploy the updated documentation for that version

**Important notes:**

- The version is automatically derived from the branch name
- Content updates preserve the existing version number and aliases
- The documentation will be redeployed with the same version identifier
- If updating the current `latest` version, the changes will be immediately visible on the default documentation site
