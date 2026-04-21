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
    build(obj, THREE);
    sizeTo(renderer, camera, canvas);
    scenes.push(obj);
    const ro = new ResizeObserver(() => sizeTo(renderer, camera, canvas));
    ro.observe(canvas.parentElement);
    return obj;
  }

  /* ---------------- HERO: contemporary Nordic villa, blue hour ---------------- */
  function buildHero(o, THREE) {
    const { scene, camera } = o;
    camera.fov = 44;
    camera.near = 0.1;
    camera.far = 300;
    camera.position.set(0, 3.5, 17);
    camera.lookAt(0, 1.4, 0);
    camera.updateProjectionMatrix();

    scene.background = new THREE.Color(0x020810);
    scene.fog = new THREE.Fog(0x06101e, 22, 42);

    // ── SKY ─────────────────────────────────────────────────────────
    const skyGeo = new THREE.SphereGeometry(90, 32, 16);
    const skyCol = new Float32Array(skyGeo.attributes.position.count * 3);
    for (let i = 0; i < skyGeo.attributes.position.count; i++) {
      const y = skyGeo.attributes.position.getY(i);
      const f = Math.max(0, Math.min(1, (y + 90) / 180)); // 0 = bottom, 1 = top
      const horizon = Math.pow(1 - Math.abs(f * 2 - 1), 3); // peaks at equator
      skyCol[i*3]   = 0.02 + f * 0.05 + horizon * 0.18;
      skyCol[i*3+1] = 0.04 + f * 0.06 + horizon * 0.08;
      skyCol[i*3+2] = 0.12 + f * 0.22;
    }
    skyGeo.setAttribute('color', new THREE.BufferAttribute(skyCol, 3));
    scene.add(new THREE.Mesh(skyGeo,
      new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, depthWrite: false })));

    // Horizon amber glow
    const horizMat = new THREE.MeshBasicMaterial({
      color: 0xf06820, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide
    });
    const horiz = new THREE.Mesh(new THREE.PlaneGeometry(120, 8), horizMat);
    horiz.position.set(7, 0.8, -24);
    scene.add(horiz);

    // ── LIGHTING ────────────────────────────────────────────────────
    // Hemisphere: cool blue sky above, warm amber bounce below
    scene.add(new THREE.HemisphereLight(0x1e3a70, 0x8a4010, 1.1));

    const keyLight = new THREE.DirectionalLight(0xffd080, 3.0);
    keyLight.position.set(10, 18, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 55;
    keyLight.shadow.camera.left = -14; keyLight.shadow.camera.right = 14;
    keyLight.shadow.camera.top = 14; keyLight.shadow.camera.bottom = -14;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3060c0, 1.1);
    rimLight.position.set(-10, 6, -8);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xf49030, 1.8, 20);
    warmFill.position.set(-1, 6, 8);
    scene.add(warmFill);

    // ── MATERIALS ───────────────────────────────────────────────────
    const mWall   = new THREE.MeshStandardMaterial({ color: 0xe4ddd0, roughness: 0.84, metalness: 0.03 });
    const mWall2  = new THREE.MeshStandardMaterial({ color: 0xd8d0c2, roughness: 0.88 });
    const mDark   = new THREE.MeshStandardMaterial({ color: 0x141c28, roughness: 0.52, metalness: 0.45 });
    const mRoof   = new THREE.MeshStandardMaterial({ color: 0x101418, roughness: 0.62, metalness: 0.38 });
    const mWinLit = new THREE.MeshStandardMaterial({ color: 0xfde8a0, emissive: 0xf89820, emissiveIntensity: 2.0, roughness: 0.1 });
    const mWinCool= new THREE.MeshStandardMaterial({ color: 0x4a78c0, roughness: 0.06, metalness: 0.7, emissive: 0x0a1a3a, emissiveIntensity: 0.5 });
    const mSolar  = new THREE.MeshStandardMaterial({ color: 0x05101c, roughness: 0.16, metalness: 0.82, emissive: 0x08224a, emissiveIntensity: 0.9 });
    const mFrame  = new THREE.MeshStandardMaterial({ color: 0xb8c8d6, roughness: 0.2, metalness: 0.96 });
    const mGround = new THREE.MeshStandardMaterial({ color: 0x090e18, roughness: 0.95 });
    const mPave   = new THREE.MeshStandardMaterial({ color: 0x0c1422, roughness: 0.88, metalness: 0.06 });
    const mDoor   = new THREE.MeshStandardMaterial({ color: 0x601c08, roughness: 0.58 });
    const mMetal  = new THREE.MeshStandardMaterial({ color: 0xb2bec8, roughness: 0.28, metalness: 0.92 });

    // ── GROUND ──────────────────────────────────────────────────────
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(38, 38), mGround);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Pavement area around house
    const pave = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), mPave);
    pave.rotation.x = -Math.PI / 2;
    pave.position.set(1, 0.006, 1.5);
    pave.receiveShadow = true;
    scene.add(pave);

    // Lawn strip
    const lawn = new THREE.Mesh(new THREE.PlaneGeometry(6, 5),
      new THREE.MeshStandardMaterial({ color: 0x0e2016, roughness: 0.97 }));
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(-4, 0.007, 0);
    scene.add(lawn);

    // ── CONTEMPORARY NORDIC VILLA ────────────────────────────────────
    const house = new THREE.Group();
    scene.add(house);

    // Main body — wide and low
    const body = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.6, 3.4), mWall);
    body.position.y = 1.3;
    body.castShadow = true; body.receiveShadow = true;
    house.add(body);

    // Dark fascia / parapet at roofline (gives the flat-roof feel)
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(5.7, 0.32, 3.5), mDark);
    fascia.position.y = 2.76;
    fascia.castShadow = true;
    house.add(fascia);

    // Roof slab (almost flat, very slight overhang)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.12, 3.62), mRoof);
    roof.position.y = 2.62;
    house.add(roof);

    // Plinth / base band
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.64, 0.14, 3.44), mDark);
    plinth.position.y = 0.08;
    house.add(plinth);

    // Side garage wing
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 3.2), mWall2);
    wing.position.set(3.1, 1.1, 0);
    wing.castShadow = true; wing.receiveShadow = true;
    house.add(wing);

    const wingFascia = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.28, 3.3), mDark);
    wingFascia.position.set(3.1, 2.34, 0);
    house.add(wingFascia);

    const wingRoof = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.1, 3.42), mRoof);
    wingRoof.position.set(3.1, 2.25, 0);
    house.add(wingRoof);

    // Garage door — aluminium sectional style
    const gDoorMat = new THREE.MeshStandardMaterial({ color: 0x1c2a38, roughness: 0.5, metalness: 0.5 });
    for (let r = 0; r < 5; r++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.38, 0.07), gDoorMat);
      panel.position.set(3.1, 0.22 + r * 0.39, 1.62);
      house.add(panel);
      // Groove between panels
      const groove = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.02, 0.075), mDark);
      groove.position.set(3.1, 0.41 + r * 0.39, 1.62);
      house.add(groove);
    }

    // ── FLOOR-TO-CEILING WINDOWS ─────────────────────────────────────
    const windowLights = [];
    const litWins = [];

    function addWin(x, y, z, w, h, rotY = 0, lit = false) {
      // Recessed reveal (dark border)
      const reveal = new THREE.Mesh(new THREE.BoxGeometry(w+0.18, h+0.18, 0.12), mDark);
      reveal.position.set(x, y, z); reveal.rotation.y = rotY;
      house.add(reveal);
      const mat = lit ? mWinLit : mWinCool;
      const glass = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.09), mat);
      glass.position.set(x, y, z + (rotY ? 0 : 0.025)); glass.rotation.y = rotY;
      house.add(glass);
      if (lit) {
        const spill = new THREE.PointLight(0xf89820, 1.1, 4.5);
        spill.position.set(x + (rotY ? 0.4 : 0), y, z + (rotY ? 0 : 0.6));
        house.add(spill);
        windowLights.push(spill);
      }
      return glass;
    }

    // Three large picture windows on front — nearly floor to ceiling
    litWins.push(addWin(-1.8, 1.35, 1.72, 1.2, 1.8, 0, true));
    litWins.push(addWin( 0.2, 1.35, 1.72, 1.2, 1.8, 0, false));
    // Small right window
    litWins.push(addWin( 2.0, 1.2, 1.72, 0.7, 0.95, 0, true));
    // Side window
    addWin(-2.82, 1.3, 0, 0.9, 1.1, Math.PI/2, false);
    // High clerestory window (adds interest)
    litWins.push(addWin(-0.8, 2.35, 1.725, 2.4, 0.28, 0, true));

    // ── ENTRANCE ─────────────────────────────────────────────────────
    // Recessed canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.8), mDark);
    canopy.position.set(-3.4, 2.45, 2.1);
    house.add(canopy);
    const canopyPost = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.4, 0.07), mMetal);
    canopyPost.position.set(-3.4, 1.2, 2.46);
    house.add(canopyPost);

    // Door
    const doorReveal = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.2, 0.1), mDark);
    doorReveal.position.set(-3.4, 1.1, 1.72);
    house.add(doorReveal);
    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.05, 0.08), mDoor);
    doorMesh.position.set(-3.4, 1.1, 1.725); doorMesh.castShadow = true;
    house.add(doorMesh);
    // Handle — horizontal bar
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.35, 8), mMetal);
    handle.rotation.z = Math.PI/2;
    handle.position.set(-3.08, 1.1, 1.77);
    house.add(handle);
    // Door sidelight
    const sideLight = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.6, 0.08), mWinLit);
    sideLight.position.set(-2.87, 1.1, 1.726);
    house.add(sideLight);
    litWins.push(sideLight);

    // Steps
    [[1.9, 0.08], [2.2, -0.04]].forEach(([z, y]) => {
      house.add(Object.assign(
        new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.5), mWall2),
        { position: new THREE.Vector3(-3.4, y, z) }
      ));
    });

    // ── SOLAR PANELS (flush on roof) ─────────────────────────────────
    function makeSolarArray(cols, rows) {
      const g = new THREE.Group();
      const pw = 0.72, ph = 0.44, gap = 0.04;
      const tW = cols*pw + (cols-1)*gap, tH = rows*ph + (rows-1)*gap;
      // mount frame
      const bg = new THREE.Mesh(new THREE.BoxGeometry(tW+0.08, 0.04, tH+0.08), mFrame);
      g.add(bg);
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cell = new THREE.Mesh(new THREE.BoxGeometry(pw, 0.05, ph), mSolar);
          cell.position.set(-tW/2+pw/2+c*(pw+gap), 0.004, -tH/2+ph/2+r*(ph+gap));
          g.add(cell);
          // cell grid
          for (let k = 1; k < 6; k++) {
            const ln = new THREE.Mesh(new THREE.BoxGeometry(pw*0.95, 0.055, 0.006), mFrame);
            ln.position.set(-tW/2+pw/2+c*(pw+gap), 0.006, -tH/2+ph/2+r*(ph+gap)-ph/2+k*ph/6);
            g.add(ln);
          }
        }
      }
      return g;
    }

    // Flat-mounted on roof (no slope — contemporary villa has flat roof)
    const solarArray = makeSolarArray(5, 2);
    solarArray.position.set(-0.8, 2.7, 0);
    solarArray.rotation.x = 0.12; // slight tilt for solar optimisation
    house.add(solarArray);

    // ── EV CHARGER ──────────────────────────────────────────────────
    const evG = new THREE.Group();
    evG.position.set(4.55, 1.15, 1.62);
    house.add(evG);
    const evBox = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.65, 0.16), mDark);
    evG.add(evBox);
    // Screen
    const evScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.13),
      new THREE.MeshBasicMaterial({ color: 0x28ffb0 }));
    evScreen.position.set(0, 0.16, 0.082); evG.add(evScreen);
    // LED dot
    const evLED = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x28ffb0 }));
    evLED.position.set(0, -0.1, 0.082); evG.add(evLED);
    const evRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.006, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x28ffb0 }));
    evRing.position.set(0, -0.1, 0.083); evG.add(evRing);
    const evGlow = new THREE.PointLight(0x28ffb0, 0.9, 2.8);
    evGlow.position.set(4.55, 1.0, 1.85);
    scene.add(evGlow);

    // ── EV CAR ──────────────────────────────────────────────────────
    const car = new THREE.Group();
    scene.add(car);
    car.position.set(5.8, 0, 3.2);
    car.rotation.y = Math.PI / 5;
    // Long, low sedan proportions
    const cBody = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.5, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x162a50, roughness: 0.25, metalness: 0.82 }));
    cBody.castShadow = true; car.add(cBody);
    const cTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.96),
      new THREE.MeshStandardMaterial({ color: 0x0c1828, roughness: 0.16, metalness: 0.7 }));
    cTop.position.set(-0.15, 0.44, 0); car.add(cTop);
    const cGlass = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.33, 0.97),
      new THREE.MeshStandardMaterial({ color: 0x4070b8, roughness: 0.03, metalness: 0.85, transparent: true, opacity: 0.45 }));
    cGlass.position.copy(cTop.position); car.add(cGlass);
    // Rocker panel / sill
    car.add(Object.assign(
      new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.06, 1.02),
        new THREE.MeshStandardMaterial({ color: 0x0a1020, roughness: 0.4 })),
      { position: new THREE.Vector3(0, -0.27, 0) }
    ));
    // Wheels — proper tyre + alloy
    const wMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 });
    const aMat = new THREE.MeshStandardMaterial({ color: 0xc0ccd8, roughness: 0.15, metalness: 0.95 });
    [[-0.72,-0.25,0.52],[0.72,-0.25,0.52],[-0.72,-0.25,-0.52],[0.72,-0.25,-0.52]].forEach(p => {
      const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 24), wMat);
      tyre.rotation.x = Math.PI/2; tyre.position.set(...p); tyre.castShadow = true; car.add(tyre);
      const alloy = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.21, 10), aMat);
      alloy.rotation.x = Math.PI/2; alloy.position.set(...p); car.add(alloy);
    });
    // DRL headlights (thin strip)
    const drl = new THREE.MeshBasicMaterial({ color: 0xfff6e0 });
    [0.38,-0.38].forEach(z => {
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.06), drl);
      h.position.set(1.16, 0.1, z); car.add(h);
    });

    // ── BATTERY CABINET ─────────────────────────────────────────────
    const batt = new THREE.Group();
    batt.position.set(-3.5, 0.85, 1.72);
    house.add(batt);
    const battBody2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.6, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x10203a, roughness: 0.35, metalness: 0.62 }));
    battBody2.castShadow = true;
    batt.add(battBody2);
    // Brand stripe
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.015),
      new THREE.MeshBasicMaterial({ color: 0x6090c0 }));
    stripe.position.set(0, 0.65, 0.165); batt.add(stripe);
    const battBars = [];
    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.07, 0.015),
        new THREE.MeshBasicMaterial({ color: 0xf4a030, transparent: true, opacity: 1 }));
      bar.position.set(0, -0.45 + i*0.22, 0.165);
      batt.add(bar); battBars.push(bar);
    }

    // ── ARCHITECTURAL HEDGES (replace childish cone trees) ────────────
    const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x0e2218, roughness: 0.96 });
    const hedgeMat2 = new THREE.MeshStandardMaterial({ color: 0x122a1e, roughness: 0.97 });
    // Formal box hedges along left side of house
    [[-4.5, 0.5, -0.5], [-4.5, 0.5, 0.8], [-4.5, 0.5, 2.1]].forEach(([x,h,z]) => {
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(0.55, h, 0.55), hedgeMat);
      hedge.position.set(x, h/2, z);
      hedge.castShadow = true;
      scene.add(hedge);
    });
    // Tall columnar forms (like yew columns — very Nordic/formal)
    [[-5.5, 2.8, -0.5], [-5.5, 2.4, 1.5], [6.0, 2.2, -1.5]].forEach(([x, h, z]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.35, h, 0.35), hedgeMat2);
      col.position.set(x, h/2, z);
      col.castShadow = true;
      scene.add(col);
    });
    // Low hedge row along driveway edge
    for (let i = 0; i < 5; i++) {
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.45), hedgeMat);
      h.position.set(1.5 + i*0.9, 0.2, -2.0);
      h.castShadow = true;
      scene.add(h);
    }

    // ── SUN ORB ──────────────────────────────────────────────────────
    const SUN_POS = new THREE.Vector3(8, 9, -6);
    const sunOrb = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffe070 }));
    sunOrb.position.copy(SUN_POS);
    scene.add(sunOrb);

    const coronaLayers = [];
    [[1.05, 0xffd060, 0.50], [1.5, 0xf4a020, 0.28], [2.4, 0xf07010, 0.12]].forEach(([r, col, op]) => {
      const c = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false }));
      c.position.copy(SUN_POS);
      scene.add(c); coronaLayers.push(c);
    });

    // Sun ray spokes (thin planes rotating around sun)
    const sunRayGroup = new THREE.Group();
    sunRayGroup.position.copy(SUN_POS);
    scene.add(sunRayGroup);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xffd060, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide
    });
    const rays = [];
    for (let i = 0; i < 18; i++) {
      const ray = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 2.8), rayMat.clone());
      const a = (i / 18) * Math.PI * 2;
      ray.position.set(Math.cos(a) * 1.7, Math.sin(a) * 1.7, 0);
      ray.rotation.z = a + Math.PI/2;
      sunRayGroup.add(ray); rays.push(ray);
    }

    // ── STARS ────────────────────────────────────────────────────────
    const starCount = 380;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2*Math.random()-1) * 0.5;
      const r = 65 + Math.random() * 20;
      starPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
      starPos[i*3+1] = Math.max(1.5, r * Math.cos(ph));
      starPos[i*3+2] = r * Math.sin(ph) * Math.sin(th);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo,
      new THREE.PointsMaterial({ color: 0xb4cce8, size: 0.22, sizeAttenuation: true, transparent: true, opacity: 0.85 }));
    scene.add(stars);

    // ── ENERGY PARTICLES (bezier arc: sun → solar panels) ────────────
    const particles = [];
    for (let i = 0; i < 42; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xffd060, transparent: true, opacity: 0 }));
      p.userData.t = Math.random();
      p.userData.side = Math.random() < 0.5 ? -1 : 1;
      p.userData.speed = 0.28 + Math.random() * 0.18;
      scene.add(p); particles.push(p);
    }

    // ── POINTER / TOUCH / GYRO ORBIT ─────────────────────────────────
    let tY = 0, tX = 0, cY = 0, cX = 0;

    const onPointer = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      tY = (cx / window.innerWidth  * 2 - 1) * 0.18;
      tX = -(cy / window.innerHeight * 2 - 1) * 0.06;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchmove',   onPointer, { passive: true });

    // Device orientation (gyroscope on phones)
    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma == null) return;
        tY =  (e.gamma / 25) * 0.18;
        tX = -((e.beta  - 45) / 25) * 0.06;
      }, { passive: true });
    }

    // ── TICK ─────────────────────────────────────────────────────────
    o.tick = (dt, t) => {
      cY += (tY - cY) * 0.045;
      cX += (tX - cX) * 0.045;

      // Camera orbit
      const ang = Math.sin(t * 0.11) * 0.13 + cY;
      const rad = 16.5;
      camera.position.x = Math.sin(ang) * rad * 0.55;
      camera.position.z = Math.cos(ang) * rad;
      camera.position.y = 5.4 + cX * 1.4 + Math.sin(t * 0.22) * 0.12;
      camera.lookAt(0, 1.6, 0);

      // Sun pulse
      const sc = 1 + Math.sin(t * 1.4) * 0.05;
      sunOrb.scale.setScalar(sc);
      sunOrb.material.color.setHSL(0.115, 0.92, 0.70 + Math.sin(t * 2.2) * 0.05);
      coronaLayers.forEach((c, i) => {
        c.scale.setScalar(1 + Math.sin(t * 1.1 + i * 0.8) * 0.07);
        c.material.opacity = [0.50, 0.28, 0.12][i] * (0.8 + Math.sin(t * 0.9) * 0.2);
      });
      sunRayGroup.rotation.z = t * 0.07;
      rays.forEach((r, i) => {
        r.material.opacity = 0.05 + Math.sin(t * 1.6 + i * 0.35) * 0.09;
      });

      // Energy particles: bezier from sun to solar array on flat roof
      const leftTarget  = new THREE.Vector3(-1.8, 2.76, 0.4);
      const rightTarget = new THREE.Vector3( 0.8, 2.76, -0.2);
      particles.forEach(p => {
        p.userData.t += dt * p.userData.speed;
        if (p.userData.t > 1) {
          p.userData.t = 0;
          p.userData.side = Math.random() < 0.5 ? -1 : 1;
        }
        const k = p.userData.t;
        const tgt = p.userData.side < 0 ? leftTarget : rightTarget;
        // quadratic bezier with control point arcing above
        const cx = (SUN_POS.x + tgt.x) * 0.5 + (p.userData.side) * 0.5;
        const cy = (SUN_POS.y + tgt.y) * 0.5 + 2.5;
        const cz = (SUN_POS.z + tgt.z) * 0.5;
        const k1 = 1 - k;
        p.position.x = k1*k1*SUN_POS.x + 2*k1*k*cx + k*k*tgt.x;
        p.position.y = k1*k1*SUN_POS.y + 2*k1*k*cy + k*k*tgt.y;
        p.position.z = k1*k1*SUN_POS.z + 2*k1*k*cz + k*k*tgt.z;
        const fade = Math.sin(k * Math.PI);
        p.material.opacity = fade * 0.9;
        p.scale.setScalar(0.4 + fade * 0.9);
      });

      // Window flicker
      litWins.forEach((w, i) => {
        if (w.material.emissiveIntensity !== undefined)
          w.material.emissiveIntensity = 1.5 + Math.sin(t * 0.65 + i * 1.4) * 0.22;
      });
      windowLights.forEach((l, i) => {
        l.intensity = 0.8 + Math.sin(t * 0.65 + i * 1.4) * 0.2;
      });

      // EV LED pulse
      evLED.material.color.setHSL(0.38, 1.0, 0.5 + Math.sin(t * 3.2) * 0.22);
      evRing.material.color.setHSL(0.38 + Math.sin(t*2)*0.02, 1.0, 0.5 + Math.sin(t*3.2)*0.18);

      // Battery bars wave fill
      battBars.forEach((b, i) => {
        const filled = i <= 2 + Math.sin(t * 0.6) * 1.5;
        b.material.color.setHSL(0.10 + i*0.015, 0.92, filled ? 0.55 + Math.sin(t*2+i)*0.1 : 0.15);
        b.material.opacity = filled ? 1 : 0.18;
      });

      // Stars twinkle
      stars.material.opacity = 0.65 + Math.sin(t * 1.2) * 0.2;

      // Horizon glow pulse
      horiz.material.opacity = 0.12 + Math.sin(t * 0.5) * 0.04;
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
