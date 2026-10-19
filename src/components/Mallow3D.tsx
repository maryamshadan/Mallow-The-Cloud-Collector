import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MallowMood } from '../types';
import { MallowCharacter } from './MallowCharacter';
import { soundFx } from '../utils/soundFx';
import { useVisitor } from '../context/VisitorContext';

interface Mallow3DProps {
  mood?: MallowMood;
  interactive?: boolean;
  className?: string;
  onTickle?: () => void;
}

export const Mallow3D: React.FC<Mallow3DProps> = ({
  mood = 'happy',
  interactive = true,
  className = '',
  onTickle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [auraGlow, setAuraGlow] = useState(false);
  const { visitor } = useVisitor();

  // Active mood tracking (supports external prop + spontaneous internal micro-interactions)
  const [currentMood, setCurrentMood] = useState<MallowMood>(mood);
  const moodRef = useRef<MallowMood>(mood);

  useEffect(() => {
    setCurrentMood(mood);
    moodRef.current = mood;
  }, [mood]);

  // Click combo tracking
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation & Three.js Refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const isHoveredRef = useRef<boolean>(false);

  // Mesh & Group references for animation
  const mallowGroupRef = useRef<THREE.Group | null>(null);
  const auraSpriteRef = useRef<THREE.Sprite | null>(null);

  // Eyes references
  const leftEyeSocketRef = useRef<THREE.Mesh | null>(null);
  const rightEyeSocketRef = useRef<THREE.Mesh | null>(null);
  const leftGlintsGroupRef = useRef<THREE.Group | null>(null);
  const rightGlintsGroupRef = useRef<THREE.Group | null>(null);
  const leftWinkBrowRef = useRef<THREE.Mesh | null>(null);
  const rightWinkBrowRef = useRef<THREE.Mesh | null>(null);

  // Cheeks references
  const leftCheekRef = useRef<THREE.Mesh | null>(null);
  const rightCheekRef = useRef<THREE.Mesh | null>(null);

  // Mouths dictionary reference
  const mouthShapesRef = useRef<{
    smile: THREE.Mesh;
    laugh: THREE.Group;
    curious: THREE.Mesh;
    surprised: THREE.Group;
    shy: THREE.Mesh;
    sleepy: THREE.Mesh;
  } | null>(null);

  // Eyebrows references
  const leftBrowRef = useRef<THREE.Mesh | null>(null);
  const rightBrowRef = useRef<THREE.Mesh | null>(null);

  // Crown Star
  const starMeshRef = useRef<THREE.Mesh | null>(null);

  // Motion physics refs
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const pupilTargetRef = useRef({ x: 0, y: 0 });
  const pupilPosRef = useRef({ x: 0, y: 0 });
  const bounceScaleRef = useRef({ x: 1, y: 1, z: 1 });
  const lastPointerMoveTimeRef = useRef(Date.now());

  // Trigger speech bubble helper
  const showBubble = (text: string, duration = 3000) => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    setSpeechBubble(text);
    speechTimeoutRef.current = setTimeout(() => {
      setSpeechBubble(null);
    }, duration);
  };

  // Listen for global website events (pillow created, rain started, wish saved, secret discovered)
  useEffect(() => {
    const handlePillowCelebration = () => {
      setCurrentMood('excited');
      moodRef.current = 'excited';
      bounceScaleRef.current = { x: 1.25, y: 0.75, z: 1.25 };
      setAuraGlow(true);
      showBubble('Yay! Such a cozy, dreamy pillow! ☁️✨', 3500);
      setTimeout(() => setAuraGlow(false), 3000);
      setTimeout(() => {
        setCurrentMood(mood);
        moodRef.current = mood;
      }, 4000);
    };

    const handleRainStarted = () => {
      setCurrentMood('comforting');
      moodRef.current = 'comforting';
      showBubble('Mmm... soft raindrops make me so cozy... 🌧️💤', 3500);
      setTimeout(() => {
        setCurrentMood(mood);
        moodRef.current = mood;
      }, 5000);
    };

    const handleWishSaved = () => {
      setCurrentMood('excited');
      moodRef.current = 'excited';
      bounceScaleRef.current = { x: 1.2, y: 0.8, z: 1.2 };
      setAuraGlow(true);
      showBubble('A brand new sky wish! It is shining so bright! 🌟', 3500);
      setTimeout(() => setAuraGlow(false), 2500);
      setTimeout(() => {
        setCurrentMood(mood);
        moodRef.current = mood;
      }, 4000);
    };

    const handleSecretFound = () => {
      setCurrentMood('surprised');
      moodRef.current = 'surprised';
      bounceScaleRef.current = { x: 1.35, y: 0.7, z: 1.35 };
      setAuraGlow(true);
      showBubble('GASP! You found the secret magical rainbow cloud! 🌈💖', 4000);
      setTimeout(() => setAuraGlow(false), 3500);
      setTimeout(() => {
        setCurrentMood(mood);
        moodRef.current = mood;
      }, 4500);
    };

    window.addEventListener('mallow-celebrate-pillow', handlePillowCelebration);
    window.addEventListener('mallow-rain-started', handleRainStarted);
    window.addEventListener('mallow-wish-saved', handleWishSaved);
    window.addEventListener('mallow-secret-found', handleSecretFound);

    return () => {
      window.removeEventListener('mallow-celebrate-pillow', handlePillowCelebration);
      window.removeEventListener('mallow-rain-started', handleRainStarted);
      window.removeEventListener('mallow-wish-saved', handleWishSaved);
      window.removeEventListener('mallow-secret-found', handleSecretFound);
    };
  }, [mood]);

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('WebGL init failed:', e);
      setWebglSupported(false);
      return;
    }

    // --- Soft Kawaii Fairytale Lighting ---
    // Warm gentle ambient fill
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.35);
    scene.add(ambientLight);

    // Warm main sun/moonlight key light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(2.5, 4, 3.5);
    scene.add(dirLight);

    // Subtle lavender-blue ambient shadow from underneath to create cloud depth
    const lavenderBottomLight = new THREE.PointLight(0xc7d2fe, 1.25, 8);
    lavenderBottomLight.position.set(0, -2.4, 0.8);
    scene.add(lavenderBottomLight);

    // Soft radiant pink light near cheeks for irresistible warm blush glow
    const pinkCheekLight = new THREE.PointLight(0xf472b6, 1.35, 7);
    pinkCheekLight.position.set(0, -0.12, 2.3);
    scene.add(pinkCheekLight);

    // Dreamy soft lavender rim light from behind
    const rimLight = new THREE.DirectionalLight(0xddd6fe, 1.3);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // --- Delicate Soft Halo Aura (Behind Mallow) ---
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = 128;
    haloCanvas.height = 128;
    const hCtx = haloCanvas.getContext('2d');
    if (hCtx) {
      const grad = hCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(254, 215, 226, 0.55)');
      grad.addColorStop(0.4, 'rgba(233, 213, 255, 0.35)');
      grad.addColorStop(0.75, 'rgba(186, 230, 253, 0.15)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      hCtx.fillStyle = grad;
      hCtx.fillRect(0, 0, 128, 128);
    }
    const haloTexture = new THREE.CanvasTexture(haloCanvas);
    const haloMat = new THREE.SpriteMaterial({
      map: haloTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const haloSprite = new THREE.Sprite(haloMat);
    haloSprite.scale.set(3.6, 3.6, 1);
    haloSprite.position.set(0, 0, -0.6);
    scene.add(haloSprite);
    auraSpriteRef.current = haloSprite;

    // --- Mallow Main Character Group ---
    const mallowGroup = new THREE.Group();
    scene.add(mallowGroup);
    mallowGroupRef.current = mallowGroup;

    // Materials
    // Warm milky white velvety cloud material
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xfdfcf9,
      roughness: 0.62,
      metalness: 0.02,
    });

    // Deep espresso charcoal navy eye material
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.15,
    });

    // Pure white glossy highlights
    const whiteHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    // Wet kawaii cyan reflection accent
    const cyanGlintMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
    });

    // Dark charcoal navy mouth & eyebrow material
    const navyFeatureMat = new THREE.MeshBasicMaterial({
      color: 0x1e1b4b,
    });

    // Golden star material
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.22,
      metalness: 0.45,
      emissive: 0xfacc15,
      emissiveIntensity: 0.5,
    });

    // --- 1. CLOUD BODY: 7 Plump Soft Overlapping Lobes ---
    const cloudLobes: { pos: [number, number, number]; r: number; scale?: [number, number, number] }[] = [
      // Center main body (slightly wider-than-tall for squishable baby silhouette)
      { pos: [0, 0, 0], r: 1.15, scale: [1.1, 0.96, 1.02] },
      // Left cheek lobe
      { pos: [-0.78, 0.08, 0], r: 0.86, scale: [1.02, 0.98, 1.0] },
      // Right cheek lobe
      { pos: [0.78, 0.08, 0], r: 0.86, scale: [1.02, 0.98, 1.0] },
      // Top-left crown puff
      { pos: [-0.45, 0.66, 0], r: 0.74, scale: [1.0, 1.02, 1.0] },
      // Top-right crown puff
      { pos: [0.45, 0.66, 0], r: 0.74, scale: [1.0, 1.02, 1.0] },
      // Top center crown
      { pos: [0, 0.82, -0.05], r: 0.68, scale: [1.05, 1.0, 1.0] },
      // Bottom-left soft foot lobe
      { pos: [-0.55, -0.44, 0.1], r: 0.66, scale: [1.04, 0.92, 1.0] },
      // Bottom-right soft foot lobe
      { pos: [0.55, -0.44, 0.1], r: 0.66, scale: [1.04, 0.92, 1.0] },
      // Bottom tummy lobe
      { pos: [0, -0.5, 0.16], r: 0.62, scale: [1.1, 0.88, 1.0] },
    ];

    cloudLobes.forEach(({ pos, r, scale }) => {
      const geo = new THREE.SphereGeometry(r, 28, 22);
      const lobe = new THREE.Mesh(geo, cloudMat);
      lobe.position.set(...pos);
      if (scale) lobe.scale.set(...scale);
      mallowGroup.add(lobe);
    });

    // --- 2. THE EYES: Large, Vertically Oval, Sparkling Baby Eyes ---
    const eyeSocketGeo = new THREE.SphereGeometry(0.185, 30, 24);

    // Left Eye Socket
    const leftEyeSocket = new THREE.Mesh(eyeSocketGeo, eyeMat);
    leftEyeSocket.position.set(-0.32, 0.08, 1.08);
    leftEyeSocket.scale.set(1.0, 1.28, 0.44);
    leftEyeSocket.renderOrder = 3;
    mallowGroup.add(leftEyeSocket);
    leftEyeSocketRef.current = leftEyeSocket;

    // Right Eye Socket
    const rightEyeSocket = new THREE.Mesh(eyeSocketGeo, eyeMat);
    rightEyeSocket.position.set(0.32, 0.08, 1.08);
    rightEyeSocket.scale.set(1.0, 1.28, 0.44);
    rightEyeSocket.renderOrder = 3;
    mallowGroup.add(rightEyeSocket);
    rightEyeSocketRef.current = rightEyeSocket;

    // Helper to create magical sparkle highlights
    const createEyeHighlights = (isLeft: boolean) => {
      const glintsGroup = new THREE.Group();
      glintsGroup.position.set(isLeft ? -0.32 : 0.32, 0.08, 1.13);
      glintsGroup.renderOrder = 5;

      // 1. Prominent bright white circular highlight near upper-outer corner
      const bigGeo = new THREE.SphereGeometry(0.052, 16, 16);
      const bigGlint = new THREE.Mesh(bigGeo, whiteHighlightMat);
      bigGlint.position.set(isLeft ? -0.052 : -0.025, 0.065, 0.02);
      bigGlint.renderOrder = 5;
      glintsGroup.add(bigGlint);

      // 2. Secondary smaller bright white highlight near lower-inner corner
      const smallGeo = new THREE.SphereGeometry(0.026, 14, 14);
      const smallGlint = new THREE.Mesh(smallGeo, whiteHighlightMat);
      smallGlint.position.set(isLeft ? 0.045 : 0.055, -0.055, 0.02);
      smallGlint.renderOrder = 5;
      glintsGroup.add(smallGlint);

      // 3. Wet glassy cyan accent glint for living sparkle
      const cyanGeo = new THREE.SphereGeometry(0.02, 12, 12);
      const cyanGlint = new THREE.Mesh(cyanGeo, cyanGlintMat);
      cyanGlint.position.set(isLeft ? -0.015 : 0.015, -0.035, 0.02);
      cyanGlint.renderOrder = 5;
      glintsGroup.add(cyanGlint);

      return glintsGroup;
    };

    const leftGlintsGroup = createEyeHighlights(true);
    mallowGroup.add(leftGlintsGroup);
    leftGlintsGroupRef.current = leftGlintsGroup;

    const rightGlintsGroup = createEyeHighlights(false);
    mallowGroup.add(rightGlintsGroup);
    rightGlintsGroupRef.current = rightGlintsGroup;

    // Winking / Sleeping closed eye curves (used for winking and squinting)
    const winkCurveGeo = (isRight: boolean) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.11, -0.02, 0),
        new THREE.Vector3(0, 0.04, 0.015),
        new THREE.Vector3(0.11, -0.02, 0),
      ]);
      return new THREE.TubeGeometry(curve, 20, 0.02, 10, false);
    };

    const leftWinkMesh = new THREE.Mesh(winkCurveGeo(false), navyFeatureMat);
    leftWinkMesh.position.set(-0.32, 0.08, 1.13);
    leftWinkMesh.visible = false;
    leftWinkMesh.renderOrder = 6;
    mallowGroup.add(leftWinkMesh);
    leftWinkBrowRef.current = leftWinkMesh;

    const rightWinkMesh = new THREE.Mesh(winkCurveGeo(true), navyFeatureMat);
    rightWinkMesh.position.set(0.32, 0.08, 1.13);
    rightWinkMesh.visible = false;
    rightWinkMesh.renderOrder = 6;
    mallowGroup.add(rightWinkMesh);
    rightWinkBrowRef.current = rightWinkMesh;

    // --- 3. THE BLUSH CHEEKS: Vibrant, Airbrushed Strawberry Pink Baby Clouds ---
    const cheekCanvas = document.createElement('canvas');
    cheekCanvas.width = 256;
    cheekCanvas.height = 256;
    const ctx = cheekCanvas.getContext('2d');
    if (ctx) {
      // Warm strawberry pink center transitioning to soft pastel pink
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
      grad.addColorStop(0, 'rgba(255, 95, 162, 0.98)'); // Vivid glowing baby pink
      grad.addColorStop(0.35, 'rgba(251, 113, 133, 0.90)'); // Soft strawberry rose
      grad.addColorStop(0.7, 'rgba(254, 205, 211, 0.55)'); // Pastel blush aura
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(128, 128, 120, 0, Math.PI * 2);
      ctx.fill();
    }
    const cheekTexture = new THREE.CanvasTexture(cheekCanvas);
    const cheekMat = new THREE.MeshBasicMaterial({
      map: cheekTexture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const cheekGeo = new THREE.PlaneGeometry(0.52, 0.36);

    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(-0.46, -0.09, 1.10);
    leftCheek.rotation.y = -0.16;
    leftCheek.renderOrder = 7;
    mallowGroup.add(leftCheek);
    leftCheekRef.current = leftCheek;

    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(0.46, -0.09, 1.10);
    rightCheek.rotation.y = 0.16;
    rightCheek.renderOrder = 7;
    mallowGroup.add(rightCheek);
    rightCheekRef.current = rightCheek;

    // --- 4. THE MOUTH: Genuinely Distinct 3D Mouth Shapes ---
    const mouthAnchorGroup = new THREE.Group();
    mouthAnchorGroup.position.set(0, -0.075, 1.135);
    mouthAnchorGroup.renderOrder = 8;
    mallowGroup.add(mouthAnchorGroup);

    // A. Happy Smile: Tiny curved upward smile with rounded end caps
    const smileCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.12, 0.022, -0.01),
      new THREE.Vector3(-0.06, -0.035, 0.015),
      new THREE.Vector3(0, -0.055, 0.025),
      new THREE.Vector3(0.06, -0.035, 0.015),
      new THREE.Vector3(0.12, 0.022, -0.01),
    ]);
    const smileGeo = new THREE.TubeGeometry(smileCurve, 32, 0.024, 12, false);
    const smileMesh = new THREE.Mesh(smileGeo, navyFeatureMat);
    smileMesh.renderOrder = 8;

    const capGeo = new THREE.SphereGeometry(0.024, 12, 10);
    const leftSmileCap = new THREE.Mesh(capGeo, navyFeatureMat);
    leftSmileCap.position.set(-0.12, 0.022, -0.01);
    smileMesh.add(leftSmileCap);
    const rightSmileCap = new THREE.Mesh(capGeo, navyFeatureMat);
    rightSmileCap.position.set(0.12, 0.022, -0.01);
    smileMesh.add(rightSmileCap);
    mouthAnchorGroup.add(smileMesh);

    // B. Laughing & Giggling: Open joyful mouth with rosy pink tongue
    const laughGroup = new THREE.Group();
    laughGroup.renderOrder = 9;

    const laughCavityShape = new THREE.Shape();
    laughCavityShape.moveTo(-0.13, 0.02);
    laughCavityShape.quadraticCurveTo(0, -0.11, 0.13, 0.02);
    laughCavityShape.quadraticCurveTo(0, 0.01, -0.13, 0.02);
    laughCavityShape.closePath();
    const laughCavityGeo = new THREE.ShapeGeometry(laughCavityShape);
    const laughCavityMat = new THREE.MeshBasicMaterial({
      color: 0x1e1b4b,
      side: THREE.DoubleSide,
    });
    const laughCavity = new THREE.Mesh(laughCavityGeo, laughCavityMat);
    laughGroup.add(laughCavity);

    // Rosy pink tongue
    const tongueShape = new THREE.Shape();
    tongueShape.moveTo(-0.075, -0.04);
    tongueShape.quadraticCurveTo(0, -0.105, 0.075, -0.04);
    tongueShape.quadraticCurveTo(0, -0.025, -0.075, -0.04);
    tongueShape.closePath();
    const tongueGeo = new THREE.ShapeGeometry(tongueShape);
    const tongueMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
    });
    const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
    tongueMesh.position.set(0, 0, 0.005);
    laughGroup.add(tongueMesh);

    // Smooth rim tube
    const laughRimCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.13, 0.02, 0.006),
      new THREE.Vector3(-0.065, -0.052, 0.008),
      new THREE.Vector3(0, -0.105, 0.01),
      new THREE.Vector3(0.065, -0.052, 0.008),
      new THREE.Vector3(0.13, 0.02, 0.006),
    ]);
    const laughRimGeo = new THREE.TubeGeometry(laughRimCurve, 24, 0.018, 10, false);
    const laughRim = new THREE.Mesh(laughRimGeo, navyFeatureMat);
    laughGroup.add(laughRim);
    laughGroup.visible = false;
    mouthAnchorGroup.add(laughGroup);

    // C. Curious Mouth: Tiny rounded "o" tube
    const curiousTorusGeo = new THREE.TorusGeometry(0.038, 0.016, 10, 24);
    const curiousMesh = new THREE.Mesh(curiousTorusGeo, navyFeatureMat);
    curiousMesh.position.set(0, -0.02, 0.005);
    curiousMesh.visible = false;
    mouthAnchorGroup.add(curiousMesh);

    // D. Surprised Mouth: Vertical oval "o" cavity with smooth rim
    const surprisedGroup = new THREE.Group();
    const surprisedShape = new THREE.Shape();
    surprisedShape.absellipse(0, -0.02, 0.045, 0.065, 0, Math.PI * 2, false, 0);
    const surprisedGeo = new THREE.ShapeGeometry(surprisedShape);
    const surprisedMesh = new THREE.Mesh(surprisedGeo, navyFeatureMat);
    surprisedGroup.add(surprisedMesh);

    const surprisedRimCurve = new THREE.EllipseCurve(0, -0.02, 0.045, 0.065, 0, Math.PI * 2, false, 0);
    const surprisedPoints = surprisedRimCurve.getPoints(24).map((p) => new THREE.Vector3(p.x, p.y, 0.005));
    const surprisedRimGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(surprisedPoints, true), 24, 0.015, 8, true);
    const surprisedRim = new THREE.Mesh(surprisedRimGeo, navyFeatureMat);
    surprisedGroup.add(surprisedRim);
    surprisedGroup.visible = false;
    mouthAnchorGroup.add(surprisedGroup);

    // E. Shy Mouth: Cute delicate baby pout curve
    const shyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, 0.005, -0.01),
      new THREE.Vector3(-0.035, -0.025, 0.01),
      new THREE.Vector3(0, -0.01, 0.015),
      new THREE.Vector3(0.035, -0.025, 0.01),
      new THREE.Vector3(0.08, 0.005, -0.01),
    ]);
    const shyGeo = new THREE.TubeGeometry(shyCurve, 24, 0.018, 10, false);
    const shyMesh = new THREE.Mesh(shyGeo, navyFeatureMat);
    shyMesh.visible = false;
    mouthAnchorGroup.add(shyMesh);

    // F. Sleepy & Content Mouth: Tiny relaxed cozy smile
    const sleepyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.075, 0.01, -0.005),
      new THREE.Vector3(0, -0.025, 0.015),
      new THREE.Vector3(0.075, 0.01, -0.005),
    ]);
    const sleepyGeo = new THREE.TubeGeometry(sleepyCurve, 20, 0.018, 10, false);
    const sleepyMesh = new THREE.Mesh(sleepyGeo, navyFeatureMat);
    sleepyMesh.visible = false;
    mouthAnchorGroup.add(sleepyMesh);

    mouthShapesRef.current = {
      smile: smileMesh,
      laugh: laughGroup,
      curious: curiousMesh,
      surprised: surprisedGroup,
      shy: shyMesh,
      sleepy: sleepyMesh,
    };

    // --- 5. EYEBROWS: Faint, Cute Arched Eyebrow Lines ---
    const browCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.065, 0, 0),
      new THREE.Vector3(0, 0.025, 0.01),
      new THREE.Vector3(0.065, 0, 0),
    ]);
    const browGeo = new THREE.TubeGeometry(browCurve, 16, 0.012, 8, false);

    const leftBrow = new THREE.Mesh(browGeo, navyFeatureMat);
    leftBrow.position.set(-0.32, 0.32, 1.05);
    leftBrow.visible = false;
    mallowGroup.add(leftBrow);
    leftBrowRef.current = leftBrow;

    const rightBrow = new THREE.Mesh(browGeo, navyFeatureMat);
    rightBrow.position.set(0.32, 0.32, 1.05);
    rightBrow.visible = false;
    mallowGroup.add(rightBrow);
    rightBrowRef.current = rightBrow;

    // --- 6. CROWN STAR ACCESSORY: Pinned Near Top-Right Crown ---
    const starShape = new THREE.Shape();
    const outerR = 0.22;
    const innerR = 0.1;
    const pts = 5;
    for (let i = 0; i < pts * 2; i++) {
      const radius = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / pts - Math.PI / 2;
      const sx = Math.cos(angle) * radius;
      const sy = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(sx, sy);
      else starShape.lineTo(sx, sy);
    }
    starShape.closePath();
    const starExtrude = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    starExtrude.center();
    const starMesh = new THREE.Mesh(starExtrude, starMat);
    starMesh.position.set(0.85, 0.85, 0.3);
    mallowGroup.add(starMesh);
    starMeshRef.current = starMesh;

    // --- Window Resize & Mouse Tracking Listeners ---
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      lastPointerMoveTimeRef.current = Date.now();
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = (clientX / rect.width) * 2 - 1;
      const normY = -(clientY / rect.height) * 2 + 1;

      // Soft body tilt toward pointer
      targetRotationRef.current.y = normX * 0.36;
      targetRotationRef.current.x = -normY * 0.24;

      // Smooth pupil tracking clamped strictly within eye boundaries
      pupilTargetRef.current = {
        x: Math.max(-0.036, Math.min(0.036, normX * 0.038)),
        y: Math.max(-0.036, Math.min(0.036, normY * 0.038)),
      };
    };

    window.addEventListener('pointermove', handlePointerMove);

    // Mouse enter / leave hover tracking
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      targetRotationRef.current = { x: 0, y: 0 };
      pupilTargetRef.current = { x: 0, y: 0 };
    };
    container.addEventListener('pointerenter', handleMouseEnter);
    container.addEventListener('pointerleave', handleMouseLeave);

    // Intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // --- ANIMATION LOOP: LIVING BABY CLOUD ---
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;
    let wanderTimer = 0;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const activeMood = moodRef.current;

      // Natural idle pupil wondering if user is idle for > 3.2s
      const idleTime = Date.now() - lastPointerMoveTimeRef.current;
      if (idleTime > 3200 && !isHoveredRef.current) {
        wanderTimer += delta;
        const wanderX = Math.sin(wanderTimer * 0.8) * 0.022;
        const wanderY = Math.cos(wanderTimer * 0.6) * 0.016 + 0.008; // slightly looks up at clouds/stars
        pupilTargetRef.current = { x: wanderX, y: wanderY };
      }

      // 1. Floating Bob & Soft Air Wobble
      const isSleep = activeMood === 'sleepy';
      const isContent = activeMood === 'content' || activeMood === 'comforting';
      const isLaugh = activeMood === 'laughing' || activeMood === 'giggling';
      const isCurious = activeMood === 'curious';
      const isSurprise = activeMood === 'surprised';
      const isShy = activeMood === 'shy';
      const isWink = activeMood === 'winking';
      const isExcited = activeMood === 'excited';

      // Float speed & amplitude adapted to mood
      const bobFreq = isSleep || isContent ? 1.4 : isLaugh || isExcited ? 3.0 : 2.2;
      const bobAmp = isSleep ? 0.07 : isLaugh ? 0.14 : isExcited ? 0.16 : 0.11;
      const bobY = Math.sin(elapsed * bobFreq) * bobAmp;
      const bobTilt = Math.sin(elapsed * 1.5) * 0.045;

      // Springy squash-and-stretch damping
      bounceScaleRef.current.x += (1 - bounceScaleRef.current.x) * 0.12;
      bounceScaleRef.current.y += (1 - bounceScaleRef.current.y) * 0.12;
      bounceScaleRef.current.z += (1 - bounceScaleRef.current.z) * 0.12;

      // Hover perk-up reaction: leans slightly forward and widens smile
      const hoverLean = isHoveredRef.current ? 0.06 : 0;

      // Smooth Rotation Lerp toward pointer
      mallowGroup.rotation.y += (targetRotationRef.current.y + (isShy ? -0.18 : 0) - mallowGroup.rotation.y) * 0.08;
      mallowGroup.rotation.x += (targetRotationRef.current.x + hoverLean - mallowGroup.rotation.x) * 0.08;
      mallowGroup.rotation.z = bobTilt + (isCurious ? 0.12 : isLaugh ? Math.sin(elapsed * 16) * 0.03 : 0);

      mallowGroup.position.y = bobY + (isSurprise ? 0.08 : 0);
      mallowGroup.position.x = isLaugh ? Math.sin(elapsed * 18) * 0.018 : 0;

      mallowGroup.scale.set(
        bounceScaleRef.current.x,
        bounceScaleRef.current.y,
        bounceScaleRef.current.z
      );

      // Star Accessory spin & vertical float
      if (starMeshRef.current) {
        starMeshRef.current.rotation.z += 0.025;
        starMeshRef.current.position.y = 0.85 + Math.sin(elapsed * 2.8) * 0.05;
      }

      // Halo Aura gentle breathing
      if (auraSpriteRef.current) {
        const auraPulse = 3.6 + Math.sin(elapsed * 2.0) * 0.25;
        auraSpriteRef.current.scale.set(auraPulse, auraPulse, 1);
      }

      // Smooth Pupil Tracking
      pupilPosRef.current.x += (pupilTargetRef.current.x - pupilPosRef.current.x) * 0.18;
      pupilPosRef.current.y += (pupilTargetRef.current.y - pupilPosRef.current.y) * 0.18;

      if (leftGlintsGroupRef.current && rightGlintsGroupRef.current) {
        leftGlintsGroupRef.current.position.x = -0.32 + pupilPosRef.current.x;
        leftGlintsGroupRef.current.position.y = 0.08 + pupilPosRef.current.y;
        rightGlintsGroupRef.current.position.x = 0.32 + pupilPosRef.current.x;
        rightGlintsGroupRef.current.position.y = 0.08 + pupilPosRef.current.y;
      }

      // 2. BLINKING SYSTEM: Natural soft eyelid motion without permanently hiding
      blinkTimer += delta;
      const blinkThreshold = isSleep ? 2.4 : 3.8;
      if (blinkTimer > blinkThreshold && !isBlinking) {
        isBlinking = true;
      }

      // 3. EYES COORDINATION ACROSS ALL EXPRESSIONS
      if (
        leftEyeSocketRef.current &&
        rightEyeSocketRef.current &&
        leftGlintsGroupRef.current &&
        rightGlintsGroupRef.current &&
        leftWinkBrowRef.current &&
        rightWinkBrowRef.current
      ) {
        if (isLaugh) {
          // Joyful squinting happy eyes ( ˆ ‿ ˆ )
          leftEyeSocketRef.current.scale.set(1.18, 0.16, 0.44);
          rightEyeSocketRef.current.scale.set(1.18, 0.16, 0.44);
          leftGlintsGroupRef.current.scale.set(0, 0, 0);
          rightGlintsGroupRef.current.scale.set(0, 0, 0);
          leftWinkBrowRef.current.visible = true;
          rightWinkBrowRef.current.visible = true;
        } else if (isWink) {
          // Left eye open & starry, Right eye winking shut (^_-)
          leftEyeSocketRef.current.scale.set(1.0, 1.28, 0.44);
          leftGlintsGroupRef.current.scale.set(1.05, 1.05, 1);
          leftWinkBrowRef.current.visible = false;

          rightEyeSocketRef.current.scale.set(1.15, 0.14, 0.44);
          rightGlintsGroupRef.current.scale.set(0, 0, 0);
          rightWinkBrowRef.current.visible = true;
        } else if (isSleep || isContent) {
          // Soft sleepy / contented eyes
          leftEyeSocketRef.current.scale.set(1.0, 0.22, 0.44);
          rightEyeSocketRef.current.scale.set(1.0, 0.22, 0.44);
          leftGlintsGroupRef.current.scale.set(0.2, 0.2, 0.2);
          rightGlintsGroupRef.current.scale.set(0.2, 0.2, 0.2);
          leftWinkBrowRef.current.visible = true;
          rightWinkBrowRef.current.visible = true;
        } else if (isSurprise || isExcited) {
          // Extra wide sparkling puppy-like eyes
          leftEyeSocketRef.current.scale.set(1.12, 1.38, 0.44);
          rightEyeSocketRef.current.scale.set(1.12, 1.38, 0.44);
          leftGlintsGroupRef.current.scale.set(1.2, 1.2, 1);
          rightGlintsGroupRef.current.scale.set(1.2, 1.2, 1);
          leftWinkBrowRef.current.visible = false;
          rightWinkBrowRef.current.visible = false;
        } else if (isBlinking) {
          // Natural smooth blink down and up
          leftEyeSocketRef.current.scale.set(1.0, 0.12, 0.44);
          rightEyeSocketRef.current.scale.set(1.0, 0.12, 0.44);
          leftGlintsGroupRef.current.scale.set(0.1, 0.1, 0.1);
          rightGlintsGroupRef.current.scale.set(0.1, 0.1, 0.1);
          if (blinkTimer > blinkThreshold + 0.18) {
            leftEyeSocketRef.current.scale.set(1.0, 1.28, 0.44);
            rightEyeSocketRef.current.scale.set(1.0, 1.28, 0.44);
            leftGlintsGroupRef.current.scale.set(1, 1, 1);
            rightGlintsGroupRef.current.scale.set(1, 1, 1);
            isBlinking = false;
            blinkTimer = 0;
          }
        } else {
          // Normal glossy big baby eyes
          leftEyeSocketRef.current.scale.set(1.0, 1.28, 0.44);
          rightEyeSocketRef.current.scale.set(1.0, 1.28, 0.44);
          leftGlintsGroupRef.current.scale.set(1, 1, 1);
          rightGlintsGroupRef.current.scale.set(1, 1, 1);
          leftWinkBrowRef.current.visible = false;
          rightWinkBrowRef.current.visible = false;
        }
      }

      // 4. EYEBROWS COORDINATION
      if (leftBrowRef.current && rightBrowRef.current) {
        if (isCurious) {
          leftBrowRef.current.visible = true;
          rightBrowRef.current.visible = true;
          leftBrowRef.current.position.y = 0.35; // raised high with curiosity
          rightBrowRef.current.position.y = 0.31;
          leftBrowRef.current.rotation.z = 0.18;
          rightBrowRef.current.rotation.z = -0.08;
        } else if (isSurprise) {
          leftBrowRef.current.visible = true;
          rightBrowRef.current.visible = true;
          leftBrowRef.current.position.y = 0.36; // both arched high
          rightBrowRef.current.position.y = 0.36;
          leftBrowRef.current.rotation.z = 0.1;
          rightBrowRef.current.rotation.z = -0.1;
        } else if (isShy) {
          leftBrowRef.current.visible = true;
          rightBrowRef.current.visible = true;
          leftBrowRef.current.position.y = 0.30;
          rightBrowRef.current.position.y = 0.30;
          leftBrowRef.current.rotation.z = -0.12;
          rightBrowRef.current.rotation.z = 0.12;
        } else {
          leftBrowRef.current.visible = false;
          rightBrowRef.current.visible = false;
        }
      }

      // 5. BLUSH CHEEKS COORDINATION
      if (leftCheekRef.current && rightCheekRef.current) {
        let cheekScale = 1.0;
        if (isShy) {
          cheekScale = 1.38; // Deep prominent blush
        } else if (isLaugh) {
          cheekScale = 1.15 + Math.sin(elapsed * 14) * 0.08; // Pulsing with giggles
        } else if (isExcited) {
          cheekScale = 1.22;
        } else if (isSleep || isContent) {
          cheekScale = 0.88;
        }
        leftCheekRef.current.scale.set(cheekScale, cheekScale, 1);
        rightCheekRef.current.scale.set(cheekScale, cheekScale, 1);
      }

      // 6. MOUTH COORDINATION: Activate exact distinct 3D mouth shape
      if (mouthShapesRef.current) {
        const { smile, laugh, curious, surprised, shy, sleepy } = mouthShapesRef.current;

        // Hide all initially
        smile.visible = false;
        laugh.visible = false;
        curious.visible = false;
        surprised.visible = false;
        shy.visible = false;
        sleepy.visible = false;

        if (isLaugh) {
          laugh.visible = true;
          const laughPulse = 1.0 + Math.sin(elapsed * 16) * 0.1;
          laugh.scale.set(laughPulse, laughPulse, 1);
        } else if (isExcited) {
          laugh.visible = true;
          laugh.scale.set(1.05, 1.05, 1);
        } else if (isCurious) {
          curious.visible = true;
          curious.scale.set(1, 1, 1);
        } else if (isSurprise) {
          surprised.visible = true;
          surprised.scale.set(1.05, 1.05, 1);
        } else if (isShy) {
          shy.visible = true;
          shy.scale.set(1, 1, 1);
        } else if (isSleep || isContent) {
          sleepy.visible = true;
          sleepy.scale.set(1, 1, 1);
        } else if (isWink) {
          smile.visible = true;
          smile.rotation.z = 0.08; // Tilted cute smirk
          smile.scale.set(1.05, 1.05, 1);
        } else {
          // Default Happy Baby Smile
          smile.visible = true;
          smile.rotation.z = 0;
          smile.scale.set(1, 1, 1);
        }
      }

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerenter', handleMouseEnter);
      container.removeEventListener('pointerleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      cheekTexture.dispose();
      haloTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported, interactive]);

  // Micro-interaction: Click / Tap / Combo Reactions
  const handleCharacterClick = () => {
    const now = Date.now();
    const timeSinceLast = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    // Reset combo if more than 3s passed
    if (timeSinceLast > 3000) {
      clickCountRef.current = 1;
    } else {
      clickCountRef.current = (clickCountRef.current % 3) + 1;
    }

    // Play cute sound feedback
    soundFx.playPuff();
    soundFx.playChime(784);

    // Springy squash-and-stretch wobble
    bounceScaleRef.current = { x: 1.3, y: 0.72, z: 1.3 };
    setAuraGlow(true);
    setTimeout(() => setAuraGlow(false), 1200);

    const nickname = visitor.nickname || 'friend';

    if (clickCountRef.current === 1) {
      // 1st click: cheerful spring bounce & greeting
      setCurrentMood('happy');
      moodRef.current = 'happy';
      const phrases = [
        `Hehe! Hello ${nickname}! ✨`,
        'Soft like a warm marshmallow! ☁️',
        'Boing! You tickled my tummy! 🩷',
        'Sending you a cozy cloud hug! 🌸',
      ];
      showBubble(phrases[Math.floor(Math.random() * phrases.length)]);
    } else if (clickCountRef.current === 2) {
      // 2nd click: joyful giggle & laugh
      setCurrentMood('laughing');
      moodRef.current = 'laughing';
      showBubble('Hahaha! That tickles so much! Giggles! 😆✨');
    } else {
      // 3rd click: bashful blush & heart sparkle
      setCurrentMood('shy');
      moodRef.current = 'shy';
      showBubble('Aw, you are so sweet... I feel so loved! 🥹💖');
    }

    onTickle?.();
  };

  // Graceful fallback for non-WebGL devices
  if (!webglSupported) {
    return (
      <div className={`relative flex flex-col items-center ${className}`}>
        <MallowCharacter size="hero" mood={currentMood} interactive={interactive} />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {speechBubble && (
        <div className="absolute -top-12 z-20 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-purple-100 text-xs sm:text-sm font-bold shadow-xl border border-purple-200 dark:border-purple-700 animate-bounce">
          {speechBubble}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 rotate-45 border-r border-b border-purple-200 dark:border-purple-700" />
        </div>
      )}

      {/* Magical Aura Glow Bloom Indicator */}
      {auraGlow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300/30 via-purple-300/30 to-sky-300/30 blur-2xl pointer-events-none animate-pulse" />
      )}

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onClick={handleCharacterClick}
        className="w-72 h-72 sm:w-84 sm:h-84 cursor-pointer focus:outline-none transition-transform active:scale-95"
        role="button"
        tabIndex={0}
        aria-label="Interactive 3D Mallow baby cloud character. Click to tickle."
        title="Tap or click to tickle Mallow! Move cursor to look around."
      />
    </div>
  );
};
