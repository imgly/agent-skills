> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Movement Constraints](./user-interface/customization/movement-constraints.md)

---

```typescript file=@cesdk_web_examples/engine-guides-movement-constraints/MovementConstraints.ts reference-only
import CreativeEngine from '@cesdk/engine';

async function movementConstraints() {
  const engine = await CreativeEngine.init({
    // license: 'YOUR_CESDK_LICENSE_KEY'
  });

  try {
    const scene = engine.scene.create();

    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    const block = engine.block.create('graphic');
    engine.block.appendChild(page, block);

    // Allow every block in the scene to overshoot by 20% of its own size.
    engine.editor.setMovementConstraint({ overshoot: 0.2 });

    // Pin all text and caption blocks fully inside the page.
    engine.editor.setMovementConstraint([
      { overshoot: 0, blockType: 'text' },
      { overshoot: 0, blockType: 'caption' }
    ]);

    // Override the scene-wide default for blocks on this page.
    engine.editor.setMovementConstraint({ overshoot: 0.1, block: page });

    // Override every other level for one specific block.
    engine.editor.setMovementConstraint({ overshoot: 0, block });

    // Read the resolved constraint, walking the priority chain:
    // block > parent page > blockType > scene-wide.
    const active = engine.editor.getMovementConstraint(block);

    // Clear a scope by passing the matching descriptor. Use no argument to
    // remove the scene-wide default.
    engine.editor.removeMovementConstraint({ block }); // per-block
    engine.editor.removeMovementConstraint({ blockType: 'text' }); // per-type
    engine.editor.removeMovementConstraint({ block: page }); // per-page
    engine.editor.removeMovementConstraint(); // scene-wide default

    return active;
  } finally {
    engine.dispose();
  }
}

movementConstraints();

```

Limit how far a block may extend past its page during user interactions.
The constraints apply to mouse and touch gestures — moving, resizing, and
scaling. API calls bypass them.

`overshoot` is a non-negative fraction of the **block's own size**: `0` pins the block fully inside, `0.2` allows a 20% overshoot. A rule's scope is determined by the keys you pass:

- `{ overshoot }` — scene-wide default.
- `{ overshoot, block }` — a specific block (pages count as blocks).
- `{ overshoot, blockType }` — every block of the given type.

## Scene-wide default

Apply a rule that affects every page in the scene:

```typescript highlight-movement-constraint-scene-wide
// Allow every block in the scene to overshoot by 20% of its own size.
engine.editor.setMovementConstraint({ overshoot: 0.2 });
```

## Per block type

Pass a `blockType` to restrict all blocks of that type. Call `setMovementConstraint` with an array to apply several rules in one call:

```typescript highlight-movement-constraint-per-type
// Pin all text and caption blocks fully inside the page.
engine.editor.setMovementConstraint([
  { overshoot: 0, blockType: 'text' },
  { overshoot: 0, blockType: 'caption' }
]);
```

## Per page

Pages are blocks, so you can target a page block to set a default for its children:

```typescript highlight-movement-constraint-per-page
// Override the scene-wide default for blocks on this page.
engine.editor.setMovementConstraint({ overshoot: 0.1, block: page });
```

## Per block

Pass a specific block ID to override every other level:

```typescript highlight-movement-constraint-per-block
// Override every other level for one specific block.
engine.editor.setMovementConstraint({ overshoot: 0, block });
```

## Read the active value

Read the resolved constraint for a block. The lookup walks the priority chain: block, parent page, blockType, then scene-wide. It returns `null` when the block is unconstrained.

```typescript highlight-movement-constraint-read
// Read the resolved constraint, walking the priority chain:
// block > parent page > blockType > scene-wide.
const active = engine.editor.getMovementConstraint(block);
```

## Remove a constraint

Pass a scope descriptor to clear any level of the priority chain, or call `removeMovementConstraint()` with no argument to clear the scene-wide default:

```typescript highlight-movement-constraint-remove
// Clear a scope by passing the matching descriptor. Use no argument to
// remove the scene-wide default.
engine.editor.removeMovementConstraint({ block }); // per-block
engine.editor.removeMovementConstraint({ blockType: 'text' }); // per-type
engine.editor.removeMovementConstraint({ block: page }); // per-page
engine.editor.removeMovementConstraint(); // scene-wide default
```

## Full code

Here's the full code:

```typescript highlight-movement-constraints
import CreativeEngine from '@cesdk/engine';

async function movementConstraints() {
  const engine = await CreativeEngine.init({
    // license: 'YOUR_CESDK_LICENSE_KEY'
  });

  try {
    const scene = engine.scene.create();

    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    const block = engine.block.create('graphic');
    engine.block.appendChild(page, block);

    // Allow every block in the scene to overshoot by 20% of its own size.
    engine.editor.setMovementConstraint({ overshoot: 0.2 });

    // Pin all text and caption blocks fully inside the page.
    engine.editor.setMovementConstraint([
      { overshoot: 0, blockType: 'text' },
      { overshoot: 0, blockType: 'caption' }
    ]);

    // Override the scene-wide default for blocks on this page.
    engine.editor.setMovementConstraint({ overshoot: 0.1, block: page });

    // Override every other level for one specific block.
    engine.editor.setMovementConstraint({ overshoot: 0, block });

    // Read the resolved constraint, walking the priority chain:
    // block > parent page > blockType > scene-wide.
    const active = engine.editor.getMovementConstraint(block);

    // Clear a scope by passing the matching descriptor. Use no argument to
    // remove the scene-wide default.
    engine.editor.removeMovementConstraint({ block }); // per-block
    engine.editor.removeMovementConstraint({ blockType: 'text' }); // per-type
    engine.editor.removeMovementConstraint({ block: page }); // per-page
    engine.editor.removeMovementConstraint(); // scene-wide default

    return active;
  } finally {
    engine.dispose();
  }
}

movementConstraints();
```



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support