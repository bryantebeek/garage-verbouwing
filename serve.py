# Serve the viewer on http://localhost:8765/ without browser caching, so model edits always show up.
import functools, http.server, pathlib

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

handler = functools.partial(NoCache, directory=pathlib.Path(__file__).parent)
http.server.ThreadingHTTPServer(('127.0.0.1', 8765), handler).serve_forever()
