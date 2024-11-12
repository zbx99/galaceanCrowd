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
        const Meshvertices: Float32Array[] = [];

        // const positions: [Vector3[]]=[[]]; 
        // const normals: [Vector3[]]=[[]]; 

  /**
 * create the "vertice" array which will be applied to use in buffer mesh creation 
 */
        asset.meshes?.forEach((meshes) => {
          meshes?.forEach((mesh) => {
            const verticesArray: number[] = [];
            console.log("position", mesh.getPositions());
            // console.log("indices", mesh.getIndices());
            // console.log("uvs", mesh.getUVs());
            console.log("normals", mesh.getNormals());
            const positions = mesh.getPositions();
            const normals = mesh.getNormals();
            // 确保 positions 和 normals 都不是 null
            if (positions && normals) {
            for (let i = 0; i < positions.length; i++) {
            // 把每个 Vector3 的 x, y, z 添加到 verticesArray 中
            verticesArray.push(positions[i].x, positions[i].y, positions[i].z);
            verticesArray.push(normals[i].x, normals[i].y, normals[i].z);
            // convert verticesArray from number to Float32Array           
            }
            const vertices = new Float32Array(verticesArray);
            //console.log("vertices value: "+ vertices);
            Meshvertices.push(vertices); 
          }
          });
        });

  /**
 * display the contents of "vertice" array to check it
 */
// console.log("Meshvertices element count: ", Meshvertices.length);
// console.log("asset.meshes: ", asset.meshes?.length);

// Meshvertices.forEach(Meshvertices => {
//   console.log("check vertice count in each mesh: ", Meshvertices.length);
//   Meshvertices.forEach(vertice => {
//     console.log("mesh vertice: ", vertice);
//   });
// });       
      })
    }
    // 加载设置LOD情况

  }
}
