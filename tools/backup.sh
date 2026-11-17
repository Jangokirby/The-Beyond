#!/bin/sh
# Makes a full local backup: the whole git history as one file, and the art. Nothing is uploaded.
# usage: tools/backup.sh [folder]   (default: ~/beyond-backups)
set -e
D="${1:-$HOME/beyond-backups}"; mkdir -p "$D"; T=$(date +%Y%m%d-%H%M)
cd "$(dirname "$0")/.."
git bundle create "$D/the-beyond-$T.bundle" --all
tar -czf "$D/the-beyond-art-$T.tar.gz" public/assets
echo "Saved to $D:"; ls -lh "$D" | tail -3
echo "To restore: git clone $D/the-beyond-$T.bundle the-beyond"
