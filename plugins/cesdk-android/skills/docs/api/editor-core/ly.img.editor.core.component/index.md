# ly.img.editor.core.component

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`
- **Module catalog:** [`ly.img:editor-core`](<../../indexes/editor-core.md>)

## Top-level declarations

### DefaultDecoration

```kotlin
@Composable
fun CanvasMenu.Companion.DefaultDecoration(_: Nothing = nothing, scope: CanvasMenu.Scope, shape: Shape = MaterialTheme.shapes.extraLarge, contentColor: Color = MaterialTheme.colorScheme.onSurfaceVariant, shadowElevation: Dp = 1.dp, rotateHandleSize: Dp = 48.dp, verticalPadding: Dp = 24.dp, horizontalPadding: Dp = 16.dp, __: Nothing = nothing, content: @Composable () -> Unit)
```

```kotlin
@Composable
fun Dock.Companion.DefaultDecoration(_: Nothing = nothing, background: Color = MaterialTheme.colorScheme.surface1.copy(alpha = 0.95f), paddingValues: PaddingValues = PaddingValues(vertical = 10.dp), __: Nothing = nothing, content: @Composable () -> Unit)
```

```kotlin
@Composable
fun InspectorBar.Companion.DefaultDecoration(_: Nothing = nothing, scope: InspectorBar.Scope, background: Color = MaterialTheme.colorScheme.surface, paddingValues: PaddingValues = PaddingValues(start = 16.dp, top = 10.dp, bottom = 10.dp), __: Nothing = nothing, content: @Composable () -> Unit)
```

```kotlin
@Composable
fun NavigationBar.Companion.DefaultDecoration(_: Nothing = nothing, background: Color = MaterialTheme.colorScheme.surface.copy(alpha = 0.95F), paddingValues: PaddingValues = PaddingValues(horizontal = 4.dp), __: Nothing = nothing, content: @Composable () -> Unit)
```

```kotlin
@Composable
fun Timeline.Companion.DefaultDecoration(_: Nothing = nothing, background: Color = MaterialTheme.colorScheme.surface1, paddingValues: PaddingValues = PaddingValues(0.dp), __: Nothing = nothing, content: @Composable () -> Unit)
```

The default decoration of the canvas menu. Calculates the position and rotation of the selected design block and finds the coordinates where the canvas menu should be placed. Finally, canvas menu is placed in a surface which parameters can be configured.

### EditorComponent

```kotlin
@Composable
fun <Scope : EditorScope> EditorComponent(component: EditorComponent<Scope>, modifier: Modifier = Modifier, onHide: () -> Unit = {})
```

```kotlin
@Composable
fun <Scope : EditorScope> ColumnScope.EditorComponent(component: EditorComponent<Scope>, modifier: Modifier = Modifier, onHide: () -> Unit = {})
```

```kotlin
@Composable
fun <Scope : EditorScope> RowScope.EditorComponent(component: EditorComponent<Scope>, modifier: Modifier = Modifier, onHide: () -> Unit = {})
```

The content of the component. The content of the component when rendered in a ColumnScope. Prefer using this overload over without ColumnScope when the component is being rendered in a column.

### adjustments

```kotlin
val Dock.Button.Id.adjustments: EditorComponentId
```

```kotlin
val InspectorBar.Button.Id.adjustments: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberAdjustments. The id of the inspector bar button returned by InspectorBar.Button.rememberAdjustments.

### alwaysEnabled

```kotlin
val alwaysEnabled: ScopedProperty<EditorScope, Boolean>
```

Predicate to be used when the EditorComponent is always enabled.

### alwaysVisible

```kotlin
val alwaysVisible: ScopedProperty<EditorScope, Boolean>
```

Predicate to be used when the EditorComponent is always visible.

### animations

```kotlin
val InspectorBar.Button.Id.animations: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberAnimations.

### assetLibrary

```kotlin
val Dock.Button.Id.assetLibrary: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberAssetLibrary.

### audiosLibrary

```kotlin
val Dock.Button.Id.audiosLibrary: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberAudiosLibrary.

### blur

```kotlin
val Dock.Button.Id.blur: EditorComponentId
```

```kotlin
val InspectorBar.Button.Id.blur: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberBlur. The id of the inspector bar button returned by InspectorBar.Button.rememberBlur.

### bringForward

```kotlin
val CanvasMenu.Button.Id.bringForward: EditorComponentId
```

