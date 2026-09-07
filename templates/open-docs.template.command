#!/bin/bash
# Double-click launcher: serve the package root and open the docs hub.
# Works repeatedly: if the server is already up, just opens the page.
cd "$(dirname "$0")"

PORT={{PORT}}
URL="http://localhost:$PORT/docs/index.html"

if ! curl -s -o /dev/null --max-time 1 "$URL"; then
  nohup python3 -m http.server $PORT >/tmp/{{PROJECT}}-server.log 2>&1 &
  sleep 1
fi
open "$URL"
