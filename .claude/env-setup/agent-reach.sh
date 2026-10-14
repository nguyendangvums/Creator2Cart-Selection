#!/bin/bash
# Agent Reach (github.com/Panniantong/agent-reach) for every Claude Code cloud session.
# Paste into: cloud environment menu > Edit > Setup script.
# Installs the CLI into ~/.agent-reach-venv, exposes agent-reach and yt-dlp on PATH,
# and runs the core install (mcporter + Exa config + Claude Code skill in ~/.claude/skills).
# Never fails session start: every step is best effort.

AR_REF=94f06c1969dfc1834001269d79d3ad0972d9dee6   # pinned commit, bump deliberately
VENV="$HOME/.agent-reach-venv"

if [ ! -x "$VENV/bin/agent-reach" ]; then
  python3 -m venv "$VENV" \
    && "$VENV/bin/pip" install -q "git+https://github.com/Panniantong/agent-reach.git@${AR_REF}" \
    || echo "agent-reach: install failed" >&2
fi

mkdir -p "$HOME/.local/bin"
[ -x "$VENV/bin/agent-reach" ] && ln -sf "$VENV/bin/agent-reach" "$HOME/.local/bin/agent-reach"
[ -x "$VENV/bin/yt-dlp" ] && ln -sf "$VENV/bin/yt-dlp" "$HOME/.local/bin/yt-dlp"

if [ -x "$VENV/bin/agent-reach" ]; then
  PATH="$HOME/.local/bin:$PATH" "$VENV/bin/agent-reach" install --env=auto --system >/dev/null 2>&1 \
    || echo "agent-reach: core install reported problems; run 'agent-reach doctor'" >&2
fi

exit 0
