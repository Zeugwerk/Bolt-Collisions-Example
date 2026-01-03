// ================= Scene & Renderer =================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 100);
camera.position.set(3,3,3);
camera.up.set(0,1,0);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ================= Lights =================
scene.add(new THREE.AmbientLight(0x404040));
const dirLight = new THREE.DirectionalLight(0xffffff,1);
dirLight.position.set(5,2,5);
scene.add(dirLight);

// ================= Grid =================
scene.add(new THREE.GridHelper(10,20));

// ================= Controls =================
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0);
controls.update();

// ================= Storage =================
const objects = new Map();
const activeCollisions = new Set();

// ================= Debug Root =================
const debugRoot = new THREE.Group();
const closestPerObject = new Map();
scene.add(debugRoot);

const debugPairs = new Map(); // pairKey -> { aSphere, bSphere, line }

// ================= Spark System =================
const sparks = [];
const sparkGroup = new THREE.Group();
scene.add(sparkGroup);

function spawnMetalSparks(pos, normal){

  // 🔒 hard limit
  while (sparks.length > 500) {
    const s = sparks.shift();
    sparkGroup.remove(s);
    s.geometry.dispose();
    s.material.dispose();
  }

  const count = 50 + Math.floor(Math.random()*80);

  for(let i=0;i<count;i++){
    const len = 0.04 + Math.random()*0.09;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([0,0,0, 0,0,len]),
        3
      )
    );

    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(
        0.06 + Math.random()*0.08, // orange → yellow
        1.0,
        0.6
      ),
      transparent: true,
      opacity: 1
    });

    const line = new THREE.Line(geo, mat);
    line.position.copy(pos);

    // randomly flip direction (both sides of surface)
    const sign = Math.random() < 0.5 ? -1 : 1;

    // narrow impact cone
    const dir = normal.clone().multiplyScalar(sign)
      .add(new THREE.Vector3(
        (Math.random()-0.5) * 0.45,
        (Math.random()-0.5) * 0.45,
        (Math.random()-0.5) * 0.45
      ))
      .normalize();

    line.quaternion.setFromUnitVectors(
      new THREE.Vector3(0,0,1),
      dir
    );

    line.userData = {
      vel: dir.clone().multiplyScalar(3.5 + Math.random()*5.0),
      life: 0.10 + Math.random()*0.15
    };

    sparkGroup.add(line);
    sparks.push(line);
  }
}

// ================= Debug Helpers =================
function debugSphere(color){
  return new THREE.Mesh(
    new THREE.SphereGeometry(0.005,8,8),
    new THREE.MeshBasicMaterial({color})
  );
}

function debugLine(){
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6),3));
  return new THREE.Line(geo, new THREE.LineBasicMaterial({color:0xffffff, opacity: 0.5, transparent: true}));
}

function setHullByDistance(hull, distance) {
  const maxDist = 0.1;

  // Clamp and normalize (0 = far, 1 = collision)
  const t = THREE.MathUtils.clamp(1 - distance / maxDist, 0, 1);

  let hue;
  if (t < 0.5) {
    // green → yellow
    hue = THREE.MathUtils.lerp(0.33, 0.16, t * 2);
  } else {
    // yellow → red
    hue = THREE.MathUtils.lerp(0.16, 0.0, (t - 0.5) * 2);
  }

  const color = new THREE.Color().setHSL(hue, 1.0, 0.5);

  hull.material.color.copy(color);
  hull.material.emissiveIntensity = 0.25 + t * 0.75;
  hull.material.opacity = 0.12 + t * 0.4;
}

// ================= Hull Material =================
function createHullMaterial(color){
  return new THREE.MeshBasicMaterial({
    color: 0x00ff00,          // neon green
    wireframe: false,
    transparent: true,
    opacity: 0.9,
    depthTest: true,
    depthWrite: true
  });
}

