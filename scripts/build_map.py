"""Türkiye il sınırlarını sitenin kullandığı data/turkiye.js dosyasına dönüştürür.

Kaynak: github.com/cihadturhan/tr-geojson (© OpenStreetMap katkıda bulunanlar, ODbL)

Kullanım:
    python scripts/build_map.py tr-cities-utf8.json
"""
import json
import math
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data" / "turkiye.js"
LON0, LAT0, LAT_REF, SCALE = 25.6, 42.15, 39.0, 66.0
TOLERANCE = 0.9      # sadeleştirme eşiği (SVG piksel)
MIN_AREA = 6.0       # bundan küçük adacıklar atılır (SVG piksel²)


def project(lon, lat):
    return ((lon - LON0) * math.cos(math.radians(LAT_REF)) * SCALE, (LAT0 - lat) * SCALE)


def simplify(pts, tol):
    """Kapalı halka için Douglas–Peucker: halka ilk noktadan ve ona en uzak noktadan bölünür."""
    if pts[0] == pts[-1]:
        pts = pts[:-1]
    if len(pts) < 4:
        return pts
    far = max(range(len(pts)), key=lambda i: math.dist(pts[0], pts[i]))
    pts = pts + [pts[0]]
    keep = [False] * len(pts)
    keep[0] = keep[far] = keep[-1] = True
    stack = [(0, far), (far, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (ax, ay), (bx, by) = pts[a], pts[b]
        dx, dy = bx - ax, by - ay
        norm = math.hypot(dx, dy) or 1e-9
        best, idx = 0.0, None
        for i in range(a + 1, b):
            px, py = pts[i]
            d = abs(dy * px - dx * py + bx * ay - by * ax) / norm
            if d > best:
                best, idx = d, i
        if idx is not None and best > tol:
            keep[idx] = True
            stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(pts, keep) if k][:-1]


def area_centroid(pts):
    a = cx = cy = 0.0
    for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]):
        c = x1 * y2 - x2 * y1
        a += c
        cx += (x1 + x2) * c
        cy += (y1 + y2) * c
    a /= 2
    return abs(a), (cx / (6 * a), cy / (6 * a)) if a else pts[0]


def main(path):
    features = json.load(open(path, encoding="utf-8"))["features"]
    provinces, xs, ys = {}, [], []
    for f in features:
        polys = f["geometry"]["coordinates"]
        if f["geometry"]["type"] == "Polygon":
            polys = [polys]
        parts, biggest = [], (0, (0, 0))
        for poly in polys:
            ring = [project(lon, lat) for lon, lat in poly[0]]
            area, cen = area_centroid(ring)
            if area < MIN_AREA:
                continue
            biggest = max(biggest, (area, cen))
            ring = simplify(ring, TOLERANCE)
            xs += [x for x, _ in ring]
            ys += [y for _, y in ring]
            parts.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in ring) + "Z")
        provinces[f["properties"]["name"]] = ["".join(parts), round(biggest[1][0], 1), round(biggest[1][1], 1)]
    data = dict(w=math.ceil(max(xs)) + 2, h=math.ceil(max(ys)) + 2, p=provinces)
    OUT.write_text("// Otomatik üretildi: scripts/build_map.py · © OpenStreetMap katkıda bulunanlar (ODbL)\nwindow.TURKIYE="
                   + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    print(f"{OUT} yazıldı: {len(provinces)} il, {OUT.stat().st_size // 1024} KB, {data['w']}×{data['h']}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
