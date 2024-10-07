// import * as GALACEAN from "@galacean/engine";
// import {CrowdLod} from "@/app/crowd/CrowdLod";
// import {Matrix} from "@galacean/engine";
//
// interface meshTypeMap {
//   [key: string]: string | null;
// }
//
// interface lodVisibleMap {
//   [key: string]: number | null;
// }
//
// export class crowd{
//   private count:number = 0;
//   private useColorTag:Array<string>=[];
//
//   // private animPathPre:Array<string>=[];
//   // private pathLodGeo:Array<string>=[];
//   // private pathTextureConfig:Array<string>=[];
//   // private pathTexture:Array<string>=[];
//   //
//   // private lodVisible:Array<lodVisibleMap>=[];
//   // private lodAvatarCount:Array<number>=[];
//   private engine:GALACEAN.Engine;
//   private dummy:GALACEAN.Entity;
//
//   private clock:GALACEAN.Time;
//   private instanceMatrix:GALACEAN.BufferInfo=new GALACEAN.BufferInfo();
//   private textureType:GALACEAN.BufferMesh;
//   private animationType:GALACEAN.BufferMesh;
//   private speed:GALACEAN.BufferMesh;
//   private obesity:GALACEAN.BufferMesh;
//   private moveMaxLength:GALACEAN.BufferMesh;
//   private animationStartTime:GALACEAN.BufferMesh;
//   private bodyScale:GALACEAN.BufferMesh;
//   private instanceColorIn_All:[string,GALACEAN.BufferMesh];
//   private lodCount:number = 21;
//   private lodList:Int8Array;
//   private lodDistance:Array<number>=[];
//   private lodGeometry:Array<number>=[];
//   private lodController:CrowdLod;
//   private meshType:Array<meshTypeMap>=[];
//   // 现在还不明白这两个的类型怎么定义
//   // private meshTypeList:Array<[string,>;
//   // private meshTypeListElem:array<>;
//   private crowdPoints:GALACEAN.Entity;
//   constructor(){
//
//   }
//   // 看看init能不能并入constructor中
//   init(){
//     //创建crwodmodel
//   }
//
//   // 设置Crowd相关属性
//   getMatrixAt(index:number,matrix:){
//     .copyFromArray(this.instanceMatrix)
//   }
