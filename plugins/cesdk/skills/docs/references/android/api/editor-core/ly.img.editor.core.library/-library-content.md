# LibraryContent

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

Each LibraryCategory has a LibraryContent that is used to render the UI of the category. There are 2 different content types: LibraryContent.Sections and LibraryContent.Grid. Sections are used to render preview sections vertically while Grid is used to render assets in a grid view. Each section can be recursively expanded into another LibraryContent.Sections or into LibraryContent.Grid.

```kotlin
@Stable
interface LibraryContent
```
