/*
 * Replaces "three" for the whole build (see the alias in vite.config.ts).
 *
 * @react-three/fiber imports three as a namespace, which normally defeats tree-shaking and ships
 * the entire library. Listing what the scene really uses takes the 3D chunk under its size budget.
 * Using a new three class or JSX element? Add it here, or R3F will say it's not in the namespace.
 */
export {
  // Used internally by @react-three/fiber
  ACESFilmicToneMapping,
  BasicShadowMap,
  Camera,
  Clock,
  ColorManagement,
  Layers,
  NoToneMapping,
  Object3D,
  OrthographicCamera,
  PCFShadowMap,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  RGBAFormat,
  Scene,
  UnsignedByteType,
  Vector2,
  Vector3,
  VSMShadowMap,
  WebGLRenderer,
  // JSX elements in HeroNetwork
  BufferAttribute,
  BufferGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  MeshBasicMaterial,
  PlaneGeometry,
  // Used directly by HeroNetwork
  AdditiveBlending,
  CanvasTexture,
  Color,
  NormalBlending,
} from 'three/src/Three.js';
