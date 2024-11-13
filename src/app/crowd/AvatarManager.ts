import * as GALACEAN from "@galacean/engine";
import {AssetType, IndexFormat, ModelMesh, SkinnedMeshRenderer, UnlitMaterial} from "@galacean/engine";

import {OrbitControl} from "@galacean/engine-toolkit-controls";
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

export class AvatarManager {
  // 逐个加载创建Crowd
  //private crowdGroup: GALACEAN.Entity;
  private engine: GALACEAN.Engine;
  //private crowdAsset: Array<GALACEAN.GLTFResource>;

  constructor(root: GALACEAN.Entity, modelLength: number) {
    //this.crowdGroup = root.createChild("buildingParent");
    this.engine = root.engine;
    // this.crowdAsset = new Array<GALACEAN.GLTFResource>();
    // this.crowdGroup.transform.setPosition(0, -30, 0);
    // this.crowdGroup.transform.setScale(10, 10, 10);
    const startTime = performance.now(); // 获取开始时间

    this.load_crowd();

    const endTime = performance.now(); // 获取结束时间
    const elapsedTime = endTime - startTime; // 计算耗时（单位为毫秒）
    console.log(`代码运行时间：${elapsedTime.toFixed(2)} 毫秒`);
    
  }


  load_crowd() {
      this.engine.resourceManager
      .load<GALACEAN.GLTFResource>({
        type: AssetType.GLTF,
        url: "assets/crowd/man02/sim.gltf",
        params: {
          keepMeshData: true,
        },
      })
      .then((gltf) => {
        var i = 0
        const scene = this.engine.sceneManager.activeScene;
        const rootEntity = scene.createRootEntity("Root");
        const shader = initCustomShader();
        gltf.meshes?.forEach((meshes) => {
          meshes?.forEach((mesh) => {
            console.log("mesh count: ", gltf.meshes?.length);
            console.log("gltf.materials count: ", gltf.materials!.length);
            const orimaterial = gltf.materials![0];
            console.log("orimaterial: ", orimaterial);
            const pos = mesh.getPositions();
            const normal = mesh.getNormals();
            const indices = mesh.getIndices();
            //console.log("try the new load fuction",pos);
            
            if(pos && normal)
            {
              const poss: Float32Array = new Float32Array(pos.length * 6);
            for (let i = 0; i < pos.length; i++) {
              poss[i * 6 + 0] = pos[i].x;
              poss[i * 6 + 1] = pos[i].y;
              poss[i * 6 + 2] = pos[i].z;
              poss[i * 6 + 3] = normal[i].x;
              poss[i * 6 + 4] = normal[i].y;
              poss[i * 6 + 5] = normal[i].z;
            }

            const indexs: Uint16Array = new Uint16Array(indices);
            //console.log("uvs", mesh.getUVs());
            //callback(poss,indexs,orimaterial)
            
            console.log("shader created");
            const cubeEntity = rootEntity.createChild("Cube");
            cubeEntity.transform.setPosition(0, -30, 0.5);
            cubeEntity.transform.setScale(5, 5, 5);
            const cubeRenderer = cubeEntity.addComponent(MeshRenderer);
            orimaterial.shader = shader;
            cubeRenderer.mesh = createCustomMesh(this.engine, poss, indexs); // Use `createCustomMesh()` to create custom instance cube mesh.
            cubeRenderer.setMaterial(orimaterial);
            }
          });
          i++;
        });
      });
  
    //   /**
    //    * 非实例化方法
    //    */
    //   // const modelCount = 500;  // 要加载的模型数量
    //   // const spacing = 1;      // 每个模型在 x 轴上的间隔距离
    //   // let counter =0;
    //   // for (let i = 0; i < modelCount; i++) {
    //   //   // 克隆模型
    //   //   let modelClone: GALACEAN.Entity= defaultSceneRoot.clone();
    //   //   // 设置模型的位置，x 轴上稍微错开
    //   //   if(i%10===0){
    //   //     counter++;
    //   //   }

    //   //   modelClone.transform.position.set(i%10*spacing, 0, counter);
    //   //   // 将模型添加到场景中
    //   //   this.crowdGroup.addChild(modelClone);
    //   // }


    // })
  }


  // 加载设置LOD情况
}





function createCustomMesh(engine:GALACEAN.Engine,  poss:Float32Array, indexs:Uint16Array): GALACEAN.Mesh {
  const geometry = new BufferMesh(engine, "CustomCubeGeometry");
  const posBufferObj = new Buffer(
    engine,
    BufferBindFlag.VertexBuffer,
    poss,
    BufferUsage.Static
  );

  const indexBufferObj = new Buffer(
    engine,
    BufferBindFlag.IndexBuffer,
    indexs,
    BufferUsage.Static
  );

  geometry.setVertexBufferBinding(posBufferObj, 24, 0);
  geometry.setIndexBufferBinding(indexBufferObj, IndexFormat.UInt16);

  // 添加vertexElements
  geometry.setVertexElements([
    new VertexElement("POSITION", 0, VertexElementFormat.Vector3, 0, 0),
    new VertexElement("NORMAL", 12, VertexElementFormat.Vector3, 0, 0), 
  ]);
  geometry.addSubMesh(0, indexs.length);
  geometry.instanceCount = 5000;
  return geometry;
}
function initCustomShader(): Shader {
  const shader = Shader.create(
    "CustomShader",
    `uniform mat4 renderer_MVPMat;
      attribute vec4 POSITION;
      uniform mat4 renderer_MVMat;
      void main() {
        vec4 position = POSITION;
        int instanceID = gl_InstanceID;
        position.xyz += vec3(instanceID%10*2,0.,instanceID/10*2);
        gl_Position = renderer_MVPMat * position;
      }`,

    `
      void main() {
        vec4 color = vec4(1.0,0.,0.,1.0);
        gl_FragColor = color;
      }
      `
  );
  return shader;
}