The id of the canvas menu button returned by CanvasMenu.Button.rememberBringForward.

### clipSpeed

```kotlin
val InspectorBar.Button.Id.clipSpeed: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberClipSpeed.

### closeEditor

```kotlin
val NavigationBar.Button.Id.closeEditor: EditorComponentId
```

The id of the navigation bar button returned by NavigationBar.Button.rememberCloseEditor.

### crop

```kotlin
val Dock.Button.Id.crop: EditorComponentId
```

```kotlin
val InspectorBar.Button.Id.crop: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberCrop. The id of the inspector bar button returned by InspectorBar.Button.rememberCrop.

### delete

```kotlin
val CanvasMenu.Button.Id.delete: EditorComponentId
```

```kotlin
val InspectorBar.Button.Id.delete: EditorComponentId
```

The id of the canvas menu button returned by CanvasMenu.Button.rememberDelete. The id of the inspector bar button returned by InspectorBar.Button.rememberDelete.

### duplicate

```kotlin
val CanvasMenu.Button.Id.duplicate: EditorComponentId
```

```kotlin
val InspectorBar.Button.Id.duplicate: EditorComponentId
```

The id of the canvas menu button returned by CanvasMenu.Button.rememberDuplicate. The id of the inspector bar button returned by InspectorBar.Button.rememberDuplicate.

### editText

```kotlin
val InspectorBar.Button.Id.editText: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberEditText.

### effect

```kotlin
val Dock.Button.Id.effect: EditorComponentId
```

```kotlin
val InspectorBar.Button.Id.effect: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberEffect. The id of the inspector bar button returned by InspectorBar.Button.rememberEffect.

### elementsLibrary

```kotlin
val Dock.Button.Id.elementsLibrary: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberElementsLibrary.

### emptyDecoration

```kotlin
val emptyDecoration: ScopedDecoration<EditorScope>
```

A helper lambda that represents no decoration.

### enterGroup

```kotlin
val InspectorBar.Button.Id.enterGroup: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberEnterGroup.

### export

```kotlin
val NavigationBar.Button.Id.export: EditorComponentId
```

The id of the navigation bar button returned by NavigationBar.Button.rememberExport.

### fillStroke

```kotlin
val InspectorBar.Button.Id.fillStroke: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberFillStroke.

### filter

```kotlin
val Dock.Button.Id.filter: EditorComponentId
```

```kotlin
val InspectorBar.Button.Id.filter: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberFilter. The id of the inspector bar button returned by InspectorBar.Button.rememberFilter.

### formatText

```kotlin
val InspectorBar.Button.Id.formatText: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberFormatText.

### imagesLibrary

```kotlin
val Dock.Button.Id.imagesLibrary: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberImagesLibrary.

### imglyCamera

```kotlin
val Dock.Button.Id.imglyCamera: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberImglyCamera.

### layer

```kotlin
val InspectorBar.Button.Id.layer: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberLayer.

### modify

```kotlin
@Composable
fun <Item : EditorComponent<*>, Alignment : Any, Arrangement : Any> EditorComponent.ListBuilder<Item, Alignment, Arrangement>.modify(builder: EditorComponent.ListBuilder.Modify<Item, Alignment, Arrangement>.() -> Unit): EditorComponent.ListBuilder<Item, Alignment, Arrangement>
```

A composable function that modifies existing EditorComponent.ListBuilder. Useful if you want to apply modifications to the original builder, without touching the original builder. The example below is based on the Dock component but it is exactly the same for all the other components that contain EditorComponent.ListBuilder.

### moveAsClip

```kotlin
val InspectorBar.Button.Id.moveAsClip: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberMoveAsClip.

### moveAsOverlay

```kotlin
val InspectorBar.Button.Id.moveAsOverlay: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberMoveAsOverlay.

### nextPage

```kotlin
val NavigationBar.Button.Id.nextPage: EditorComponentId
```

The id of the navigation bar button returned by NavigationBar.Button.rememberNextPage.

### noneEnterTransition

```kotlin
val noneEnterTransition: ScopedProperty<EditorScope, EnterTransition>
```

A helper lambda for getting EnterTransition.None in the EditorScope.

### noneExitTransition

```kotlin
val noneExitTransition: ScopedProperty<EditorScope, ExitTransition>
```

A helper lambda for getting ExitTransition.None in the EditorScope.

### overlaysLibrary

