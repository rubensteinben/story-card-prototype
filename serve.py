import http.server
import os

os.chdir("/Users/benrubenstein/Documents/Claude/Projects/Story Card")
httpd = http.server.HTTPServer(('', 7890), http.server.SimpleHTTPRequestHandler)
httpd.serve_forever()
