import * as GALACEAN from "@galacean/engine";
import {AssetType, BoundingBox, Color, IndexFormat, Matrix, ModelMesh, SkinnedMeshRenderer, UnlitMaterial} from "@galacean/engine";

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
import {ShaderLabVertPBRSource, ShaderLabFragPBRSource, instancePBRshader} from "@/app/utils/shaderlab";
import {InstancePBRMaterial} from "@/app/utils/InstancePBRMaterial";

export class AvatarManager {
  // 逐个加载创建Crowd
  private crowdGroup: GALACEAN.Entity;
  private engine: GALACEAN.Engine;
  //private crowdAsset: Array<GALACEAN.GLTFResource>;
  static modelCount: number =5;

  constructor(root: GALACEAN.Entity, modelLength: number) {
    this.crowdGroup = root.createChild("CrowdParent");
    this.engine = root.engine;
    // this.crowdAsset = new Array<GALACEAN.GLTFResource>();
    // this.crowdGroup.transform.setPosition(0, -30, 0);
    // this.crowdGroup.transform.setScale(0.5, 0.5, 0.5);
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
        url: "assets/crowd/test.glb",
        params: {
          keepMeshData: true,
        },
      })
      .then((gltf) => {

        const meshRenderers:any[]=[];
        gltf.defaultSceneRoot.getComponentsIncludeChildren(MeshRenderer,meshRenderers);
        const scene = this.engine.sceneManager.activeScene;
        const rootEntity = scene.createRootEntity("Root");
        const shader = initCustomShader();
        let j = 0;
        // 直接添加gltf
        // rootEntity.transform.setPosition(0.5, -10, 0.5);
        // rootEntity.transform.setScale(5,5,5);
        // rootEntity.addChild(gltf.defaultSceneRoot);

        // meshrenderer中添加原mesh
        // meshRenderers.forEach((meshrender)=>{
        //   const orimaterial = meshrender._materials[0];
        //   const mesh = meshrender._mesh;
        //   const personEntity = rootEntity.createChild("PersonPart" + j.toString());
        //   personEntity.transform.setPosition(0, -10, 0.5);
        //   personEntity.transform.setScale(5, 5, 5);
        //   const personRenderer = personEntity.addComponent(MeshRenderer);
        //   personRenderer.mesh = mesh;
        //   personRenderer.setMaterial(orimaterial);
        // })

        // meshrenderer中添加自定义mesh
        meshRenderers.forEach((meshrender)=>{
          const orimaterial = meshrender._materials[0];
          const mesh = meshrender._mesh;
          console.log(mesh);
          const texture = orimaterial.shaderData.getTexture('material_BaseTexture');
          const pos = mesh.getPositions();
          const normal = mesh.getNormals();
          const indices = mesh.getIndices();
          const uvs = mesh.getUVs();

          if(pos && normal && uvs){
            const uvss: Float32Array = new Float32Array(uvs.length * 2);
            const poss: Float32Array = new Float32Array(pos.length * 6);
            for (let i = 0; i < pos.length; i++) {
              poss[i * 6 + 0] = pos[i].x;
              poss[i * 6 + 1] = pos[i].y;
              poss[i * 6 + 2] = pos[i].z;
              poss[i * 6 + 3] = normal[i].x;
              poss[i * 6 + 4] = normal[i].y;
              poss[i * 6 + 5] = normal[i].z;
              uvss[i * 2 + 0] = uvs[i].x;
              uvss[i * 2 + 1] = uvs[i].y;
            }
            const indexs: Uint16Array = new Uint16Array(indices);
            const personEntity = rootEntity.createChild("PersonPart" + j.toString());
            personEntity.transform.setPosition(0, -10, 0.5);
            personEntity.transform.setScale(5, 5, 5);
            const material = new Material(this.engine, shader);
            // const material = new InstancePBRMaterial(this.engine);
            // orimaterial.cloneTo(material);
            // material.shader = instancePBRshader;
            // console.log(material,orimaterial);
            const personRenderer = personEntity.addComponent(MeshRenderer);
            if(texture){
              material.shaderData.setTexture("Tex", texture);
              material.shaderData.setFloat("ifTex", 1.0);
            }else{
              const color = orimaterial.shaderData.getColor('material_BaseColor')
              material.shaderData.setColor("BaseColor", color)
              material.shaderData.setFloat("ifTex", 0.0);
            }
            personRenderer.mesh = createCustomMesh(this.engine, poss, indexs, uvss); // Use `createCustomMesh()` to create custom instance person mesh.
            personRenderer.setMaterial(orimaterial);

            //为自定义mesh设置bounds
            const box = new BoundingBox(personEntity.transform.position, new Vector3(AvatarManager.modelCount%10*2,50.,AvatarManager.modelCount/10*2));
            personRenderer.mesh.bounds=box;
            j++;
          }
        })
      });

    //   /**
    //    * 非实例化方法
    //    */
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


    // })
  }


  // 加载设置LOD情况
}


function createCustomMesh(engine:GALACEAN.Engine,  poss:Float32Array, indexs:Uint16Array, uvss:Float32Array): GALACEAN.Mesh {
  const geometry = new BufferMesh(engine, "CustompersonGeometry");
  const posBufferObj = new Buffer(
    engine,
    BufferBindFlag.VertexBuffer,
    poss,
    BufferUsage.Static
  );
  const uvBufferObj = new Buffer(
    engine,
    BufferBindFlag.VertexBuffer,
    uvss,
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
  geometry.setVertexBufferBinding(uvBufferObj, 8, 1);
  // 添加vertexElements
  geometry.setVertexElements([
    new VertexElement("POSITION", 0, VertexElementFormat.Vector3, 0, 0),
    new VertexElement("NORMAL", 12, VertexElementFormat.Vector3, 0, 0),
    new VertexElement("UVV", 0, VertexElementFormat.Vector2, 1, 0)
  ]);
  geometry.addSubMesh(0, indexs.length);
  geometry.instanceCount = AvatarManager.modelCount;
  return geometry;
}
function initCustomShader(): Shader {// 庄edited
  const shader = Shader.create(
    "InstanceShader",
    `
      #include <common>
      uniform mat4 renderer_MVPMat;
      attribute vec4 POSITION;
      attribute vec2 UVV;
      uniform mat4 renderer_MVMat;
      varying vec2 v_uv;
      void main() {
        vec4 position = POSITION;
        int instanceID = gl_InstanceID;
        position.xyz += vec3(instanceID%10*2,0.,instanceID/10*2);
        gl_Position = renderer_MVPMat * position;
        v_uv = UVV;
      }`,

    ` #include <common>
      uniform sampler2D Tex;
      uniform float ifTex;
      uniform vec4 BaseColor;
      varying vec2 v_uv;
      void main() {
        if(ifTex == 1.){
          gl_FragColor = texture2D(Tex, v_uv);
        }
        else{
          if(BaseColor.a == 0.){
            discard;
          }
          gl_FragColor =  BaseColor;
        }
      }
      `
  );
  return shader;
}
