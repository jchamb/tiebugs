"use client";

import { clsx } from "clsx";
import { useEffect, useRef } from "react";

import { useTheme } from "@/components/ThemeProvider";

export function TopographicBackground() {
	const svgRef = useRef<SVGSVGElement>(null);
	const seedRef = useRef(Math.floor(Math.random() * 100000));
	const { theme } = useTheme();

	useEffect(() => {
		const generateAndDraw = () => {
			if (!svgRef.current) return;

			const width = window.innerWidth;
			const height = window.innerHeight;
			const cellSize = 25;

			const cols = Math.ceil(width / cellSize) + 1;
			const rows = Math.ceil(height / cellSize) + 1;

			svgRef.current.setAttribute("viewBox", `0 0 ${width} ${height}`);

			// Generate height map
			const heightMap = generateHeightMap(cols, rows, seedRef.current);

			// Clear existing paths
			while (svgRef.current.firstChild) {
				svgRef.current.removeChild(svgRef.current.firstChild);
			}

			// Extract and draw contours at different thresholds
			const numContours = 10;
			for (let i = 0; i < numContours; i++) {
				const threshold = 0.3 + (i / numContours) * 0.4;
				const polylines = extractContour(heightMap, threshold, cellSize);
				const opacity = 0.08 + (i / numContours) * 0.12;

				for (const polyline of polylines) {
					const path = document.createElementNS(
						"http://www.w3.org/2000/svg",
						"path",
					);
					path.setAttribute("d", polylineToSmoothPath(polyline));
					path.setAttribute("fill", "none");
					path.setAttribute("stroke", "currentColor");
					path.setAttribute("stroke-width", "1.2");
					path.setAttribute("stroke-opacity", opacity.toString());
					path.setAttribute("stroke-linecap", "round");
					path.setAttribute("stroke-linejoin", "round");
					svgRef.current.appendChild(path);
				}
			}
		};

		generateAndDraw();

		let resizeTimeout: ReturnType<typeof setTimeout>;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(generateAndDraw, 100);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(resizeTimeout);
		};
	}, []);

	return (
		<svg
			ref={svgRef}
			className={clsx("pointer-events-none fixed inset-0 -z-10 h-full w-full", {
				"text-sage-300": theme === "light",
				"text-sage-600": theme === "dark",
			})}
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
		/>
	);
}

// Simple seeded random number generator
function seededRandom(seed: number): () => number {
	let s = seed;
	return () => {
		s = (s * 1103515245 + 12345) & 0x7fffffff;
		return s / 0x7fffffff;
	};
}

// Generate smooth 2D noise using value noise with interpolation
function generateHeightMap(
	cols: number,
	rows: number,
	seed: number,
): number[][] {
	const random = seededRandom(seed);
	const scale = 0.08;

	// Generate random gradients at integer points
	const gradients: Map<string, number> = new Map();
	const getGradient = (ix: number, iy: number): number => {
		const key = `${ix},${iy}`;
		if (!gradients.has(key)) {
			// Use a deterministic hash based on coordinates
			const hash = Math.sin(ix * 12.9898 + iy * 78.233 + seed) * 43758.5453123;
			gradients.set(key, hash - Math.floor(hash));
		}
		return gradients.get(key)!;
	};

	// Smooth interpolation (smootherstep)
	const fade = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10);
	const lerp = (a: number, b: number, t: number): number => a + t * (b - a);

	const noise = (x: number, y: number): number => {
		const x0 = Math.floor(x);
		const y0 = Math.floor(y);
		const x1 = x0 + 1;
		const y1 = y0 + 1;

		const sx = fade(x - x0);
		const sy = fade(y - y0);

		const n00 = getGradient(x0, y0);
		const n10 = getGradient(x1, y0);
		const n01 = getGradient(x0, y1);
		const n11 = getGradient(x1, y1);

		const nx0 = lerp(n00, n10, sx);
		const nx1 = lerp(n01, n11, sx);

		return lerp(nx0, nx1, sy);
	};

	// Multi-octave noise
	const fbm = (x: number, y: number): number => {
		let value = 0;
		let amplitude = 1;
		let frequency = 1;
		let maxValue = 0;

		for (let i = 0; i < 4; i++) {
			value += noise(x * frequency * scale, y * frequency * scale) * amplitude;
			maxValue += amplitude;
			amplitude *= 0.5;
			frequency *= 2;
		}

		return value / maxValue;
	};

	const heightMap: number[][] = [];
	for (let y = 0; y < rows; y++) {
		heightMap[y] = [];
		for (let x = 0; x < cols; x++) {
			heightMap[y][x] = fbm(x, y);
		}
	}

	return heightMap;
}

