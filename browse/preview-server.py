"""Local static preview with byte ranges for video seeking. No dependencies."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import os
import re


class PreviewHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.byte_range = None
        target = Path(self.translate_path(self.path))
        request = self.headers.get('Range')
        if not request or not target.is_file():
            return super().send_head()
        size = target.stat().st_size
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', request.strip())
        if not match or not size or not any(match.groups()):
            self.send_error(416, 'Unsupported byte range')
            return None
        first, last = match.groups()
        start = int(first) if first else max(0, size - int(last))
        end = min(size - 1, int(last)) if first and last else size - 1
        if start >= size or end < start:
            self.send_response(416)
            self.send_header('Content-Range', 'bytes */' + str(size))
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        file = target.open('rb')
        self.byte_range = (start, end)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(target)))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Last-Modified', self.date_time_string(target.stat().st_mtime))
        self.end_headers()
        return file

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def copyfile(self, source, output):
        if self.byte_range is None:
            return super().copyfile(source, output)
        start, end = self.byte_range
        source.seek(start)
        remaining = end - start + 1
        while remaining:
            data = source.read(min(65536, remaining))
            if not data:
                break
            output.write(data)
            remaining -= len(data)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=5175)
    parser.add_argument('--bind', default='127.0.0.1')
    args = parser.parse_args()
    os.chdir(Path(__file__).resolve().parent.parent)
    print(f'Open http://{args.bind}:{args.port}/browse/tasks.html?lang=en&v=deep2a', flush=True)
    ThreadingHTTPServer((args.bind, args.port), PreviewHandler).serve_forever()
