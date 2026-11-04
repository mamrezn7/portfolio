/**
 * The five inflated shapes, one per case study, each an object from the project:
 *
 *   card     — the bank card the account-opening journey ends with  (Bajet)
 *   database — a database and a pointer                               (Farakav performance)
 *   bpmn     — a process diagram with a token running through it      (BPMN-IO extensions)
 *   cap      — a graduation cap for the learning platform            (Davilo LMS)
 *   sparkle  — the AI mark with a check                               (Farakav AI copilot)
 *
 * Plain ES module rather than TypeScript so that scripts/stills.html can load
 * this exact file in a browser to render the still images the site uses on
 * phones, on cards, and before the live scene has loaded.
 */

import {
  ACESFilmicToneMapping,
  Box3,
  CatmullRomCurve3,
  DirectionalLight,
  Euler,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Shape,
  SphereGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Where each shape sits when all four share the hero. */
export const HERO_LAYOUT = [
  { kind: "card", pos: [-0.75, 2.55, 0], rot: [0.12, 0.28, 0.1] },
  { kind: "database", pos: [0.95, 1.45, -0.2], rot: [0.05, -0.35, 0] },
  { kind: "bpmn", pos: [-0.45, 0.0, 0.4], rot: [0.12, 0.3, 0.12] },
  { kind: "cap", pos: [1.0, -1.0, 0], rot: [0.45, -0.5, 0] },
  { kind: "sparkle", pos: [-0.55, -2.15, 0.2], rot: [0.08, 0.3, 0.05] },
];

/** The same shapes alone, posed to read well at card size. */
export const SOLO_POSE = {
  card: { kind: "card", pos: [0, 0, 0], rot: [0.18, -0.3, 0.05] },
  database: { kind: "database", pos: [0, 0, 0], rot: [0.18, -0.3, 0.05] },
  bpmn: { kind: "bpmn", pos: [0, 0, 0], rot: [0.18, -0.3, 0.05] },
  cap: { kind: "cap", pos: [0, 0, 0], rot: [0.45, -0.5, 0] },
  sparkle: { kind: "sparkle", pos: [0, 0, 0], rot: [0.18, -0.3, 0.05] },
};

// A superellipsoid: boxy across its face, round through its depth, so it
// reads as a pillow or a balloon rather than a rounded box.
function pillow(w, h, d, face = 0.3, depth = 0.85, seg = 56) {
  let g = new SphereGeometry(1, seg, seg);
  const p = g.attributes.position;
  const f = (v, e) => Math.sign(v) * Math.pow(Math.abs(v), e);
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(i, (f(p.getX(i), face) * w) / 2, (f(p.getY(i), face) * h) / 2, (f(p.getZ(i), depth) * d) / 2);
  }
  // The sphere's UV seam duplicates vertices; merge them or the shading
  // shows a crease down the back.
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  g = mergeVertices(g);
  g.computeVertexNormals();
  return g;
}

const balloonMaterial = () =>
  new MeshPhysicalMaterial({
    roughness: 0.36,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.16,
    sheen: 0.5,
    sheenRoughness: 0.6,
    envMapIntensity: 0.85,
  });

// A flat outline, puffed up: extruded with a deep, round bevel.
function puffed(points, depth = 0.08, bevel = 0.07) {
  const s = new Shape();
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  const g = new ExtrudeGeometry(s, {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 10, curveSegments: 12,
  });
  g.center();
  g.computeVertexNormals();
  return g;
}

// A four-point sparkle, the usual mark for "AI".
function sparkle(r = 0.5, waist = 0.13, steps = 12) {
  const pts = [];
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const tip = [Math.cos(a) * r, Math.sin(a) * r];
    const next = [Math.cos(a + Math.PI / 2) * r, Math.sin(a + Math.PI / 2) * r];
    // Concave sides: bend each edge in towards the centre.
    for (let k = 0; k < steps; k++) {
      const u = k / steps;
      const x = (1 - u) * (1 - u) * tip[0] + 2 * u * (1 - u) * Math.cos(a + Math.PI / 4) * waist + u * u * next[0];
      const y = (1 - u) * (1 - u) * tip[1] + 2 * u * (1 - u) * Math.sin(a + Math.PI / 4) * waist + u * u * next[1];
      pts.push([x, y]);
    }
  }
  return puffed(pts, 0.06, 0.08);
}

