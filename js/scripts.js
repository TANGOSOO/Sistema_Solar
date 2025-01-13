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
import jupiterTexture from "../img/jupiter.jpg";

import moonTexture from "../img/lua.jpg";

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

//Dados dos planetas
const textPlanetas = [mercuryTexture, venusTexture, earthTexture, marsTexture, jupiterTexture,
  saturnTexture, uranusTexture, neptuneTexture, plutoTexture];
const raiosPlanetas = [3.2, 5.8, 6, 4, 12, 10, 7, 7, 2.8];
const posxPlanetas = [28, 44, 62, 78, 100, 138, 176, 200, 216];
const planetas = [];

//Criação de planetas
function createPlanet(size, texture, position){
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh); //Adiciona um objeto como filho de outro;
  scene.add(obj);
  mesh.position.x = position;
  return {mesh, obj};
}

for (let i = 0; i < raiosPlanetas.length; i++)
{
  planetas[i] = createPlanet(raiosPlanetas[i], textPlanetas[i], posxPlanetas[i]);
}

//Aneis de Saturno
const geoAnelSat = new THREE.RingGeometry (13, 20, 30);
const matAnelSat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(saturnRingTexture),
  side: THREE.DoubleSide
})
const anelSat = new THREE.Mesh(geoAnelSat, matAnelSat);
planetas[5].obj.add(anelSat);
anelSat.position.x = planetas[5].mesh.position.x;
//Deixa o anel horizontal
anelSat.rotation.x = -0.50*Math.PI;
//Inclina um pouco o anel para receber luz e sombra
anelSat.rotation.y = -0.05*Math.PI;
//Permite a saturno causar sombra e os aneis a receberem
planetas[5].mesh.castShadow = true;
anelSat.receiveShadow = true;

//Aneis de Urano e ajustes
//Urano gira "deitado"
planetas[6].mesh.rotation.z = -0.5*Math.PI;
//Cria aneis de urano
const geoAnelUr = new THREE.RingGeometry(8, 12, 50);
const matAnelUr = new THREE.MeshStandardMaterial({
  map: textureLoader.load(uranusRingTexture),
  side: THREE.DoubleSide
})
const anelUr = new THREE.Mesh(geoAnelUr, matAnelUr);
planetas[6].obj.add(anelUr);
anelUr.position.x = planetas[6].mesh.position.x;
anelUr.rotation.x = -0.08*Math.PI;
//Aneis de urano também são "deitados"
anelUr.rotation.y = -0.5*Math.PI;

//Criando as luas


function criarLua(size, texture, indicePlaneta, radiusOffset){
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
  });
  const meshLua = new THREE.Mesh(geo, mat);
  const objLua = new THREE.Group();
  meshLua.position.set(raiosPlanetas[indicePlaneta] + radiusOffset,0,0);
  objLua.add(meshLua);
  objLua.position.x = planetas[indicePlaneta].mesh.position.x;
  objLua.name = "objLua";
  planetas[indicePlaneta].obj.add(objLua);
  return {meshLua, objLua};
}

const lua = criarLua(1, moonTexture, 2, 3);

//Multiplicador de tempo global
let t = 1;
//Velocidades de referencia (terra)
let velTerraRotacao = 0.01*t;
let velTerraTranslacao = 0.0001*t;


function animate(){
  //Rotação dos planetas
  sun.rotateY(0.00001*t);
  //Mercurio e venus sempre tem o mesmo lado apontando pro sol
  planetas[2].mesh.rotateY(velTerraRotacao);
  planetas[3].mesh.rotateY(0.959*velTerraRotacao); //Dia em marte = 1.04167 dias
  planetas[4].mesh.rotateY(2.399*velTerraRotacao); //Dia em jupiter = 0.4167 dia
  planetas[5].mesh.rotateY(2.182*velTerraRotacao); //Dia em saturno = 0.4583 dia
  planetas[6].mesh.rotateY(1.412*velTerraRotacao); //Dia em urano = 0.7083 dia
  planetas[7].mesh.rotateY(1.5*velTerraRotacao); //Dia em netuno = 0.6667 dia
  planetas[8].mesh.rotateY(0.0156*velTerraRotacao); //Dia em plutão = 6.4 dias

  //Translação dos planetas com velocidade ajustada com base no periodo orbital
  planetas[0].obj.rotateY(4.16*velTerraTranslacao);
  planetas[1].obj.rotateY(1.63*velTerraTranslacao);
  planetas[2].obj.rotateY(velTerraTranslacao);
  planetas[3].obj.rotateY(0.53*velTerraTranslacao);
  planetas[4].obj.rotateY(0.0843*velTerraTranslacao);
  planetas[5].obj.rotateY(0.0339*velTerraTranslacao);
  planetas[6].obj.rotateY(0.0119*velTerraTranslacao);
  planetas[7].obj.rotateY(0.006*velTerraTranslacao);
  planetas[8].obj.rotateY(0.004*velTerraTranslacao);

  //Translação das luas
  planetas[2].obj.getObjectByName("objLua").rotateY(velTerraRotacao);
  planetas[2].obj.getObjectByName("objLua").rotateZ(0.001);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect=this.window.innerWidth/this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(this.window.innerWidth, this.window.innerHeight);
})

//TESTE COMMIT