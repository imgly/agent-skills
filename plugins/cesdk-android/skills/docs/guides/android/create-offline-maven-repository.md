> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Offline Maven Repository](./create-offline-maven-repository.md)

---

Mirror all IMG.LY Android artifacts for a specific CE.SDK version and
configure Gradle to resolve them from a local Maven repository.

<Image src={heroImage} alt="CE.SDK Android artifacts flowing from the IMG.LY Maven repository into a local offline repository" class="block dark:hidden" />

<Image src={heroImageDark} alt="CE.SDK Android artifacts flowing from the IMG.LY Maven repository into a local offline repository" class="hidden dark:block" />

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://img.ly/release/v1.82.0-rc.0/apps/documentation/downloads/download-maven-version.sh)

The download script uses the public IMG.LY Maven repository and preserves its directory structure. It does not require Artifactory access or credentials.

> **Note:** The script mirrors artifacts published by IMG.LY. A fully offline Android
> build also needs local access to Gradle, plugins, and transitive dependencies
> from repositories such as Google Maven and Maven Central.

## Requirements

Prepare the repository on a machine with:

- Network access to `https://maven.img.ly`
- Bash
- `curl`
- `jq`
- The CE.SDK version used by your Android project

## Download the Script

Use the download action above, or download the script from the command line:

```bash
curl --remote-name https://img.ly/docs/cesdk/downloads/download-maven-version.sh
chmod +x download-maven-version.sh
```

You can inspect the matching files without downloading them:

```bash
./download-maven-version.sh --dry-run 1.82.0-rc.0
```

## Download IMG.LY Artifacts

Run the script with the CE.SDK version and the output directory:

```bash
./download-maven-version.sh 1.82.0-rc.0 ./maven-offline
```

The script downloads every file in an exact `1.82.0-rc.0` version directory and keeps the Maven layout. The generated local repository starts at `maven-offline/maven` and contains paths such as `ly/img/editor-core/1.82.0-rc.0/`.

## Transfer the Repository

Copy the complete `maven-offline` directory to the target environment. Keep its directory structure unchanged. You can place it inside the Android project or at another stable filesystem location available to Gradle.

## Configure Gradle

Register the `maven` subdirectory inside `dependencyResolutionManagement.repositories` in your project's settings file.

<Tabs syncKey="gradle-dsl">
  <TabItem label="Kotlin DSL">
    ```text title="settings.gradle.kts"
    dependencyResolutionManagement {
        repositories {
            maven {
                name = "imgly-offline"
                url = uri(rootDir.resolve("maven-offline/maven"))
                mavenContent {
                    includeGroup("ly.img")
                }
            }
            google()
            mavenCentral()
        }
    }
    ```
  </TabItem>

  <TabItem label="Groovy DSL">
    ```groovy title="settings.gradle"
    dependencyResolutionManagement {
        repositories {
            maven {
                name = 'imgly-offline'
                url = new File(rootDir, 'maven-offline/maven').toURI()
                mavenContent {
                    includeGroup 'ly.img'
                }
            }
            google()
            mavenCentral()
        }
    }
    ```
  </TabItem>
</Tabs>

Adjust the filesystem path if the repository is outside the project. `mavenContent` restricts this repository to the `ly.img` group so Gradle continues to resolve other groups from their configured repositories.

## Verify Offline Resolution

Run a representative build with Gradle's offline mode enabled:

```bash
./gradlew --offline assembleDebug
```

The build now resolves CE.SDK artifacts from the local repository. If Gradle reports a missing artifact from another group, add that artifact to the appropriate third-party repository mirror or cache.

## Troubleshooting

### No Artifacts Found

Confirm that the requested CE.SDK version exists in the IMG.LY Maven repository and exactly matches the version declared in your Gradle dependencies.

### curl or jq Is Missing

Install the missing command on the connected preparation machine, then run the script again. Both commands are required to browse the repository and download files safely.

### Gradle Still Requests Network Access

The local repository contains IMG.LY artifacts only. Mirror or cache Gradle, Android Gradle Plugin dependencies, and all transitive dependencies from Google Maven, Maven Central, and any other repositories used by your project.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support