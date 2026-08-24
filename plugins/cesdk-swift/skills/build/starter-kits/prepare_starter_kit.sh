#! /bin/bash
# Prepares an iOS starter kit by symlinking scaffold files and generating an Xcode project.
# Example: ./prepare_starter_kit.sh starter-kit-design
set -euo pipefail
IFS=$'\n\t'

TARGET_DIR="${1:-}"
SCAFFOLD_DIR="./starter-kit-scaffold"

if [ -z "$TARGET_DIR" ]; then
  echo "Usage: $0 <target-folder>"
  exit 1
fi

# Resolve to absolute paths
TARGET_DIR="$(cd "$(dirname "$TARGET_DIR")" && pwd)/$(basename "$TARGET_DIR")"
SCAFFOLD_DIR="$(cd "$(dirname "$SCAFFOLD_DIR")" && pwd)/$(basename "$SCAFFOLD_DIR")"

if [ ! -d "$SCAFFOLD_DIR" ]; then
  echo "Scaffold directory not found at: $SCAFFOLD_DIR"
  exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
  echo "Target directory not found at: $TARGET_DIR"
  exit 1
fi

STARTER_KIT_CONFIG_FILE="starter-kit-config.properties"
if [ ! -f "$TARGET_DIR/$STARTER_KIT_CONFIG_FILE" ]; then
  echo "Missing $STARTER_KIT_CONFIG_FILE in $TARGET_DIR"
  exit 1
fi

# Read xcodegen project name from config
xcodegen_project_name=$(grep '^xcodegen_project_name=' "$TARGET_DIR/$STARTER_KIT_CONFIG_FILE" | cut -d'=' -f2)
if [ -z "$xcodegen_project_name" ]; then
  echo "Missing xcodegen_project_name in $STARTER_KIT_CONFIG_FILE"
  exit 1
fi

# Derive the app source directory name from the project name (e.g., StarterKit-DesignEditor)
APP_DIR="$TARGET_DIR/$xcodegen_project_name"
if [ ! -d "$APP_DIR" ]; then
  echo "App directory not found at: $APP_DIR"
  exit 1
fi

echo "Linking scaffold files into: $TARGET_DIR"

# Link top-level scaffold files
for src in "$SCAFFOLD_DIR"/.gitignore "$SCAFFOLD_DIR"/LICENSE; do
  name="$(basename "$src")"
  dst="$TARGET_DIR/$name"
  if [ -L "$dst" ]; then
    echo "  Skipped (symlink exists): $name"
  elif [ -e "$dst" ]; then
    echo "  Skipped (file exists): $name"
  else
    ln -s "$src" "$dst"
    echo "  Linked: $name"
  fi
done

# Link Secrets.swift into the app directory
secrets_src="$SCAFFOLD_DIR/StarterKit-App/Secrets.swift"
secrets_dst="$APP_DIR/Secrets.swift"
if [ -L "$secrets_dst" ]; then
  echo "  Skipped (symlink exists): Secrets.swift"
elif [ -e "$secrets_dst" ]; then
  echo "  Skipped (file exists): Secrets.swift"
else
  ln -s "$secrets_src" "$secrets_dst"
  echo "  Linked: Secrets.swift -> $APP_DIR/"
fi

# Generate Xcode project from project.yml
if [ -f "$TARGET_DIR/project.yml" ]; then
  echo "Generating Xcode project..."
  if ! (cd "$TARGET_DIR" && xcodegen generate --quiet 2>/dev/null); then
    (cd "$TARGET_DIR" && xcodegen generate)
  fi
  echo "Generated: $xcodegen_project_name.xcodeproj"
else
  echo "Warning: No project.yml found, skipping Xcode project generation"
fi

echo "Done: $(basename "$TARGET_DIR")"
