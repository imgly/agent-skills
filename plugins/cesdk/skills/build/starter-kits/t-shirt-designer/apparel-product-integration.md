# Apparel Editor vs Product Editor Integration Analysis

## Executive Summary

**YES - The product-editor config can be reused for starterkit-apparel-editor with minimal changes.**

The core engine configuration (`config/product.ts`, `config/plugin.ts`, etc.) is **100% reusable**. The only differences are in:

1. **Sidebar UI** - Different visual design and features
2. **Product data** - Different products.ts file
3. **Assets** - Different mockup images

---

## Architectural Comparison

### File Structure

| Component      | product-editor-ui (Showcase)           | apparel-editor-ui (Showcase)           | starterkit-product-editor       |
| -------------- | -------------------------------------- | -------------------------------------- | ------------------------------- |
| Config File    | `ProductEditorUIConfig.ts` (652 lines) | `ApparelEditorUIConfig.ts` (483 lines) | `config/product.ts` (639 lines) |
| Products       | `product.ts` (443 lines, 6 products)   | `product.ts` (137 lines, 1 product)    | `products.ts`                   |
| Sidebar        | `FormSection.tsx` (121 lines)          | `FormSection.tsx` (211 lines)          | `sidebar.ts` (499 lines)        |
| Main Component | `CaseComponent.jsx` (256 lines)        | `CaseComponent.jsx` (124 lines)        | `index.ts` (143 lines)          |

---

## Core Config Differences

### ProductEditorUIConfig.ts vs ApparelEditorUIConfig.ts

#### Identical Core Interfaces

Both use the **exact same** `ProductConfig` interface:

```typescript
interface ProductConfig {
  id: string;
  label: string;
  designUnit: DesignUnit;
  unitPrice: number;
  areas: ProductAreaConfig[];
  colors: ProductColor[];
  sizes: ProductSize[];
}

interface ProductAreaConfig {
  id: string;
  label: string;
  pageSize: { width: number; height: number };
  disabled?: boolean;
  mockup?: ProductAreaMockupConfig;
}

interface ProductColor {
  id: string;
  label?: string;
  colorHex: string;
  isDefault?: boolean;
}
```

#### Key Differences

| Feature                           | ProductEditorUIConfig                           | ApparelEditorUIConfig                        | Impact                                                      |
| --------------------------------- | ----------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| **Mask support**                  | `editingMaskUrl`, `exportingMaskUrl`            | Not included                                 | Product has mask support for irregular shapes (arrow signs) |
| **`switchProductView` signature** | `(instance, areaId, color)`                     | `(instance, mockupArea, areaId, color)`      | Apparel passes mockup config directly                       |
| **`exportDesigns` signature**     | `(instance, product)`                           | `(instance)` (reads from scene)              | Product passes product config; Apparel reads from metadata  |
| **`exportDesigns` returns**       | `{ archive, pdfs, thumbnails }`                 | `{ archive, pdfs, thumbnails, previews }`    | Apparel includes preview images                             |
| **ZOOM_PADDING**                  | `{ left: 40, top: 80, right: 40, bottom: 100 }` | `{ left: 5, top: 50, right: 5, bottom: 60 }` | Different viewport padding                                  |
| **Zoom method**                   | `actions.run('zoom.toBlock', ...)`              | `engine.scene.zoomToBlock(...)`              | Product uses new action-based API                           |
| **Content-aware resize**          | Uses `resizeContentAware`                       | Uses `setWidth/setHeight`                    | Product preserves content when resizing                     |
| **Product ID tracking**           | `CURRENT_PRODUCT_ID_KEY` metadata               | None                                         | Product tracks changes to avoid redundant mockup recreation |

---

## Sidebar Comparison

### product-editor-ui FormSection.tsx

- **Product grid** with thumbnails (6 products)
- **Color picker** (swatches)
- **Download link** for assets
- **Simple, minimal UI**

### apparel-editor-ui FormSection.tsx

- **Header** with product name, price
- **Area selector** (SegmentedControl for Front/Back/Left/Right)
- **Preview image** of current area
- **Print details** (dimensions, print method)
- **Color picker** (swatches)
- **Size & Quantity inputs** with counters
- **Add to Cart button** with price calculation
- **Download link** for assets
- **E-commerce focused UI**

---

## CaseComponent Comparison

### product-editor-ui CaseComponent.jsx (256 lines)

```
Features:
- Multiple product support (6 products)
- Product switching with state management
- Area selector via custom CE.SDK component (product-area-select)
- Color selection via sidebar
- Product configurator mode (press 'M' key)
- Content-aware resize on product change
- Complex effect management for product/area/color changes
```

### apparel-editor-ui CaseComponent.jsx (124 lines)

```
Features:
- Single product (t-shirt only)
- Area selection via sidebar SegmentedControl
- Color selection via sidebar
- Simpler state management
- No product switching logic
- No product configurator mode
```

---

## Reusability Assessment

### What CAN Be Reused (100%)

