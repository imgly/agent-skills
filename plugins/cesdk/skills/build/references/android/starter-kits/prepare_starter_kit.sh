#! /bin/bash
# Example: ./prepare_starter_kit.sh starter-kit-apparel
set -euo pipefail
IFS=$'\n\t'

TARGET_DIR="${1:-}"
SCAFFOLD_DIR="./starter-kit-scaffold"

if [ -z "$TARGET_DIR" ]; then
  echo "❌ Usage: $0 <target-folder> [<scaffold-folder>]"
  exit 1
fi

# Resolve to absolute paths
TARGET_DIR="$(cd "$(dirname "$TARGET_DIR")" && pwd)/$(basename "$TARGET_DIR")"
SCAFFOLD_DIR="$(cd "$(dirname "$SCAFFOLD_DIR")" && pwd)/$(basename "$SCAFFOLD_DIR")"

if [ ! -d "$SCAFFOLD_DIR" ]; then
  echo "❌ Scaffold directory not found at: $SCAFFOLD_DIR"
  exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
  echo "📁 Creating target directory: $TARGET_DIR"
  mkdir -p "$TARGET_DIR"
fi

echo "🔗 Recursively linking files from:"
echo "   $SCAFFOLD_DIR"
echo "   → $TARGET_DIR"
echo

# Skip hidden and build/IDE folders
SKIP_NAMES=( ".git" ".idea" ".gradle" "build" )

should_skip() {
  local name="$1"
  for n in "${SKIP_NAMES[@]}"; do
    if [[ "$name" == "$n" ]]; then
      return 0
    fi
  done
  return 1
}

link_recursive() {
  local src_dir="$1"
  local dst_dir="$2"

  mkdir -p "$dst_dir"

  for src in "$src_dir"/*; do
    [ -e "$src" ] || continue  # skip if no files match

    local name
    name="$(basename "$src")"
    local dst="$dst_dir/$name"

    # Skip actual .gitignore files in scaffold
    if [[ "$name" == ".gitignore" ]]; then
        echo "⚠️  Skipping scaffold .gitignore"
        continue
    fi

    if [ -d "$src" ]; then
      # recurse into directories
      link_recursive "$src" "$dst"
    else
      # create symlink if not already present
      if [ -e "$dst" ] && [ ! -L "$dst" ]; then
        echo "⚠️  Skipped (exists): $dst"
      elif [ -L "$dst" ]; then
        echo "⚠️  Skipped (symlink exists): $dst"
      else
        ln -s "$src" "$dst"
        echo "✅ Linked: $dst -> $src"
      fi
    fi
  done
}

link_recursive "$SCAFFOLD_DIR" "$TARGET_DIR"