// Marching squares to extract contour lines
function extractContour(
	heightMap: number[][],
	threshold: number,
	cellSize: number,
): { x: number; y: number }[][] {
	const rows = heightMap.length;
	const cols = heightMap[0].length;
	const segments: [{ x: number; y: number }, { x: number; y: number }][] = [];

	const lerp = (a: number, b: number, t: number): number => a + t * (b - a);

	for (let y = 0; y < rows - 1; y++) {
		for (let x = 0; x < cols - 1; x++) {
			const v00 = heightMap[y][x];
			const v10 = heightMap[y][x + 1];
			const v01 = heightMap[y + 1][x];
			const v11 = heightMap[y + 1][x + 1];

			// Determine which corners are above threshold
			const b00 = v00 >= threshold ? 1 : 0;
			const b10 = v10 >= threshold ? 1 : 0;
			const b01 = v01 >= threshold ? 1 : 0;
			const b11 = v11 >= threshold ? 1 : 0;

			const state = b00 | (b10 << 1) | (b11 << 2) | (b01 << 3);

			if (state === 0 || state === 15) continue;

			// Calculate interpolated edge positions
			const px = x * cellSize;
			const py = y * cellSize;

			const topX =
				v00 !== v10
					? px + lerp(0, cellSize, (threshold - v00) / (v10 - v00))
					: px;
			const bottomX =
				v01 !== v11
					? px + lerp(0, cellSize, (threshold - v01) / (v11 - v01))
					: px;
			const leftY =
				v00 !== v01
					? py + lerp(0, cellSize, (threshold - v00) / (v01 - v00))
					: py;
			const rightY =
				v10 !== v11
					? py + lerp(0, cellSize, (threshold - v10) / (v11 - v10))
					: py;

			const top = { x: topX, y: py };
			const bottom = { x: bottomX, y: py + cellSize };
			const left = { x: px, y: leftY };
			const right = { x: px + cellSize, y: rightY };

			// Add line segments based on marching squares lookup
			const addSeg = (
				a: { x: number; y: number },
				b: { x: number; y: number },
			) => {
				segments.push([a, b]);
			};

			switch (state) {
				case 1:
					addSeg(top, left);
					break;
				case 2:
					addSeg(right, top);
					break;
				case 3:
					addSeg(right, left);
					break;
				case 4:
					addSeg(bottom, right);
					break;
				case 5:
					addSeg(top, left);
					addSeg(bottom, right);
					break;
				case 6:
					addSeg(bottom, top);
					break;
				case 7:
					addSeg(bottom, left);
					break;
				case 8:
					addSeg(left, bottom);
					break;
				case 9:
					addSeg(top, bottom);
					break;
				case 10:
					addSeg(left, top);
					addSeg(right, bottom);
					break;
				case 11:
					addSeg(right, bottom);
					break;
				case 12:
					addSeg(left, right);
					break;
				case 13:
					addSeg(top, right);
					break;
				case 14:
					addSeg(left, top);
					break;
			}
		}
	}

	// Join segments into polylines
	return joinSegmentsIntoPolylines(segments);
}

function joinSegmentsIntoPolylines(
	segments: [{ x: number; y: number }, { x: number; y: number }][],
): { x: number; y: number }[][] {
	if (segments.length === 0) return [];

	const eps = 0.5;
	const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
		Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

	const polylines: { x: number; y: number }[][] = [];
	const used = new Array(segments.length).fill(false);

	for (let i = 0; i < segments.length; i++) {
		if (used[i]) continue;

		used[i] = true;
		const polyline = [segments[i][0], segments[i][1]];

		let changed = true;
		while (changed) {
			changed = false;
			for (let j = 0; j < segments.length; j++) {
				if (used[j]) continue;

				const seg = segments[j];
				const start = polyline[0];
				const end = polyline[polyline.length - 1];

				if (dist(end, seg[0]) < eps) {
					polyline.push(seg[1]);
					used[j] = true;
					changed = true;
				} else if (dist(end, seg[1]) < eps) {
					polyline.push(seg[0]);
					used[j] = true;
					changed = true;
				} else if (dist(start, seg[1]) < eps) {
					polyline.unshift(seg[0]);
					used[j] = true;
					changed = true;
				} else if (dist(start, seg[0]) < eps) {
					polyline.unshift(seg[1]);
					used[j] = true;
					changed = true;
				}
			}
		}

		if (polyline.length >= 4) {
			polylines.push(polyline);
		}
	}

	return polylines;
}

// Convert polyline to smooth SVG path using Catmull-Rom to Bezier conversion
function polylineToSmoothPath(points: { x: number; y: number }[]): string {
	if (points.length < 2) return "";
	if (points.length === 2) {
		return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
	}

	const tension = 0.3;
	let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[Math.max(0, i - 1)];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = points[Math.min(points.length - 1, i + 2)];

		// Control points for cubic bezier
		const cp1x = p1.x + (p2.x - p0.x) * tension;
		const cp1y = p1.y + (p2.y - p0.y) * tension;
		const cp2x = p2.x - (p3.x - p1.x) * tension;
		const cp2y = p2.y - (p3.y - p1.y) * tension;

		d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
	}

	return d;
}
