> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Controls the availability of features within the Creative Editor SDK.

The FeatureAPI allows you to enable or disable specific functionality
within the editor based on custom conditions or user permissions.

## Understanding the Feature System

The feature system uses a **predicate chain** to determine if a feature is enabled.
There are two types of predicates:

1. **Boolean predicates** (e.g., `true` or `false`) - These are **always terminal** and immediately return their value.
2. **Function predicates** - The implementation decides whether to call `isPreviousEnable()` (continue chain) or return directly (end chain).

<details>
  <summary>
    ### Evaluation Order

    <br /><p>Predicates are evaluated in this order:</p>
  </summary>

  1. **`set()` predicates** (most recent first) - Evaluated **FIRST**
  2. **`enable()`/`disable()` state** - Evaluated **LAST**

  This means **`set()` can override `enable()` and `disable()`**.
</details>

## Common Use Cases and Expected Outcomes

<details>
  <summary>
    ### Use Case 1: Simple Enable/Disable
  </summary>

  ```typescript
  // Enable a feature with its default behavior
  cesdk.feature.enable('ly.img.delete');
  // isEnabled: true

  // Disable it
  cesdk.feature.disable('ly.img.delete');
  // isEnabled: false

  // Re-enable it
  cesdk.feature.enable('ly.img.delete');
  // isEnabled: true
  ```

  **Expected outcome:** `enable()` and `disable()` work together to toggle features on/off.
</details>

<details>
  <summary>
    ### Use Case 2: Custom Conditions with <code>set()</code>
  </summary>

  ```typescript
  // Enable delete only when something is selected
  cesdk.feature.set('ly.img.delete', ({ engine }) => {
    return engine.block.findAllSelected().length > 0;
  });
  // isEnabled: depends on selection

  // Now calling disable() won't work because set() is evaluated first!
  cesdk.feature.disable('ly.img.delete');
  // isEnabled: still depends on selection (disable is ignored)
  ```

  **Expected outcome:** `set()` function predicates are evaluated before `disable()`,
  so `disable()` has no effect when a `set()` predicate exists.
</details>

<details>
  <summary>
    ### Use Case 3: Terminal Boolean Predicates
  </summary>

  ```typescript
  cesdk.feature.enable('ly.img.delete'); // Default predicate: true
  cesdk.feature.set('ly.img.delete', false); // Adds false to front
  // Chain: [set(false), enable(true)]
  // Evaluation: false (stops here, never reaches enable)
  // isEnabled: false

  cesdk.feature.set('ly.img.delete', true); // Adds true to front
  // Chain: [set(true), set(false), enable(true)]
  // Evaluation: true (stops here, never reaches the rest)
  // isEnabled: true
  ```

  **Expected outcome:** The most recent `set()` call with a boolean wins because
  boolean predicates are terminal.
</details>

<details>
  <summary>
    ### Use Case 4: Layering Conditions with Functions
  </summary>

  ```typescript
  // Base: Feature enabled by default
  cesdk.feature.enable('ly.img.delete');

  // Layer 1: Add selection requirement
  cesdk.feature.set('ly.img.delete', ({ isPreviousEnable, engine }) => {
    const baseEnabled = isPreviousEnable(); // Checks enable(true)
    const hasSelection = engine.block.findAllSelected().length > 0;
    return baseEnabled && hasSelection;
  });
  // isEnabled: true only if enabled AND has selection

  // Layer 2: Add block type requirement
  cesdk.feature.set('ly.img.delete', ({ isPreviousEnable, engine }) => {
    const previousEnabled = isPreviousEnable(); // Checks Layer 1
    const [selected] = engine.block.findAllSelected();
    const isText = selected != null && engine.block.getType(selected) === '//ly.img.ubq/text';
    return previousEnabled && isText;
  });
  // isEnabled: true only if all conditions met (block type + selection + enabled)
  ```

  **Expected outcome:** Each `set()` call with a function can build on previous
  conditions by calling `isPreviousEnable()`.
</details>

