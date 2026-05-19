# Product Editor Starterkit - TODO / Revisit Later

> Items to revisit after the main refactoring is complete.

---

## Architecture Clarification

### `product.ts` Location and Structure

**CRITICAL**: The `product.ts` must be:
1. Located INSIDE the starterkit at `src/imgly/config/product.ts`
2. NOT symlinked from the showcase (`apps/cesdk_web/packages/configs/product-editor/`)
3. A standalone file owned by the starterkit

**Structure Decision**:
- Keep `product.ts` as the main barrel export that re-exports from split modules
- Internal modules: `types.ts`, `state.ts`, `scene.ts`, `mockup.ts`, `view.ts`, `export.ts`
- External imports use `./config/product` (clean, single entry point)
- Internal implementation is modular (easy to understand and maintain)

**File Layout**:
```
src/imgly/config/
├── product.ts      # Barrel export - re-exports from all modules below
├── types.ts        # ProductConfig, ProductColor, ProductAreaConfig, etc.
├── state.ts        # getCurrentColor, setCurrentColor, getProductData, setProductData
├── scene.ts        # createOrUpdateSceneByProduct, page management
├── mockup.ts       # createMockupsForProduct, showMockup, findMockupBlock
├── view.ts         # switchProductView
├── export.ts       # exportDesigns (includes mask swapping)
├── settings.ts     # Engine settings (dimOutOfPageAreas, etc.)
├── features.ts     # Feature flags (singlePageMode, etc.)
├── actions.ts      # Action handlers (save, export, upload)
├── i18n.ts         # Translations
├── plugin.ts       # ProductEditorConfig class
├── index.ts        # Config barrel (includes plugin + product exports)
└── ui/
    ├── index.ts    # UI setup orchestrator
    ├── canvas.ts   # Canvas bar configuration
    ├── components.ts # Custom UI components
    ├── dock.ts     # Dock configuration
    ├── inspectorBar.ts # Inspector bar configuration
    ├── navigationBar.ts # Navigation bar configuration
    └── panel.ts    # Panel positions
```

---

## To Revisit

### 1. `exportDesigns` Function
**Location**: `config/export.ts`
**Question**: Is this function actually used in the starterkit?
**Options**:
- [ ] Remove entirely (YAGNI)
- [ ] Keep as reference/example code
- [ ] Move to separate "optional features" module

---

### 2. Mask System (`editingMaskUrl`, `exportingMaskUrl`)
**Location**: `ProductMockupConfig` type, `config/export.ts` mask functions
**Question**: Is this a core feature or edge case?
**Observation**: Only 1 product (arrowsign) uses masks
**Options**:
- [ ] Keep as-is (demonstrates advanced feature)
- [ ] Remove from starterkit (simplify)
- [ ] Move to separate "advanced features" module

---

### 3. Mockup Pre-creation Strategy
**Current Behavior**: Creates ALL color variants upfront (e.g., 6 colors × 2 areas = 12 mockup blocks)
**Question**: Is this a performance concern?
**Options**:
- [ ] Keep as-is (simpler implementation, acceptable for starterkit)
- [ ] Implement lazy creation (better performance, more complex)
- [ ] Document the trade-off and let users decide

---

### 4. `backdrop.ts` Integration
**Location**: `src/imgly/backdrop.ts`
**Status**: Created during debugging session but not integrated
**Question**: Should this utility be used or removed?
**Options**:
- [ ] Integrate into mockup management
- [ ] Keep as optional utility
- [ ] Remove (if mockup.ts handles everything)

---

### 5. `window.location.origin` for Assets
**Location**: `products.ts` line 19
**Current**:
```typescript
const ASSETS_BASE = `${window.location.origin}/products`;
```
**Question**: Is there a better approach that works across all environments?
**Options**:
- [ ] Keep as-is (works, documented)
- [ ] Make configurable via environment variable
- [ ] Use relative paths with proper CE.SDK baseURL configuration

---

## Completed

- [x] Identify duplicate `dimOutOfPageAreas` setting → Fix: Remove from product.ts, keep only in settings.ts
- [x] Identify unused types/fields → Fix: Remove `ProductSize`, `unitPrice`, `sizes`
- [x] `setFill` after `getFill` → Decision: Keep as-is (intentional pattern)
- [x] `backdrop.ts` not integrated → Decision: Keep for now, revisit later
- [x] Architecture decision: `product.ts` as barrel export in config directory

---

## Questions for User (End of Session)

1. After refactoring, test the mask feature with arrowsign product - still needed?
2. Performance testing with many products - is lazy mockup creation worth the complexity?
3. Export functionality - any real usage or can we simplify/remove?
