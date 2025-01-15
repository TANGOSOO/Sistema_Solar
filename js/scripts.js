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
import titanTexture from "../img/titan.jpg";
import enceladusTexture from "../img/enceladus.jpg";
import ioTexture from "../img/io.jpg";
import europaTexture from "../img/io.jpg";
import ganymedeTexture from "../img/ganymede.jpg";
import callistoTexture from "../img/callisto.jpg";

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

//orbit.target.set(200,0,0);

//Luz ambiente
const ambientLight=new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//Luz pontual do sol
const pointLight=new THREE.PointLight(0xffffff, 1, 0, 0);
scene.add(pointLight);
//Permite a luz do sol causar sombras
pointLight.castShadow = true;
pointLight.shadow.camera.far = 10000;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;

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
const posxPlanetas = [28, 64, 102, 138, 180, 238, 296, 340, 376];
const planetas = [];

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
function criarLua(size, texture, indicePlaneta, radiusOffset, nome){
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
  });
  const meshLua = new THREE.Mesh(geo, mat);
  const objLua = new THREE.Group();
  meshLua.position.set(raiosPlanetas[indicePlaneta] + radiusOffset,0,0);
  meshLua.castShadow = true;
  objLua.add(meshLua);
  objLua.position.x = planetas[indicePlaneta].mesh.position.x;
  objLua.name = nome;
  planetas[indicePlaneta].obj.add(objLua);
  return {meshLua, objLua};
}

const lua = criarLua(1, moonTexture, 2, 5, "lua");
const titan = criarLua(2, titanTexture, 5, 15, "titan");
const enceladus = criarLua(1.5, enceladusTexture, 5, 20, "enceladus");
const io = criarLua(1.5, ioTexture, 4, 5, "io");
const europa = criarLua(1.25, europaTexture, 4, 9, "europa");
const ganymede = criarLua(3, ganymedeTexture, 4, 15, "ganymede");
const callisto = criarLua(2.8, callistoTexture, 4, 25, "callisto");

//Ajuste para terra, jupiter e saturno receberem sombras das luas
planetas[2].mesh.receiveShadow = true;
planetas[4].mesh.receiveShadow = true;
planetas[5].mesh.receiveShadow = true;

//Multiplicador de tempo global
let t = 1;
//Velocidades de referencia (terra)
let velTerraRotacao = 0.01;
let velTerraTranslacao = 0.0001;

function animate(){
  //Rotação dos planetas
  sun.rotateY(0.00001*t);
  //Mercurio e venus sempre tem o mesmo lado apontando pro sol
  planetas[2].mesh.rotateY(velTerraRotacao*t);
  planetas[3].mesh.rotateY(0.959*velTerraRotacao*t); //Dia em marte = 1.04167 dias
  planetas[4].mesh.rotateY(2.399*velTerraRotacao*t); //Dia em jupiter = 0.4167 dia
  planetas[5].mesh.rotateY(2.182*velTerraRotacao*t); //Dia em saturno = 0.4583 dia
  planetas[6].mesh.rotateY(1.412*velTerraRotacao*t); //Dia em urano = 0.7083 dia
  planetas[7].mesh.rotateY(1.5*velTerraRotacao*t); //Dia em netuno = 0.6667 dia
  planetas[8].mesh.rotateY(0.0156*velTerraRotacao*t); //Dia em plutão = 6.4 dias

  //Translação dos planetas com velocidade ajustada com base no periodo orbital
  planetas[0].obj.rotateY(4.16*velTerraTranslacao*t);
  planetas[1].obj.rotateY(1.63*velTerraTranslacao*t);
  planetas[2].obj.rotateY(velTerraTranslacao*t);
  planetas[3].obj.rotateY(0.53*velTerraTranslacao*t);
  planetas[4].obj.rotateY(0.0843*velTerraTranslacao*t);
  planetas[5].obj.rotateY(0.0339*velTerraTranslacao*t);
  planetas[6].obj.rotateY(0.0119*velTerraTranslacao*t);
  planetas[7].obj.rotateY(0.006*velTerraTranslacao*t);
  planetas[8].obj.rotateY(0.004*velTerraTranslacao*t);

  //Translação das luas
  planetas[2].obj.getObjectByName("lua").rotateY(velTerraRotacao*t);
  //planetas[2].obj.getObjectByName("lua").rotateZ(0.001);

  planetas[5].obj.getObjectByName("titan").rotateY(0.25*velTerraRotacao*t);
  //planetas[5].obj.getObjectByName("titan").rotateZ(0.0005);
  planetas[5].obj.getObjectByName("enceladus").rotateY(0.12*velTerraRotacao*t);
  //planetas[5].obj.getObjectByName("enceladus").rotateZ(-0.001);

  planetas[4].obj.getObjectByName("io").rotateY(0.31*velTerraRotacao*t);
  //planetas[4].obj.getObjectByName("io").rotateZ(0.0015);
  planetas[4].obj.getObjectByName("europa").rotateY(0.15*velTerraRotacao*t);
  //planetas[4].obj.getObjectByName("europa").rotateZ(-0.0005);
  planetas[4].obj.getObjectByName("ganymede").rotateY(0.1*velTerraRotacao*t);
  //planetas[4].obj.getObjectByName("ganymede").rotateZ(0.0025);
  planetas[4].obj.getObjectByName("callisto").rotateY(0.2*velTerraRotacao*t);
  //planetas[4].obj.getObjectByName("callisto").rotateZ(-0.0015);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
//renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect=this.window.innerWidth/this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(this.window.innerWidth, this.window.innerHeight);
})

//Funções dos botões
document.getElementById("pausar").addEventListener("click", function () {
  t = 0;
  orbit.target.set(0,0,0);
  animate();
});

document.getElementById("play").addEventListener("click", function () {
  t = 1;
  animate();
});

document.getElementById("acelerar").addEventListener("click", function () {
  if(t !=0)
  {
    t = 2*t;
  } else {
    t = 2;
  }
  animate();
});

document.getElementById("0").addEventListener("click", function () {
  //Pausa a animação
  t = 0;
  //getWorldPosition(vetor) escreve no vetor passado a posição atual da mesh do planeta
  //orbit.target é o atributo com o alvo da camera
  planetas[0].mesh.getWorldPosition(orbit.target);
  animate();
})

document.getElementById("1").addEventListener("click", function () {
  t = 0;
  planetas[1].mesh.getWorldPosition(orbit.target);
  animate();
})

document.getElementById("2").addEventListener("click", function () {
  t = 0;
  planetas[2].mesh.getWorldPosition(orbit.target);
  animate();
})

document.getElementById("3").addEventListener("click", function () {
  t = 0;
  planetas[3].mesh.getWorldPosition(orbit.target);
  animate();
})

document.getElementById("4").addEventListener("click", function () {
  t = 0;
  planetas[4].mesh.getWorldPosition(orbit.target);
  animate();
})

document.getElementById("5").addEventListener("click", function () {
  t = 0;
  planetas[5].mesh.getWorldPosition(orbit.target);
  animate();
})

document.getElementById("6").addEventListener("click", function () {
  t = 0;
  planetas[6].mesh.getWorldPosition(orbit.target);
  animate();
})

document.getElementById("7").addEventListener("click", function () {
  t = 0;
  planetas[7].mesh.getWorldPosition(orbit.target);
  animate();
})

document.getElementById("8").addEventListener("click", function () {
  t = 0;
  planetas[8].mesh.getWorldPosition(orbit.target);
  animate();
})

//TESTE COMMIT