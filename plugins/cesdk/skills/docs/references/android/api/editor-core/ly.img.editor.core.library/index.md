# ly.img.editor.core.library

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`
- **Module catalog:** [`ly.img:editor-core`](<../../indexes/editor-core.md>)

## Top-level declarations

### addSection

```kotlin
fun LibraryCategory.addSection(section: LibraryContent.Section): LibraryCategory
```

Add a new section to the content of the library category. Note that the function will throw an exception if the content of the library category is not LibraryContent.Sections.

### dropSection

```kotlin
fun LibraryCategory.dropSection(index: Int): LibraryCategory
```

Drop a section from the content of the library category. Note that the function will throw an exception if the content of the library category is not LibraryContent.Sections.

### replaceSection

```kotlin
fun LibraryCategory.replaceSection(index: Int, sectionReducer: LibraryContent.Section.() -> LibraryContent.Section): LibraryCategory
```

Replace a section in the content of the library category. Note that the function will throw an exception if the content of the library category is not LibraryContent.Sections.
