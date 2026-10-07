#!/usr/bin/env bash
# Apply the reviewed rulesets after logging in with an administrator account.
set -euo pipefail
repo=deessaka/js-challenge
root="$(cd "$(dirname "$0")/.." && pwd)"
command -v gh >/dev/null || { echo "Install the official GitHub CLI first."; exit 1; }
gh auth status
admin="$(gh api "repos/$repo" --jq '.permissions.admin')"
test "$admin" = true || { echo "Administrator access is required."; exit 1; }
# Refuse activation until the checks have been installed on the default branch.
for path in .github/workflows/security.yml .github/CODEOWNERS; do
  gh api "repos/$repo/contents/$path?ref=main" --silent
done
for file in "$root"/.github/rulesets/*.json; do
  name="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["name"])' "$file")"
  current="$(gh api --paginate "repos/$repo/rulesets" --jq ".[] | select(.name == \"$name\") | .id")"
  if [[ -n "$current" ]]; then
    gh api --method PUT "repos/$repo/rulesets/$current" --input "$file" --silent
  else
    gh api --method POST "repos/$repo/rulesets" --input "$file" --silent
  fi
done
gh api --paginate "repos/$repo/rulesets" --jq '.[] | [.name, .enforcement] | @tsv'
echo "Verify environment approvals, Actions settings, and security features separately."