<details>
  <summary>
    ### Use Case 5: Overriding with <code>set()</code>
  </summary>

  ```typescript
  cesdk.feature.enable('ly.img.delete');
  cesdk.feature.disable('ly.img.delete');
  // isEnabled: false (disable overrides enable)

  // But set() overrides both:
  cesdk.feature.set('ly.img.delete', true);
  // Chain: [set(true), disable(false)]
  // isEnabled: true (set is terminal, disable never evaluated)
  ```

  **Expected outcome:** `set()` with a boolean always wins because it's evaluated
  first and is terminal.
</details>

<details>
  <summary>
    ### Use Case 6: Glob Patterns for Bulk Operations
  </summary>

  ```typescript
  // Enable all video features at once
  cesdk.feature.enable('ly.img.video.*');

  // Disable all crop features
  cesdk.feature.disable('ly.img.crop.*');

  // Set custom predicate for all navigation features
  cesdk.feature.set('ly.img.navigation.*', ({ engine }) => {
    return engine.block.findAllSelected().length > 0;
  });

  // Check if all video features are enabled
  const allVideoEnabled = cesdk.feature.isEnabled('ly.img.video.*');
  // Returns true only if ALL matching features are enabled
  ```

  **Expected outcome:** Glob patterns match multiple features. `isEnabled()` with
  a glob returns `true` only if **all** matching features are enabled.
</details>

<details>
  <summary>
    ### Use Case 7: Role-Based Access Control
  </summary>

  ```typescript
  const userRole = 'editor'; // Could be 'viewer', 'editor', 'admin'

  cesdk.feature.set('ly.img.delete', () => {
    return userRole === 'editor' || userRole === 'admin';
  });

  cesdk.feature.set('ly.img.settings', () => {
    return userRole === 'admin';
  });
  ```

  **Expected outcome:** Features are enabled based on user roles, with predicates
  evaluated on every check.
</details>

<details>
  <summary>
    ### Use Case 8: Enable/Disable Propagation to Children
  </summary>

  ```typescript
  // Enable the parent feature - also enables children
  cesdk.feature.enable('ly.img.replace');
  // Equivalent to also calling: cesdk.feature.enable('ly.img.replace.*')

  // All children with default predicates are now enabled:
  cesdk.feature.isEnabled('ly.img.replace.fill');  // true (if default predicate passes)
  cesdk.feature.isEnabled('ly.img.replace.shape'); // true (if default predicate passes)
  cesdk.feature.isEnabled('ly.img.replace.audio'); // true (if default predicate passes)

  // Disable a specific child after propagation:
  cesdk.feature.disable('ly.img.replace.fill');
  cesdk.feature.isEnabled('ly.img.replace.fill');  // false

  // Disable propagates to children too:
  cesdk.feature.disable('ly.img.replace');
  // Equivalent to also calling: cesdk.feature.disable('ly.img.replace.*')
  ```

  **Expected outcome:** `enable()` and `disable()` propagate to all child features
  that have registered default predicates. Each child uses its own default predicate,
  so context-dependent conditions (e.g., block type checks) still apply.
  Children can be individually overridden after propagation.
</details>

## Key Principles

1. **Use `enable()` for simple on/off** - Works with default predicates
2. **Use `disable()` to turn off enabled features** - Only works if no `set()` predicates exist
3. **Use `set()` for custom logic** - Overrides `enable()`/`disable()`
4. **Boolean predicates are terminal** - Stop evaluation immediately
5. **Function predicates can chain** - Call `isPreviousEnable()` to continue
6. **Most recent `set()` wins** - Evaluated in LIFO order (most recent first)
7. **Glob patterns affect multiple features** - Use `*` as wildcard
8. **Enable/disable propagates to children** - `enable()` and `disable()` also affect all child features with default predicates

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>FeatureAPI</code></p>
  </summary>
</details>

## Feature Control

Methods for enabling and checking the status of editor features based on custom predicates.

