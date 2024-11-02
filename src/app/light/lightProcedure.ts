import * as GALACEAN from "@galacean/engine";
import {DiffuseMode, DirectLight} from "@galacean/engine";

import { OrbitControl } from "@galacean/engine-toolkit-controls";
//import * as dat from "dat.gui";
import {
  BlinnPhongMaterial,
  Camera,
  MeshRenderer,
  PointLight,
  PrimitiveMesh,
  RenderFace,
  SpotLight,
  UnlitMaterial,
  Vector3,
  WebGLEngine,
} from "@galacean/engine";
import { log } from "console";
//const gui = new dat.GUI();


import { PBRMaterial, AmbientLight, AssetType } from '@galacean/engine'


export class LightProcedure extends GALACEAN.Script {
  private lightGroup:GALACEAN.Entity;
  private directLight: GALACEAN.Entity | undefined;
  //private spotLight2: GALACEAN.Entity;
  private spotLights: GALACEAN.Entity[] = [];

  private deltadegree: number = 1; //聚光灯转动速度
  private rotationAngle: number = 0;  //聚光灯旋转角度

  private indicatorCube: GALACEAN.Entity| undefined;
  private root : GALACEAN.Entity| undefined;
  //private cube : GALACEAN.Entity;
  private sportLightPhase: number = 90; //聚光灯相位差
  private spotLightAmount: number = 1;  //聚光灯数量
  private spotLightRadius: number[] = []; //聚光灯半径

  constructor(root:GALACEAN.Entity) {
    super(root); 
    this.lightGroup = root.createChild("lightGroup");
    // 添加环境光
    this.createAmbientLight();
    // 添加方向光
    this.createDirectLight();

    //初始化聚光灯集合
    this.spotLights=[];

    // 添加聚光灯
    this.createSpotlight(3,
       [50,70,90], 
       [new GALACEAN.Color(1, 0, 0, 1),new GALACEAN.Color(0, 1, 0, 1), new GALACEAN.Color(0, 0, 1, 1)], 
       90);

    // this.createSpotlight(2,
    //   [50,150],
    //   [new GALACEAN.Color(1, 0.5, 0, 1),new GALACEAN.Color(0.5, 0, 0.5, 1)],
    //   30);
    this.root = this.scene.createRootEntity();
    //this.cube = this.root!.createChild("cuboid");
  }

  createAmbientLight(){
    // TODO:之后可以试试把环境光设置为天空盒hdr，详见：https://galacean.antgroup.com/engine/examples/ambient-light/
    this.lightGroup.scene.ambientLight.diffuseMode = DiffuseMode.SolidColor;
    this.lightGroup.scene.ambientLight.diffuseSolidColor.set(135/255,135/255,135/255,1);
  }

  createDirectLight(){
    this.directLight = this.lightGroup.createChild("directLight");
    const directLightComponent = this.directLight.addComponent(DirectLight);
    directLightComponent.intensity = 2//0.6;
    this.directLight.transform.setPosition(0,3,0);
    this.directLight.transform.setRotation(-45,-45,0);
  }

  //创建能够扫描全场的聚光灯
  createSpotlight(amount:number, radius: number[], color:GALACEAN.Color[], phase:number)
  {
    this.sportLightPhase=phase;
    this.spotLightAmount=amount;
    this.spotLightRadius=radius;
    
    for(let i=0; i<amount;i++)
    {
      const light = this.lightGroup.createChild("spotLight"+ i.toString());
      const spotLightComponent = light.addComponent(SpotLight);
      spotLightComponent.intensity = 15;
      light.transform.setPosition(0,50,0); //似乎体育馆的宽度x取值应该是+-200，z取值应该是+-300
      spotLightComponent.penumbra=100;
      spotLightComponent.angle=5;
      spotLightComponent.color = color[i]; // 设置颜色
      this.spotLights.push(light);
    }
  }

  //添加一个cube用来可视化聚光灯spotlight的位置
  // onStart(): void {
  //   this.cube!.transform.setPosition(0, 50, 0);
  //   const renderer = this.cube!.addComponent(GALACEAN.MeshRenderer);
  //   renderer.mesh = PrimitiveMesh.createCuboid(this.engine);
  //   // Create material
  //   const material = new GALACEAN.BlinnPhongMaterial(this.engine);
  //   material.emissiveColor.set(1, 0, 0, 1);
  //   renderer.setMaterial(material);
  // }

  onUpdate(deltaTime: number) {
    for(let i=0; i<this.spotLightAmount;i++)
    {
      this.rotationAngle += deltaTime * this.deltadegree;
      const x = Math.sin(this.rotationAngle + this.sportLightPhase*i) * this.spotLightRadius[i];
      const z = Math.cos(this.rotationAngle + this.sportLightPhase*i) * this.spotLightRadius[i];
          // 更新聚光灯位置
      this.spotLights[i].transform.setPosition(x, 60, z);
          // 聚光灯始终朝向中心
      this.spotLights[i].transform.lookAt(new Vector3(0, 0, 0));
    }

}
}
