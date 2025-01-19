# Sistema Solar

## Introdução

Esse projeto é uma simulação do sistema solar feita para a disciplina de **Computação Gráfica** do semestre 2024.2 da **Universidade Federal do Ceará**. Para realizar a simulação, utilizou-se a biblioteca [Three.js](https://threejs.org/), que facilita o uso de gráficos 3D na web. Além disso, foram utilizadas outras ferramentas como o framework [Vite](https://vite.dev/) para a criação do projeto inicial e a ferramenta [dat.GUI](https://github.com/dataarts/dat.gui) para a interface de mudança de valores.

## Descrição do sistema

O sistema é composto pela a seguinte estrutura:
- Sol
    - Mercúrio
    - Vênus
    - Terra
        - Lua
    - Marte
    - Júpiter
        - Io
        - Europa
        - Ganímedes
        - Calisto
    - Saturno
        - Anéis de Saturno
        - Titã
        - Encélado
    - Urano
        - Anéis de Urano
    - Netuno
    - Plutão

Mercúrio, Vênus e todas as luas possuem acoplamento de maré ([*tidal locking*](https://en.wikipedia.org/wiki/Tidal_locking)), então mantêm a mesma face virada para o sol ou seus planetas. Para simular isso, optou-se por simplesmente desligar a rotação desses corpos, mas ligá-la com a mesma frequência de sua translação surtiria o mesmo efeito.

As velocidades de translação e rotação dos planetas foram definidas em fatores das velocidades de translação e rotação da Terra. Por exemplo, 1 volta de Netuno ao redor do Sol dura o mesmo tempo de 165 voltas da Terra ao redor do Sol. É possível multiplicar todas as velocidades do sistema por um fator inteiro. No entanto, todas as luas estão com acomplamento de maré e possuem velocidades de translação arbitrárias.

## Criação de planetas

A seguinte função foi usada para a criação de planetas. A função recebe apenas três parâmetros: o raio do planeta (size), a textura do planeta e sua posição (raio da órbita).
```
function criarPlaneta(size, textura, posicao)
```
Primeiramente, é criada a *mesh* do planeta com esses parâmetros.
```
function criarPlaneta(size, textura, posicao){
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(textura)
  });
  const mesh = new THREE.Mesh(geo, mat);
  ...
}
```
Após isso, cria-se um objeto para conter a *mesh*. Esse objeto é adicionado à cena na posição central, por padrão. Então desloca-se a *mesh* dentro do objeto para a posição equivalente ao raio da órbita do planeta.
```
function criarPlaneta(size, textura, posicao){
  ...
  const obj = new THREE.Object3D();
  obj.add(mesh); //Adiciona um objeto como filho de outro
  cena.add(obj);
  mesh.position.x = posicao;
  return {mesh, obj};
}
```
Por fim a função retorna um objeto com tanto a *mesh* do planeta e o objeto que a contém.

## Criação de luas
Para a criação das luas, uma função diferente foi utilizada. Essa nova função recebe como parâmetros também o raio da lua (tamanho), sua textura, mas também o índice do planeta a qual pertence, a distância até a superfície do planeta (radiusOffset) e um nome para ser identificada no seu objeto-pai.
```
function criarLua(tamanho, textura, indicePlaneta, radiusOffset, nome)
```
Semelhante a criação dos planetas, também se cria uma *mesh* e um objeto contendo a *mesh*. Além disso, posiciona-se a *mesh* da lua dentro do seu objeto a uma distância igual ao raio do planeta mais a distância até a superfície (radiusOffset). Além disso, também se ativa a propriedade das luas causarem sombras nos seus planetas.
```
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
  ...
}
```
Em seguida, posiciona-se o objeto que contém a *mesh* da lua no centro da *mesh* do planeta. Dá-se um nome à lua para facilitar seu acesso no objeto-pai. O objeto da lua é posto dentro do objeto do planeta.
```
function criarLua(tamanho, textura, indicePlaneta, radiusOffset, nome){
  ...
  objLua.position.x = planetas[indicePlaneta].mesh.position.x;
  objLua.name = nome;
  planetas[indicePlaneta].obj.add(objLua);
  return {meshLua, objLua};
}
```
Por fim, retorna-se o objeto e a *mesh* da lua.

## Animações
Para implementar as animações de rotação e translação, utilizou-se uma função de animação que é chamada recursivamente usando requestAnimationFrame. Cada planeta e lua foi animado individualmente com base nas velocidades definidas.
### Rotação

Para simular a rotação, apenas rotacionou-se a *mesh* do planeta ao redor de Y, como na função que realiza a rotação de Marte.
```
planetas[3].mesh.rotateY(0.959*velTerraRotacao*t);
```

### Translação

Para simular a translação dos planetas, rotacionou-se o objeto do planeta ao redor de Y. Como os objetos estão centrados no centro da cena e os planetas a uma distância de seu centro, essa animação simula uma trajetória circular para os planetas. Abaixo está a função que realiza a translação da Terra.
```
planetas[2].obj.rotateY(velTerraTranslacao*t);
```

### Acelerar animações
Para acelerar as animações, foi implementado um controle que multiplica as velocidades de rotação e translação de todos os planetas e luas por um fator ajustável. Esse fator é controlado através da interface dat.GUI, permitindo ao usuário modificar a velocidade das animações em tempo real.

## Customizações

As principais customizações feitas para o sistema estão relacionadas aos anéis de Saturno e Urano. Para ambos, utilizou-se a geometria de anel (THREE.RingGeometry) e a mesma textura aplicada aos dois lados.

### Anéis de Saturno

Os parâmetros da geometria dos Anéis de Saturno foram um raio interno de 13 e externo de 20. Além disso, inclinou-se o anel na -0.5\*pi radianos na direção x e -0.05\*pi radianos na direção y para que ele recebesse a luz do Sol corretamente. Ativou-se a propriedade de Saturno causar sombras sobre o anel.

### Anéis de Urano

Tanto Urano quanto seus anéis estão ["deitados"](https://en.wikipedia.org/wiki/Uranus#Axial_tilt) em relação ao plano de órbita, ou seja, seu eixo de rotação aponta para o Sol. Para isso, girou-se a *mesh* de Urano na direção -0.5\*pi radianos z e os anéis -0.08\*pi radianos na direção x e -0.5\*pi radianos na direção y.

## Câmera e controles
A câmera utilizada na simulação é do tipo PerspectiveCamera, configurada para proporcionar uma visão ampla e imersiva do sistema solar. A câmera foi posicionada de forma a capturar uma visão clara e central do Sol e dos planetas ao redor. Para facilitar a interação do usuário com o sistema solar, foi utilizado o módulo OrbitControls da biblioteca Three.js. Este módulo permite que o usuário gire a câmera ao redor do centro da cena, aplique zoom in e zoom out, e mova a câmera para explorar diferentes ângulos.
## Projeto hospedado no Vercel

Disponível em [https://sistema-solar-silk.vercel.app/](https://sistema-solar-silk.vercel.app/)

## Link da Demonstração do projeto

[https://youtu.be/ZYFP5aF3Hd0]


