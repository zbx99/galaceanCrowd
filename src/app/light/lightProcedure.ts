import * as GALACEAN from "@galacean/engine";
import {DiffuseMode, DirectLight} from "@galacean/engine";

export class LightProcedure{
  private lightGroup:GALACEAN.Entity;
  private directLight: GALACEAN.Entity | undefined;
  constructor(root:GALACEAN.Entity) {
    this.lightGroup = root.createChild("lightGroup");
    // 添加环境光
    this.createAmbientLight();
    // 添加方向光
    this.createDirectLight();
  }

  createAmbientLight(){
    // TODO:之后可以试试把环境光设置为天空盒hdr，详见：https://galacean.antgroup.com/engine/examples/ambient-light/
    this.lightGroup.scene.ambientLight.diffuseMode = DiffuseMode.SolidColor;
    this.lightGroup.scene.ambientLight.diffuseSolidColor.set(135/255,135/255,135/255,1);
  }

  createDirectLight(){
    this.directLight = this.lightGroup.createChild("directLight");
    const directLightComponent = this.directLight.addComponent(DirectLight);
    directLightComponent.intensity = 0.6;
    this.directLight.transform.setPosition(0,3,0);
    this.directLight.transform.setRotation(-45,-45,0);
  }
}
