// The "Getting there" map: the real terrain around Connestee Falls with brass
// contour lines, and the drive from the Dollar General on US 276 to the Clubhouse
// parking, by the East Fork Gate, drawn on in brass. Loaded only when the map
// nears the screen (GalaDirections.tsx), so the Gala page carries no three.js
// until then. Data: src/data/galaDirections.json (scripts/gala-directions/build.mjs).

import * as THREE from 'three';
import type { GalaDirectionsData } from './types';

export interface MapLabel {
  key: string;
  text: string;
  tone: 'ivory' | 'brass' | 'pink';
  at: [number, number]; // [lon, lat]
}

export interface SceneHandle {
  dispose: () => void;
}

const DRAW_MS = 3600;

export function createDirectionsScene(
  canvas: HTMLCanvasElement,
  labelLayer: HTMLElement,
  data: GalaDirectionsData,
  labels: MapLabel[],
  reduceMotion: boolean,
): SceneHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Local metres, then scaled so the map is 10 units across.
  const { bbox, grid } = data;
  const lat0 = (bbox.north + bbox.south) / 2;
  const lon0 = (bbox.east + bbox.west) / 2;
  const mPerLon = 111_320 * Math.cos((lat0 * Math.PI) / 180);
  const mPerLat = 110_540;
  const widthM = (bbox.east - bbox.west) * mPerLon;
  const depthM = (bbox.north - bbox.south) * mPerLat;
  const scale = 10 / widthM;
  const minE = Math.min(...grid.elevation);
  const EXAGGERATE = 1.7;
  const toX = (lon: number) => (lon - lon0) * mPerLon * scale;
  const toZ = (lat: number) => -(lat - lat0) * mPerLat * scale;

  // Bilinear height from the grid, in scene units.
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
    return ((top * (1 - ty) + bottom * ty) - minE) * scale * EXAGGERATE;
  };

  const scene = new THREE.Scene();

  // Terrain: a shaded relief with brass contour lines every 20 m.
  const terrainGeo = new THREE.PlaneGeometry(10, depthM * scale, grid.cols - 1, grid.rows - 1);
  terrainGeo.rotateX(-Math.PI / 2);
  const pos = terrainGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i += 1) {
    pos.setY(i, (grid.elevation[i] - minE) * scale * EXAGGERATE);
  }
  terrainGeo.computeVertexNormals();
  const terrainMat = new THREE.ShaderMaterial({
    uniforms: {
      uInterval: { value: 20 * scale * EXAGGERATE },
      uLight: { value: new THREE.Vector3(-0.5, 0.8, 0.35).normalize() },
      uMaxH: { value: (Math.max(...grid.elevation) - minE) * scale * EXAGGERATE },
      uHalf: { value: new THREE.Vector2(5, (depthM * scale) / 2) },
    },
    vertexShader: /* glsl */ `
      varying float vH;
      varying vec3 vNormal;
      varying vec2 vXZ;
      void main() {
        vH = position.y;
        vNormal = normal;
        vXZ = position.xz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uInterval;
      uniform vec3 uLight;
      uniform float uMaxH;
      uniform vec2 uHalf;
      varying float vH;
      varying vec3 vNormal;
      varying vec2 vXZ;
      void main() {
        float t = clamp(vH / uMaxH, 0.0, 1.0);
        vec3 low = vec3(0.075, 0.118, 0.18);
        vec3 high = vec3(0.16, 0.22, 0.26);
        vec3 base = mix(low, high, t);
        float lit = 0.55 + 0.6 * max(dot(normalize(vNormal), uLight), 0.0);
        vec3 col = base * lit;
        float f = vH / uInterval;
        float line = 1.0 - smoothstep(0.0, fwidth(f) * 1.2, abs(fract(f - 0.5) - 0.5));
        col = mix(col, vec3(0.85, 0.71, 0.42), line * 0.32);
        // Fade the edges into the night.
        float edge = smoothstep(0.0, 3.0, min(uHalf.x - abs(vXZ.x), uHalf.y - abs(vXZ.y)));
        gl_FragColor = vec4(col, edge);
      }
    `,
    transparent: true,
    extensions: { derivatives: true } as unknown as THREE.ShaderMaterialParameters['extensions'],
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  scene.add(terrain);

  const lift = 0.05;
  const toVec = ([lon, lat]: [number, number], extra = lift) => new THREE.Vector3(toX(lon), heightAt(lon, lat) + extra, toZ(lat));

  // The approach on US 276, from the main entrance (the turn not to take) to the
  // Dollar General: a quiet, thin ivory line, there from the start.
  const approachPts = data.approach.map((p) => toVec(p as [number, number], 0.04));
  const approach = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(approachPts, false, 'centripetal'), Math.max(80, approachPts.length * 2), 0.016, 5, false),
    new THREE.MeshBasicMaterial({ color: 0xf7f1e5, transparent: true, opacity: 0.5 }),
  );
  scene.add(approach);

  // The drive: a brass tube, drawn on.
  const drivePts = data.drive.map((p) => toVec(p as [number, number]));
  const curve = new THREE.CatmullRomCurve3(drivePts, false, 'centripetal');
  const tubular = Math.max(200, drivePts.length * 3);
  const radial = 6;
  const tubeGeo = new THREE.TubeGeometry(curve, tubular, 0.035, radial, false);
  const tubeMat = new THREE.MeshBasicMaterial({ color: 0xf1d9a0 });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  const totalIndex = tubeGeo.index ? tubeGeo.index.count : 0;
  tubeGeo.setDrawRange(0, reduceMotion ? totalIndex : 0);
  scene.add(tube);
  // A soft glow under the tube.
  const glow = new THREE.Mesh(
    new THREE.TubeGeometry(curve, tubular, 0.09, radial, false),
    new THREE.MeshBasicMaterial({ color: 0xd9b56a, transparent: true, opacity: 0.18, depthWrite: false }),
  );
  (glow.geometry as THREE.BufferGeometry).setDrawRange(0, reduceMotion ? totalIndex : 0);
  scene.add(glow);

  // Pins at each stop.
  const pinColor = { ivory: 0xf7f1e5, brass: 0xf1d9a0, pink: 0xe03694 } as const;
  const pins: { label: MapLabel; top: THREE.Vector3; el: HTMLElement }[] = [];
  for (const label of labels) {
    const base = toVec(label.at, 0);
    const height = label.tone === 'pink' ? 0.7 : 0.5;
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, height, 6),
      new THREE.MeshBasicMaterial({ color: pinColor[label.tone], transparent: true, opacity: 0.75 }),
    );
    stem.position.copy(base).add(new THREE.Vector3(0, height / 2, 0));
    scene.add(stem);
    const head = new THREE.Mesh(new THREE.SphereGeometry(label.tone === 'pink' ? 0.075 : 0.055, 16, 12), new THREE.MeshBasicMaterial({ color: pinColor[label.tone] }));
    head.position.copy(base).add(new THREE.Vector3(0, height, 0));
    scene.add(head);
    const el = document.createElement('span');
    el.className = `gala-dirmap-label is-${label.tone}`;
    el.textContent = label.text;
    labelLayer.appendChild(el);
    pins.push({ label, top: head.position.clone(), el });
  }

  // Camera: from the south-east, looking up the route toward the gate.
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  const sphere = new THREE.Sphere();
  new THREE.Box3().setFromPoints([...drivePts, ...approachPts]).getBoundingSphere(sphere);
  const target = sphere.center.clone();
  const viewDir = new THREE.Vector3(0.3, 0.62, 0.72).normalize();
  // Distance that fits the route's sphere in the frame, with room for the labels.
  const fitDistance = () => {
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    return (sphere.radius * 1.02) / Math.sin(Math.min(vFov, hFov) / 2);
  };
  const sway = { x: 0, y: 0, tx: 0, ty: 0 };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  };

  const placeLabels = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    for (const pin of pins) {
      const p = pin.top.clone().project(camera);
      // Keep every label inside the frame, even when its pin sits near an edge.
      const half = pin.el.offsetWidth / 2;
      const x = Math.min(Math.max(((p.x + 1) / 2) * w, half + 6), w - half - 6);
      pin.el.style.transform = `translate(-50%, -100%) translate(${x}px, ${((1 - p.y) / 2) * h - 8}px)`;
      pin.el.style.opacity = p.z < 1 ? '1' : '0';
    }
  };

  function render() {
    sway.x += (sway.tx - sway.x) * 0.08;
    sway.y += (sway.ty - sway.y) * 0.08;
    camera.position.copy(target).add(viewDir.clone().multiplyScalar(fitDistance())).add(new THREE.Vector3(sway.x * 0.9, sway.y * 0.5, 0));
    camera.lookAt(target);
    renderer.render(scene, camera);
    placeLabels();
  }

  // Animate only while drawing the route or settling after a pointer move.
  let frame = 0;
  let start = 0;
  let settleUntil = 0;
  const tick = (now: number) => {
    if (!start) start = now;
    const progress = reduceMotion ? 1 : Math.min(1, (now - start) / DRAW_MS);
    const eased = 1 - Math.pow(1 - progress, 3);
    const count = Math.floor((eased * totalIndex) / (radial * 6)) * radial * 6;
    tubeGeo.setDrawRange(0, count);
    (glow.geometry as THREE.BufferGeometry).setDrawRange(0, count);
    render();
    frame = progress < 1 || now < settleUntil ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const onPointer = (event: PointerEvent) => {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const rect = canvas.getBoundingClientRect();
    sway.tx = ((event.clientX - rect.left) / rect.width - 0.5) * -1;
    sway.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 1;
    settleUntil = performance.now() + 900;
    wake();
  };
  canvas.addEventListener('pointermove', onPointer);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  wake();

  return {
    dispose() {
      cancelAnimationFrame(frame);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onPointer);
      for (const pin of pins) pin.el.remove();
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