// A database: three stacked discs, close enough to read as one cylinder with seams.
function database(add, mat, gap = 0.37) {
  [gap, 0, -gap].forEach((y) => {
    const d = add(pillow(1.3, 1.3, 0.44, 0.6, 0.3), mat, [0, y, 0]);
    d.rotation.x = -Math.PI / 2 + 0.35;
  });
}

function buildShape(kind, mats, idx) {
  const group = new Group();
  const add = (geo, mat, pos = [0, 0, 0]) => {
    const m = new Mesh(geo, mat);
    m.position.set(...pos);
    m.userData.idx = idx;
    group.add(m);
    return m;
  };
  // Per-shape animation beyond the shared bob and wobble.
  let tick = () => {};






  const addTo = (parent, geo, mat, pos = [0, 0, 0]) => {
    const m = new Mesh(geo, mat);
    m.position.set(...pos);
    m.userData.idx = idx;
    parent.add(m);
    return m;
  };

  if (kind === "card") {
    // Bajet: the bank card the account-opening journey ends with.
    add(pillow(1.7, 1.08, 0.16, 0.16, 0.8), mats.a);
    add(pillow(0.34, 0.26, 0.07, 0.25, 0.9), mats.c, [-0.5, 0.12, 0.08]);
    [-0.5, -0.17, 0.16, 0.49].forEach((x) => add(pillow(0.24, 0.07, 0.04, 0.3, 0.9), mats.c, [x, -0.22, 0.08]));
    // Now and then it flips, like a card being picked in the journey.
    let t = 0;
    tick = (dt) => {
      t += dt;
      const k = t - 4;
      if (k > 0 && k < 0.8) group.rotation.y += (dt / 0.8) * Math.PI * 2;
      if (t > 4.8) t = 0;
    };
  }


  if (kind === "bpmn") {
    // Faash: a small BPMN diagram, start event, task and gateway.
    const flow = new Group();
    flow.scale.setScalar(1.05);
    group.add(flow);
    addTo(flow, pillow(0.42, 0.42, 0.22, 1, 0.85), mats.b, [-1.15, 0, 0]);
    addTo(flow, pillow(0.86, 0.58, 0.26, 0.35, 0.85), mats.a, [-0.15, 0, 0]);
    const gate = addTo(flow, pillow(0.5, 0.5, 0.26, 0.35, 0.85), mats.b, [0.98, 0, 0]);
    gate.rotation.z = Math.PI / 4;
    const wire = (x1, x2) => {
      const path = new CatmullRomCurve3([new Vector3(x1, 0, 0), new Vector3(x2, 0, 0)]);
      addTo(flow, new TubeGeometry(path, 8, 0.045, 12, false), mats.b);
    };
    wire(-0.93, -0.58);
    wire(0.28, 0.62);
    // A token runs through the process, as the modeller animates it.
    const token = addTo(flow, new SphereGeometry(0.1, 20, 14), mats.c, [-1.15, 0, 0.18]);
    token.userData.decor = true;
    let t = 0;
    tick = (dt) => {
      t = (t + dt * 0.45) % 1;
      token.position.x = -1.15 + t * 2.13;
    };
  }

  if (kind === "cap") {
    // Davilo: the learning platform, as a graduation cap with a swinging tassel.
    const board = add(pillow(1.45, 1.45, 0.12, 0.25, 0.9), mats.b, [0, 0.12, 0]);
    board.rotation.x = -Math.PI / 2;
    const skull = add(new SphereGeometry(0.5, 40, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mats.b, [0, 0.1, 0]);
    skull.scale.set(1.05, 0.75, 1.05);
    add(new SphereGeometry(0.08, 16, 12), mats.a, [0, 0.2, 0]);
    const cord = new CatmullRomCurve3([new Vector3(0, 0.2, 0), new Vector3(0.38, 0.2, 0.38), new Vector3(0.62, 0.18, 0.62)]);
    add(new TubeGeometry(cord, 20, 0.025, 8, false), mats.a);
    const hang = new Group();
    hang.position.set(0.62, 0.18, 0.62);
    group.add(hang);
    addTo(hang, new TubeGeometry(new CatmullRomCurve3([new Vector3(0, 0, 0), new Vector3(0, -0.45, 0)]), 8, 0.025, 8, false), mats.a);
    addTo(hang, pillow(0.13, 0.26, 0.13, 0.6, 0.9), mats.a, [0, -0.55, 0]);
    let t = 0;
    tick = (dt) => {
      t += dt;
      hang.rotation.z = Math.sin(t * 2.4) * 0.35;
      hang.rotation.x = Math.sin(t * 1.7) * 0.15;
    };
  }


  if (kind === "database") {
    // Farakav performance.
    database(add, mats.b);
    const lid = group.children[0];
    const arrow = add(
      puffed([[0, 0], [0, -0.62], [0.15, -0.48], [0.27, -0.74], [0.37, -0.69], [0.25, -0.44], [0.45, -0.44]], 0.06, 0.06),
      mats.a,
      [0.72, -0.12, 0.78],
    );
    arrow.scale.setScalar(1.3);
    let t = 0;
    tick = (dt) => {
      t = (t + dt) % 2.6;
      const k = t > 1.6 && t < 1.85 ? Math.sin(((t - 1.6) / 0.25) * Math.PI) : 0;
      arrow.scale.setScalar(1.3 * (1 - k * 0.15));
      lid.position.y = 0.37 + (t > 1.7 && t < 2.3 ? Math.sin(((t - 1.7) / 0.6) * Math.PI) * 0.18 : 0);
    };
  }


  if (kind === "sparkle") {
    // AI copilot.
    const star = add(sparkle(0.72, 0.18), mats.a);
    add(pillow(0.6, 0.6, 0.22, 1, 0.85), mats.b, [0.5, -0.5, 0.2]);
    const check = new CatmullRomCurve3([new Vector3(0.37, -0.5, 0.33), new Vector3(0.46, -0.6, 0.34), new Vector3(0.64, -0.38, 0.33)], false, "catmullrom", 0.1);
    add(new TubeGeometry(check, 24, 0.045, 10, false), mats.c);
    let t = 0;
    tick = (dt) => {
      t += dt;
      star.rotation.z = Math.sin(t * 1.1) * 0.15;
    };
  }


  return { group, tick };
}

/**
 * A scene of one or more shapes on a transparent canvas.
 *
 * options:
 *   items        — [{ kind, pos, rot }]
 *   pointerArea  — element whose box the pointer is measured against
 *                  (the hero passes its stage, since text overlaps the canvas)
 *   onHover(i)   — shape index under the pointer, or -1
 *   onPick(i)    — a shape was clicked
 *   still        — render a single posed frame, keep the drawing buffer
 */
export class BalloonScene {
  constructor(canvas, { items, pointerArea = canvas, onHover, onPick, still = false }) {
    this.canvas = canvas;
    this.still = still;
    this.reduced = still || matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.onHover = onHover;
    this.active = -1;
    this.hovered = -1;

    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: still });
    renderer.setPixelRatio(still ? 1 : Math.min(devicePixelRatio, 2));
    renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer = renderer;

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    const key = new DirectionalLight(0xffffff, 1.4);
    key.position.set(-3, 5, 6);
    scene.add(key, new HemisphereLight(0xfff3e2, 0x3a2a20, 0.35));
    this.scene = scene;

    this.camera = new PerspectiveCamera(30, 1, 0.1, 80);
    this.root = new Group();
    scene.add(this.root);

    this.mats = { a: balloonMaterial(), b: balloonMaterial(), c: balloonMaterial(), d: balloonMaterial() };
    this.shapes = items.map((item, idx) => {
      const { group, tick } = buildShape(item.kind, this.mats, idx);
      group.position.set(...item.pos);
      group.rotation.set(...item.rot);
      group.userData = {
        idx,
        base: new Vector3(...item.pos),
        rot: new Euler(...item.rot),
        phase: idx * 1.7,
        s: 1,
      };
      this.root.add(group);
      return { group, tick };
    });
    this.groups = this.shapes.map((s) => s.group);

    // Frame the cluster at rest, with room for the bob and the hover swell.
    const box = new Box3();
    this.root.updateMatrixWorld(true);
    for (const g of this.groups) {
      g.traverse((o) => {
        if (o.isMesh && !o.userData.decor) box.expandByObject(o);
      });
    }
    this.size = box.getSize(new Vector3()).multiplyScalar(1.22);
    this.center = box.getCenter(new Vector3());

    this.paint();
    this.t = 0;
    this.aim = new Vector2();
    this.pointer = new Vector2();
    this.ray = new Raycaster();

    if (still) return;

    this.onScheme = () => {
      this.paint();
      this.frame(0);
    };
    this.schemeQuery = matchMedia("(prefers-color-scheme: dark)");
    this.schemeQuery.addEventListener("change", this.onScheme);

    this.onMove = (e) => {
      const r = pointerArea.getBoundingClientRect();
      this.aim.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      const inside = Math.abs(this.aim.x) <= 1 && Math.abs(this.aim.y) <= 1;
      const hit = inside ? this.pick(this.aim) : -1;
      if (hit !== this.hovered) {
        this.hovered = hit;
        canvas.style.cursor = hit >= 0 && onPick ? "pointer" : "";
        onHover?.(hit);
        if (this.reduced) this.frame(0);
      }
    };
    addEventListener("pointermove", this.onMove, { passive: true });
    if (onPick) {
      this.onClick = (e) => {
        const r = canvas.getBoundingClientRect();
        const at = new Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        const hit = this.pick(at);
        if (hit >= 0) onPick(hit);
      };
      canvas.addEventListener("click", this.onClick);
    }

    this.resizer = new ResizeObserver(() => this.resize());
    this.resizer.observe(canvas);
    this.visible = false;
    this.watcher = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible && !this.reduced) this.start();
    });
    this.watcher.observe(canvas);
  }

  pick(ndc) {
    this.ray.setFromCamera(ndc, this.camera);
    const hit = this.ray.intersectObjects(this.groups, true).find((h) => !h.object.userData.decor);
    return hit ? hit.object.userData.idx : -1;
  }

  paint() {
    const cs = getComputedStyle(document.documentElement);
    for (const k of ["a", "b", "c", "d"]) this.mats[k].color.set(cs.getPropertyValue(`--balloon-${k}`).trim() || "#888");
  }

  /** Swell one shape and shrink the rest; -1 for none. */
  setActive(i) {
    this.active = i;
    if (this.reduced) this.frame(0);
  }

  resize(width = this.canvas.clientWidth, height = this.canvas.clientHeight) {
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    const cam = this.camera;
    cam.aspect = width / height;
    const tan = Math.tan(MathUtils.degToRad(cam.fov / 2));
    const dist = Math.max(this.size.y / 2 / tan, this.size.x / 2 / tan / cam.aspect) + this.size.z / 2;
    cam.position.set(this.center.x, this.center.y, this.center.z + dist);
    cam.lookAt(this.center);
    cam.updateProjectionMatrix();
    this.frame(0);
  }

  frame(dt) {
    this.t += dt;
    const t = this.t;
    const a = this.active >= 0 ? this.active : this.hovered;
    const ease = this.reduced ? 1 : Math.min(1, dt * 8);

    if (!this.still) {
      this.pointer.lerp(this.aim.clone().clampScalar(-1, 1), this.reduced ? 1 : Math.min(1, dt * 3));
      this.root.rotation.y = this.pointer.x * 0.22;
      this.root.rotation.x = -this.pointer.y * 0.12;
    }

    for (const { group: g, tick } of this.shapes) {
      const { idx, base, rot, phase } = g.userData;
      const target = a === idx ? 1.16 : a >= 0 ? 0.92 : 1;
      g.userData.s += (target - g.userData.s) * ease;
      g.scale.setScalar(g.userData.s);
      if (this.reduced) continue;
      g.position.y = base.y + Math.sin(t * 0.9 + phase) * 0.09;
      tick(dt, a === idx);
      g.rotation.x = rot.x + Math.sin(t * 0.7 + phase) * 0.08;
      g.rotation.z = rot.z + Math.sin(t * 0.55 + phase) * 0.1;
    }
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    if (this.running) return;
    this.running = true;
    let last = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      if (!this.visible) {
        this.running = false;
        return;
      }
      this.frame(Math.min((now - last) / 1000, 0.05));
      last = now;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /** For scripts/stills.html: one posed frame at a fixed size, as an image. */
  snapshot(width, height, type = "image/webp", quality = 0.9) {
    this.resize(width, height);
    return new Promise((resolve) => this.canvas.toBlob(resolve, type, quality));
  }

  dispose() {
    this.running = false;
    removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("click", this.onClick);
    this.schemeQuery?.removeEventListener("change", this.onScheme);
    this.resizer?.disconnect();
    this.watcher?.disconnect();
    this.scene.traverse((o) => {
      if (o.isMesh) o.geometry.dispose();
    });
    for (const m of Object.values(this.mats)) m.dispose();
    this.renderer.dispose();
  }
}
