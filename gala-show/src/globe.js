// The live gold globe. One WebGL scene sits behind every page; each page asks
// for a pose (where the globe sits, how big, how bright, what it faces) and
// the globe eases there, so it carries across page changes instead of
// reappearing. Trip pages also ask for a route: an arc drawn from Brevard to
// the destination while the globe turns to show both ends.
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LAND } from './generated/land.js';

export const HOME = { lat: 35.23, lon: -82.73 }; // Brevard, NC

const BRASS = new THREE.Color('#d9b56a');
const BRASS_LIGHT = new THREE.Color('#f1d9a0');
const PINK = new THREE.Color('#e03694');
const STAGE_W = 1920;
const STAGE_H = 1080;

// A long lens: with the globe off to one side, a wide one skews which side
// faces the room and slides destinations towards the edge.
const FOV = 8;
const CAM_Z = 40;
// World units per stage pixel on the z=0 plane.
const K = (2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))) / STAGE_H;

/** Unit vector for a lat/lon, with lon 0 facing the camera (+z) and north up. */
export function toVec(lat, lon, r = 1) {
  const φ = THREE.MathUtils.degToRad(lat);
  const θ = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(r * Math.cos(φ) * Math.sin(θ), r * Math.sin(φ), r * Math.cos(φ) * Math.cos(θ));
}

