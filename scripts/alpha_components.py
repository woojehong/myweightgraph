"""Inspect or retain large connected alpha components in a raster asset."""
from argparse import ArgumentParser
from collections import deque
from pathlib import Path
from PIL import Image


def components(image: Image.Image, threshold: int):
    alpha = image.getchannel("A")
    width, height = image.size
    seen = bytearray(width * height)
    pixels = alpha.load()
    found = []
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if seen[index] or pixels[x, y] <= threshold:
                continue
            queue = deque([(x, y)])
            seen[index] = 1
            points = []
            while queue:
                px, py = queue.popleft()
                points.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        ni = ny * width + nx
                        if not seen[ni] and pixels[nx, ny] > threshold:
                            seen[ni] = 1
                            queue.append((nx, ny))
            found.append(points)
    return sorted(found, key=len, reverse=True)


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--out", type=Path)
    parser.add_argument("--threshold", type=int, default=64)
    parser.add_argument("--keep", type=int, default=1)
    args = parser.parse_args()
    image = Image.open(args.input).convert("RGBA")
    groups = components(image, args.threshold)
    for group in groups[:10]:
        xs, ys = zip(*group)
        print(len(group), (min(xs), min(ys), max(xs) + 1, max(ys) + 1))
    if args.out:
        keep = {point for group in groups[: args.keep] for point in group}
        pixels = image.load()
        for y in range(image.height):
            for x in range(image.width):
                if pixels[x, y][3] > args.threshold and (x, y) not in keep:
                    pixels[x, y] = (0, 0, 0, 0)
        image.save(args.out)
