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
        console.log("crowd asset: "+this.crowdAsset);
        const defaultSceneRoot = asset.instantiateSceneRoot(); // 获取模型的根节点
        console.log("defaultSceneRoot"+defaultSceneRoot);
        const shader = initCustomShader();
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

  // 获取所有 SkinnedMeshRenderer 组件
  const skinnedMeshRenderers = getAllSkinnedMeshRenderers(defaultSceneRoot);
  if (skinnedMeshRenderers.length > 0) {
    console.log(`Loaded ${skinnedMeshRenderers.length} SkinnedMeshRenderer(s) with bone animations.`);
  }

// Inside `load_crowd`
const instanceCount = 1000;  // Number of instances
const instanceStride = 6;    // Data per instance: position (xyz) + color (rgb)
const instanceData = new Float32Array(instanceCount * instanceStride);

// Generate random instance data
for (let i = 0; i < instanceCount; i++) {
  const offset = i * instanceStride;
  instanceData[offset] = (Math.random() - 0.5) * 60; // X position
  instanceData[offset + 1] = (Math.random() - 0.5) * 60; // Y position
  instanceData[offset + 2] = (Math.random() - 0.5) * 60; // Z position
  instanceData[offset + 3] = Math.random(); // Red color
  instanceData[offset + 4] = Math.random(); // Green color
  instanceData[offset + 5] = Math.random(); // Blue color
}
// // Create instance buffer
// const instanceBuffer = new GALACEAN.Buffer(
//   this.engine,
//   GALACEAN.BufferBindFlag.VertexBuffer,
//   instanceData,
//   GALACEAN.BufferUsage.Static
// );


  // // Create gpu vertex buffer and index buffer.
  // const vertexBuffer = new Buffer(
  //   this.engine,
  //   BufferBindFlag.VertexBuffer,
  //   vertices,
  //   BufferUsage.Static
  // );



// Apply instance buffer and material to each SkinnedMeshRenderer
skinnedMeshRenderers.forEach(renderer => {
  const sourceMesh = renderer.mesh as GALACEAN.ModelMesh;
  const pos=sourceMesh.getPositions;
  // for(let i=0;i<pos.length;i++)
  // {
    console.log("sourceMesh's positions length: "+pos.length)
  //}


  // Attach instance data to the mesh
  if (sourceMesh) {
    //sourceMesh.setVertexBufferBinding(instanceBuffer, 24, 1);
    renderer.mesh = sourceMesh;
    
    // Apply custom shader
    const material = new GALACEAN.Material(this.engine, shader);
    renderer.setMaterial(material);
  }
});

      // 添加到场景
      this.crowdGroup.addChild(defaultSceneRoot);
      console.log(`Models added to crowd group: ${this.crowdGroup.children.length}`);




  /**
 * 非实例化方法
 */
      // const modelCount = 500;  // 要加载的模型数量
      // const spacing = 1;      // 每个模型在 x 轴上的间隔距离
      // let counter =0;
      // for (let i = 0; i < modelCount; i++) {
      //   // 克隆模型
      //   let modelClone: GALACEAN.Entity= defaultSceneRoot.clone();
      //   // 设置模型的位置，x 轴上稍微错开
      //   if(i%10===0){
      //     counter++;
      //   }       

      //   modelClone.transform.position.set(i%10*spacing, 0, counter);
      //   // 将模型添加到场景中
      //   this.crowdGroup.addChild(modelClone);
      // }

      

      })
    }


    
    // 加载设置LOD情况    
  }

}

/**
 * 创建自定义实例化着色器
 */
function initCustomShader(): GALACEAN.Shader {
  const vertexShader = `
    attribute vec3 POSITION;
    attribute vec3 NORMAL;
    attribute vec3 INSTANCE_OFFSET;
    attribute vec3 INSTANCE_COLOR;

    uniform mat4 renderer_MVPMat;
    uniform mat4 u_Bones[83]; // 根据骨骼数量调整

    varying vec3 v_Color;

    void main() {
      // 简单的骨骼变换示例（需要根据实际骨骼数据调整）
      vec4 skinnedPosition = vec4(POSITION, 1.0);
      for (int i = 0; i < 4; i++) { // 假设每个顶点最多受4个骨骼影响
        skinnedPosition += u_Bones[i] * skinnedPosition; // 需要结合骨骼权重
      }

      // 应用实例偏移
      skinnedPosition.xyz += INSTANCE_OFFSET;

      // 计算最终位置
      gl_Position = renderer_MVPMat * skinnedPosition;

      // 传递颜色
      v_Color = INSTANCE_COLOR;
    }
  `;

  const fragmentShader = `
    precision mediump float;
    varying vec3 v_Color;

    void main() {
      gl_FragColor = vec4(v_Color, 1.0);
    }
  `;

  // 使用 Shader.create 正确创建着色器
  return GALACEAN.Shader.create("CustomSkinnedShader", vertexShader, fragmentShader);
}
