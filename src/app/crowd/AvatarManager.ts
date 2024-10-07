import * as GALACEAN from "@galacean/engine";
import {AssetType} from "@galacean/engine";
export class AvatarManager{
  // 逐个加载创建Crowd
  private crowdGroup: GALACEAN.Entity;
  private engine:GALACEAN.Engine;
  private crowdAsset:Array<GALACEAN.GLTFResource>;
  constructor(root:GALACEAN.Entity,modelLength:number) {
    this.crowdGroup = root.createChild("buildingParent");
    this.engine = root.engine;
    this.crowdAsset = new Array<GALACEAN.GLTFResource>();
    this.load_crowd(1);
  }

  load_crowd(modelLength:number) {
    // 加载基础GLB模型
    for (let i=0;i<modelLength;i++) {
      this.engine.resourceManager.load<GALACEAN.GLTFResource>({
        type:AssetType.GLTF,
        url:"assets/crowd/man02/sim.glb"
      }).then((asset)=>{
        this.crowdAsset.push(asset);
        // console.log(this.crowdAsset);
      })
    }
    // 加载设置LOD情况

  }
}
