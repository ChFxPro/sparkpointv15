// The "Getting there" map, drawn like the navigation app guests use every day,
// already run: north up, night mode, the real roads and lakes over a soft relief
// of the terrain, and the route from the Dollar General on US 276 to the
// Clubhouse by the East Fork Gate. A car marker drives it while the camera
// follows, and the page's turn banner and trip bar update as it goes
// (GalaDirections.tsx). Loaded only when the map nears the screen, so the Gala
// page carries no three.js until then.
//
// Roads and route are drawn over the terrain without depth testing, as nav maps
// do, so no road ever sinks into a hillside.

import * as THREE from 'three';
import mapData from '../../data/galaDirectionsMap.json';
import type { GalaDirectionsData } from './types';

interface MapData {
  grid: { rows: number; cols: number; elevation: number[] };
  roads: { c: 'major' | 'minor' | 'local' | 'service'; n: string; name: string; p: number[][] }[];
  water: { n: string; p: number[][] }[];
  streams: { p: number[][] }[];
}

export interface NavState {
  /** 0–1 along the drive. */
  progress: number;
  /** Index into the page's maneuver list (0: East Fork Rd, 1: the gate, 2: arrive, 3: arrived). */
  step: number;
  /** Miles to the next maneuver, and to the end. */
  toNext: number;
  left: number;
  playing: boolean;
}

export interface SceneHandle {
  play: () => void;
  pause: () => void;
  replay: () => void;
  dispose: () => void;
}

export interface SceneLabel {
  text: string;
  kind: 'shield' | 'road' | 'poi' | 'gate' | 'destination' | 'quiet';
  at: [number, number];
}

