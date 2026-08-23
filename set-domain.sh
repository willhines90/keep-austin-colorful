#!/usr/bin/env bash
# Point the whole site at a different domain.
#
#   ./set-domain.sh keepaustincolorful.com
#
# This used to patch public/index.html with perl. That was wrong twice over:
# public/*.html is generated, so the edit vanished on the next build, and it
# only ever touched one of the five pages. The domain now lives in exactly one
# place, and everything else is derived from it.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: $0 <domain>    e.g. $0 keepaustincolorful.com" >&2
  exit 1
fi

DOMAIN="${1#https://}"; DOMAIN="${DOMAIN#http://}"; DOMAIN="${DOMAIN%/}"
URL="https://${DOMAIN}"
SRC="tools/build-pages.js"

[ -f "$SRC" ] || { echo "no $SRC here; run this from the project root" >&2; exit 1; }

# the single source of truth for canonical, og:url and og:image on every page
perl -0pi -e "s{(const DEFAULT_DOMAIN = ')[^']*(')}{\$1${URL}\$2}" "$SRC"

if ! grep -q "const DEFAULT_DOMAIN = '${URL}'" "$SRC"; then
  echo "could not set DEFAULT_DOMAIN in $SRC; has it been renamed?" >&2
  exit 1
fi

echo "Set to ${URL}"
echo

# build:pages rewrites every page's canonical/og tags; build:meta then rewrites
# sitemap.xml, robots.txt and llms.txt from the canonical it finds there.
npm run build

echo
echo "Next:  npm test && git commit -am 'Point the site at ${DOMAIN}' && git push"
echo "Then check the card renders: https://www.opengraph.xyz/url/$(printf '%s' "${URL}" | sed 's/:/%3A/g; s/\//%2F/g')"
