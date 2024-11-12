import * as GALACEAN from "@galacean/engine";
import {
  AssetPromise,
  AssetType,
  Engine,
  GLTFResource,
  Loader,
  LoadItem,
  resourceLoader,
  ResourceManager
} from "@galacean/engine";
import SMatrix from "./smatrix.json";
import StructDesc from "./structdesc.json";
import AdmZip from 'adm-zip';
import JSZip from "jszip";
// import * as fs from "fs/promises";

@resourceLoader("Zip",["zip"])
export class ZipLoader extends Loader<GLTFResource>{
  load(
    item: LoadItem,
    resourceManager: ResourceManager
  ): AssetPromise<GLTFResource> {
    // 读取zip压缩文件，然后传回GLTFResource
    return this.request<ArrayBuffer>(item.url!,{ ...item, type: "arraybuffer" }).then((data:ArrayBuffer) => {
      console.log(data);
      return JSZip.loadAsync(data).then((zip) => {
          let files = zip.files;
          for (let file in files) {
            if (file.endsWith(".gltf")||file.endsWith(".glb")) {
              let fileContent = zip.file(file);
              // @ts-ignore
              return fileContent.async("arraybuffer").then((content) => {
                console.log(content, file)
                let blob = new Blob([content]);
                let modelUrl = URL.createObjectURL(blob);
                console.log(modelUrl);
                return resourceManager.load<GLTFResource>({
                  type:AssetType.GLTF,
                  url:modelUrl
                })
              })
            }
          }
          console.log("error:Zip is empty!");
          return new AssetPromise<GLTFResource>((resolve, reject, setTaskCompleteProgress, setTaskDetailProgress) => {})
      });
    });
  }
}

export class Building{
  private parentGroup: GALACEAN.Entity;
  private engine:GALACEAN.Engine;
  meshRenderers: GALACEAN.MeshRenderer[];
  constructor(root:GALACEAN.Entity) {
    this.parentGroup = root.createChild("buildingParent");
    this.engine = root.engine;
    this.parentGroup.transform.setPosition(0,-30,0);
    this.parentGroup.transform.setScale(0.0001,0.0001,0.0001);
    // this.load().then(r => {});
    this.loadZip(1).then(r => {});
    this.meshRenderers=[];
  }

  async load(){
    let self = this;
    self.engine.resourceManager.load<GALACEAN.GLTFResource>(
      "assets/Building/tiyuguan/output.glb"
    ).then((asset) => {
      const { materials, animations } = asset;
      const defaultSceneRoot = asset.instantiateSceneRoot();
      this.parentGroup.addChild(defaultSceneRoot);
      //const meshRenderers: any[] = [];
      defaultSceneRoot.getComponentsIncludeChildren(GALACEAN.MeshRenderer, this.meshRenderers);
    })
  }

  colors = [
    new GALACEAN.Color(1, 0, 0, 1),    // 红色 直播大屏幕
    new GALACEAN.Color(0, 1, 0, 1),    // 绿色 直播屏幕上面的大螺母
    new GALACEAN.Color(0, 0, 1, 1),    // 蓝色 直播屏幕的框框
    new GALACEAN.Color(1, 1, 0, 1),    // 黄色 斜前方的扶手
    new GALACEAN.Color(1, 0, 1, 1),    // 品红色
    new GALACEAN.Color(0, 1, 1, 1),    // 青色 侧面的扶手
    new GALACEAN.Color(0.5, 0, 0.5, 1), // 紫色
    new GALACEAN.Color(0.5, 0.5, 0, 1), // 橄榄色
    new GALACEAN.Color(0.5, 0.5, 1, 1), // 浅蓝色
    new GALACEAN.Color(1, 0.5, 0, 1),  // 橙色
    new GALACEAN.Color(0, 0.5, 0.5, 1), // 深青色
    new GALACEAN.Color(0.5, 1, 0.5, 1), // 浅绿色
    new GALACEAN.Color(1, 0.5, 1, 1),  // 粉色
    new GALACEAN.Color(0.5, 0, 0, 1),  // 深红色
    new GALACEAN.Color(0, 0.5, 0, 1),  // 深绿色 就是体育馆主体
    new GALACEAN.Color(0, 0, 0, 1)     // 黑色 顶上的架子
];


  async loadZip(index:number){
    const baseUrl = "assets/Building/output"
    // 加载ZIP文件
    let self = this;
    this.engine.resourceManager.load<GALACEAN.GLTFResource>({
      type:"Zip",
      url:"assets/Building/tiyuguan.zip"  //baseUrl+index+".zip"
    }).then((asset) => {
      console.log(asset)
      const { materials, animations } = asset;
      const defaultSceneRoot = asset.instantiateSceneRoot();
      this.parentGroup.addChild(defaultSceneRoot);
      // const meshRenderers: any[] = [];
      // defaultSceneRoot.getComponentsIncludeChildren(GALACEAN.MeshRenderer, meshRenderers);
            // 在这里应用材质和纹理
            //const meshRenderers: GALACEAN.MeshRenderer[] = [];
            defaultSceneRoot.getComponentsIncludeChildren(GALACEAN.MeshRenderer, this.meshRenderers);
            const texturePath: string="assets/Building/textures/TCom_Ground_Grass01_header.jpg"
            // 确保纹理在加载时启用 Mipmap 以提高显示效果
            self.engine.resourceManager.load<GALACEAN.Texture2D>({
            type: GALACEAN.AssetType.Texture2D,
            url: texturePath,
            //mipmap: true  // 启用 Mipmap
            
          }).then(texture => {
            // 设置材质并应用纹理
            texture.generateMipmaps();
            const material = new GALACEAN.PBRMaterial(self.engine);
            material.baseTexture = texture;
            material.baseColor.set(1, 1, 1, 1);  // 确保 baseColor 是白色，以便完全显示颜色纹理
            // 设置为双面渲染，禁用背面剔除
            //material.renderFace = GALACEAN.RenderFace.Double; // 确保材质双面渲染
            // 应用材质到所有的 MeshRenderer
            //material.renderState.rasterState.cullMode = GALACEAN.CullMode.Off; // 禁用背面剔除
            //this.meshRenderers[14].setMaterial(material);
            this.meshRenderers[0].setMaterial(material);
            //this.meshRenderers[14].update(0.01); // 强制更新渲染器
          
            
            console.log("Texture applied to material:", material.baseTexture);
          }).catch(error => {
            console.error("Error loading texture:", error);
          });

    })

  }
}
