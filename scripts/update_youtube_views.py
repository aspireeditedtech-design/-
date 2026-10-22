#!/usr/bin/env python3
"""Refresh public YouTube video view counts for the static GitHub Pages site.
Requires YOUTUBE_API_KEY environment variable (GitHub Actions secret).
"""
import json
import os
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'data' / 'youtube-views.json'
PATTERN = re.compile(r'^[a-zA-Z0-9_-]{11}$')

class VideoIds(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for name in ('data-id', 'data-home-youtube-id', 'data-view-id'):
            v = a.get(name, '')
            if PATTERN.fullmatch(v):
                self.ids.add(v)

api_key = os.environ.get('YOUTUBE_API_KEY', '').strip()
if not api_key:
    print('No YOUTUBE_API_KEY secret configured; retaining existing cached views.')
    raise SystemExit(0)

parser = VideoIds()
for filename in ('index.html', 'gallery.html'):
    parser.feed((ROOT / filename).read_text(encoding='utf-8'))
ids = sorted(parser.ids)
if not ids:
    raise SystemExit('No YouTube video IDs found')

try:
    previous = json.loads(OUT.read_text(encoding='utf-8'))
except (OSError, json.JSONDecodeError):
    previous = {'videos':{}}
old = previous.get('videos', {})
result = {}
for i in range(0, len(ids), 50):
    group = ids[i:i+50]
    params = urlencode({'part':'statistics,snippet','id':','.join(group),'key':api_key,'maxResults':50})
    req = Request('https://www.googleapis.com/youtube/v3/videos?' + params, headers={'User-Agent':'IrfanPortfolioViewSync/1.0'})
    with urlopen(req, timeout=30) as resp:
        payload = json.load(resp)
    for item in payload.get('items', []):
        vid = item.get('id')
        raw = item.get('statistics',{}).get('viewCount')
        if not PATTERN.fullmatch(vid or '') or raw is None: continue
        try: count = int(raw)
        except (ValueError, TypeError): continue
        result[vid] = {'views':count, 'title':item.get('snippet',{}).get('title','')}

# Retain prior counts if an individual video is temporarily unavailable.
for vid in ids:
    if vid not in result and vid in old: result[vid] = old[vid]

payload = {'updated_at':datetime.now(timezone.utc).isoformat(timespec='seconds'), 'videos':result}
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Updated {len(result)} of {len(ids)} video view counts')
