import {
  AssetPromise, AssetType,
  BlinnPhongMaterial,
  Camera,
  Color,
  DirectLight,
  Entity, GLTFResource,
  Loader,
  LoadItem,
  MeshRenderer,
  MeshTopology,
  ModelMesh,
  resourceLoader,
  ResourceManager,
  Vector3,
  WebGLEngine,
} from "@galacean/engine";
import JSZip from "jszip";
import * as fs from "fs";


@resourceLoader("OBJ", ["obj"])
export class OBJLoader extends Loader<ModelMesh> {
  load(
    item: LoadItem,
    resourceManager: ResourceManager
  ): AssetPromise<ModelMesh> {
    return this.request<string>(item.url!, { ...item, type: "text" }).then(
      (text: string) => {
        const lines = text.split(/\n/);
        const positions: Vector3[] = [];
        const indices: number[] = [];
        lines
          .map((lineText) => lineText.split(" "))
          .forEach((parseTexts) => {
            if (parseTexts[0] === "v") {
              positions.push(
                new Vector3(
                  parseFloat(parseTexts[1]),
                  parseFloat(parseTexts[2]),
                  parseFloat(parseTexts[3])
                )
              );
            } else if (parseTexts[0] === "f") {
              indices.push(
                parseInt(parseTexts[1]) - 1,
                parseInt(parseTexts[2]) - 1,
                parseInt(parseTexts[3]) - 1
              );
            }
          });
        const mesh = new ModelMesh(resourceManager.engine);
        mesh.setPositions(positions);
        mesh.setIndices(Uint16Array.from(indices));
        mesh.addSubMesh(0, indices.length, MeshTopology.Triangles);
        mesh.uploadData(false);
        return mesh;
      }
    );
  }
}
