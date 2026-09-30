#!/bin/bash
set -e

# Check if 1Password CLI is installed
if ! command -v op &> /dev/null; then
    echo "Error: 1Password CLI (op) is not installed."
    echo "Install it from: https://developer.1password.com/docs/cli/get-started/"
    exit 1
fi

# Check if user is signed in to 1Password
if ! op whoami --account imgly.1password.com &> /dev/null; then
    echo "Please sign in to 1Password first:"
    op signin --account imgly.1password.com
fi

# Retrieve the CESDK license key from 1Password
echo "Retrieving CESDK license key from 1Password..."
CESDK_LICENSE=$(op read "op://Secrets/web-examples/CESDK_API_KEY" --account imgly.1password.com)

if [ -z "$CESDK_LICENSE" ]; then
    echo "Error: Could not retrieve CESDK_API_KEY from 1Password"
    exit 1
fi

# Write to .env file
cat > .env << EOF
# CE.SDK License Key (Retrieved from 1Password)
# Last updated: $(date)
VITE_CESDK_LICENSE=$CESDK_LICENSE
EOF

echo "✓ Successfully created .env with CESDK license key from 1Password"
