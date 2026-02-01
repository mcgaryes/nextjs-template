#!/bin/bash
# Post-scaffold: hook
# Usage: ./scripts/after-scaffold-hook.sh features/<feature>/hooks/use-<hook>.ts

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-hook-file>"
  echo "Example: $0 features/auth/hooks/use-user-session.ts"
  exit 1
fi

HOOK_PATH="$1"

echo "Running lint on $HOOK_PATH..."
pnpm lint "$HOOK_PATH"

echo "Running format on $HOOK_PATH..."
pnpm prettier --write "$HOOK_PATH"

echo "Post-scaffold complete for $HOOK_PATH"
