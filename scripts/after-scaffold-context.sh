#!/bin/bash
# Post-scaffold: context
# Usage: ./scripts/after-scaffold-context.sh features/<feature>/contexts/<context>

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-context-directory>"
  echo "Example: $0 features/auth/contexts/user-session"
  exit 1
fi

CONTEXT_PATH="$1"

echo "Running lint on $CONTEXT_PATH..."
pnpm lint "$CONTEXT_PATH"

echo "Running format on $CONTEXT_PATH..."
pnpm prettier --write "$CONTEXT_PATH/**/*.ts*"

echo "Post-scaffold complete for $CONTEXT_PATH"
