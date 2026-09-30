#!/bin/bash
# Writes the dev credentials this kit needs into .env from 1Password:
# the CE.SDK license and the IMG.LY AI Gateway key.
set -e

ACCOUNT=imgly.1password.com

if ! command -v op &> /dev/null; then
    echo "Error: 1Password CLI (op) is not installed."
    echo "Install it from: https://developer.1password.com/docs/cli/get-started/"
    exit 1
fi

if ! op whoami --account "$ACCOUNT" &> /dev/null; then
    echo "Please sign in to 1Password first:"
    op signin --account "$ACCOUNT"
fi

# Sets NAME=VALUE in .env, replacing the line when it already exists.
set_env() {
    local name=$1 value=$2
    if [ -f .env ] && grep -q "^$name=" .env; then
        # A key can hold sed's replacement metacharacters.
        local escaped
        escaped=$(printf '%s' "$value" | sed 's/[&|\\]/\\&/g')
        sed -i.bak "s|^$name=.*|$name=$escaped|" .env
        rm -f .env.bak
    else
        echo "$name=$value" >> .env
    fi
}

read_secret() {
    local value
    value=$(op read "$1" --account "$ACCOUNT")
    if [ -z "$value" ]; then
        echo "Error: Could not retrieve $1 from 1Password"
        exit 1
    fi
    echo "$value"
}

echo "Retrieving the CE.SDK license key from 1Password..."
set_env VITE_CESDK_LICENSE "$(read_secret op://Secrets/web-examples/CESDK_API_KEY)"

echo "Retrieving the AI Gateway key from 1Password..."
set_env VITE_AI_API_KEY "$(read_secret op://Shared/web-plugins-dev/VITE_GATEWAY_API_KEY)"
# The shared dev key is issued for the staging gateway, so production rejects it.
set_env VITE_AI_GATEWAY_URL https://gateway.staging.img.ly

echo "✓ Updated .env with the CE.SDK license and the AI Gateway key"
