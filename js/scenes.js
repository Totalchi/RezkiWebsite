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
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.setClearColor(0x000000, 0);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.outputColorSpace = THREE.SRGBColorSpace;
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

  /* ---------------- HERO: villa with sun rays, solar, EV, battery ---------------- */
  function buildHero(o, THREE) {
    const { scene, camera } = o;
    camera.position.set(5.5, 4.2, 8);
    camera.lookAt(0, 1.2, 0);

    scene.fog = new THREE.Fog(0x0a1628, 14, 30);

    // lighting
    const amb = new THREE.AmbientLight(0x5a6e8c, 0.55);
    scene.add(amb);
    const sun = new THREE.DirectionalLight(0xffd98a, 1.8);
    sun.position.set(6, 8, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 0.1;
    sun.shadow.camera.far = 30;
    sun.shadow.camera.left = -10; sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10; sun.shadow.camera.bottom = -10;
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x6a8ec8, 0.6);
    rim.position.set(-6, 4, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xf4a438, 1.2, 14);
    fill.position.set(-2, 3.5, 3);
    scene.add(fill);

    // materials
    const matWall = new THREE.MeshStandardMaterial({ color: 0xe6e1d6, roughness: 0.85, metalness: 0.05 });
    const matWall2 = new THREE.MeshStandardMaterial({ color: 0xd8d0bf, roughness: 0.9 });
    const matTrim = new THREE.MeshStandardMaterial({ color: 0x1d2d48, roughness: 0.65 });
    const matRoof = new THREE.MeshStandardMaterial({ color: 0x2a2320, roughness: 0.7, metalness: 0.2 });
    const matWindow = new THREE.MeshStandardMaterial({ color: 0x5b7aa8, roughness: 0.12, metalness: 0.6, emissive: 0x0a1e36, emissiveIntensity: 0.35 });
    const matWindowLit = new THREE.MeshStandardMaterial({ color: 0xffd98a, emissive: 0xf4a438, emissiveIntensity: 0.9, roughness: 0.2 });
    const matSolar = new THREE.MeshStandardMaterial({ color: 0x0b1b2e, roughness: 0.25, metalness: 0.7, emissive: 0x0a2340, emissiveIntensity: 0.2 });
    const matSolarFrame = new THREE.MeshStandardMaterial({ color: 0xc0c7d1, roughness: 0.3, metalness: 0.9 });
    const matGround = new THREE.MeshStandardMaterial({ color: 0x101d34, roughness: 0.95 });
    const matGrass = new THREE.MeshStandardMaterial({ color: 0x1a3a2b, roughness: 0.95 });
    const matDoor = new THREE.MeshStandardMaterial({ color: 0x7a3319, roughness: 0.6 });
    const matMetal = new THREE.MeshStandardMaterial({ color: 0xb6bac2, roughness: 0.4, metalness: 0.85 });

    // ground
    const ground = new THREE.Mesh(new THREE.CircleGeometry(14, 64), matGround);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // grass patch
    const grass = new THREE.Mesh(new THREE.CircleGeometry(5.5, 48), matGrass);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = 0.005;
    scene.add(grass);

    // HOUSE GROUP
    const house = new THREE.Group();
    scene.add(house);

    // main body
    const body = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 3), matWall);
    body.position.y = 1.1;
    body.castShadow = true; body.receiveShadow = true;
    house.add(body);

    // side wing
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2, 1.8, 2.2), matWall2);
    wing.position.set(2.6, 0.9, 0.3);
    wing.castShadow = true; wing.receiveShadow = true;
    house.add(wing);

    // trim band
    const trim = new THREE.Mesh(new THREE.BoxGeometry(4.02, 0.1, 3.02), matTrim);
    trim.position.y = 0.2;
    house.add(trim);

    // ROOF (pitched) — main
    const roofGeo = new THREE.BufferGeometry();
    const rv = new Float32Array([
      // front triangle
      -2.1, 2.2,  1.6,   2.1, 2.2,  1.6,   0, 3.6,  1.6,
      // back triangle
      -2.1, 2.2, -1.6,   0, 3.6, -1.6,   2.1, 2.2, -1.6,
      // left slope
      -2.1, 2.2,  1.6,   0, 3.6,  1.6,   0, 3.6, -1.6,
      -2.1, 2.2,  1.6,   0, 3.6, -1.6,  -2.1, 2.2, -1.6,
      // right slope
       2.1, 2.2,  1.6,   0, 3.6, -1.6,   0, 3.6,  1.6,
       2.1, 2.2,  1.6,   2.1, 2.2, -1.6,   0, 3.6, -1.6,
    ]);
    roofGeo.setAttribute('position', new THREE.BufferAttribute(rv, 3));
    roofGeo.computeVertexNormals();
    const roof = new THREE.Mesh(roofGeo, matRoof);
    roof.castShadow = true; roof.receiveShadow = true;
    roof.position.y = 0;
    house.add(roof);

    // roof of wing (flatter)
    const wingRoofGeo = new THREE.BufferGeometry();
    const wrv = new Float32Array([
      -1.05, 1.8, 1.2,   1.05, 1.8, 1.2,   0, 2.5, 1.2,
      -1.05, 1.8, -1.0,  0, 2.5, -1.0,   1.05, 1.8, -1.0,
      -1.05, 1.8, 1.2,   0, 2.5, 1.2,   0, 2.5, -1.0,
      -1.05, 1.8, 1.2,   0, 2.5, -1.0,  -1.05, 1.8, -1.0,
       1.05, 1.8, 1.2,   0, 2.5, -1.0,   0, 2.5, 1.2,
       1.05, 1.8, 1.2,   1.05, 1.8, -1.0,   0, 2.5, -1.0,
    ]);
    wingRoofGeo.setAttribute('position', new THREE.BufferAttribute(wrv, 3));
    wingRoofGeo.computeVertexNormals();
    const wingRoof = new THREE.Mesh(wingRoofGeo, matRoof);
    wingRoof.position.set(2.6, 0, 0.3);
    wingRoof.castShadow = true;
    house.add(wingRoof);

    // windows
    function addWindow(x, y, z, w, h, rotY = 0, lit = false) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, h + 0.12, 0.08), matTrim);
      f.position.set(x, y, z);
      f.rotation.y = rotY;
      house.add(f);
      const g = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), lit ? matWindowLit : matWindow);
      g.position.set(x, y, z + 0.03);
      g.rotation.y = rotY;
      house.add(g);
      // cross
      const cV = new THREE.Mesh(new THREE.BoxGeometry(0.04, h, 0.1), matTrim);
      cV.position.set(x, y, z + 0.04);
      cV.rotation.y = rotY;
      house.add(cV);
      const cH = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, 0.1), matTrim);
      cH.position.set(x, y, z + 0.04);
      cH.rotation.y = rotY;
      house.add(cH);
      return g;
    }

    // front face windows (z = 1.5)
    const w1 = addWindow(-1.1, 1.2, 1.51, 0.8, 0.9, 0, true);
    const w2 = addWindow( 1.1, 1.2, 1.51, 0.8, 0.9, 0, false);
    const w3 = addWindow(2.6, 1.0, 1.41, 0.7, 0.8, 0, true);
    // side window
    addWindow(-2.01, 1.2, 0, 0.7, 0.9, Math.PI / 2, false);

    // door
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.1), matDoor);
    door.position.set(0, 0.85, 1.52);
    door.castShadow = true;
    house.add(door);
    const doorHandle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), matMetal);
    doorHandle.position.set(0.28, 0.85, 1.58);
    house.add(doorHandle);
    // door step
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.4), matWall2);
    step.position.set(0, 0.08, 1.75);
    house.add(step);

    // chimney
    const chim = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 0.4), matWall2);
    chim.position.set(1.2, 3.05, -0.3);
    chim.castShadow = true;
    house.add(chim);

    // SOLAR PANELS on roof (both slopes)
    const panelGroup = new THREE.Group();
    house.add(panelGroup);
    const pW = 0.65, pH = 0.4, pGap = 0.05;
    // Left slope: normal points toward +z-slope; tilt
    function solarOn(flip) {
      const panel = new THREE.Group();
      // 4x2 array
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          const cell = new THREE.Mesh(new THREE.BoxGeometry(pW, 0.03, pH), matSolar);
          cell.position.set(
            (i - 1.5) * (pW + pGap),
            0,
            (j - 0.5) * (pH + pGap)
          );
          cell.castShadow = true;
          panel.add(cell);
          // grid lines
          for (let k = 1; k < 4; k++) {
            const line = new THREE.Mesh(new THREE.BoxGeometry(pW * 0.98, 0.032, 0.01), matSolarFrame);
            line.position.set((i - 1.5) * (pW + pGap), 0.001, (j - 0.5) * (pH + pGap) - pH/2 + k * pH/4);
            panel.add(line);
          }
          for (let k = 1; k < 2; k++) {
            const line = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.032, pH * 0.98), matSolarFrame);
            line.position.set((i - 1.5) * (pW + pGap) - pW/2 + k * pW/2, 0.001, (j - 0.5) * (pH + pGap));
            panel.add(line);
          }
        }
      }
      const frame = new THREE.Mesh(new THREE.BoxGeometry(4 * (pW + pGap), 0.02, 2 * (pH + pGap) + 0.05), matSolarFrame);
      frame.position.y = -0.01;
      panel.add(frame);
      return panel;
    }
    const leftSolar = solarOn(false);
    // Left slope plane: apex at y=3.6, eave at y=2.2, width 4.2, depth 1.6 (in x dir)
    // tilt around z
    const slopeAngle = Math.atan2(3.6 - 2.2, 2.1); // ~0.59 rad
    // Left slope faces +x (eave at x=-2.1, apex at x=0)
    leftSolar.position.set(-1.1, 2.95, 0);
    leftSolar.rotation.z = slopeAngle;
    // rotate so panels lie on slope: also should face forward toward viewer; keep as-is
    panelGroup.add(leftSolar);

    // right slope
    const rightSolar = solarOn(true);
    rightSolar.position.set(1.1, 2.95, 0);
    rightSolar.rotation.z = -slopeAngle;
    panelGroup.add(rightSolar);

    // ---- EV CHARGER on side of wing ----
    const evGroup = new THREE.Group();
    evGroup.position.set(3.65, 1.0, 1.2);
    house.add(evGroup);
    const evBody = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.55, 0.15), matTrim);
    evGroup.add(evBody);
    const evScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.12), matWindowLit);
    evScreen.position.set(0, 0.12, 0.076);
    evGroup.add(evScreen);
    const evLED = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 10), new THREE.MeshBasicMaterial({ color: 0x4cff8a }));
    evLED.position.set(0, -0.1, 0.076);
    evGroup.add(evLED);
    // cable — a quick curve
    const evCablePts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = -0.1 - t * 0.9;
      const y = -0.2 - Math.sin(t * Math.PI) * 0.35;
      const z = 0;
      evCablePts.push(new THREE.Vector3(x, y, z));
    }
    const cableCurve = new THREE.CatmullRomCurve3(evCablePts);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 24, 0.02, 8, false);
    const cable = new THREE.Mesh(cableGeo, new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }));
    evGroup.add(cable);

    // ---- EV car (simplified) ----
    const car = new THREE.Group();
    scene.add(car);
    car.position.set(4.8, 0.35, 3.0);
    car.rotation.y = Math.PI / 6;
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.9), new THREE.MeshStandardMaterial({ color: 0x1a3358, roughness: 0.35, metalness: 0.7 }));
    carBody.castShadow = true;
    car.add(carBody);
    const carTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 0.85), new THREE.MeshStandardMaterial({ color: 0x0f1d34, roughness: 0.2, metalness: 0.6 }));
    carTop.position.set(-0.1, 0.4, 0);
    car.add(carTop);
    // windows (side)
    const carWin = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 0.86), new THREE.MeshStandardMaterial({ color: 0x5b7aa8, roughness: 0.1, metalness: 0.7, transparent: true, opacity: 0.65 }));
    carWin.position.set(-0.1, 0.4, 0);
    car.add(carWin);
    // wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
    const wheelPos = [[-0.55, -0.25, 0.46], [0.55, -0.25, 0.46], [-0.55, -0.25, -0.46], [0.55, -0.25, -0.46]];
    wheelPos.forEach(p => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 18), wheelMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(...p);
      car.add(w);
    });
    // headlight glow (fake)
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffe7a8 }));
    hl.position.set(0.92, 0, 0.3); car.add(hl);
    const hl2 = hl.clone(); hl2.position.set(0.92, 0, -0.3); car.add(hl2);

    // ---- battery cabinet near house ----
    const batt = new THREE.Group();
    batt.position.set(-3.2, 0.6, 1.5);
    scene.add(batt);
    const battBody = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.3), new THREE.MeshStandardMaterial({ color: 0x1d2d48, roughness: 0.4, metalness: 0.5 }));
    battBody.castShadow = true;
    batt.add(battBody);
    for (let i = 0; i < 4; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.01), new THREE.MeshStandardMaterial({ color: 0xf4a438, emissive: 0xf4a438, emissiveIntensity: 1.5 }));
      bar.position.set(0, -0.3 + i * 0.18, 0.151);
      batt.add(bar);
    }

    // ---- fence / small trees ----
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x2e4a38, roughness: 0.9 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1e, roughness: 0.9 });
    function tree(x, z, h = 1) {
      const g = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.6 * h, 8), trunkMat);
      trunk.position.y = 0.3 * h;
      trunk.castShadow = true;
      g.add(trunk);
      const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.45 * h, 1.1 * h, 10), treeMat);
      leaves.position.y = 1.1 * h;
      leaves.castShadow = true;
      g.add(leaves);
      g.position.set(x, 0, z);
      scene.add(g);
      return g;
    }
    tree(-4.2, 2.5, 1.2);
    tree(-3.5, -2.8, 0.9);
    tree(4.2, -2.5, 1.1);
    tree(-4.8, -0.5, 1.0);

    // ---- SUN in sky + rays ----
    const sunGroup = new THREE.Group();
    sunGroup.position.set(5.2, 6.5, -2);
    scene.add(sunGroup);
    const sunOrb = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffd98a }));
    sunGroup.add(sunOrb);
    const sunHalo = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), new THREE.MeshBasicMaterial({ color: 0xf4a438, transparent: true, opacity: 0.35 }));
    sunGroup.add(sunHalo);
    // rays (thin cones)
    const rayMat = new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.4 });
    const rays = [];
    const RAY_COUNT = 14;
    for (let i = 0; i < RAY_COUNT; i++) {
      const ray = new THREE.Mesh(new THREE.ConeGeometry(0.06, 1.4, 6), rayMat);
      const a = (i / RAY_COUNT) * Math.PI * 2;
      ray.position.set(Math.cos(a) * 1.1, Math.sin(a) * 1.1, 0);
      ray.rotation.z = a - Math.PI / 2;
      sunGroup.add(ray);
      rays.push(ray);
    }

    // energy particles flowing from sun to panels
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.95 });
    const particles = [];
    for (let i = 0; i < 28; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), particleMat);
      p.userData.t = Math.random();
      p.userData.target = Math.random() < 0.5 ? 'left' : 'right';
      scene.add(p);
      particles.push(p);
    }

    // stars backdrop
    const starGeo = new THREE.BufferGeometry();
    const starCount = 150;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i*3 + 0] = (Math.random() - 0.5) * 30;
      starPos[i*3 + 1] = Math.random() * 12 + 2;
      starPos[i*3 + 2] = -10 + (Math.random() - 0.5) * 6;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x9fb3d1, size: 0.04, transparent: true, opacity: 0.7 }));
    scene.add(stars);

    // interaction: pointer orbit
    let targetRotY = 0, targetRotX = 0;
    let currentRotY = 0, currentRotX = 0;
    o.canvas.parentElement.addEventListener('pointermove', (e) => {
      const r = o.canvas.parentElement.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      targetRotY = nx * 0.25;
      targetRotX = -ny * 0.1;
    });

    const group = new THREE.Group();
    scene.add(group);
    // everything stays in world; we orbit the camera instead

    // window light flicker state
    const litWins = [w1, w3];

    o.tick = (dt, t) => {
      // camera orbit gently
      currentRotY += (targetRotY - currentRotY) * 0.04;
      currentRotX += (targetRotX - currentRotX) * 0.04;
      const baseA = Math.sin(t * 0.15) * 0.15;
      const rad = 9.5;
      const ang = baseA + currentRotY;
      camera.position.x = Math.sin(ang) * rad * 0.8 + Math.cos(ang) * 2;
      camera.position.z = Math.cos(ang) * rad;
      camera.position.y = 4.2 + currentRotX * 2 + Math.sin(t * 0.3) * 0.1;
      camera.lookAt(0.3, 1.6, 0);

      // sun pulse
      sunHalo.scale.setScalar(1 + Math.sin(t * 1.2) * 0.08);
      sunOrb.material.color.setHSL(0.12, 0.85, 0.72 + Math.sin(t * 2) * 0.05);
      // rays rotate
      sunGroup.rotation.z = t * 0.1;
      rays.forEach((r, i) => {
        r.material.opacity = 0.25 + Math.sin(t * 2 + i) * 0.15;
      });

      // particles travel from sun to left/right solar
      const sunPos = new THREE.Vector3().copy(sunGroup.position);
      const leftTarget = new THREE.Vector3(-1.1, 3.1, 0);
      const rightTarget = new THREE.Vector3(1.1, 3.1, 0);
      particles.forEach((p) => {
        p.userData.t += dt * 0.4;
        if (p.userData.t > 1) {
          p.userData.t = 0;
          p.userData.target = Math.random() < 0.5 ? 'left' : 'right';
        }
        const tgt = p.userData.target === 'left' ? leftTarget : rightTarget;
        const k = p.userData.t;
        // arc
        p.position.x = sunPos.x + (tgt.x - sunPos.x) * k;
        p.position.y = sunPos.y + (tgt.y - sunPos.y) * k + Math.sin(k * Math.PI) * 0.5;
        p.position.z = sunPos.z + (tgt.z - sunPos.z) * k;
        p.material.opacity = Math.sin(k * Math.PI);
      });

      // EV LED breathing
      evLED.material.color.setHSL(0.35, 1.0, 0.5 + Math.sin(t * 3) * 0.2);

      // battery bars pulse
      batt.children.slice(1).forEach((bar, i) => {
        bar.material.emissiveIntensity = 1 + Math.sin(t * 1.5 + i * 0.4) * 0.5;
      });

      // window light flicker
      litWins.forEach((w, i) => {
        w.material.emissiveIntensity = 0.8 + Math.sin(t * 0.8 + i) * 0.15;
      });

      // stars twinkle
      stars.material.opacity = 0.5 + Math.sin(t * 1.3) * 0.15;
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
