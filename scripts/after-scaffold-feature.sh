#!/bin/bash
# Post-scaffold: feature
# Usage: ./scripts/after-scaffold-feature.sh features/<feature>

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-feature-directory>"
  echo "Example: $0 features/auth"
  exit 1
fi

FEATURE_PATH="$1"

echo "Running lint on $FEATURE_PATH..."
pnpm lint "$FEATURE_PATH"

echo "Running format on $FEATURE_PATH..."
pnpm prettier --write "$FEATURE_PATH/**/*.ts*"

echo "Post-scaffold complete for $FEATURE_PATH"