function fromVec(v) {
  const n = v.clone().normalize();
  return {
    lat: THREE.MathUtils.radToDeg(Math.asin(n.y)),
    lon: THREE.MathUtils.radToDeg(Math.atan2(n.x, n.z)),
  };
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const wrap = (d) => ((((d + 180) % 360) + 360) % 360) - 180;

export function createGlobe(canvas, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, STAGE_W / STAGE_H, 1, 200);
  camera.position.set(0, 0, CAM_Z);

  // pivot: placement and size on the stage. spin: which way the earth faces.
  const pivot = new THREE.Group();
  const spin = new THREE.Group();
  spin.rotation.order = 'XYZ';
  pivot.add(spin);
  scene.add(pivot);

  const fadeables = []; // [material, baseOpacity]
  const track = (m, base) => {
    m.transparent = true;
    fadeables.push([m, base]);
    return m;
  };

  // Ocean: a deep night sphere with a brass rim light.
  const ocean = new THREE.Mesh(
    new THREE.SphereGeometry(0.995, 96, 64),
    track(
      new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: 1 }, uRim: { value: BRASS } },
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform float uOpacity; uniform vec3 uRim; varying vec3 vN; varying vec3 vV;
          void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.6);
            vec3 base = mix(vec3(0.035,0.06,0.11), vec3(0.06,0.09,0.16), vN.y*0.5+0.5);
            gl_FragColor = vec4(base + uRim*f*0.55, uOpacity*0.92); }`,
      }),
      1
    )
  );
  spin.add(ocean);
  // Every layer is see-through, and three.js would otherwise sort them by
  // their centres, which lets the ocean paint over the land when the globe
  // tips south. Draw order is fixed instead.
  ocean.renderOrder = 0;

  // Halo: a soft brass glow just outside the edge.
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(1.18, 64, 48),
    track(
      new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: 1 }, uColor: { value: BRASS } },
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform float uOpacity; uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
          void main(){ float d = dot(vN, vV); float g = smoothstep(0.0, 0.55, -d) * smoothstep(1.0, 0.35, -d);
            gl_FragColor = vec4(uColor, g*0.32*uOpacity); }`,
      }),
      1
    )
  );
  halo.renderOrder = -1;
  pivot.add(halo); // on the pivot so it never spins

  // Graticule: thin brass lines every 30°, like the lockup's drawn globe.
  const grat = [];
  const seg = 128;
  for (let lat = -60; lat <= 60; lat += 30) {
    for (let i = 0; i < seg; i++) {
      const a = toVec(lat, (i / seg) * 360 - 180, 1.002);
      const b = toVec(lat, ((i + 1) / seg) * 360 - 180, 1.002);
      grat.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  for (let lon = -180; lon < 180; lon += 30) {
    for (let i = 0; i < seg / 2; i++) {
      const a = toVec((i / (seg / 2)) * 180 - 90, lon, 1.002);
      const b = toVec(((i + 1) / (seg / 2)) * 180 - 90, lon, 1.002);
      grat.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  const gratGeo = new THREE.BufferGeometry();
  gratGeo.setAttribute('position', new THREE.Float32BufferAttribute(grat, 3));
  const graticule = new THREE.LineSegments(gratGeo, track(new THREE.LineBasicMaterial({ color: BRASS, depthWrite: false }), 0.16));
  graticule.renderOrder = 1;
  spin.add(graticule);

  // Land: the same dot field as the site's route map, wrapped onto the sphere.
  const landPos = [];
  for (let i = 0; i < LAND.length; i += 2) {
    const v = toVec(LAND[i + 1], LAND[i], 1.004);
    landPos.push(v.x, v.y, v.z);
  }
  const landGeo = new THREE.BufferGeometry();
  landGeo.setAttribute('position', new THREE.Float32BufferAttribute(landPos, 3));
  const landMat = track(
    new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 1 }, uColor: { value: BRASS_LIGHT }, uSize: { value: 4 } },
      depthWrite: false,
      vertexShader: `uniform float uSize; varying float vFace;
        void main(){ vec4 mv = modelViewMatrix*vec4(position,1.);
          vec3 n = normalize(normalMatrix*normalize(position)); vFace = dot(n, normalize(-mv.xyz));
          gl_PointSize = uSize; gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform float uOpacity; uniform vec3 uColor; varying float vFace;
        void main(){ if (vFace < 0.0) discard; vec2 c = gl_PointCoord-0.5; float d = length(c); if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.3, d) * (0.35 + 0.65*smoothstep(0.0, 0.5, vFace));
          gl_FragColor = vec4(uColor, a*uOpacity*0.9); }`,
    }),
    1
  );
  const land = new THREE.Points(landGeo, landMat);
  land.renderOrder = 2;
  spin.add(land);

  // Home: a pink pin at Brevard with a slow pulse.
  const homeGroup = new THREE.Group();
  const homeV = toVec(HOME.lat, HOME.lon, 1.006);
  homeGroup.position.copy(homeV);
  homeGroup.lookAt(homeV.clone().multiplyScalar(2));
  const homeDot = new THREE.Mesh(new THREE.CircleGeometry(0.014, 24), track(new THREE.MeshBasicMaterial({ color: PINK, depthWrite: false }), 1));
  const homeRing = new THREE.Mesh(
    new THREE.RingGeometry(0.02, 0.026, 48),
    track(new THREE.MeshBasicMaterial({ color: PINK, depthWrite: false, side: THREE.DoubleSide }), 0.8)
  );
  homeGroup.add(homeDot, homeRing);
  homeDot.renderOrder = homeRing.renderOrder = 5;
  spin.add(homeGroup);

  // Route: the arc, a travelling spark at its head, and a ring at the far end.
  const routeMat = new LineMaterial({ color: BRASS_LIGHT, linewidth: 3, transparent: true, depthWrite: false, worldUnits: false });
  routeMat.resolution.set(STAGE_W, STAGE_H);
  let routeLine = null;
  let routePts = [];
  const spark = new THREE.Mesh(new THREE.SphereGeometry(0.014, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
  const destGroup = new THREE.Group();
  const destRing = new THREE.Mesh(
    new THREE.RingGeometry(0.03, 0.038, 48),
    new THREE.MeshBasicMaterial({ color: BRASS_LIGHT, transparent: true, depthWrite: false, side: THREE.DoubleSide })
  );
  const destDot = new THREE.Mesh(new THREE.CircleGeometry(0.016, 24), new THREE.MeshBasicMaterial({ color: BRASS_LIGHT, transparent: true, depthWrite: false }));
  destGroup.add(destRing, destDot);
  destRing.renderOrder = destDot.renderOrder = 5;
  spark.renderOrder = 6;
  spin.add(spark, destGroup);
  spark.visible = false;
  destGroup.visible = false;

  function buildRoute(dest) {
    if (routeLine) {
      spin.remove(routeLine);
      routeLine.geometry.dispose();
      routeLine = null;
    }
    if (!dest) {
      routePts = [];
      return;
    }
    const a = toVec(HOME.lat, HOME.lon);
    const b = toVec(dest.lat, dest.lon);
    const angle = a.angleTo(b);
    const lift = 0.08 + 0.2 * (angle / Math.PI);
    const n = 160;
    routePts = [];
    const flat = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const p = slerp(a, b, t).multiplyScalar(1.006 + lift * Math.sin(Math.PI * t));
      routePts.push(p);
      flat.push(p.x, p.y, p.z);
    }
    const geo = new LineGeometry();
    geo.setPositions(flat);
    routeLine = new Line2(geo, routeMat);
    routeLine.renderOrder = 4;
    routeLine.computeLineDistances();
    geo.instanceCount = 0;
    spin.add(routeLine);
    const dv = toVec(dest.lat, dest.lon, 1.007);
    destGroup.position.copy(dv);
    destGroup.lookAt(dv.clone().multiplyScalar(2));
  }

  function slerp(a, b, t) {
    const ang = a.angleTo(b);
    if (ang < 1e-5) return a.clone();
    const s = Math.sin(ang);
    return a
      .clone()
      .multiplyScalar(Math.sin((1 - t) * ang) / s)
      .add(b.clone().multiplyScalar(Math.sin(t * ang) / s));
  }

  // --- Pose -------------------------------------------------------------
  // x, y: centre on the 1920×1080 stage; r: radius in stage px;
  // opacity: 0–1; view: {lat, lon} facing the camera; spin: idle turn (deg/s).
  const cur = { x: 960, y: 540, r: 380, opacity: 0, lat: 20, lon: -40, spin: 4 };
  let from = { ...cur };
  let to = { ...cur };
  let t0 = 0;
  let dur = 1;
  let route = null; // { dest, start }
  let lastTime = performance.now();

  function setPose(pose, { instant = false, route: dest = null } = {}) {
    from = { ...cur };
    to = { ...cur, ...pose };
    if (dest) {
      // Face a point between home and the destination so both ends show;
      // lean towards the destination when they're far apart.
      const a = toVec(HOME.lat, HOME.lon);
      const b = toVec(dest.lat, dest.lon);
      // Past ~140° apart both ends can't show at once, so favour the destination.
      const far = a.angleTo(b) > THREE.MathUtils.degToRad(140);
      const mid = fromVec(slerp(a, b, far ? 0.75 : 0.55));
      to.lat = THREE.MathUtils.clamp(mid.lat - 4, -50, 60);
      to.lon = mid.lon;
      to.spin = 0;
    }
    // Turn the short way round.
    to.lon = from.lon + wrap(to.lon - from.lon);
    t0 = performance.now();
    dur = instant || reducedMotion ? 0 : 1700;
    const sameDest = route && dest && route.dest.lat === dest.lat && route.dest.lon === dest.lon;
    if (!sameDest) {
      buildRoute(dest);
      route = dest ? { dest, start: t0 + (instant || reducedMotion ? 0 : dur * 0.8) } : null;
    }
  }

  function resize(w, h) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    routeMat.resolution.set(w, h);
    landMat.uniforms.uSize.value = Math.max(2, 4.2 * (h / STAGE_H) * Math.min(window.devicePixelRatio || 1, 2));
  }

  function frame(now) {
    const dt = Math.min(0.1, (now - lastTime) / 1000);
    lastTime = now;
    const p = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
    const e = ease(p);
    for (const k of ['x', 'y', 'r', 'opacity', 'lat', 'spin']) cur[k] = from[k] + (to[k] - from[k]) * e;
    // Idle spin keeps going underneath the tween.
    if (!reducedMotion && to.spin) {
      to.lon -= to.spin * dt;
      from.lon -= to.spin * dt;
    }
    cur.lon = from.lon + (to.lon - from.lon) * e;

    pivot.position.set((cur.x - STAGE_W / 2) * K, (STAGE_H / 2 - cur.y) * K, 0);
    pivot.scale.setScalar(Math.max(cur.r, 0.001) * K);
    spin.rotation.set(THREE.MathUtils.degToRad(cur.lat), THREE.MathUtils.degToRad(-cur.lon), 0);

    for (const [m, base] of fadeables) {
      if (m.uniforms && m.uniforms.uOpacity) m.uniforms.uOpacity.value = cur.opacity;
      else m.opacity = base * cur.opacity;
    }
    const pulse = reducedMotion ? 0.5 : (now / 2200) % 1;
    homeRing.scale.setScalar(1 + pulse * 1.6);
    homeRing.material.opacity = 0.8 * (1 - pulse) * cur.opacity;

    // Route drawing.
    if (route && routeLine) {
      const rp = Math.max(0, Math.min(1, (now - route.start) / (reducedMotion ? 1 : 2600)));
      const re = ease(rp);
      const count = Math.round(re * (routePts.length - 1));
      routeLine.geometry.instanceCount = count;
      routeMat.opacity = cur.opacity;
      spark.visible = rp > 0 && rp < 1;
      if (spark.visible) spark.position.copy(routePts[Math.max(0, count)]);
      spark.material.opacity = cur.opacity;
      destGroup.visible = rp >= 1;
      if (destGroup.visible) {
        const since = (now - route.start - 2600) / 1000;
        const pop = reducedMotion ? 1 : Math.min(1, since * 3);
        const throb = reducedMotion ? 1 : 1 + 0.12 * Math.sin(since * 2.4);
        destGroup.scale.setScalar(pop * throb);
        destRing.material.opacity = destDot.material.opacity = cur.opacity;
      }
    } else {
      spark.visible = false;
      destGroup.visible = false;
    }

    canvas.style.visibility = cur.opacity < 0.005 ? 'hidden' : 'visible';
    if (cur.opacity >= 0.005) renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { setPose, resize };
}
