import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import earthTexture from "../img/earth.jpg";
import marsTexture from "../img/mars.jpg";
import mercuryTexture from "../img/mercury.jpg";
import venusTexture from "../img/venus.jpg";
import sunTexture from "../img/sun.jpg";
import saturnTexture from "../img/saturn.jpg";
import saturnRingTexture from "../img/saturnring.png";
import uranusTexture from "../img/uranus.jpg";
import uranusRingTexture from "../img/uranusring.png";
import neptuneTexture from "../img/neptune.jpg";
import plutoTexture from "../img/pluto.jpg";
import starsTexture from "../img/stars.jpg";
import jupiterTexture from "../img/jupiter.jpg"

//Renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Permite o renderizador a trabalhar com sombras
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Cena e camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90, //fov
  window.innerWidth / window.innerHeight, //aspect
  0.1, //near
  10000 //far
);

scene.add(camera);

//Controles da camera
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

//Luz ambiente
//const ambientLight=new THREE.AmbientLight(0x333333);
//scene.add(ambientLight);

//Luz pontual do sol
const pointLight=new THREE.PointLight(0xffffff, 1, 0, 0);
scene.add(pointLight);
//Permite a luz do sol causar sombras
pointLight.castShadow = true;
pointLight.shadow.camera.far = 10000;

//Skybox
const cubeTextureLoader=new THREE.CubeTextureLoader();
scene.background=cubeTextureLoader.load([starsTexture, starsTexture, starsTexture, starsTexture, starsTexture, starsTexture])

//Carregador de texturas
const textureLoader=new THREE.TextureLoader();

//Criação do sol
const sunGeo=new THREE.SphereGeometry(16, 30, 30);
const sunMat=new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
});
const sun=new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

//Criação de planetas
function createPlanet(size, texture, position){
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh); //Adiciona um objeto como filho de outro
  scene.add(obj);
  mesh.position.x=position;
  return {mesh, obj};
  // if(ring){
  //   const ringGeo=new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
  //   const ringMat=new THREE.MeshBasicMaterial({
  //     map: textureLoader.load(ring.texture),
  //     side: THREE.DoubleSide,
  //   });
  //   const ringMesh=new THREE.Mesh(ringGeo, ringMat);
  //   obj.add(ringMesh)
  //   ringMesh.position.x=position;
  //   ringMesh.rotation.x=-0.5*Math.PI;
  // }
}

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138);
const uranus = createPlanet(7, uranusTexture, 176);
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

//Aneis de Saturno
const geoAnelSat = new THREE.RingGeometry (13, 20, 30);
const matAnelSat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(saturnRingTexture),
  side: THREE.DoubleSide
})
const anelSat = new THREE.Mesh(geoAnelSat, matAnelSat);
saturn.obj.add(anelSat);
anelSat.position.x = saturn.mesh.position.x;
//Deixa o anel horizontal
anelSat.rotation.x = -0.50*Math.PI;
//Inclina um pouco o anel para receber luz e sombra
anelSat.rotation.y = -0.05*Math.PI;
//Permite a saturno causar sombra e os aneis a receberem
saturn.mesh.castShadow = true;
anelSat.receiveShadow = true;

//Aneis de Urano e ajustes
//Urano gira "deitado"
uranus.mesh.rotation.z = -0.5*Math.PI;
//Cria aneis de urano
const geoAnelUr = new THREE.RingGeometry(8, 12, 50);
const matAnelUr = new THREE.MeshStandardMaterial({
  map: textureLoader.load(uranusRingTexture),
  side: THREE.DoubleSide
})
const anelUr = new THREE.Mesh(geoAnelUr, matAnelUr);
uranus.obj.add(anelUr);
anelUr.position.x = uranus.mesh.position.x;
anelUr.rotation.x = -0.08*Math.PI;
//Aneis de urano também são "deitados"
anelUr.rotation.y = -0.5*Math.PI;


//Multiplicador de tempo global
let t = 1;
//Velocidades de referencia (terra)
let velTerraRotacao = 1;
let velTerraTranslacao = 0.01;

function animate(){
  //Rotação dos planetas
  sun.rotateY(0.00001*t);
  //Mercurio e venus sempre tem o mesmo lado apontando pro sol
  //mercury.mesh.rotateY(0.04*t);
  //venus.mesh.rotateY(0.002*t);
  earth.mesh.rotateY(velTerraRotacao*t);
  mars.mesh.rotateY(0.959*velTerraRotacao*t); //Dia em marte = 1.04167 dias
  jupiter.mesh.rotateY(2.399*velTerraRotacao*t); //Dia em jupiter = 0.4167 dia
  saturn.mesh.rotateY(2.182*velTerraRotacao*t); //Dia em saturno = 0.4583 dia
  uranus.mesh.rotateY(1.412*velTerraRotacao*t); //Dia em urano = 0.7083 dia
  neptune.mesh.rotateY(1.5*velTerraRotacao*t); //Dia em netuno = 0.6667 dia
  pluto.mesh.rotateY(0.0156*velTerraRotacao*t); //Dia em plutão = 6.4 dias

  //Translação dos planetas com velocidade ajustada com base no periodo orbital
  mercury.obj.rotateY(4.16*velTerraTranslacao*t);
  venus.obj.rotateY(1.63*velTerraTranslacao*t);
  earth.obj.rotateY(velTerraTranslacao*t);
  mars.obj.rotateY(0.53*velTerraTranslacao*t);
  jupiter.obj.rotateY(0.0843*velTerraTranslacao*t);
  saturn.obj.rotateY(0.0339*velTerraTranslacao*t);
  uranus.obj.rotateY(0.0119*velTerraTranslacao*t);
  neptune.obj.rotateY(0.006*velTerraTranslacao*t);
  pluto.obj.rotateY(0.004*velTerraTranslacao*t);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect=this.window.innerWidth/this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(this.window.innerWidth, this.window.innerHeight);
})

//TESTE COMMIT