const MAP = mapData as unknown as MapData;
const T_IN = 2200;
const T_DRIVE = 17000;
const T_OUT = 2400;
const MI = 1609.344;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createDirectionsScene(
  canvas: HTMLCanvasElement,
  overlay: HTMLElement,
  data: GalaDirectionsData,
  labels: SceneLabel[],
  options: { reduceMotion: boolean; onUpdate: (state: NavState) => void },
): SceneHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x0d1524);

  const { bbox } = data;
  const { grid } = MAP;
  const lat0 = (bbox.north + bbox.south) / 2;
  const lon0 = (bbox.east + bbox.west) / 2;
  const mPerLon = 111_320 * Math.cos((lat0 * Math.PI) / 180);
  const mPerLat = 110_540;
  const widthM = (bbox.east - bbox.west) * mPerLon;
  const depthM = (bbox.north - bbox.south) * mPerLat;
  const scale = 10 / widthM; // scene units per metre
  const minE = Math.min(...grid.elevation);
  const RELIEF = 0.9;
  const toX = (lon: number) => (lon - lon0) * mPerLon * scale;
  const toZ = (lat: number) => -(lat - lat0) * mPerLat * scale;
  const heightAt = (lon: number, lat: number) => {
    const fx = ((lon - bbox.west) / (bbox.east - bbox.west)) * (grid.cols - 1);
    const fy = ((bbox.north - lat) / (bbox.north - bbox.south)) * (grid.rows - 1);
    const x0 = Math.max(0, Math.min(grid.cols - 2, Math.floor(fx)));
    const y0 = Math.max(0, Math.min(grid.rows - 2, Math.floor(fy)));
    const tx = Math.min(1, Math.max(0, fx - x0));
    const ty = Math.min(1, Math.max(0, fy - y0));
    const e = (r: number, c: number) => grid.elevation[r * grid.cols + c];
    const top = e(y0, x0) * (1 - tx) + e(y0, x0 + 1) * tx;
    const bottom = e(y0 + 1, x0) * (1 - tx) + e(y0 + 1, x0 + 1) * tx;
    return (top * (1 - ty) + bottom * ty - minE) * scale * RELIEF;
  };
  const at = (lon: number, lat: number, lift = 0) => new THREE.Vector3(toX(lon), heightAt(lon, lat) + lift, toZ(lat));

  const scene = new THREE.Scene();
  let order = 0;
  const flat = (material: THREE.Material) => {
    material.depthTest = false;
    material.depthWrite = false;
    material.side = THREE.DoubleSide;
    return material;
  };
  const add = (mesh: THREE.Object3D) => {
    const rank = order++;
    mesh.traverse((child) => {
      child.renderOrder = rank;
    });
    scene.add(mesh);
    return mesh;
  };

  // Terrain: a soft night relief with faint contours, under everything.
  const terrainGeo = new THREE.PlaneGeometry(10, depthM * scale, grid.cols - 1, grid.rows - 1);
  terrainGeo.rotateX(-Math.PI / 2);
  const tPos = terrainGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < tPos.count; i += 1) tPos.setY(i, (grid.elevation[i] - minE) * scale * RELIEF);
  terrainGeo.computeVertexNormals();
  const terrain = new THREE.Mesh(
    terrainGeo,
    new THREE.ShaderMaterial({
      uniforms: {
        uInterval: { value: 20 * scale * RELIEF },
        uLight: { value: new THREE.Vector3(-0.6, 0.75, -0.3).normalize() },
        uMaxH: { value: (Math.max(...grid.elevation) - minE) * scale * RELIEF },
      },
      vertexShader: /* glsl */ `
        varying float vH;
        varying vec3 vNormal;
        void main() {
          vH = position.y;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uInterval;
        uniform vec3 uLight;
        uniform float uMaxH;
        varying float vH;
        varying vec3 vNormal;
        void main() {
          float t = clamp(vH / uMaxH, 0.0, 1.0);
          vec3 base = mix(vec3(0.067, 0.098, 0.153), vec3(0.11, 0.15, 0.2), t);
          float lit = 0.72 + 0.42 * dot(normalize(vNormal), uLight);
          vec3 col = base * lit;
          float f = vH / uInterval;
          float line = 1.0 - smoothstep(0.0, fwidth(f) * 1.1, abs(fract(f - 0.5) - 0.5));
          col = mix(col, vec3(0.85, 0.71, 0.42), line * 0.09);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }),
  );
  add(terrain);

  // A ribbon along a line, flat on the map, for roads, streams and the route.
  const ribbon = (points: THREE.Vector3[], width: number) => {
    const positions: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i < points.length; i += 1) {
      const prev = points[Math.max(0, i - 1)];
      const next = points[Math.min(points.length - 1, i + 1)];
      const dx = next.x - prev.x;
      const dz = next.z - prev.z;
      const len = Math.hypot(dx, dz) || 1;
      const nx = (-dz / len) * (width / 2);
      const nz = (dx / len) * (width / 2);
      const p = points[i];
      positions.push(p.x + nx, p.y, p.z + nz, p.x - nx, p.y, p.z - nz);
      if (i < points.length - 1) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    return geo;
  };
  // Round end caps where lines meet, so joins read as continuous roads.
  const caps = (points: THREE.Vector3[], radius: number, material: THREE.Material) => {
    const group = new THREE.Group();
    const disc = new THREE.CircleGeometry(radius, 12).rotateX(-Math.PI / 2);
    for (const p of [points[0], points[points.length - 1]]) {
      const m = new THREE.Mesh(disc, material);
      m.position.copy(p);
      group.add(m);
    }
    return group;
  };
  const line = (coords: number[][], lift = 0) => coords.map(([lon, lat]) => at(lon, lat, lift));

  // Water: lakes filled, streams as thin lines.
  const waterMat = flat(new THREE.MeshBasicMaterial({ color: 0x1b3352 }));
  for (const lake of MAP.water) {
    if (lake.p.length < 4) continue;
    const shape = new THREE.Shape(lake.p.map(([lon, lat]) => new THREE.Vector2(toX(lon), -toZ(lat))));
    const geo = new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2);
    const h = Math.min(...lake.p.map(([lon, lat]) => heightAt(lon, lat)));
    const mesh = new THREE.Mesh(geo, waterMat);
    mesh.position.y = h;
    add(mesh);
  }
  for (const stream of MAP.streams) add(new THREE.Mesh(ribbon(line(stream.p), 0.012), waterMat));

  // Roads, nav-style: a dark casing under each class, then the fills, minor to major.
  const ROAD = {
    service: { w: 0.016, fill: 0x2c3850, casing: 0x0b111c },
    local: { w: 0.026, fill: 0x3a4862, casing: 0x0b111c },
    minor: { w: 0.036, fill: 0x56637c, casing: 0x0b111c },
    major: { w: 0.05, fill: 0x8f8466, casing: 0x0b111c },
  } as const;
  const classes = ['service', 'local', 'minor', 'major'] as const;
  for (const pass of ['casing', 'fill'] as const) {
    for (const c of classes) {
      const style = ROAD[c];
      const material = flat(new THREE.MeshBasicMaterial({ color: pass === 'casing' ? style.casing : style.fill }));
      const width = pass === 'casing' ? style.w + 0.014 : style.w;
      for (const road of MAP.roads) {
        if (road.c !== c || road.p.length < 2) continue;
        const pts = line(road.p);
        add(new THREE.Mesh(ribbon(pts, width), material));
        // Round ends only on the major roads; on the many short local ways they
        // showed as dots along the route.
        if (c === 'major' || c === 'minor') add(caps(pts, width / 2, material));
      }
    }
  }

  // The route: densified so the car moves smoothly, with a glow, a dark casing
  // and a brass line; the part already driven turns grey, as in a nav app.
  const raw = data.drive.map(([lon, lat]) => at(lon, lat));
  const route: THREE.Vector3[] = [];
  const lonlat: [number, number][] = [];
  for (let i = 0; i < raw.length - 1; i += 1) {
    const steps = Math.max(1, Math.ceil(raw[i].distanceTo(raw[i + 1]) / 0.01));
    for (let k = 0; k < steps; k += 1) {
      const t = k / steps;
      const lon = data.drive[i][0] + (data.drive[i + 1][0] - data.drive[i][0]) * t;
      const lat = data.drive[i][1] + (data.drive[i + 1][1] - data.drive[i][1]) * t;
      route.push(at(lon, lat));
      lonlat.push([lon, lat]);
    }
  }
  route.push(raw[raw.length - 1]);
  lonlat.push(data.drive[data.drive.length - 1] as [number, number]);
  const cum = [0];
  for (let i = 1; i < route.length; i += 1) cum.push(cum[i - 1] + route[i].distanceTo(route[i - 1]));
  const total = cum[cum.length - 1];
  const metresPerUnit = 1 / scale;

  add(new THREE.Mesh(ribbon(route, 0.13), flat(new THREE.MeshBasicMaterial({ color: 0xd9b56a, transparent: true, opacity: 0.16 }))));
  const casingMat = flat(new THREE.MeshBasicMaterial({ color: 0x0b1322 }));
  add(new THREE.Mesh(ribbon(route, 0.078), casingMat));
  add(caps(route, 0.039, casingMat));
  const routeMat = flat(new THREE.MeshBasicMaterial({ color: 0xf1d9a0 }));
  add(new THREE.Mesh(ribbon(route, 0.054), routeMat));
  add(caps(route, 0.027, routeMat));
  const drivenGeo = ribbon(route, 0.056);
  drivenGeo.setDrawRange(0, 0);
  add(new THREE.Mesh(drivenGeo, flat(new THREE.MeshBasicMaterial({ color: 0x7a7f8c }))));

  // Maneuver points along the route: the East Fork Rd turn, the gate, the end.
  const nearest = ([lon, lat]: [number, number]) => {
    const target = at(lon, lat);
    let best = 0;
    let bestD = Infinity;
    route.forEach((p, i) => {
      const d = Math.hypot(p.x - target.x, p.z - target.z);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return cum[best];
  };
  const maneuvers = [nearest(data.places.eastForkTurn), nearest(data.places.gate), total];

  // Labels and the car, as page elements over the canvas so their type stays crisp.
  const labelEls = labels.map((label) => {
    const el = document.createElement('span');
    el.className = `gala-nav-label is-${label.kind}`;
    el.textContent = label.text;
    overlay.appendChild(el);
    return { label, el, pos: at(label.at[0], label.at[1]) };
  });
  const puck = document.createElement('span');
  puck.className = 'gala-nav-puck';
  puck.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"/><path d="M20 8 L29 30 L20 25 L11 30 Z"/></svg>';
  overlay.appendChild(puck);

  // Camera: north up, looking down with a slight tilt so the hills read.
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 200);
  const TILT = (24 * Math.PI) / 180;
  const sphere = new THREE.Sphere();
  new THREE.Box3().setFromPoints([...route, ...data.approach.map(([lon, lat]) => at(lon, lat))]).getBoundingSphere(sphere);
  const overviewDistance = () => {
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    return (sphere.radius * 1.12) / Math.sin(Math.min(vFov, hFov) / 2);
  };
  const followDistance = () => Math.max(1.5, overviewDistance() * 0.42);
  const view = { target: sphere.center.clone(), distance: 10 };
  const place = () => {
    camera.position.set(view.target.x, view.target.y + view.distance * Math.cos(TILT), view.target.z + view.distance * Math.sin(TILT));
    camera.lookAt(view.target);
  };

  const pointAt = (s: number) => {
    const d = Math.min(Math.max(s, 0), total);
    let i = 1;
    while (i < cum.length - 1 && cum[i] < d) i += 1;
    const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    return { pos: route[i - 1].clone().lerp(route[i], t), index: i - 1 + t };
  };

  const project = (v: THREE.Vector3) => {
    const p = v.clone().project(camera);
    return [((p.x + 1) / 2) * canvas.clientWidth, ((1 - p.y) / 2) * canvas.clientHeight, p.z] as const;
  };

  let distance = 0; // scene units along the route
  let clock = 0; // ms into the timeline
  const draw = () => {
    place();
    renderer.render(scene, camera);
    const w = canvas.clientWidth;
    // Labels hide under the turn banner and the trip bar, measured as laid out.
    const frame = canvas.getBoundingClientRect();
    const banner = canvas.parentElement?.querySelector('.gala-nav-banner')?.getBoundingClientRect();
    const trip = canvas.parentElement?.querySelector('.gala-nav-trip')?.getBoundingClientRect();
    const safeTop = banner ? banner.bottom - frame.top + 8 : 96;
    const safeBottom = trip ? trip.top - frame.top - 8 : canvas.clientHeight - 92;
    for (const item of labelEls) {
      const [x, y, z] = project(item.pos);
      const half = item.el.offsetWidth / 2;
      const cx = Math.min(Math.max(x, half + 6), w - half - 6);
      item.el.style.transform = `translate(-50%, -50%) translate(${cx}px, ${y}px)`;
      item.el.style.opacity = z < 1 && y > safeTop && y < safeBottom ? '1' : '0';
    }
    const car = pointAt(distance);
    const ahead = pointAt(distance + 0.04);
    const [cx, cy] = project(car.pos);
    const [ax, ay] = project(ahead.pos);
    const heading = (Math.atan2(ax - cx, -(ay - cy)) * 180) / Math.PI;
    puck.style.transform = `translate(-50%, -50%) translate(${cx}px, ${cy}px) rotate(${heading}deg)`;
    // Driven road turns grey; back in the overview at the end, the whole route shows again.
    const finished = clock >= T_IN + T_DRIVE + T_OUT;
    drivenGeo.setDrawRange(0, finished ? 0 : Math.floor(car.index) * 6);
  };

  const report = (playing: boolean) => {
    const step = distance >= total - 1e-6 ? 3 : maneuvers.findIndex((m) => m > distance + 1e-6);
    const next = step >= 3 ? total : maneuvers[step];
    options.onUpdate({
      progress: distance / total,
      step,
      toNext: ((next - distance) * metresPerUnit) / MI,
      left: ((total - distance) * metresPerUnit) / MI,
      playing,
    });
  };

  // Timeline: glide in from the overview, drive, glide back out.
  let raf = 0;
  let playing = false;
  let last = 0;
  const overview = () => ({ target: sphere.center.clone(), distance: overviewDistance() });
  const frame = (now: number) => {
    const dt = last ? now - last : 0;
    last = now;
    if (playing) clock += dt;
    const ov = overview();
    if (clock < T_IN) {
      const t = ease(clock / T_IN);
      distance = 0;
      view.target.lerpVectors(ov.target, pointAt(0).pos, t);
      view.distance = ov.distance + (followDistance() - ov.distance) * t;
    } else if (clock < T_IN + T_DRIVE) {
      const t = (clock - T_IN) / T_DRIVE;
      distance = total * (t < 0.04 ? t * t * 12.5 : t > 0.96 ? 1 - (1 - t) * (1 - t) * 12.5 : t);
      view.target.lerp(pointAt(distance).pos, 0.12);
      view.distance = followDistance();
    } else {
      const t = ease(Math.min(1, (clock - T_IN - T_DRIVE) / T_OUT));
      distance = total;
      view.target.lerpVectors(pointAt(total).pos, ov.target, t);
      view.distance = followDistance() + (ov.distance - followDistance()) * t;
      if (t >= 1) playing = false;
    }
    draw();
    report(playing);
    raf = playing ? requestAnimationFrame(frame) : 0;
    if (!playing) last = 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (!playing) {
      if (clock === 0) {
        const ov = overview();
        view.target.copy(ov.target);
        view.distance = ov.distance;
      }
      draw();
    }
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  report(false);

  return {
    play() {
      if (clock >= T_IN + T_DRIVE + T_OUT) clock = 0;
      playing = true;
      last = 0;
      kick();
    },
    pause() {
      playing = false;
      report(false);
    },
    replay() {
      clock = 0;
      distance = 0;
      playing = true;
      last = 0;
      kick();
    },
    dispose() {
      playing = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      labelEls.forEach((item) => item.el.remove());
      puck.remove();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
    },
  };
}
