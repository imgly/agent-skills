# CE.SDK Swift Agent Skills

One portable plugin for CE.SDK development in Swift across iOS, macOS, and Mac
Catalyst. It contains `docs`, `explain`, and `build` skills.

`IMGLYEngine` is available on all three targets. The prebuilt editor, camera,
UI modules, and bundled starter kits are iOS-only. The skills prefer live Xcode
symbols for the installed SDK and use bundled API digests as a portable
fallback.

```bash
# Claude Code
claude plugin install cesdk-swift@imgly

# Codex
codex plugin add cesdk-swift@imgly
```

## Usage

In Claude Code, type `/`; in Codex, type `$`. Then select the
matching skill from the `cesdk-swift` plugin. Both assistants can also
select a skill automatically from a natural-language request.


