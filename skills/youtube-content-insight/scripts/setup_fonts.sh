#!/usr/bin/env bash
# Installs Plus Jakarta Sans + Google Sans locally so LibreOffice QA renders true widths.
set -e
TMP=$(mktemp -d); cd "$TMP"
npm init -y >/dev/null 2>&1
npm i @fontsource/plus-jakarta-sans @fontsource/google-sans >/dev/null 2>&1
mkdir -p ~/.fonts
python3 - <<'PY'
from fontTools.ttLib import TTFont
import os
base='node_modules/@fontsource'
jobs=[('plus-jakarta-sans',['400','700','800']),('google-sans',['400','500','700'])]
for fam,ws in jobs:
    for w in ws:
        for st in ['normal','italic']:
            p=f'{base}/{fam}/files/{fam}-latin-{w}-{st}.woff'
            if not os.path.exists(p): continue
            f=TTFont(p); f.flavor=None
            f.save(os.path.expanduser(f'~/.fonts/{fam}-{w}-{st}.ttf'))
PY
fc-cache -f >/dev/null
fc-list | grep -ciE "jakarta|google sans" | xargs echo "font files installed:"
