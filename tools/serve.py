"""本地预览用的静态服务器：python3 tools/serve.py，然后打开 http://127.0.0.1:8765/bukit.html
（标准库自带的服务器不给 HTML 加 charset，中文会乱码，所以单独写一个）"""
import http.server, functools, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
H = http.server.SimpleHTTPRequestHandler
H.extensions_map.update({'.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.mp3': 'audio/mpeg'})
http.server.ThreadingHTTPServer(('127.0.0.1', 8765), functools.partial(H, directory=ROOT)).serve_forever()
