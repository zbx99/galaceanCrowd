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
      const meshRenderers: any[] = [];
      defaultSceneRoot.getComponentsIncludeChildren(GALACEAN.MeshRenderer, meshRenderers);
    })
  }

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
      const meshRenderers: any[] = [];
      defaultSceneRoot.getComponentsIncludeChildren(GALACEAN.MeshRenderer, meshRenderers);
    })
  }
}
