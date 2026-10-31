"""
Serves the project root for scripts/stills.html and accepts the images it
renders: WebP stills for the site go to public/3d/, PNG copies for the
Open Graph images (whose renderer cannot read WebP) go to assets/og/.

    python scripts/stills-server.py
    then open http://127.0.0.1:4174/scripts/stills.html

Local only: binds to 127.0.0.1 and accepts nothing but *.webp and *.png names.
"""

import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = {"webp": ROOT / "public" / "3d", "png": ROOT / "assets" / "og"}
NAME = re.compile(r"^/save/([a-z0-9-]+\.(webp|png))$")


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".js": "text/javascript"}

    def do_POST(self):
        match = NAME.match(self.path)
        if not match:
            self.send_error(400, "expected /save/<name>.webp or .png")
            return
        length = int(self.headers.get("Content-Length", 0))
        out = OUT[match.group(2)]
        out.mkdir(parents=True, exist_ok=True)
        (out / match.group(1)).write_bytes(self.rfile.read(length))
        self.send_response(204)
        self.end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 4174), partial(Handler, directory=str(ROOT)))
    print("http://127.0.0.1:4174/scripts/stills.html")
    server.serve_forever()
