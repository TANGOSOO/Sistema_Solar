import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import terraTextura from "../img/earth.jpg";
import marteTextura from "../img/mars.jpg";
import mercurioTextura from "../img/mercury.jpg";
import venusTextura from "../img/venus.jpg";
import solTextura from "../img/sun.jpg";
import saturnoTextura from "../img/saturn.jpg";
import anelSaturnoTextura from "../img/saturnring.png";
import uranoTextura from "../img/uranus.jpg";
import anelUranoTextura from "../img/uranusring.png";
import netunoTextura from "../img/neptune.jpg";
import plutaoTextura from "../img/pluto.jpg";
import estrelasTextura from "../img/stars.jpg";
import jupiterTextura from "../img/jupiter.jpg";

import luaTextura from "../img/lua.jpg";
import titanTexture from "../img/titan.jpg";
import enceladusTexture from "../img/enceladus.jpg";
import ioTexture from "../img/io.jpg";
import europaTexture from "../img/io.jpg";
import ganymedeTexture from "../img/ganymede.jpg";
import callistoTexture from "../img/callisto.jpg";

import planetasInfo from "./planetasInfo";

//Renderizador
const renderizador = new THREE.WebGLRenderer();
renderizador.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizador.domElement);

//Permite o renderizador a trabalhar com sombras
renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.PCFSoftShadowMap;


//Cena e camera
const cena = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90, //fov
  window.innerWidth / window.innerHeight, //aspect
  0.1, //near
  10000 //far
);

cena.add(camera);

//Controles da camera
const orbita = new OrbitControls(camera, renderizador.domElement);
camera.position.set(-90, 140, 140);
orbita.update();

//orbita.target.set(200,0,0);

//Luz ambiente
const luzAmbiente=new THREE.AmbientLight(0x333333);
cena.add(luzAmbiente);

//Luz pontual do sol
const luzDoSol=new THREE.PointLight(0xffffff, 1, 0, 0);
cena.add(luzDoSol);
//Permite a luz do sol causar sombras
luzDoSol.castShadow = true;
luzDoSol.shadow.camera.far = 10000;
luzDoSol.shadow.mapSize.width = 2048;
luzDoSol.shadow.mapSize.height = 2048;

//Skybox
const cubeTextureLoader=new THREE.CubeTextureLoader();
cena.background=cubeTextureLoader.load([estrelasTextura, estrelasTextura, estrelasTextura, estrelasTextura, estrelasTextura, estrelasTextura])

//Carregador de texturas
const textureLoader=new THREE.TextureLoader();

//Criação do sol
const solGeo=new THREE.SphereGeometry(16, 30, 30);
const solMat=new THREE.MeshBasicMaterial({
  map: textureLoader.load(solTextura)
});
const sol=new THREE.Mesh(solGeo, solMat);
cena.add(sol);

//Dados dos planetas
const planetasTextura = [mercurioTextura, venusTextura, terraTextura, marteTextura, jupiterTextura,
  saturnoTextura, uranoTextura, netunoTextura, plutaoTextura];
const raiosPlanetas = [3.2, 5.8, 6, 4, 12, 10, 7, 7, 2.8];
const posxPlanetas = [28, 64, 102, 138, 180, 238, 296, 340, 376];
const planetas = [];

//Criação de planetas
function criarPlaneta(size, textura, posicao){
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(textura)
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh); //Adiciona um objeto como filho de outro
  cena.add(obj);
  mesh.position.x = posicao;
  return {mesh, obj};
}

for (let i = 0; i < raiosPlanetas.length; i++)
{
  planetas[i] = criarPlaneta(raiosPlanetas[i], planetasTextura[i], posxPlanetas[i]);
}

//Aneis de Saturno
const geoAnelSat = new THREE.RingGeometry (13, 20, 30);
const matAnelSat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(anelSaturnoTextura),
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
  map: textureLoader.load(anelUranoTextura),
  side: THREE.DoubleSide
})
const anelUr = new THREE.Mesh(geoAnelUr, matAnelUr);
planetas[6].obj.add(anelUr);
anelUr.position.x = planetas[6].mesh.position.x;
anelUr.rotation.x = -0.08*Math.PI;
//Aneis de urano também são "deitados"
anelUr.rotation.y = -0.5*Math.PI;

