#!/bin/bash
# Post-scaffold: component
# Usage: ./scripts/after-scaffold-component.sh features/<feature>/components/<component>

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-component-directory>"
  echo "Example: $0 features/auth/components/login-form"
  exit 1
fi

COMPONENT_PATH="$1"

echo "Running lint on $COMPONENT_PATH..."
pnpm lint "$COMPONENT_PATH"

echo "Running format on $COMPONENT_PATH..."
pnpm prettier --write "$COMPONENT_PATH/**/*.ts*"

echo "Post-scaffold complete for $COMPONENT_PATH"
