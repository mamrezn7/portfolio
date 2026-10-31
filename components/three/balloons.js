/**
 * The four inflated shapes: one per problem in the headline, one per case study.
 *
 *   flow   — the flow that loses people      (Bajet onboarding)
 *   screen — the screen with too much data   (Farakav performance)
 *   bar    — the library that will not bend  (BPMN-IO extensions)
 *   knot   — the rules that keep changing    (Davilo LMS)
 *   bubble — the model that sounds sure       (Farakav AI copilot)
 *
 * Plain ES module rather than TypeScript so that scripts/stills.html can load
 * this exact file in a browser to render the still images the site uses on
 * phones, on cards, and before the live scene has loaded.
 */

import {
  ACESFilmicToneMapping,
  Box3,
  CatmullRomCurve3,
  ConeGeometry,
  DirectionalLight,
  Euler,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  TorusKnotGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Where each shape sits when all four share the hero. */
export const HERO_LAYOUT = [
  { kind: "flow", pos: [-0.8, 2.3, 0], rot: [0, 0, 0.12] },
  { kind: "screen", pos: [0.85, 1.15, -0.3], rot: [0.05, -0.38, 0] },
  { kind: "bar", pos: [-0.55, -0.05, 0.45], rot: [0.1, 0.25, 0.32] },
  { kind: "knot", pos: [1.0, -0.95, 0], rot: [0, 0, 0] },
  { kind: "bubble", pos: [-0.5, -2.15, 0.2], rot: [0.05, 0.3, 0.06] },
];

/** The same shapes alone, posed to read well at card size. */
export const SOLO_POSE = {
  flow: { kind: "flow", pos: [0, 0, 0], rot: [0.2, -0.25, 0.12] },
  screen: { kind: "screen", pos: [0, 0, 0], rot: [0.08, -0.42, 0.02] },
  bar: { kind: "bar", pos: [0, 0, 0], rot: [0.25, 0.35, 0.3] },
  knot: { kind: "knot", pos: [0, 0, 0], rot: [0.4, 0.3, 0] },
  bubble: { kind: "bubble", pos: [0, 0, 0], rot: [0.08, -0.35, 0.04] },
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

const KNOTS = [[2, 3], [3, 4], [2, 5], [3, 5]];
const knotGeometry = ([p, q]) => new TorusKnotGeometry(0.4, 0.14, 180, 28, p, q);
const easeOutBack = (k) => 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2);

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

  if (kind === "flow") {
    const path = new CatmullRomCurve3(
      [[-1.05, 0.15, 0], [-0.55, 0.5, 0.15], [0, 0.02, 0], [0.5, -0.42, -0.15], [0.98, -0.12, 0]].map((p) => new Vector3(...p)),
    );
    const r = 0.18;
    add(new TubeGeometry(path, 120, r, 32, false), mats.a);
    const cap = new SphereGeometry(r, 32, 24);
    add(cap, mats.a, path.getPoint(0).toArray());
    const tail = path.getPoint(1);
    add(cap, mats.a, tail.toArray());
    // Now and then a ball leaves the end of the flow and falls away.
    const lost = add(new SphereGeometry(0.1, 24, 16), mats.a, tail.toArray());
    lost.userData.decor = true;
    let life = 0;
    lost.scale.setScalar(0.001);
    tick = (dt) => {
      life += dt;
      const k = Math.max(0, life - 1.2);
      lost.position.set(tail.x + k * 0.35, tail.y - 2.2 * k * k, tail.z + k * 0.2);
      lost.scale.setScalar(Math.max(0.001, life < 1.2 ? Math.min(1, life / 0.4) : 1 - k / 1.1));
      if (life > 3.6) life = 0;
    };
  }

  if (kind === "screen") {
    add(pillow(1.75, 1.2, 0.36), mats.b);
    add(pillow(1.15, 0.14, 0.14, 0.3, 0.9), mats.c, [-0.12, 0.3, 0.17]);
    add(pillow(0.85, 0.14, 0.14, 0.3, 0.9), mats.c, [-0.27, 0.04, 0.17]);
    // The row that does not fit the screen it is on.
    add(pillow(1.8, 0.14, 0.14, 0.3, 0.9), mats.c, [0.3, -0.24, 0.17]);
  }

  if (kind === "bar") {
    add(pillow(2.0, 0.42, 0.42, 0.3, 0.9), mats.c);
    const rivet = new SphereGeometry(0.075, 20, 14);
    add(rivet, mats.a, [-0.72, 0, 0.2]);
    add(rivet, mats.a, [0.72, 0, 0.2]);
  }

  if (kind === "knot") {
    const knot = add(knotGeometry(KNOTS[0]), mats.d);
    let which = 0;
    let clock = 0;
    let swapped = false;
    // Every few seconds the knot pops out and comes back as a different knot.
    tick = (dt, active) => {
      group.rotation.x += dt * (active ? 1.2 : 0.4);
      group.rotation.y += dt * (active ? 1.6 : 0.6);
      clock += dt;
      const m = clock - 3.5;
      let s = 1;
      if (m > 0 && m < 0.2) s = 1 - m / 0.2;
      else if (m >= 0.2) {
        if (!swapped) {
          which = (which + 1) % KNOTS.length;
          knot.geometry.dispose();
          knot.geometry = knotGeometry(KNOTS[which]);
          swapped = true;
        }
        const k = (m - 0.2) / 0.5;
        if (k >= 1) {
          clock = 0;
          swapped = false;
        } else s = easeOutBack(k);
      }
      knot.scale.setScalar(Math.max(0.001, s));
    };
  }

  if (kind === "bubble") {
    add(pillow(1.7, 1.12, 0.5, 0.35, 0.85), mats.a);
    // The tail, pointing down and out like a chat bubble's.
    const tail = add(new ConeGeometry(0.24, 0.5, 40), mats.a, [-0.52, -0.66, 0]);
    tail.rotation.z = Math.PI - 0.55;
    // Three "typing" dots: the model about to say something with confidence.
    const dots = [-0.38, 0, 0.38].map((x) => add(new SphereGeometry(0.11, 24, 16), mats.c, [x, 0.02, 0.24]));
    let t = 0;
    tick = (dt) => {
      t += dt;
      dots.forEach((d, i) => {
        d.position.y = 0.02 + 0.09 * Math.max(0, Math.sin(t * 5 - i * 0.9));
      });
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
        // The library does not bend: it bobs with the rest and never tilts.
        rigid: item.kind === "bar",
        // The knot turns itself; the shared wobble would fight it.
        spins: item.kind === "knot",
        sway: item.kind === "screen",
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
      if (g.userData.spins || g.userData.rigid) continue;
      g.rotation.x = rot.x + Math.sin(t * 0.7 + phase) * 0.08;
      g.rotation.z = rot.z + Math.sin(t * 0.55 + phase) * 0.1;
      if (g.userData.sway) g.rotation.y = rot.y + Math.sin(t * 0.5) * 0.14;
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