<details>
  <summary>
    ### enable()

    <br /><p>Enables one or more features using their default predicates.</p>
  </summary>

  This is the recommended way to enable features. Each feature has a sensible
  default predicate that determines when it should be available in the UI.
  To customize the behavior, use the `set()` method instead.

  Supports glob patterns (e.g., 'ly.img.video.\*') to enable multiple features at once.
  Use `*` as a wildcard to match any sequence of characters.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `featureId` | | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md) | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md)\[] | The feature ID, glob pattern, or array of feature IDs to enable. |

  ##### Returns

  `void`

  ##### Examples

  Enable single feature with its default predicate:

  ```typescript
  cesdk.feature.enable('ly.img.delete');
  ```

  Enable multiple features at once:

  ```typescript
  cesdk.feature.enable(['ly.img.delete', 'ly.img.duplicate']);
  ```

  Enable all video features using a glob pattern:

  ```typescript
  cesdk.feature.enable('ly.img.video.*');
  ```

  Enable all navigation features:

  ```typescript
  cesdk.feature.enable('ly.img.navigation.*');
  ```

  #### Call Signature

  ```ts
  enable(featureId, predicate): void;
  ```

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `featureId` | | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md) | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md)\[] | The feature ID or array of feature IDs to enable. |
  | `predicate` | [`FeaturePredicate`](./api/cesdk-js/type-aliases/featurepredicate.md) | The condition that determines if the feature is enabled. |

  ##### Returns

  `void`

  ##### Deprecated

  Use `cesdk.feature.set(featureId, predicate)` instead.
  This overload will be removed in a future version.

  Enables one or more features based on the provided predicate.

  #### Signatures

  ```typescript
  enable(featureId: FeatureId | FeatureId[]): void
  ```

  ```typescript
  enable(featureId: FeatureId | FeatureId[], predicate: FeaturePredicate): void
  ```

  ***
</details>

<details>
  <summary>
    ### disable()

    <br /><p>Disables one or more features.</p>
  </summary>

  This is a convenience method that adds a `false` predicate to the feature's
  predicate chain, effectively disabling the feature. Disabled features will
  not be shown in the UI.

  Supports glob patterns (e.g., 'ly.img.video.\*') to disable multiple features at once.
  Use `*` as a wildcard to match any sequence of characters.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `featureId` | | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md) | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md)\[] | The feature ID, glob pattern, or array of feature IDs to disable. |

  #### Returns

  `void`

  #### Examples

  Disable a single feature:

  ```typescript
  cesdk.feature.disable('ly.img.delete');
  ```

  Disable multiple features at once:

  ```typescript
  cesdk.feature.disable([
    'ly.img.delete',
    'ly.img.duplicate',
    'ly.img.group'
  ]);
  ```

  Disable all video features using a glob pattern:

  ```typescript
  cesdk.feature.disable('ly.img.video.*');
  ```

  Disable all crop features:

  ```typescript
  cesdk.feature.disable('ly.img.crop.*');
  ```

  #### Signature

  ```typescript
  disable(featureId: FeatureId | FeatureId[]): void
  ```

  ***
</details>

<details>
  <summary>
    ### set()

    <br /><p>Sets a feature's enabled state, replacing any existing predicates.</p>
  </summary>

  This method provides a unified way to enable or disable features. When setting
  to `true`, the feature's default predicate is used. When setting to `false`,
  the feature is explicitly disabled. You can also provide a custom predicate
  function for advanced control.

  Supports glob patterns (e.g., 'ly.img.video.\*') to set multiple features at once.
  Use `*` as a wildcard to match any sequence of characters.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `featureId` | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md) | The feature ID or glob pattern to set. |
  | `enabled` | [`FeaturePredicate`](./api/cesdk-js/type-aliases/featurepredicate.md) | Boolean to enable/disable, or a predicate function for custom logic. |

  #### Returns

  `void`

  #### Examples

  Enable a feature using its default predicate:

  ```typescript
  cesdk.feature.set('ly.img.delete', true);
  ```

  Disable a feature:

  ```typescript
  cesdk.feature.set('ly.img.delete', false);
  ```

  Set a feature with a custom predicate:

  ```typescript
  cesdk.feature.set('ly.img.delete', ({ engine }) => {
    return engine.block.findAllSelected().length > 0;
  });
  ```

  Disable all video features using a glob pattern:

  ```typescript
  cesdk.feature.set('ly.img.video.*', false);
  ```

  Enable all filter features with a custom predicate:

  ```typescript
  cesdk.feature.set('ly.img.filter.*', ({ engine }) => {
    // Only enable filters for images
    const selected = engine.block.findAllSelected();
    return selected.some(id => engine.block.getType(id) === '//ly.img.ubq/graphic');
  });
  ```

  #### Signature

  ```typescript
  set(featureId: FeatureId, enabled: FeaturePredicate): void
  ```

  ***