// ================= Mesh Creation =================
function createMesh(link){
  const group = new THREE.Group();
  group.name = link.Name;

  link.Collisions.forEach(c=>{

    // colors:
    let dark_blue = new THREE.Color(42.0 / 255, 51.0 / 255.0, 75.0 / 255.0);
    let mid_blue = new THREE.Color( 71.0 / 255, 91.0 / 255, 120.0 / 255);
    let light_blue = new THREE.Color( 202.0 / 255, 208.0 / 255, 222.0 / 255);
    let red = new THREE.Color( 218.0 / 255, 119.0 / 255, 109.0 / 255);
    let whitish = new THREE.Color( 245.0 / 255, 241.0 / 255, 238.0 / 255);

    let geo,color;
    switch(c.Type){
      case "box":
        geo = new THREE.BoxGeometry(c.SizeX,c.SizeZ,c.SizeY);
        color = c.SizeX > 1 ? dark_blue : light_blue;
        break;
      case "sphere":
        geo = new THREE.SphereGeometry(c.Radius,16,16);
        color = light_blue;
        break;
      case "cylinder":
        geo = new THREE.CylinderGeometry(c.Radius,c.Radius,c.SizeX,16);
        color = c.Radius > 0.1 ? light_blue : mid_blue;
        break;
      default:
        geo = new THREE.BoxGeometry(0.1,0.1,0.1);
        color = new THREE.Color(0.5,0.5,0.5);
    }

    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({color,roughness:0.7,metalness:0.6})
    );
    group.add(mesh);

    const hull = new THREE.Mesh(geo.clone(), createHullMaterial(color));
    hull.scale.multiplyScalar(1.05);
    hull.visible = false;
    mesh.userData.hull = hull;
    group.add(hull);
  });

  scene.add(group);
  objects.set(link.Name, group);
  return group;
}

// ================= WebSocket =================
const ws = new WebSocket("ws://192.168.178.39:55735/ws");

ws.onmessage = ev=>{
  const state = JSON.parse(ev.data);
  activeCollisions.clear();

  // Reset hulls & debug
  objects.forEach(o=>{
    o.children.forEach(c=>{
      if(c.userData.hull){
        c.userData.hull.visible = false;
        c.userData.hull.material.opacity = 0;
      }
    });
  });

  debugPairs.forEach(p=>{
    p.aSphere.visible = false;
    p.bSphere.visible = false;
    p.line.visible = false;
  });

  // Update transforms
  state.Links?.forEach(link=>{
    const g = objects.get(link.Name) || createMesh(link);
    g.position.set(link.Position.X, link.Position.Z, -link.Position.Y);
    g.quaternion.set(link.Rotation.X, link.Rotation.Z, -link.Rotation.Y, link.Rotation.W);
  });

  // Collisions
  state.Collisions?.forEach(c=>{
    if(c.Distance == null)
      return;

    const key = `${c.A}|${c.B}`;
    const pA = new THREE.Vector3(c.Ax, c.Az, -c.Ay);
    const pB = new THREE.Vector3(c.Bx, c.Bz, -c.By);
    const normal = new THREE.Vector3(-c.Nx, -c.Nz, c.Ny).normalize();  

    // --- Collision sparks ---
    if(c.Distance < 0 && !activeCollisions.has(key)){
      spawnMetalSparks(pA, normal);
      activeCollisions.add(key);
    }

    // --- Proximity hull ---
    if(c.Distance < 0.01){
      const obj = objects.get(c.A);
      if(!obj) return;

      const t = THREE.MathUtils.clamp(1 - c.Distance/0.05, 0, 1);
      obj.children.forEach(ch=>{
        const hull = ch.userData.hull;
        if(!hull) return;
        hull.visible = c.A == "table" ? false : true;
        setHullByDistance(hull, c.Distance)
      });
    }

    // --- Proximity hull ---
    if(c.Distance < 0.01){
      const obj = objects.get(c.B);
      if(!obj) return;

      const t = THREE.MathUtils.clamp(1 - c.Distance/0.05, 0, 1);
      obj.children.forEach(ch=>{
        const hull = ch.userData.hull;
        if(!hull) return;
        hull.visible = c.B == "table" ? false : true;
        setHullByDistance(hull, c.Distance)
      });
    }    
  });
};

// ================= Animate =================
function animate(){
  requestAnimationFrame(animate);
  controls.update();

  // Update sparks
  for(let i=sparks.length-1;i>=0;i--){
    const s = sparks[i];
    s.position.addScaledVector(s.userData.vel, 0.016);
    s.userData.life -= 0.016;
    s.material.opacity = Math.max(0, s.userData.life*6);
    s.scale.multiplyScalar(0.92);

    if(s.userData.life <= 0){
      sparkGroup.remove(s);
      sparks.splice(i,1);
    }
  }

  renderer.render(scene,camera);
}
animate();

// ================= Resize =================
window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