```kotlin
val Dock.Button.Id.overlaysLibrary: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberOverlaysLibrary.

### previousPage

```kotlin
val NavigationBar.Button.Id.previousPage: EditorComponentId
```

The id of the navigation bar button returned by NavigationBar.Button.rememberPreviousPage.

### redo

```kotlin
val NavigationBar.Button.Id.redo: EditorComponentId
```

The id of the navigation bar button returned by NavigationBar.Button.rememberRedo.

### rememberAdjustments

```kotlin
@Composable
fun Dock.Button.rememberAdjustments(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberAdjustments(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens adjustments sheet for the current page via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberAnimations

```kotlin
@Composable
fun InspectorBar.Button.rememberAnimations(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A helper function that returns an Button that opens animation sheet via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberAssetLibrary

```kotlin
@Composable
fun Dock.Button.rememberAssetLibrary(builder: EditorComponentBuilder<EditorComponent<EditorScope>, EditorScope>.() -> Unit = {}): EditorComponent<EditorScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with tabs via EditorEvent.Sheet.Open. Every item in ly.img.editor.core.library.AssetLibrary.tabs is represented via a tab in the sheet.

### rememberAudiosLibrary

```kotlin
@Composable
fun Dock.Button.rememberAudiosLibrary(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with audios via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberBlur

```kotlin
@Composable
fun Dock.Button.rememberBlur(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberBlur(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens blur sheet for the current page via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberBringForward

```kotlin
@Composable
fun CanvasMenu.Button.rememberBringForward(builder: CanvasMenu.ButtonBuilder.() -> Unit = {}): Button<CanvasMenu.ItemScope>
```

A composable helper function that creates and remembers an Button that brings forward currently selected design block via EditorEvent.Selection.BringForward. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberClipSpeed

```kotlin
@Composable
fun InspectorBar.Button.rememberClipSpeed(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that opens clip speed sheet via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberCloseEditor

```kotlin
@Composable
fun NavigationBar.Button.rememberCloseEditor(builder: NavigationBar.ButtonBuilder.() -> Unit = {}): Button<NavigationBar.ItemScope>
```

A composable helper function that creates and remembers an Button that triggers ly.img.editor.core.configuration.EditorConfiguration.onClose callback via EditorEvent.OnClose. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberCrop

```kotlin
@Composable
fun Dock.Button.rememberCrop(mode: SheetType.Crop.Mode = SheetType.Crop.Mode.ImageCrop, builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberCrop(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens crop sheet for the current page via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberDefaultScope

```kotlin
@Composable
fun CanvasMenu.Companion.rememberDefaultScope(_: Nothing = nothing, parentScope: EditorScope, selectedDesignBlock: EditorScope.() -> DesignBlock? = { editorContext.engine.block.findAllSelected().firstOrNull() }, __: Nothing = nothing): CanvasMenu.Scope
```

```kotlin
@Composable
fun InspectorBar.Companion.rememberDefaultScope(_: Nothing = nothing, parentScope: EditorScope, selectedDesignBlock: EditorScope.() -> DesignBlock? = { editorContext.engine.block.findAllSelected().firstOrNull()?.takeIf { editorContext.engine.block.getType(it) != DesignBlockType.Page.key || editorContext.engine.editor.getSettingBoolean("page/selectWhenNoBlocksSelected").not() } }, __: Nothing = nothing): InspectorBar.Scope
```

The default scope of the canvas menu. The value is updated when: 1. Parent scope is updated. 2. Selection is updated. 3. Scene playing status is updated (applicable in video scenes only).

### rememberDelete

```kotlin
@Composable
fun CanvasMenu.Button.rememberDelete(builder: CanvasMenu.ButtonBuilder.() -> Unit = {}): Button<CanvasMenu.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberDelete(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that deletes currently selected design block via EditorEvent.Selection.Delete. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberDuplicate

```kotlin
@Composable
fun CanvasMenu.Button.rememberDuplicate(builder: CanvasMenu.ButtonBuilder.() -> Unit = {}): Button<CanvasMenu.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberDuplicate(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that duplicates currently selected design block via EditorEvent.Selection.Duplicate. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberEditText

```kotlin
@Composable
fun InspectorBar.Button.rememberEditText(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that enters text editing mode for the selected design block via EditorEvent.Selection.EnterTextEditMode. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberEffect

```kotlin
@Composable
fun Dock.Button.rememberEffect(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberEffect(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens effect sheet for the current page via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberElementsLibrary

```kotlin
@Composable
fun Dock.Button.rememberElementsLibrary(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with elements via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberEnterGroup

```kotlin
@Composable
fun InspectorBar.Button.rememberEnterGroup(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that changes selection from the selected group design block to a design block within that group via EditorEvent.Selection.EnterGroup. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberExport

```kotlin
@Composable
fun NavigationBar.Button.rememberExport(builder: NavigationBar.ButtonBuilder.() -> Unit = {}): Button<NavigationBar.ItemScope>
```

A composable helper function that creates and remembers an Button that starts export via EditorEvent.Export. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberFillStroke

```kotlin
@Composable
fun InspectorBar.Button.rememberFillStroke(builder: AbstractButtonBuilder<FillStrokeItemScope>.() -> Unit = {}): Button<FillStrokeItemScope>
```

A composable helper function that creates and remembers an Button that opens fill stroke sheet via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberFilter

```kotlin
@Composable
fun Dock.Button.rememberFilter(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberFilter(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens filter sheet for the current page via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberFormatText

```kotlin
@Composable
fun InspectorBar.Button.rememberFormatText(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that opens text formatting sheet via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberImagesLibrary

```kotlin
@Composable
fun Dock.Button.rememberImagesLibrary(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with images via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberImglyCamera

```kotlin
@Composable
fun Dock.Button.rememberImglyCamera(acceptsVideoCapture: Dock.ItemScope.() -> Boolean = { false }, builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens the imgly camera via EditorEvent.LaunchContract. IMPORTANT: Make sure your app has the dependency of ly.img:camera:<version> next to the ly.img:editor:<version> dependency. Also make sure that their versions match. Failing to provide the dependency will result to a crash. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberLayer

```kotlin
@Composable
fun InspectorBar.Button.rememberLayer(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that opens layer sheet via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberMoveAsClip

```kotlin
@Composable
fun InspectorBar.Button.rememberMoveAsClip(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that moves currently selected design block into the background track as clip via EditorEvent.Selection.MoveAsClip. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberMoveAsOverlay

```kotlin
@Composable
fun InspectorBar.Button.rememberMoveAsOverlay(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that moves currently selected design block from the background track to an overlay via EditorEvent.Selection.MoveAsOverlay. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberNextPage

```kotlin
@Composable
fun NavigationBar.Button.rememberNextPage(builder: NavigationBarPageButtonBuilder.() -> Unit = {}): EditorComponent<NavigationBar.ItemScope>
```

A composable helper function that creates and remembers a custom EditorComponent that navigates to the next page via EditorEvent.Navigation.ToNextPage. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberOverlaysLibrary

```kotlin
@Composable
fun Dock.Button.rememberOverlaysLibrary(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with overlays via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberPreviousPage

```kotlin
@Composable
fun NavigationBar.Button.rememberPreviousPage(builder: NavigationBarPageButtonBuilder.() -> Unit = {}): EditorComponent<NavigationBar.ItemScope>
```

A composable helper function that creates and remembers a custom EditorComponent that navigates to the previous page via EditorEvent.Navigation.ToPreviousPage. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberRedo

```kotlin
@Composable
fun NavigationBar.Button.rememberRedo(builder: NavigationBar.ButtonBuilder.() -> Unit = {}): Button<NavigationBar.ItemScope>
```

A composable helper function that creates and remembers an Button that does redo operation in the editor via ly.img.engine.EditorApi.redo engine API. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberReorder

```kotlin
@Composable
fun Dock.Button.rememberReorder(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberReorder(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens reorder sheet via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberReplace

```kotlin
@Composable
fun InspectorBar.Button.rememberReplace(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that opens a library sheet via EditorEvent.Sheet.Open. Selected asset will replace the content of the currently selected design block. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberResizeAll

```kotlin
@Composable
fun Dock.Button.rememberResizeAll(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens resize sheet for the current page via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberSelectGroup

```kotlin
@Composable
fun CanvasMenu.Button.rememberSelectGroup(builder: CanvasMenu.ButtonBuilder.() -> Unit = {}): Button<CanvasMenu.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberSelectGroup(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that selects the group design block that contains the currently selected design block via EditorEvent.Selection.SelectGroup. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberSendBackward

```kotlin
@Composable
fun CanvasMenu.Button.rememberSendBackward(builder: CanvasMenu.ButtonBuilder.() -> Unit = {}): Button<CanvasMenu.ItemScope>
```

A composable helper function that creates and remembers an Button that sends backward currently selected design block via EditorEvent.Selection.SendBackward. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberShape

```kotlin
@Composable
fun InspectorBar.Button.rememberShape(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that opens shape options sheet via EditorEvent.Sheet.Open. The button is applicable for the following shape types: ShapeType.Star, ShapeType.Polygon, ShapeType.Rect. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberShapesLibrary

```kotlin
@Composable
fun Dock.Button.rememberShapesLibrary(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with shapes via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberSplit

```kotlin
@Composable
fun InspectorBar.Button.rememberSplit(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that splits currently selected design block via EditorEvent.Selection.Split in a video scene. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberStickersAndShapesLibrary

```kotlin
@Composable
fun Dock.Button.rememberStickersAndShapesLibrary(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with stickers and shapes via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberStickersLibrary

```kotlin
@Composable
fun Dock.Button.rememberStickersLibrary(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with stickers via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberSystemCamera

```kotlin
@Composable
fun Dock.Button.rememberSystemCamera(captureVideo: Dock.ItemScope.() -> Boolean = { false }, builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens the system camera via EditorEvent.LaunchContract. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberSystemGallery

```kotlin
@Composable
fun Dock.Button.rememberSystemGallery(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with system gallery content via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberTextBackground

```kotlin
@Composable
fun InspectorBar.Button.rememberTextBackground(builder: AbstractButtonBuilder<TextBackgroundItemScope>.() -> Unit = {}): Button<TextBackgroundItemScope>
```

A composable helper function that creates and remembers an Button that opens text background options sheet via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberTextLibrary

```kotlin
@Composable
fun Dock.Button.rememberTextLibrary(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a library sheet with text via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberTextOnPath

```kotlin
@Composable
fun InspectorBar.Button.rememberTextOnPath(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that opens the text on path sheet via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberTextPresets

```kotlin
@Composable
fun InspectorBar.Button.rememberTextPresets(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that opens the text style presets library sheet via EditorEvent.Sheet.Open. Selected preset is applied to the currently selected text block via the engine asset replace path. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberTogglePagesMode

```kotlin
@Composable
fun NavigationBar.Button.rememberTogglePagesMode(builder: EditorComponentBuilder<EditorComponent<EditorScope>, EditorScope>.() -> Unit = {}): EditorComponent<EditorScope>
```

A composable helper function that creates and remembers a custom EditorComponent that updates editor view mode via EditorEvent.SetViewMode: when current view mode is EditorViewMode.Edit, then EditorViewMode.Pages is set and vice versa. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberTogglePreviewMode

```kotlin
@Composable
fun NavigationBar.Button.rememberTogglePreviewMode(builder: NavigationBar.ButtonBuilder.() -> Unit = {}): Button<NavigationBar.ItemScope>
```

A composable helper function that creates and remembers an Button that updates editor view mode via EditorEvent.SetViewMode: when current view mode is EditorViewMode.Edit, then EditorViewMode.Preview is set and vice versa. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberTransition

```kotlin
@Composable
fun InspectorBar.Button.rememberTransition(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A helper function that returns a Button that opens the transition sheet for the selected design block. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberUndo

```kotlin
@Composable
fun NavigationBar.Button.rememberUndo(builder: NavigationBar.ButtonBuilder.() -> Unit = {}): Button<NavigationBar.ItemScope>
```

A composable helper function that creates and remembers an Button that does undo operation in the editor via ly.img.engine.EditorApi.undo engine API. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### rememberVoiceoverRecord

```kotlin
@Composable
fun Dock.Button.rememberVoiceoverRecord(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens the voiceover recording sheet via EditorEvent.Sheet.Open.

### rememberVoiceover

```kotlin
@Composable
fun InspectorBar.Button.rememberVoiceover(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A helper function that returns an InspectorBar.Button that opens the voiceover recording sheet via EditorEvent.Sheet.Open.

### rememberVolume

```kotlin
@Composable
fun InspectorBar.Button.rememberVolume(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers an Button that opens volume sheet via EditorEvent.Sheet.Open. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### remember

```kotlin
@Composable
fun <Scope : EditorScope, Builder : AbstractButtonBuilder<Scope>> Button.Companion.remember(builderFactory: () -> Builder, builder: Builder.() -> Unit = {}): Button<Scope>
```

```kotlin
@Composable
fun CanvasMenu.Companion.remember(builder: CanvasMenuBuilder.() -> Unit = {}): CanvasMenu<CanvasMenu.Scope>
```

```kotlin
@Composable
fun <Scope : CanvasMenu.Scope, Builder : AbstractCanvasMenuBuilder<Scope>> CanvasMenu.Companion.remember(builderFactory: () -> Builder, builder: Builder.() -> Unit = {}): CanvasMenu<Scope>
```

```kotlin
@Composable
fun CanvasMenu.ListBuilder.remember(builder: HorizontalListBuilderScope<EditorComponent<*>>.() -> Unit): HorizontalListBuilder<EditorComponent<*>>
```

```kotlin
@Composable
fun CanvasMenu.Button.remember(builder: CanvasMenu.ButtonBuilder.() -> Unit = {}): Button<CanvasMenu.ItemScope>
```

```kotlin
@Composable
fun CanvasMenu.Divider.remember(builder: CanvasMenu.DividerBuilder.() -> Unit = {}): Divider<CanvasMenu.ItemScope>
```

```kotlin
@Composable
fun <Scope : EditorScope, Builder : AbstractDividerBuilder<Scope>> Divider.Companion.remember(builderFactory: () -> Builder, builder: Builder.() -> Unit = {}): Divider<Scope>
```

```kotlin
@Composable
fun Dock.Companion.remember(builder: DockBuilder.() -> Unit = {}): Dock<Dock.Scope>
```

```kotlin
@Composable
fun <Scope : Dock.Scope, Builder : AbstractDockBuilder<Scope>> Dock.Companion.remember(builderFactory: () -> Builder, builder: Builder.() -> Unit = {}): Dock<Scope>
```

```kotlin
@Composable
fun Dock.ListBuilder.remember(builder: HorizontalListBuilderScope<EditorComponent<*>>.() -> Unit): HorizontalListBuilder<EditorComponent<*>>
```

```kotlin
@Composable
fun Dock.Button.remember(builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

```kotlin
@Composable
fun Dock.Divider.remember(builder: Dock.DividerBuilder.() -> Unit = {}): Divider<Dock.ItemScope>
```

```kotlin
@Composable
fun EditorComponent.Companion.remember(builder: EditorComponentBuilder<EditorComponent<EditorScope>, EditorScope>.() -> Unit = {}): EditorComponent<EditorScope>
```

```kotlin
@Composable
fun <Builder : EditorComponentBuilder<EditorComponent<Scope>, Scope>, Scope : EditorScope> EditorComponent.Companion.remember(builderFactory: () -> Builder, builder: Builder.() -> Unit = {}): EditorComponent<Scope>
```

```kotlin
@Composable
fun <Item : EditorComponent<*>, Alignment : Any, Arrangement : Any> EditorComponent.ListBuilder.Companion.remember(builder: EditorComponent.ListBuilder.New<Item, Alignment, Arrangement>.() -> Unit): EditorComponent.ListBuilder<Item, Alignment, Arrangement>
```

```kotlin
@Composable
fun EditorTrigger.Companion.remember(vararg keys: Any?): EditorTrigger
```

```kotlin
@Composable
fun EditorTrigger.Companion.remember(vararg keys: Any?, flow: () -> Flow<*>): EditorTrigger
```

```kotlin
@Composable
fun InspectorBar.Companion.remember(builder: InspectorBarBuilder.() -> Unit = {}): InspectorBar<InspectorBar.Scope>
```

```kotlin
@Composable
fun <Scope : InspectorBar.Scope, Builder : AbstractInspectorBarBuilder<Scope>> InspectorBar.Companion.remember(builderFactory: () -> Builder, builder: Builder.() -> Unit = {}): InspectorBar<Scope>
```

```kotlin
@Composable
fun InspectorBar.ListBuilder.remember(builder: HorizontalListBuilderScope<EditorComponent<*>>.() -> Unit): HorizontalListBuilder<EditorComponent<*>>
```

```kotlin
@Composable
fun InspectorBar.Button.remember(builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

```kotlin
@Composable
fun NavigationBar.Companion.remember(builder: NavigationBarBuilder.() -> Unit = {}): NavigationBar<NavigationBar.Scope>
```

```kotlin
@Composable
fun <Scope : NavigationBar.Scope, Builder : AbstractNavigationBarBuilder<Scope>> NavigationBar.Companion.remember(builderFactory: () -> Builder, builder: Builder.() -> Unit = {}): NavigationBar<Scope>
```

```kotlin
@Composable
fun NavigationBar.ListBuilder.remember(builder: HorizontalListBuilderScope<EditorComponent<*>>.() -> Unit): HorizontalListBuilder<EditorComponent<*>>
```

```kotlin
@Composable
fun NavigationBar.Button.remember(builder: NavigationBar.ButtonBuilder.() -> Unit = {}): Button<NavigationBar.ItemScope>
```

```kotlin
@Composable
fun Timeline.Companion.remember(builder: TimelineBuilder.() -> Unit = {}): Timeline
```

```kotlin
@Composable
fun <Builder : TimelineBuilder> Timeline.Companion.remember(builderFactory: () -> Builder, builder: TimelineBuilder.() -> Unit = {}): Timeline
```

A composable function that creates and remembers an Button instance. Note that both builderFactory and builder lambdas run only once, therefore you should not have builder property reassignments based on conditions. Check ly.img.editor.core.configuration.EditorConfiguration.Companion.remember for more details on this pattern.

### reorder

```kotlin
val Dock.Button.Id.reorder: EditorComponentId
```

```kotlin
val InspectorBar.Button.Id.reorder: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberReorder. The id of the inspector bar button returned by InspectorBar.Button.rememberReorder.

### replace

```kotlin
val InspectorBar.Button.Id.replace: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberReplace.

### resizeAll

```kotlin
val Dock.Button.Id.resizeAll: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberResizeAll.

### selectGroup

```kotlin
val CanvasMenu.Button.Id.selectGroup: EditorComponentId
```

```kotlin
val InspectorBar.Button.Id.selectGroup: EditorComponentId
```

The id of the canvas menu button returned by CanvasMenu.Button.rememberSelectGroup. The id of the inspector bar button returned by InspectorBar.Button.rememberSelectGroup.

### sendBackward

```kotlin
val CanvasMenu.Button.Id.sendBackward: EditorComponentId
```

The id of the canvas menu button returned by CanvasMenu.Button.rememberSendBackward.

### shape

```kotlin
val InspectorBar.Button.Id.shape: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberShape.

### shapesLibrary

```kotlin
val Dock.Button.Id.shapesLibrary: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberShapesLibrary.

### split

```kotlin
val InspectorBar.Button.Id.split: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberSplit.

### stickersAndShapesLibrary

```kotlin
val Dock.Button.Id.stickersAndShapesLibrary: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberStickersAndShapesLibrary.

### stickersLibrary

```kotlin
val Dock.Button.Id.stickersLibrary: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberStickersLibrary.

### systemCamera

```kotlin
val Dock.Button.Id.systemCamera: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberSystemCamera.

### systemGallery

```kotlin
val Dock.Button.Id.systemGallery: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberSystemGallery.

### textBackground

```kotlin
val InspectorBar.Button.Id.textBackground: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberTextBackground.

### textLibrary

```kotlin
val Dock.Button.Id.textLibrary: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberTextLibrary.

### textOnPath

```kotlin
val InspectorBar.Button.Id.textOnPath: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberTextOnPath.

### textPresets

```kotlin
val InspectorBar.Button.Id.textPresets: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberTextPresets.

### togglePagesMode

```kotlin
val NavigationBar.Button.Id.togglePagesMode: EditorComponentId
```

The id of the navigation bar button returned by NavigationBar.Button.rememberTogglePagesMode.

### togglePreviewMode

```kotlin
val NavigationBar.Button.Id.togglePreviewMode: EditorComponentId
```

The id of the navigation bar button returned by NavigationBar.Button.rememberTogglePreviewMode.

### transition

```kotlin
val InspectorBar.Button.Id.transition: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberTransition.

### undo

```kotlin
val NavigationBar.Button.Id.undo: EditorComponentId
```

The id of the navigation bar button returned by NavigationBar.Button.rememberUndo.

### voiceoverRecord

```kotlin
val Dock.Button.Id.voiceoverRecord: EditorComponentId
```

The id of the dock button returned by Dock.Button.rememberVoiceoverRecord.

### voiceover

```kotlin
val Button.Id.Companion.voiceover: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberVoiceover.

### volume

```kotlin
val InspectorBar.Button.Id.volume: EditorComponentId
```

The id of the inspector bar button returned by InspectorBar.Button.rememberVolume.
