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
            {
              indicesArray=Array.from(indices);
            }
            const indces = new Uint16Array(indicesArray);
            meshIndices.push(indces);
          }

        });
      });

      /**
       * display the contents of "vertice" array to check it
       */
        // console.log("meshVertices element count: ", meshVertices.length);
        // console.log("asset.meshes: ", asset.meshes?.length);

        // meshVertices.forEach(Meshvert => {
        //   console.log("check vertice count in each mesh: ", Meshvert.length);
        //   Meshvert.forEach(vertice => {
        //     console.log("mesh vertice: ", vertice);
        //   });
        // });

        
        // let i =0;
        // meshIndices.forEach(meshind => {
        //   console.log("check indice count in each mesh: ", meshind.length);
        //   meshind.forEach(indices => {
        //     i++;
        //     //console.log("mesh indice: ", indices);
        //   });
        // });
        // console.log("indice count in array: ", i);

        const meshRenderers: any[] = [];
        defaultSceneRoot.getComponentsIncludeChildren(MeshRenderer,meshRenderers);
        console.log(meshRenderers);

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