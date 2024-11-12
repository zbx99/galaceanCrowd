import * as GALACEAN from "@galacean/engine";
import {AssetType, IndexFormat, ModelMesh, SkinnedMeshRenderer, UnlitMaterial} from "@galacean/engine";

import { OrbitControl } from "@galacean/engine-toolkit-controls";
import {
  Engine,
  WebGLEngine,
  BufferMesh,
  Buffer,
  BufferBindFlag,
  BufferUsage,
  MeshRenderer,
  Material,
  Shader,
  VertexElement,
  VertexElementFormat,
  Vector3,
  Camera,
} from "@galacean/engine";

export class AvatarManager{
  // 逐个加载创建Crowd
  private crowdGroup: GALACEAN.Entity;
  private engine:GALACEAN.Engine;
  private crowdAsset:Array<GALACEAN.GLTFResource>;
  constructor(root:GALACEAN.Entity,modelLength:number) {
    this.crowdGroup = root.createChild("buildingParent");
    this.engine = root.engine;
    this.crowdAsset = new Array<GALACEAN.GLTFResource>();
    this.crowdGroup.transform.setPosition(0,-30,0);
    this.crowdGroup.transform.setScale(10,10,10);
    this.load_crowd(1);
  }


  load_crowd(modelLength:number) {
    // 加载基础GLB模型
    for (let i=0;i<modelLength;i++) {
      this.engine.resourceManager.load<GALACEAN.GLTFResource>({
        type:AssetType.GLTF,
        url:"assets/crowd/man02/sim.gltf",
        params: {
          keepMeshData: true,
        },
      }).then((asset)=>{
        this.crowdAsset.push(asset);
        // console.log(this.crowdAsset);
      })
    }
    // 加载设置LOD情况

  }
}