| Component          | File                           | Reusable? | Notes                        |
| ------------------ | ------------------------------ | --------- | ---------------------------- |
| Product operations | `config/product.ts`            | Yes       | Core scene/mockup/mask logic |
| Plugin config      | `config/plugin.ts`             | Yes       | CE.SDK configuration         |
| Actions            | `config/actions.ts`            | Yes       | Navigation bar actions       |
| Features           | `config/features.ts`           | Yes       | Feature flags                |
| Settings           | `config/settings.ts`           | Yes       | Editor settings              |
| I18n               | `config/i18n.ts`               | Yes       | Translations                 |
| Types              | `config/types.ts`              | Yes       | TypeScript interfaces        |
| UI components      | `config/ui/*`                  | Yes       | CE.SDK UI components         |
| Init function      | `index.ts (initProductEditor)` | Yes       | Initialization logic         |
| Export helper      | `sidebar-exports.ts`           | Yes       | Export functionality         |

### What Needs to Change

| Component      | Change Required                            | Effort |
| -------------- | ------------------------------------------ | ------ |
| `products.ts`  | Replace with t-shirt product data          | Low    |
| `sidebar.ts`   | Replace with e-commerce sidebar            | Medium |
| `index.ts`     | Update orchestration for sidebar callbacks | Low    |
| Product assets | Add mockup images                          | Low    |

---

## Recommended Approach for starterkit-apparel-editor

### Option A: Fork and Customize Sidebar (Recommended)

1. **Copy starterkit-product-editor** to `starterkit-apparel-editor`
2. **Keep all config files unchanged** (`config/*`)
3. **Replace `products.ts`** with single t-shirt product:
   ```typescript
   export const PRODUCT_SAMPLES: ProductConfig[] = [
     {
       id: 'tshirt',
       label: 'Mens T-Shirt',
       designUnit: 'Inch',
       unitPrice: 19.99,
       areas: [
         { id: 'front', label: 'Front', pageSize: { width: 20, height: 20 }, mockup: {...} },
         { id: 'back', label: 'Back', pageSize: { width: 20, height: 20 }, mockup: {...} }
       ],
       colors: [...],
       sizes: [...]
     }
   ];
   ```
4. **Create new `ApparelSidebar` class** with:
   - Area selector (SegmentedControl or buttons)
   - Color picker
   - Size & quantity inputs
   - Add to cart button
   - Print area details display
5. **Update `index.ts`** to use new sidebar
6. **Add product mockup images**

### Option B: Parameterized Starterkit

Create a single starterkit that can be configured for either use case:

- Configuration flag for "multi-product" vs "single-product" mode
- Pluggable sidebar component
- Shared core engine configuration

---

## Code Snippets for Apparel Sidebar

### Minimal ApparelSidebar Implementation

```typescript
export class ApparelSidebar {
  private container: HTMLElement;
  private state: {
    areaId: string;
    colorId: string;
    quantities: Map<string, number>;
  };
  private callbacks: SidebarCallbacks;

  constructor(container: HTMLElement, callbacks: SidebarCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.state = {
      areaId: 'front',
      colorId: 'white',
      quantities: new Map([
        ['M', 1],
        ['L', 1]
      ])
    };
    this.render();
  }

  // Area selection
  private createAreaSelector(): HTMLElement {
    // Segmented control: Front | Back
  }

  // Color picker (same as ProductSidebar)
  private createColorSection(): HTMLElement {
    // Color swatches
  }

  // Size & quantity inputs
  private createSizeQuantitySection(): HTMLElement {
    // XS [0] S [0] M [1] L [1] XL [0]
  }

  // Add to cart
  private createCartSection(): HTMLElement {
    // Price calculation + Add to Cart button
  }
}
```

### Updated index.ts Orchestration

```typescript
const sidebar = new ApparelSidebar(sidebarContainer, {
  onAreaChange: async (areaId: string) => {
    const color = getCurrentColor(cesdk.engine);
    await switchProductView(cesdk, areaId, color);
  },
  onColorChange: async (color: ProductColor) => {
    setCurrentColor(cesdk.engine, color);
    const areaId = getCurrentAreaId();
    await switchProductView(cesdk, areaId, color);
  },
  onExportRequest: async () => {
    // Export logic
  }
});
```

---

## Effort Estimate

| Task                  | Effort  | Description                         |
| --------------------- | ------- | ----------------------------------- |
| Copy starterkit       | 5 min   | Clone directory structure           |
| Update products.ts    | 15 min  | Single t-shirt product with mockups |
| Create ApparelSidebar | 2-3 hrs | E-commerce UI with quantities       |
| Update index.ts       | 30 min  | Wire up new sidebar callbacks       |
| Add assets            | 30 min  | Mockup images for t-shirt colors    |
| Testing               | 1 hr    | Verify all interactions work        |
| Documentation         | 1 hr    | Update README and comments          |

**Total: ~5-6 hours**

---

## Conclusion

The starterkit-product-editor architecture is well-designed for reuse:

1. **Core engine logic** (`config/*`) is product-agnostic and fully reusable
2. **Sidebar is the only component that needs replacement** for different use cases
3. **The orchestration pattern** (sidebar emits callbacks, main handles CE.SDK) is clean and maintainable
4. **TypeScript interfaces** are identical between both showcases

**Recommendation**: Create `starterkit-apparel-editor` by copying `starterkit-product-editor` and implementing a custom `ApparelSidebar` class. The config folder stays unchanged.
