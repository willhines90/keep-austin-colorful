#!/usr/bin/env bash
# Point the share-image and canonical URLs at your real domain.
# Run this once, after the first deploy, when you know the address.
#
#   ./set-domain.sh keep-austin-colorful.vercel.app
#   ./set-domain.sh keepaustincolorful.org
#
# Relative URLs already work on Facebook, X, LinkedIn and Slack. This is for
# the older clients that insist on an absolute one, and for the canonical tag.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: $0 <domain>    e.g. $0 keep-austin-colorful.vercel.app" >&2
  exit 1
fi

DOMAIN="${1#https://}"; DOMAIN="${DOMAIN#http://}"; DOMAIN="${DOMAIN%/}"
URL="https://${DOMAIN}"
FILE="index.html"

[ -f "$FILE" ] || { echo "no $FILE here; run this from the project root" >&2; exit 1; }

# absolute share image
perl -0pi -e "s{(<meta (?:property|name)=\"(?:og:image|twitter:image)\" content=\")[^\"]*(\")}{\$1${URL}/og.png\$2}g" "$FILE"

# canonical, added once if missing
if ! grep -q 'rel="canonical"' "$FILE"; then
  perl -0pi -e "s{(<meta name=\"description\")}{<link rel=\"canonical\" href=\"${URL}/\">\n\$1}" "$FILE"
else
  perl -0pi -e "s{(<link rel=\"canonical\" href=\")[^\"]*(\")}{\$1${URL}/\$2}" "$FILE"
fi

# og:url, added once if missing
if ! grep -q 'property="og:url"' "$FILE"; then
  perl -0pi -e "s{(<meta property=\"og:type\")}{<meta property=\"og:url\" content=\"${URL}/\">\n\$1}" "$FILE"
else
  perl -0pi -e "s{(<meta property=\"og:url\" content=\")[^\"]*(\")}{\$1${URL}/\$2}" "$FILE"
fi

echo "Set to ${URL}"
grep -o 'content="https://[^"]*og.png"' "$FILE" | head -1
echo
echo "Next:  git commit -am 'Point share URLs at ${DOMAIN}' && git push"
echo "Then check the card renders: https://www.opengraph.xyz/url/$(printf '%s' "${URL}" | sed 's/:/%3A/g; s/\//%2F/g')"
