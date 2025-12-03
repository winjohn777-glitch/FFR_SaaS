#!/usr/bin/env python3
import http.server
import socketserver
import urllib.request
import urllib.parse
from urllib.error import URLError

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        try:
            # Forward request to localhost:3000
            target_url = f"http://localhost:3000{self.path}"

            # Create request
            req = urllib.request.Request(target_url)

            # Copy headers from original request
            for header, value in self.headers.items():
                if header.lower() not in ['host']:
                    req.add_header(header, value)

            # Make request to React app
            with urllib.request.urlopen(req) as response:
                # Send response status
                self.send_response(response.status)

                # Copy response headers
                for header, value in response.headers.items():
                    if header.lower() not in ['server']:
                        self.send_header(header, value)
                self.end_headers()

                # Send response body
                self.wfile.write(response.read())

        except URLError as e:
            self.send_error(502, f"Bad Gateway: {e}")
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {e}")

    def do_POST(self):
        # Same logic for POST requests
        self.do_GET()

if __name__ == "__main__":
    PORT = 8000
    with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
        print(f"Proxy server running on port {PORT}")
        print(f"Forwarding to React app on localhost:3000")
        httpd.serve_forever()