</details>

<details>
  <summary>
    ### list()

    <br /><p>Lists all registered feature IDs, optionally filtered by a pattern.</p>
  </summary>

  This method is useful for debugging and discovering which features are currently
  registered in the editor. You can provide a glob-style pattern to filter the results.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `matcher?`: `string`; } | Optional configuration object with a `matcher` property for glob-style pattern filtering (e.g., 'ly.img.video.\*'). |
  | `options.matcher?` | `string` | - |

  #### Returns

  [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md)\[]

  An array of feature IDs sorted alphabetically.

  #### Examples

  List all registered features:

  ```typescript
  const allFeatures = cesdk.feature.list();
  console.log(allFeatures); // ['ly.img.delete', 'ly.img.duplicate', ...]
  ```

  List features matching a pattern:

  ```typescript
  const videoFeatures = cesdk.feature.list({ matcher: 'ly.img.video.*' });
  console.log(videoFeatures); // ['ly.img.video.timeline', 'ly.img.video.timeline.clips', ...]
  ```

  List navigation features:

  ```typescript
  const navFeatures = cesdk.feature.list({ matcher: 'ly.img.navigation.*' });
  ```

  #### Signature

  ```typescript
  list(options?: object): FeatureId[]
  ```

  ***
</details>

<details>
  <summary>
    ### get()

    <br /><p>Gets the predicate chain for a specific feature.</p>
  </summary>

  This method returns the array of predicates currently registered for a feature,
  allowing you to inspect the feature's configuration. Returns `undefined` if the
  feature is not registered.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `featureId` | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md) | The feature ID to query. |

  #### Returns

  [`FeaturePredicate`](./api/cesdk-js/type-aliases/featurepredicate.md)\[]

  The array of predicates for the feature, or undefined if not registered.

  #### Examples

  Get predicates for a feature:

  ```typescript
  const predicates = cesdk.feature.get('ly.img.delete');
  if (predicates) {
    console.log(`Feature has ${predicates.length} predicates`);
  }
  ```

  Check if a feature is registered:

  ```typescript
  const isRegistered = cesdk.feature.get('ly.img.delete') !== undefined;
  ```

  #### Signature

  ```typescript
  get(featureId: FeatureId): FeaturePredicate[]
  ```

  ***
</details>

<details>
  <summary>
    ### isEnabled()

    <br /><p>Checks if one or more features are currently enabled.</p>
  </summary>

  Supports glob patterns (e.g., 'ly.img.video.\*') to check multiple features at once.
  When a glob pattern is used, returns `true` only if **all** matching features are enabled.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `featureId` | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md) | The feature ID or glob pattern to check. |
  | `context?` | [`IsEnabledFeatureContext`](./api/cesdk-js/type-aliases/isenabledfeaturecontext.md) | The context object containing a reference to the underlying engine. |

  #### Returns

  `boolean`

  True if the feature (or all matching features for glob patterns) is enabled, false otherwise.

  #### Examples

  Check if a single feature is enabled:

  ```typescript
  const isDeleteEnabled = cesdk.feature.isEnabled('ly.img.delete');
  ```

  Check if all video features are enabled:

  ```typescript
  const allVideoFeaturesEnabled = cesdk.feature.isEnabled('ly.img.video.*');
  ```

  Check with custom context (useful in predicates):

  ```typescript
  cesdk.feature.set('ly.img.delete', ({ engine }) => {
    return cesdk.feature.isEnabled('ly.img.duplicate', { engine });
  });
  ```

  #### Signature

  ```typescript
  isEnabled(featureId: FeatureId, context?: IsEnabledFeatureContext): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### has()

    <br /><p>Checks if a feature has registered predicates.</p>
  </summary>

  Returns `true` if the feature has any predicates (boolean or function) in its chain.
  Returns `false` if the feature is unknown or has no predicates.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `featureId` | [`FeatureId`](./api/cesdk-js/type-aliases/featureid.md) | The feature ID to check. |

  #### Returns

  `boolean`

  True if the feature has registered predicates.

  #### Signature

  ```typescript
  has(featureId: FeatureId): boolean
  ```
</details>


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support