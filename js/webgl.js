/* ============ KINETIC SCULPTURE — custom GLSL blob + gyroscope rings ============ */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('fig3d');
const canvas = document.getElementById('gl');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
catch (e) { container.classList.add('no-gl'); throw e; }

renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
camera.position.set(0, 0.3, 7.6);

const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 4.6;
controls.maxDistance = 10;
controls.zoomSpeed = 0.7;
controls.autoRotate = !reduced;
controls.autoRotateSpeed = 0.65;
canvas.style.touchAction = 'pan-y';

let idleT;
canvas.addEventListener('pointerdown', () => {
  controls.autoRotate = false;
  clearTimeout(idleT);
  idleT = setTimeout(() => { controls.autoRotate = !reduced; }, 3000);
});

const sculpture = new THREE.Group();
scene.add(sculpture);

const NOISE = `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;

const vert = NOISE + `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vN;
varying vec3 vW;
float field(vec3 p){
  float t = uTime * 0.32;
  float n = snoise(p * uFreq + vec3(t, t * 0.7, -t * 0.5));
  n += 0.45 * snoise(p * uFreq * 2.15 + vec3(-t * 1.3, t * 0.9, t * 0.6));
  return n * uAmp;
}
void main(){
  vec3 n0 = normalize(position);
  vec3 pos = position + n0 * field(position);
  vec3 helper = abs(n0.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tg = normalize(cross(n0, helper));
  vec3 bt = cross(n0, tg);
  float e = 0.05;
  vec3 pa = position + tg * e; pa += normalize(pa) * field(pa);
  vec3 pb = position + bt * e; pb += normalize(pb) * field(pb);
  vec3 nrm = normalize(cross(pa - pos, pb - pos));
  vN = normalize(mat3(modelMatrix) * nrm);
  vec4 w = modelMatrix * vec4(pos, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const frag = `
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uHi;
uniform vec3 uAccent;
varying vec3 vN;
varying vec3 vW;
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  vec3 L = normalize(vec3(0.5, 0.85, 0.55));
  float hl = dot(N, L) * 0.5 + 0.5;
  vec3 col = mix(uDeep, uMid, smoothstep(0.08, 0.96, hl));
  col = mix(col, uHi, smoothstep(0.88, 1.0, hl) * 0.45);
  float fr = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.1);
  col = mix(col, uAccent, smoothstep(0.32, 0.8, fr));
  col = pow(col, vec3(1.0 / 2.2));
  gl_FragColor = vec4(col, 1.0);
}`;

const uniforms = {
  uTime:   { value: 0 },
  uAmp:    { value: 0.27 },
  uFreq:   { value: 1.28 },
  uDeep:   { value: new THREE.Color('#14110C') },
  uMid:    { value: new THREE.Color('#4A453A') },
  uHi:     { value: new THREE.Color('#D9D3C5') },
  uAccent: { value: new THREE.Color('#FF4A00') }
};
const blob = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.06, 20),
  new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag })
);
sculpture.add(blob);

const INK = '#171410', ACC = '#FF4A00', PAPER = '#ECE8DF';

const pivotA = new THREE.Group();
pivotA.rotation.set(1.05, 0, 0.35);
const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.013, 10, 240), new THREE.MeshBasicMaterial({ color: INK }));
pivotA.add(ringA);
const satA = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 20), new THREE.MeshBasicMaterial({ color: ACC }));
pivotA.add(satA);
sculpture.add(pivotA);

const pivotB = new THREE.Group();
pivotB.rotation.set(-0.55, 0.8, -0.2);
const pts = [];
for (let i = 0; i <= 160; i++) {
  const a = (i / 160) * Math.PI * 2;
  pts.push(new THREE.Vector3(Math.cos(a) * 2.28, Math.sin(a) * 2.28, 0));
}
const ringB = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(pts),
  new THREE.LineDashedMaterial({ color: ACC, dashSize: 0.16, gapSize: 0.1 })
);
ringB.computeLineDistances();
pivotB.add(ringB);
const satB = new THREE.Mesh(new THREE.SphereGeometry(0.04, 20, 20), new THREE.MeshBasicMaterial({ color: PAPER }));
pivotB.add(satB);
sculpture.add(pivotB);

const pivotC = new THREE.Group();
pivotC.rotation.set(1.45, 0.2, 0);
const ptsC = [];
for (let i = 0; i <= 160; i++) {
  const a = (i / 160) * Math.PI * 2;
  ptsC.push(new THREE.Vector3(Math.cos(a) * 2.7, Math.sin(a) * 2.7, 0));
}
const ringC = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(ptsC),
  new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.3 })
);
pivotC.add(ringC);
sculpture.add(pivotC);

sculpture.scale.setScalar(0.7);

function resize(){
  const w = container.clientWidth, h = container.clientHeight;
  if (w === 0 || h === 0) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(container);
resize();

let inView = true;
new IntersectionObserver(en => { inView = en[0].isIntersecting; }, { rootMargin: '120px' }).observe(container);

const clock = new THREE.Clock();
let born = -1;
window.__glOK = true;

function tick(){
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  if (!inView) return;

  uniforms.uTime.value = t * (reduced ? 0.45 : 1);
  pivotA.rotation.y += dt * 0.22;
  pivotB.rotation.y -= dt * 0.16;
  pivotC.rotation.y += dt * 0.08;

  const sa = t * 0.55;
  satA.position.set(Math.cos(sa) * 1.85, Math.sin(sa) * 1.85, 0);
  const sb = -t * 0.35 + 2;
  satB.position.set(Math.cos(sb) * 2.28, Math.sin(sb) * 2.28, 0);

  if (born < 0 && document.body.classList.contains('loaded')) born = t;
  if (born >= 0) {
    const p = Math.min(1, (t - born) / 1.4);
    const e = 1 - Math.pow(1 - p, 3);
    sculpture.scale.setScalar(0.7 + 0.3 * e);
    sculpture.rotation.y = (1 - e) * 0.7;
  }

  controls.update();
  renderer.render(scene, camera);
}
tick();
