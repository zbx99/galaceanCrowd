import {Building} from "./building/building";
import {LightProcedure} from "./light/lightProcedure";
// core app styles:
import './index.scss'

// init galacean engine
import * as GALACEAN from "@galacean/engine";
import {BackgroundMode, PrimitiveMesh, SkyBoxMaterial, TextureCube} from "@galacean/engine";
import {FreeControl} from "@galacean/engine-toolkit-controls";
import {AvatarManager} from "@/app/crowd/AvatarManager";
import { Stats } from "@galacean/engine-toolkit-stats";

console.log('it works!')

async function setupDefaultScene(scene: GALACEAN.Scene){
  const root = scene.createRootEntity();
  const cameraEntity = root.createChild("camera");
  cameraEntity.transform.setPosition(0,  0,  0);
  cameraEntity.transform.lookAt(new GALACEAN.Vector3(0,0,0),new GALACEAN.Vector3(0,1,0));
  cameraEntity.addComponent(Stats);
  let camera = cameraEntity.addComponent(GALACEAN.Camera);
  const controler = cameraEntity.addComponent(FreeControl);
  camera.fieldOfView = 50;
  camera.farClipPlane = 50000;
  camera.enableFrustumCulling=false;
  controler.movementSpeed = 100;
  controler.rotateSpeed = 1;
  // 设置天空盒
  createSky(scene);
  // 加入灯光
  //const lightProcedure = new LightProcedure(root);
  const lightProcedure = root.addComponent(LightProcedure);
  // 加载建筑
  const building = new Building(root);
  // 加载人群
  const avatarManager = new AvatarManager(root,1);
}

function createSky(scene:GALACEAN.Scene){
  const sky = scene.background.sky;
  const skyMeterial = new SkyBoxMaterial(scene.engine);
  scene.background.mode = BackgroundMode.Sky;
  sky.material = skyMeterial;
  sky.mesh = PrimitiveMesh.createCuboid(scene.engine,1,1,1);
  // 加载hdr天空盒
  scene.engine.resourceManager
    .load<TextureCube>("assets/environment/royal_esplanade_1k.hdr")
    .then((texture)=>{
      skyMeterial.texture = texture;
      skyMeterial.textureDecodeRGBM = true;
    })
}

async function start() {
  const engine = await GALACEAN.WebGLEngine.create({
    canvas: document.getElementById('peoples') as HTMLCanvasElement
  });

  // set canvas size
  // engine.canvas.resizeByClientSize();
  engine.canvas.width = window.innerWidth;
  engine.canvas.height = window.innerHeight;
  engine.canvas._webCanvas.addEventListener("onresize", () => {
    // engine.canvas.resizeByClientSize();
    engine.canvas.width = window.innerHeight;
    engine.canvas.height = window.innerHeight;
  });

  const scene = engine.sceneManager.activeScene;
  await setupDefaultScene(engine.sceneManager.activeScene);

  engine.run();

}

start().then(r => {});