//Criando as luas
function criarLua(tamanho, textura, indicePlaneta, radiusOffset, nome){
  const geo = new THREE.SphereGeometry(tamanho, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(textura)
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

const lua = criarLua(1, luaTextura, 2, 5, "lua");
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

//Cria as opções de uma combo box para a gui
const comboBox=["Sol", "Mercúrio", "Vênus", "Terra", "Marte", "Júpiter", "Saturno", "Urano", "Netuno", "Plutão"];
//Cria uma GUI para interação com o usuário
const gui = new dat.GUI();
const opcoes = {
  velocidade: 0, //Velocidade da passagem do tempo
  foco: "Sol", //Planeta em foco
  mostrarInfos: true
};


//Cria uma barra deslizante
gui.add(opcoes, "velocidade", 0, 1000);
//Cria uma combo box
gui.add(opcoes, 'foco', comboBox).onChange((value) => {
  switch(value){
    case "Sol":
      sol.getWorldPosition(orbita.target);
      break;
    case "Mercúrio":
      planetas[0].mesh.getWorldPosition(orbita.target);
      break;
    case "Vênus":
      planetas[1].mesh.getWorldPosition(orbita.target);
      break;
    case "Terra":
      planetas[2].mesh.getWorldPosition(orbita.target);
      break;
    case "Marte":
      planetas[3].mesh.getWorldPosition(orbita.target);
      break;
    case "Júpiter":
      planetas[4].mesh.getWorldPosition(orbita.target);
      break;
    case "Saturno":
      planetas[5].mesh.getWorldPosition(orbita.target);
      break;
    case "Urano":
      planetas[6].mesh.getWorldPosition(orbita.target);
      break;
    case "Netuno":
      planetas[7].mesh.getWorldPosition(orbita.target);
      break;
    case "Plutão":
      planetas[8].mesh.getWorldPosition(orbita.target);
      break;
  };

  const square = document.getElementById("colored-square");
  const planetaInfo = planetasInfo[value]; // Acessa as novas informações do planeta
  if (opcoes.mostrarInfos) {
    square.innerHTML = `
        <h1>${planetaInfo.nome}</h1>
        <img src="${planetaInfo.imagem}" alt="${planetaInfo.nome}">
        <p>Massa: ${planetaInfo.massa}</p>
        <p>Raio: ${planetaInfo.raio}</p>
        <p>Temperatura Média: ${planetaInfo.temperaturaMedia}</p>
        <p>Tempo de Translação: ${planetaInfo.tempoDeTranslacao}</p>
        <p>Distância do Sol: ${planetaInfo.distanciaDoSol}</p>
    `;
    square.style.display = "block"; // Torna a div visível
}
});

gui.add(opcoes, 'mostrarInfos').name("Mostrar Infos").onChange(() => {
  const square = document.getElementById("colored-square");
  const planetaInfo = planetasInfo[opcoes.foco];  // Utiliza o planeta que está em foco

  if (opcoes.mostrarInfos) {
      // Atualiza o conteúdo da div com as informações do planeta
      square.innerHTML = `
          <h1>${planetaInfo.nome}</h1>
          <img src="${planetaInfo.imagem}" alt="${planetaInfo.nome}">
          <p>Massa: ${planetaInfo.massa}</p>
          <p>Raio: ${planetaInfo.raio}</p>
          <p>Temperatura Média: ${planetaInfo.temperaturaMedia}</p>
          <p>Tempo de Translação: ${planetaInfo.tempoDeTranslacao}</p>
          <p>Distância do Sol: ${planetaInfo.distanciaDoSol}</p>
      `;
      square.style.display = "block"; // Torna a div visível
  } else {
      // Se a opção estiver desmarcada, oculta as informações
      square.style.display = "none"; // Esconde a div
  }
});

//Multiplicador de tempo global
let t = opcoes.velocidade;
//Velocidades de referencia (terra)
let velTerraRotacao = 0.01;
let velTerraTranslacao = 0.0001;

function animate(){
  t = opcoes
.velocidade
  //Rotação dos planetas
  sol.rotateY(0.00001*t);
  //Mercurio e venus sempre tem o mesmo lado apontando pro sol
  planetas[2].mesh.rotateY(velTerraRotacao*t);
  planetas[3].mesh.rotateY(0.959*velTerraRotacao*t); //Dia em marte = 1.04167 dias
  planetas[4].mesh.rotateY(2.399*velTerraRotacao*t); //Dia em jupiter = 0.4167 dia
  planetas[5].mesh.rotateY(2.182*velTerraRotacao*t); //Dia em saturno = 0.4583 dia
  planetas[6].mesh.rotateY(1.412*velTerraRotacao*t); //Dia em urano = 0.7083 dia
  planetas[7].mesh.rotateY(1.5*velTerraRotacao*t); //Dia em netuno = 0.6667 dia
  planetas[8].mesh.rotateY(0.0156*velTerraRotacao*t); //Dia em plutão = 6.4 dias

  //Translação dos planetas com velocidade ajustada com base no periodo orbitaal
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

   // Foco nos planetas
   if (opcoes.foco === "Sol") {
    sol.getWorldPosition(orbita.target); //foco no sol
  } else {
    const indicePlaneta = comboBox.indexOf(opcoes.foco) - 1; // indice do planeta
    if (indicePlaneta >= 0) {
      planetas[indicePlaneta].mesh.getWorldPosition(orbita.target); //foco em um planeta escolhido 
    }
  }

  // Atualizaçao
  orbita.update();

  requestAnimationFrame(animate);
  renderizador.render(cena, camera);
}

animate();
//renderizador.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect=this.window.innerWidth/this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderizador.setSize(this.window.innerWidth, this.window.innerHeight);
})
