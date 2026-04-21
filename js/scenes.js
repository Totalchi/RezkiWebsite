/* ==========================================================
   RM Bygg & Montage AB — 3D scenes (Three.js)
   ========================================================== */

(function () {
  const THREE = window.THREE;
  if (!THREE) { console.error("Three.js not loaded"); return; }

  const scenes = [];
  let globalRaf = null;
  const clock = new THREE.Clock();

  function startLoop() {
    if (globalRaf) return;
    const tick = () => {
      const dt = clock.getDelta();
      const t = clock.elapsedTime;
      for (const s of scenes) { try { s.tick && s.tick(dt, t); } catch (e) { console.error(e); } }
      for (const s of scenes) { s.renderer.render(s.scene, s.camera); }
      globalRaf = requestAnimationFrame(tick);
    };
    globalRaf = requestAnimationFrame(tick);
  }

  function mkRenderer(canvas) {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    r.setClearColor(0x000000, 0);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.outputColorSpace = THREE.SRGBColorSpace;
    if (THREE.ACESFilmicToneMapping) {
      r.toneMapping = THREE.ACESFilmicToneMapping;
      r.toneMappingExposure = 1.08;
    }
    return r;
  }

  function sizeTo(renderer, camera, canvas) {
    const parent = canvas.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function register(canvas, build) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    const renderer = mkRenderer(canvas);
    const obj = { canvas, scene, camera, renderer };
    try {
      build(obj, THREE);
    } catch (err) {
      console.error('[RMScenes] build error:', err);
    }
    sizeTo(renderer, camera, canvas);
    scenes.push(obj);
    const ro = new ResizeObserver(() => sizeTo(renderer, camera, canvas));
    ro.observe(canvas.parentElement);
    return obj;
  }

  /* ---------------- HERO: contemporary Nordic villa, blue hour ---------------- */
  function buildHero(o, THREE) {
    const { scene, camera } = o;
    // 3/4 architectural view — camera orbits at radius 16, ~30° from front
    camera.fov = 40;
    camera.updateProjectionMatrix();
    camera.position.set(8, 6, 14);
    camera.lookAt(0, 1.5, 0);

    scene.fog = new THREE.Fog(0x0a1628, 22, 40);

    // ── LIGHTING ────────────────────────────────────────────────────
    // Warm evening: key from upper-right, soft cool fill from left-back
    const amb = new THREE.AmbientLight(0x4a5e80, 0.55);
    scene.add(amb);

    const sunLight = new THREE.DirectionalLight(0xffcc70, 2.6);
    sunLight.position.set(12, 18, 8);   // upper-right-front — paints the front & right faces
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -14; sunLight.shadow.camera.right = 14;
    sunLight.shadow.camera.top  =  14; sunLight.shadow.camera.bottom = -14;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x4870c8, 0.55);
    rimLight.position.set(-8, 5, -6);   // cool blue from back-left
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xf4902a, 1.1, 18);
    warmFill.position.set(-3, 5, 6);
    scene.add(warmFill);

    // ── MATERIALS ───────────────────────────────────────────────────
    // Walls: off-white stucco; reveals: subtle charcoal (not pure black)
    const mWall  = new THREE.MeshStandardMaterial({ color: 0xeae5d8, roughness: 0.80, metalness: 0.02 });
    const mWall2 = new THREE.MeshStandardMaterial({ color: 0xe0d8c8, roughness: 0.84 });
    const mDark  = new THREE.MeshStandardMaterial({ color: 0x2a3848, roughness: 0.62, metalness: 0.22 }); // charcoal, not black
    const mRoof  = new THREE.MeshStandardMaterial({ color: 0x1c2230, roughness: 0.58, metalness: 0.30 });
    const mWinLit  = new THREE.MeshStandardMaterial({ color: 0xfce898, emissive: 0xf49010, emissiveIntensity: 1.4, roughness: 0.14 });
    const mWinCool = new THREE.MeshStandardMaterial({ color: 0x3a60a8, roughness: 0.06, metalness: 0.60, emissive: 0x07152e, emissiveIntensity: 0.5 });
    const mSolar = new THREE.MeshStandardMaterial({ color: 0x05101e, roughness: 0.16, metalness: 0.78, emissive: 0x071e3c, emissiveIntensity: 0.75 });
    const mFrame = new THREE.MeshStandardMaterial({ color: 0xbcc8d4, roughness: 0.24, metalness: 0.92 });
    const mGround= new THREE.MeshStandardMaterial({ color: 0x0e1a2e, roughness: 0.95 });
    const mGrass = new THREE.MeshStandardMaterial({ color: 0x14281a, roughness: 0.97 });
    const mDoor  = new THREE.MeshStandardMaterial({ color: 0x5a1e0c, roughness: 0.54 });
    const mMetal = new THREE.MeshStandardMaterial({ color: 0xb0bcc6, roughness: 0.28, metalness: 0.92 });

    // ── GROUND ──────────────────────────────────────────────────────
    const ground = new THREE.Mesh(new THREE.CircleGeometry(18, 64), mGround);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grass = new THREE.Mesh(new THREE.CircleGeometry(6, 48), mGrass);
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(-3.5, 0.005, 0);
    scene.add(grass);

    // ── CONTEMPORARY NORDIC FLAT-ROOF VILLA ─────────────────────────
    const house = new THREE.Group();
    scene.add(house);

    // Main body
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.5, 3.2), mWall);
    body.position.y = 1.25;
    body.castShadow = true; body.receiveShadow = true;
    house.add(body);

    // Dark parapet / fascia band (flat-roof signature)
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.28, 3.3), mDark);
    fascia.position.y = 2.64;
    fascia.castShadow = true;
    house.add(fascia);

    // Flat roof slab
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.10, 3.42), mRoof);
    roofSlab.position.y = 2.55;
    house.add(roofSlab);

    // Base plinth strip
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(4.85, 0.12, 3.22), mDark);
    plinth.position.y = 0.07;
    house.add(plinth);

    // Garage wing
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.1, 3.0), mWall2);
    wing.position.set(3.0, 1.05, 0.1);
    wing.castShadow = true; wing.receiveShadow = true;
    house.add(wing);

    const wingFascia = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.24, 3.1), mDark);
    wingFascia.position.set(3.0, 2.32, 0.1);
    house.add(wingFascia);

    const wingRoof = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.10, 3.22), mRoof);
    wingRoof.position.set(3.0, 2.24, 0.1);
    house.add(wingRoof);

    // Garage door (sectional panels)
    const gDoorMat = new THREE.MeshStandardMaterial({ color: 0x1e2c3c, roughness: 0.50, metalness: 0.48 });
    for (let ri = 0; ri < 4; ri++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.80, 0.46, 0.06), gDoorMat);
      panel.position.set(3.0, 0.27 + ri * 0.47, 1.52);
      house.add(panel);
      const groove = new THREE.Mesh(new THREE.BoxGeometry(1.80, 0.02, 0.065), mDark);
      groove.position.set(3.0, 0.50 + ri * 0.47, 1.52);
      house.add(groove);
    }

    // ── WINDOWS ──────────────────────────────────────────────────────
    const windowLights = [];
    const litWins = [];

    function addWin(x, y, z, w, h, rotY, lit) {
      if (rotY === undefined) rotY = 0;
      if (lit === undefined) lit = false;
      const reveal = new THREE.Mesh(new THREE.BoxGeometry(w + 0.07, h + 0.07, 0.09), mDark);
      reveal.position.set(x, y, z);
      reveal.rotation.y = rotY;
      house.add(reveal);
      const mat = lit ? mWinLit : mWinCool;
      const glass = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.07), mat);
      if (rotY) {
        glass.position.set(x, y, z);
      } else {
        glass.position.set(x, y, z + 0.015);
      }
      glass.rotation.y = rotY;
      house.add(glass);
      if (lit) {
        const spill = new THREE.PointLight(0xf49820, 1.0, 4.2);
        if (rotY) {
          spill.position.set(x + 0.5, y, z);
        } else {
          spill.position.set(x, y, z + 0.55);
        }
        house.add(spill);
        windowLights.push(spill);
      }
      return glass;
    }

    // Front windows
    litWins.push(addWin(-1.5, 1.3, 1.62, 1.1, 1.7, 0, true));
    litWins.push(addWin( 0.3, 1.3, 1.62, 1.1, 1.7, 0, false));
    litWins.push(addWin( 1.8, 1.2, 1.62, 0.65, 0.9, 0, true));
    // Clerestory band window
    litWins.push(addWin(-0.6, 2.28, 1.625, 2.2, 0.26, 0, true));
    // Side window on left wall (rotY = PI/2)
    addWin(-2.42, 1.2, 0, 0.85, 1.0, Math.PI / 2, false);

    // ── ENTRANCE ─────────────────────────────────────────────────────
    // Door centered in main body front face
    const dReveal = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.18, 0.10), mDark);
    dReveal.position.set(-0.6, 1.12, 1.63);
    house.add(dReveal);
    const dMesh = new THREE.Mesh(new THREE.BoxGeometry(0.84, 2.02, 0.08), mDoor);
    dMesh.position.set(-0.6, 1.12, 1.635);
    dMesh.castShadow = true;
    house.add(dMesh);
    // Handle
    const dHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.04), mMetal);
    dHandle.position.set(-0.25, 1.12, 1.68);
    house.add(dHandle);
    // Door step
    const dStep = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.09, 0.42), mWall2);
    dStep.position.set(-0.6, 0.06, 1.85);
    house.add(dStep);
    // Door sidelight
    const dSide = new THREE.Mesh(new THREE.BoxGeometry(0.20, 1.55, 0.08), mWinLit);
    dSide.position.set(-0.02, 1.1, 1.636);
    house.add(dSide);
    litWins.push(dSide);

    // Entry canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.65), mDark);
    canopy.position.set(-0.6, 2.4, 1.94);
    house.add(canopy);
    const cPost = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.3, 0.06), mMetal);
    cPost.position.set(-0.6, 1.15, 2.24);
    house.add(cPost);

    // ── SOLAR PANELS (flat on roof) ─────────────────────────────────
    const solarGrp = new THREE.Group();
    solarGrp.position.set(-0.6, 2.62, 0);
    house.add(solarGrp);
    const pw = 0.68, ph = 0.42, pgap = 0.045;
    const cols = 5, rows = 2;
    const tW = cols * pw + (cols - 1) * pgap;
    const tH = rows * ph + (rows - 1) * pgap;
    const sFrame = new THREE.Mesh(new THREE.BoxGeometry(tW + 0.08, 0.04, tH + 0.08), mFrame);
    solarGrp.add(sFrame);
    for (let ci = 0; ci < cols; ci++) {
      for (let ri = 0; ri < rows; ri++) {
        const cell = new THREE.Mesh(new THREE.BoxGeometry(pw, 0.05, ph), mSolar);
        cell.position.set(-tW / 2 + pw / 2 + ci * (pw + pgap), 0.005, -tH / 2 + ph / 2 + ri * (ph + pgap));
        solarGrp.add(cell);
        for (let k = 1; k < 5; k++) {
          const ln = new THREE.Mesh(new THREE.BoxGeometry(pw * 0.94, 0.055, 0.005), mFrame);
          ln.position.set(cell.position.x, 0.007, cell.position.z - ph / 2 + k * ph / 5);
          solarGrp.add(ln);
        }
      }
    }

    // ── EV CHARGER ──────────────────────────────────────────────────
    const evG = new THREE.Group();
    evG.position.set(4.15, 1.1, 1.52);
    house.add(evG);
    evG.add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.60, 0.14), mDark));
    const evScreen = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.10, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x28ffb0 }));
    evScreen.position.set(0, 0.14, 0.08);
    evG.add(evScreen);
    const evLED = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x28ffb0 }));
    evLED.position.set(0, -0.09, 0.079);
    evG.add(evLED);
    const evGlow = new THREE.PointLight(0x28ffb0, 0.8, 2.5);
    evGlow.position.set(4.15, 0.95, 1.72);
    scene.add(evGlow);

    // ── EV CAR ──────────────────────────────────────────────────────
    const car = new THREE.Group();
    car.position.set(5.5, 0, 2.8);
    car.rotation.y = Math.PI / 6;
    scene.add(car);

    const cBodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.48, 0.98),
      new THREE.MeshStandardMaterial({ color: 0x182844, roughness: 0.26, metalness: 0.80 }));
    cBodyMesh.castShadow = true;
    car.add(cBodyMesh);

    const cTop = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.38, 0.94),
      new THREE.MeshStandardMaterial({ color: 0x0e1c30, roughness: 0.18, metalness: 0.68 }));
    cTop.position.set(-0.12, 0.42, 0);
    car.add(cTop);

    const cGlass = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.31, 0.95),
      new THREE.MeshStandardMaterial({ color: 0x3a68b0, roughness: 0.04, metalness: 0.82, transparent: true, opacity: 0.42 }));
    cGlass.position.copy(cTop.position);
    car.add(cGlass);

    const wMatC = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.82 });
    const aMatC = new THREE.MeshStandardMaterial({ color: 0xbcc8d4, roughness: 0.18, metalness: 0.94 });
    [[-0.68, -0.24, 0.50], [0.68, -0.24, 0.50], [-0.68, -0.24, -0.50], [0.68, -0.24, -0.50]].forEach(function(p) {
      const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 20), wMatC);
      tyre.rotation.x = Math.PI / 2;
      tyre.position.set(p[0], p[1], p[2]);
      tyre.castShadow = true;
      car.add(tyre);
      const alloy = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.19, 8), aMatC);
      alloy.rotation.x = Math.PI / 2;
      alloy.position.set(p[0], p[1], p[2]);
      car.add(alloy);
    });
    const drlMat = new THREE.MeshBasicMaterial({ color: 0xfff4dc });
    [-0.36, 0.36].forEach(function(z) {
      const drl = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.035, 0.055), drlMat);
      drl.position.set(1.11, 0.09, z);
      car.add(drl);
    });

    // ── BATTERY CABINET ─────────────────────────────────────────────
    const batt = new THREE.Group();
    batt.position.set(-3.2, 0.85, -1.55);
    house.add(batt);
    const battBody = new THREE.Mesh(new THREE.BoxGeometry(0.66, 1.55, 0.30),
      new THREE.MeshStandardMaterial({ color: 0x10213c, roughness: 0.36, metalness: 0.60 }));
    battBody.castShadow = true;
    batt.add(battBody);
    const battStripe = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.055, 0.014),
      new THREE.MeshBasicMaterial({ color: 0x5888bc }));
    battStripe.position.set(0, 0.62, 0.158);
    batt.add(battStripe);
    const battBars = [];
    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.065, 0.014),
        new THREE.MeshBasicMaterial({ color: 0xf4a030, transparent: true, opacity: 1 }));
      bar.position.set(0, -0.42 + i * 0.21, 0.158);
      batt.add(bar);
      battBars.push(bar);
    }

    // ── FORMAL HEDGES ────────────────────────────────────────────────
    const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x102218, roughness: 0.95 });
    [[-4.2, 0.55, -0.6], [-4.2, 0.55, 0.7], [-4.2, 0.55, 2.0]].forEach(function(d) {
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(0.52, d[1], 0.52), hedgeMat);
      hedge.position.set(d[0], d[1] / 2, d[2]);
      hedge.castShadow = true;
      scene.add(hedge);
    });
    [[-5.2, 2.6, -0.5], [-5.2, 2.2, 1.4], [5.8, 2.0, -1.2]].forEach(function(d) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.34, d[1], 0.34), hedgeMat);
      col.position.set(d[0], d[1] / 2, d[2]);
      col.castShadow = true;
      scene.add(col);
    });

    // ── SUN ORB — positioned in the background sky, above right ────────
    // At radius 16 with baseAng=0.52: camera.x≈8, camera.z≈13
    // Sun behind & above the house: x=10, y=11, z=-10 (far back-right)
    const SUN_X = 10, SUN_Y = 11, SUN_Z = -10;
    const sunOrb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 28, 28),
      new THREE.MeshBasicMaterial({ color: 0xffe060 }));
    sunOrb.position.set(SUN_X, SUN_Y, SUN_Z);
    scene.add(sunOrb);

    const coronaLayers = [];
    [[0.82, 0xffce50, 0.45], [1.25, 0xf4a020, 0.24], [2.0, 0xee6810, 0.10]].forEach(function(d) {
      const cr = new THREE.Mesh(new THREE.SphereGeometry(d[0], 20, 20),
        new THREE.MeshBasicMaterial({ color: d[1], transparent: true, opacity: d[2] }));
      cr.position.set(SUN_X, SUN_Y, SUN_Z);
      scene.add(cr);
      coronaLayers.push(cr);
    });

    // ── ENERGY PARTICLES (sun → solar panels) ───────────────────────
    const ptclTarget = new THREE.Vector3(-0.6, 2.68, 0.2);
    const particles = [];
    for (let i = 0; i < 38; i++) {
      const pm = new THREE.MeshBasicMaterial({ color: 0xffd050, transparent: true, opacity: 0 });
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.032, 6, 6), pm);
      p.userData.t = Math.random();
      p.userData.speed = 0.25 + Math.random() * 0.20;
      scene.add(p);
      particles.push(p);
    }

    // ── POINTER / TOUCH / GYRO ───────────────────────────────────────
    let tY = 0, tX = 0, cY = 0, cX = 0;
    const onPointer = function(e) {
      const px = e.touches ? e.touches[0].clientX : e.clientX;
      const py = e.touches ? e.touches[0].clientY : e.clientY;
      tY = (px / window.innerWidth  * 2 - 1) * 0.20;
      tX = -(py / window.innerHeight * 2 - 1) * 0.07;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchmove',   onPointer, { passive: true });
    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', function(e) {
        if (e.gamma == null) return;
        tY =  (e.gamma / 25) * 0.20;
        tX = -((e.beta - 45) / 25) * 0.07;
      }, { passive: true });
    }

    // ── TICK ─────────────────────────────────────────────────────────
    o.tick = function(dt, t) {
      cY += (tY - cY) * 0.05;
      cX += (tX - cX) * 0.05;

      // Proper orbit: base angle ~0.52 rad (≈30°) puts camera front-right of house
      const baseAng = 0.52;
      const ang = baseAng + Math.sin(t * 0.09) * 0.14 + cY;
      const radius = 16;
      camera.position.x = Math.sin(ang) * radius;
      camera.position.z = Math.cos(ang) * radius;
      camera.position.y = 5.8 + cX * 1.4 + Math.sin(t * 0.18) * 0.12;
      camera.lookAt(0, 1.5, 0);

      // Sun pulse
      const sc = 1 + Math.sin(t * 1.5) * 0.05;
      sunOrb.scale.setScalar(sc);
      sunOrb.material.color.setHSL(0.115, 0.94, 0.68 + Math.sin(t * 2.0) * 0.05);
      coronaLayers.forEach(function(c, i) {
        c.scale.setScalar(1 + Math.sin(t * 1.1 + i * 0.7) * 0.08);
        c.material.opacity = [0.48, 0.26, 0.11][i] * (0.78 + Math.sin(t * 0.9) * 0.22);
      });

      // Energy particles: bezier arc sun → solar panels
      particles.forEach(function(p) {
        p.userData.t += dt * p.userData.speed;
        if (p.userData.t > 1) p.userData.t = 0;
        const k = p.userData.t;
        const k1 = 1 - k;
        const bx = (SUN_X + ptclTarget.x) / 2;
        const by = (SUN_Y + ptclTarget.y) / 2 + 2.8;
        const bz = (SUN_Z + ptclTarget.z) / 2;
        p.position.set(
          k1*k1*SUN_X + 2*k1*k*bx + k*k*ptclTarget.x,
          k1*k1*SUN_Y + 2*k1*k*by + k*k*ptclTarget.y,
          k1*k1*SUN_Z + 2*k1*k*bz + k*k*ptclTarget.z
        );
        const fade = Math.sin(k * Math.PI);
        p.material.opacity = fade * 0.88;
        p.scale.setScalar(0.35 + fade * 0.95);
      });

      // Window flicker
      litWins.forEach(function(w, i) {
        if (w.material && w.material.emissiveIntensity !== undefined)
          w.material.emissiveIntensity = 1.4 + Math.sin(t * 0.70 + i * 1.5) * 0.24;
      });
      windowLights.forEach(function(l, i) {
        l.intensity = 0.75 + Math.sin(t * 0.70 + i * 1.5) * 0.22;
      });

      // EV LED
      evLED.material.color.setHSL(0.39, 1.0, 0.50 + Math.sin(t * 3.0) * 0.22);

      // Battery bars
      battBars.forEach(function(b, i) {
        const filled = i <= 2 + Math.sin(t * 0.55) * 1.5;
        b.material.color.setHSL(0.10 + i * 0.016, 0.92, filled ? 0.54 + Math.sin(t * 2 + i) * 0.10 : 0.15);
        b.material.opacity = filled ? 1 : 0.18;
      });
    };
  }

  /* ---------- SOLAR service card scene: rotating array + sun ---------- */
  function buildSolar(o) {
    const { scene, camera } = o;
    camera.position.set(0, 2.2, 4.5);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0x6a7f9f, 0.7));
    const l = new THREE.DirectionalLight(0xffd98a, 1.6);
    l.position.set(2, 4, 3); scene.add(l);

    const g = new THREE.Group(); scene.add(g);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0b1b2e, roughness: 0.25, metalness: 0.7, emissive: 0x0a2040, emissiveIntensity: 0.4 });
    const frame = new THREE.MeshStandardMaterial({ color: 0xc0c7d1, roughness: 0.3, metalness: 0.9 });
    const pw = 0.9, ph = 0.55, gap = 0.06;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(pw, 0.05, ph), mat);
        c.position.set((i - 1) * (pw + gap), 0, (j - 0.5) * (ph + gap));
        g.add(c);
        // cell grid
        for (let k = 1; k < 4; k++) {
          const ln = new THREE.Mesh(new THREE.BoxGeometry(pw * 0.95, 0.055, 0.008), frame);
          ln.position.copy(c.position); ln.position.z += (k - 2) * ph / 4;
          g.add(ln);
        }
      }
    }
    // sun orb
    const sun = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffd98a }));
    sun.position.set(1.8, 1.6, -0.5);
    scene.add(sun);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), new THREE.MeshBasicMaterial({ color: 0xf4a438, transparent: true, opacity: 0.35 }));
    halo.position.copy(sun.position); scene.add(halo);

    g.rotation.x = -0.35;
    o.tick = (dt, t) => {
      g.rotation.y = Math.sin(t * 0.4) * 0.5 + t * 0.15;
      halo.scale.setScalar(1 + Math.sin(t * 1.5) * 0.1);
    };
  }

  /* ---------- BATTERY card ---------- */
  function buildBattery(o) {
    const { scene, camera } = o;
    camera.position.set(0, 0.6, 3.8); camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0x6a7f9f, 0.7));
    const l = new THREE.DirectionalLight(0xf4a438, 1.5);
    l.position.set(2, 3, 3); scene.add(l);
    const l2 = new THREE.DirectionalLight(0x6a8ec8, 0.6);
    l2.position.set(-2, 1, -2); scene.add(l2);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.1, 0.55), new THREE.MeshStandardMaterial({ color: 0x1d2d48, roughness: 0.35, metalness: 0.6 }));
    scene.add(body);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.4), new THREE.MeshStandardMaterial({ color: 0x0a1628, emissive: 0xf4a438, emissiveIntensity: 0.8 }));
    screen.position.set(0, 0.6, 0.276); scene.add(screen);

    const bars = [];
    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.07, 0.02), new THREE.MeshStandardMaterial({ color: 0xf4a438, emissive: 0xf4a438, emissiveIntensity: 2 }));
      bar.position.set(0, -0.35 + i * 0.22, 0.28);
      scene.add(bar); bars.push(bar);
    }
    // glow particles around
    const glows = [];
    for (let i = 0; i < 14; i++) {
      const gp = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.9 }));
      gp.userData.ang = Math.random() * Math.PI * 2;
      gp.userData.r = 1.0 + Math.random() * 0.3;
      gp.userData.y = (Math.random() - 0.5) * 2;
      gp.userData.sp = 0.3 + Math.random() * 0.4;
      scene.add(gp); glows.push(gp);
    }

    o.tick = (dt, t) => {
      scene.rotation.y = Math.sin(t * 0.3) * 0.4;
      bars.forEach((b, i) => {
        b.material.emissiveIntensity = 1.2 + Math.sin(t * 1.8 + i * 0.5) * 0.8;
      });
      glows.forEach(gp => {
        gp.userData.ang += dt * gp.userData.sp;
        gp.position.set(
          Math.cos(gp.userData.ang) * gp.userData.r,
          gp.userData.y + Math.sin(t + gp.userData.ang) * 0.1,
          Math.sin(gp.userData.ang) * gp.userData.r
        );
      });
    };
  }

  /* ---------- EV CHARGER card ---------- */
  function buildEV(o) {
    const { scene, camera } = o;
    camera.position.set(0, 0.3, 3.8); camera.lookAt(0, 0.1, 0);
    scene.add(new THREE.AmbientLight(0x6a7f9f, 0.6));
    const l = new THREE.DirectionalLight(0xffd98a, 1.2);
    l.position.set(2, 3, 3); scene.add(l);
    const l2 = new THREE.PointLight(0x4cff8a, 1.2, 5); l2.position.set(0, 0.2, 1); scene.add(l2);

    // stand
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0x1d2d48, roughness: 0.4, metalness: 0.6 }));
    base.position.y = -0.9; scene.add(base);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.5, 24), new THREE.MeshStandardMaterial({ color: 0xc6ccd6, roughness: 0.3, metalness: 0.8 }));
    post.position.y = -0.2; scene.add(post);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.22), new THREE.MeshStandardMaterial({ color: 0x1d2d48, roughness: 0.4, metalness: 0.6 }));
    head.position.y = 0.7; scene.add(head);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.3), new THREE.MeshStandardMaterial({ color: 0x0a1628, emissive: 0x4cff8a, emissiveIntensity: 0.9 }));
    screen.position.set(0, 0.85, 0.112); scene.add(screen);
    // LED ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 10, 32), new THREE.MeshBasicMaterial({ color: 0x4cff8a }));
    ring.position.set(0, 0.45, 0.12); scene.add(ring);

    // cable curve
    function cableCurve(t) {
      const pts = [];
      for (let i = 0; i <= 30; i++) {
        const u = i / 30;
        const x = -0.25 - u * 0.4 + Math.sin(u * Math.PI) * 0.15;
        const y = 0.3 - u * 1.1 - Math.sin(u * Math.PI + t) * 0.1;
        const z = u * 0.5;
        pts.push(new THREE.Vector3(x, y, z));
      }
      return new THREE.CatmullRomCurve3(pts);
    }
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    let cableMesh = new THREE.Mesh(new THREE.TubeGeometry(cableCurve(0), 24, 0.035, 8, false), cableMat);
    scene.add(cableMesh);
    const plug = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.12), new THREE.MeshStandardMaterial({ color: 0xc6ccd6, roughness: 0.3, metalness: 0.8 }));
    scene.add(plug);

    // electric arc particles
    const sparks = [];
    for (let i = 0; i < 10; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshBasicMaterial({ color: 0xf4a438 }));
      s.userData.t = Math.random();
      scene.add(s); sparks.push(s);
    }

    o.tick = (dt, t) => {
      scene.rotation.y = Math.sin(t * 0.3) * 0.4 - 0.1;
      // refresh cable
      cableMesh.geometry.dispose();
      cableMesh.geometry = new THREE.TubeGeometry(cableCurve(t), 24, 0.035, 8, false);
      // plug position at end
      const cc = cableCurve(t);
      const endP = cc.getPoint(1);
      plug.position.copy(endP);
      plug.lookAt(0, 0.45, 0.12);

      ring.material.color.setHSL(0.35 + Math.sin(t * 2) * 0.05, 1, 0.55);
      sparks.forEach(s => {
        s.userData.t += dt * 0.8;
        if (s.userData.t > 1) s.userData.t = 0;
        const p = cc.getPoint(s.userData.t);
        s.position.copy(p).add(new THREE.Vector3((Math.random()-0.5)*0.05, 0, 0));
        s.material.color.setHSL(0.12, 1, 0.6 + Math.random() * 0.2);
      });
    };
  }

  /* ---------- WINDOW card ---------- */
  function buildWindow(o) {
    const { scene, camera } = o;
    camera.position.set(0, 0.2, 3.6); camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0x6a7f9f, 0.6));
    const l = new THREE.DirectionalLight(0xffd98a, 1.4); l.position.set(3, 3, 3); scene.add(l);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xe8dfd0, roughness: 0.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x9cc2e8, roughness: 0.05, metalness: 0.1,
      transmission: 0.85, transparent: true, opacity: 0.6,
      emissive: 0x3a6fae, emissiveIntensity: 0.3
    });
    const g = new THREE.Group(); scene.add(g);
    // outer frame
    const outer = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.1, 0.1), frameMat);
    g.add(outer);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.85), glassMat);
    glass.position.z = 0.051;
    g.add(glass);
    // cross
    const mv = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.85, 0.12), frameMat);
    g.add(mv);
    const mh = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.06, 0.12), frameMat);
    g.add(mh);
    // handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.06), new THREE.MeshStandardMaterial({ color: 0xc6ccd6, metalness: 0.9, roughness: 0.2 }));
    handle.position.set(0.7, -0.3, 0.08); g.add(handle);

    // sunlight beams behind
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.25 });
    const beams = [];
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 4), beamMat);
      b.position.set(-1 + i * 0.4, 0, -0.5);
      b.rotation.z = Math.PI / 12;
      g.add(b); beams.push(b);
    }

    o.tick = (dt, t) => {
      g.rotation.y = Math.sin(t * 0.35) * 0.3;
      beams.forEach((b, i) => {
        b.material.opacity = 0.1 + Math.sin(t * 1.2 + i) * 0.1;
      });
    };
  }

  /* ---------- ROOF card ---------- */
  function buildRoof(o) {
    const { scene, camera } = o;
    camera.position.set(2.2, 2.4, 3.8); camera.lookAt(0, 0.3, 0);
    scene.add(new THREE.AmbientLight(0x6a7f9f, 0.5));
    const l = new THREE.DirectionalLight(0xffd98a, 1.6); l.position.set(3, 5, 2); l.castShadow = true; scene.add(l);

    // pitched roof tiles
    const tileMat = new THREE.MeshStandardMaterial({ color: 0x8c3a24, roughness: 0.8 });
    const tileMat2 = new THREE.MeshStandardMaterial({ color: 0x6d2a17, roughness: 0.85 });
    const roof = new THREE.Group(); scene.add(roof);
    // base wall
    const wall = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.0, 2.0), new THREE.MeshStandardMaterial({ color: 0xe6e1d6, roughness: 0.9 }));
    wall.position.y = -0.5; roof.add(wall);

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        const t = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.32), (row + col) % 2 ? tileMat : tileMat2);
        const ang = 0.55;
        t.position.set(-1.1 + col * 0.3, 0.1 + row * Math.cos(ang) * 0.26, -0.8 + row * Math.sin(ang) * 0.26);
        t.rotation.x = -ang;
        roof.add(t);
      }
    }
    // mirror other side
    const right = roof.clone();
    right.rotation.y = Math.PI;
    right.position.z = 0;
    // easier: create a second set mirrored on z
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        const t = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.32), (row + col) % 2 ? tileMat : tileMat2);
        const ang = 0.55;
        t.position.set(-1.1 + col * 0.3, 0.1 + row * Math.cos(ang) * 0.26, 0.8 - row * Math.sin(ang) * 0.26);
        t.rotation.x = ang;
        roof.add(t);
      }
    }

    o.tick = (dt, t) => {
      roof.rotation.y = Math.sin(t * 0.3) * 0.5;
    };
  }

  /* ---------- PAINTING card: paint brush stroke ---------- */
  function buildPaint(o) {
    const { scene, camera } = o;
    camera.position.set(0, 0.4, 3.4); camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0x6a7f9f, 0.7));
    const l = new THREE.DirectionalLight(0xffd98a, 1.5); l.position.set(3, 3, 2); scene.add(l);

    // wall with half-painted
    const wallGeo = new THREE.PlaneGeometry(3, 2);
    // use a canvas texture that we paint onto
    const tex = document.createElement('canvas');
    tex.width = 512; tex.height = 340;
    const tctx = tex.getContext('2d');
    tctx.fillStyle = '#8c7560'; tctx.fillRect(0, 0, tex.width, tex.height);
    const texture = new THREE.CanvasTexture(tex);
    const wall = new THREE.Mesh(wallGeo, new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9 }));
    scene.add(wall);

    // brush
    const brush = new THREE.Group(); scene.add(brush);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.9, 14), new THREE.MeshStandardMaterial({ color: 0x6d3e1a, roughness: 0.6 }));
    handle.rotation.z = Math.PI/2; handle.position.x = 0.4;
    brush.add(handle);
    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 14), new THREE.MeshStandardMaterial({ color: 0xc6ccd6, metalness: 0.9, roughness: 0.2 }));
    ferrule.rotation.z = Math.PI/2; ferrule.position.x = -0.1;
    brush.add(ferrule);
    const bristle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.24, 0.04), new THREE.MeshStandardMaterial({ color: 0xf7c064, roughness: 0.9 }));
    bristle.position.set(-0.28, 0, 0);
    brush.add(bristle);
    brush.position.z = 0.1;

    let lastX = null, lastY = null;
    o.tick = (dt, t) => {
      const x = Math.sin(t * 0.5) * 1.2;
      const y = Math.cos(t * 0.35) * 0.6;
      brush.position.set(x, y, 0.08);
      brush.rotation.z = -0.2;
      // paint on canvas
      const tx = ((x + 1.5) / 3) * tex.width;
      const ty = ((1 - (y + 1) / 2)) * tex.height;
      if (lastX !== null) {
        tctx.strokeStyle = '#eae3d3';
        tctx.lineWidth = 42;
        tctx.lineCap = 'round';
        tctx.beginPath();
        tctx.moveTo(lastX, lastY);
        tctx.lineTo(tx, ty);
        tctx.stroke();
        texture.needsUpdate = true;
      }
      lastX = tx; lastY = ty;
    };
  }

  /* ---------- PROMISE card scene: exploded energy system ---------- */
  function buildPromise(o) {
    const { scene, camera } = o;
    camera.position.set(0, 1.2, 5); camera.lookAt(0, 0.3, 0);
    scene.add(new THREE.AmbientLight(0x6a7f9f, 0.6));
    const l = new THREE.DirectionalLight(0xffd98a, 1.4); l.position.set(3, 4, 2); scene.add(l);
    const l2 = new THREE.PointLight(0xf4a438, 1.2, 10); l2.position.set(-2, 1, 3); scene.add(l2);

    // little house
    const house = new THREE.Group(); scene.add(house);
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.4), new THREE.MeshStandardMaterial({ color: 0xe6e1d6, roughness: 0.85 }));
    body.position.y = 0.6; house.add(body);
    const roofG = new THREE.BufferGeometry();
    const v = new Float32Array([
      -0.95, 1.2, 0.75, 0.95, 1.2, 0.75, 0, 1.9, 0.75,
      -0.95, 1.2, -0.75, 0, 1.9, -0.75, 0.95, 1.2, -0.75,
      -0.95, 1.2, 0.75, 0, 1.9, 0.75, 0, 1.9, -0.75,
      -0.95, 1.2, 0.75, 0, 1.9, -0.75, -0.95, 1.2, -0.75,
      0.95, 1.2, 0.75, 0, 1.9, -0.75, 0, 1.9, 0.75,
      0.95, 1.2, 0.75, 0.95, 1.2, -0.75, 0, 1.9, -0.75,
    ]);
    roofG.setAttribute('position', new THREE.BufferAttribute(v, 3));
    roofG.computeVertexNormals();
    const rMesh = new THREE.Mesh(roofG, new THREE.MeshStandardMaterial({ color: 0x2a2320, roughness: 0.7, metalness: 0.3 }));
    house.add(rMesh);
    // solar on roof
    const s1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.5), new THREE.MeshStandardMaterial({ color: 0x0b1b2e, roughness: 0.25, metalness: 0.7, emissive: 0x0a2040, emissiveIntensity: 0.3 }));
    s1.position.set(-0.45, 1.58, 0); s1.rotation.z = 0.6; house.add(s1);
    const s2 = s1.clone(); s2.position.set(0.45, 1.58, 0); s2.rotation.z = -0.6; house.add(s2);

    // orbit ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.015, 10, 64), new THREE.MeshBasicMaterial({ color: 0xf4a438, transparent: true, opacity: 0.5 }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.6;
    scene.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.01, 10, 64), new THREE.MeshBasicMaterial({ color: 0x6a8ec8, transparent: true, opacity: 0.4 }));
    ring2.rotation.x = Math.PI / 2; ring2.rotation.z = 0.3; ring2.position.y = 0.6;
    scene.add(ring2);
    // floating nodes
    const nodes = [];
    const nodeColors = [0xf4a438, 0x4cff8a, 0x6a8ec8, 0xffd98a];
    for (let i = 0; i < 4; i++) {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshBasicMaterial({ color: nodeColors[i] }));
      n.userData.ang = (i / 4) * Math.PI * 2;
      scene.add(n); nodes.push(n);
    }

    o.tick = (dt, t) => {
      house.rotation.y = t * 0.2;
      ring.rotation.z = t * 0.3;
      ring2.rotation.z = -t * 0.2;
      nodes.forEach((n, i) => {
        const a = n.userData.ang + t * 0.8;
        n.position.set(Math.cos(a) * 1.9, 0.6 + Math.sin(t * 1.2 + i) * 0.2, Math.sin(a) * 1.9);
      });
    };
  }

  // ========= public init =========
  window.RMScenes = {
    init() {
      const heroCanvas = document.getElementById('hero-canvas');
      if (heroCanvas) register(heroCanvas, buildHero);

      document.querySelectorAll('[data-scene]').forEach(c => {
        const kind = c.getAttribute('data-scene');
        const builder = {
          solar: buildSolar,
          battery: buildBattery,
          ev: buildEV,
          window: buildWindow,
          roof: buildRoof,
          paint: buildPaint,
          promise: buildPromise,
        }[kind];
        if (builder) register(c, builder);
      });

      startLoop();
    }
  };
})();
