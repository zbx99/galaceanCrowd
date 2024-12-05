import {Engine, PBRBaseMaterial, Shader} from "@galacean/engine";
import {ShaderProperty} from "@galacean/engine";
import {Texture2D} from "@galacean/engine";
import { MathUtil, Vector3 } from "@galacean/engine-math";
import {instancePBRshader} from "./shaderlab";


/**
 * PBR (Metallic-Roughness Workflow) Material.
 */
export class InstancePBRMaterial extends PBRBaseMaterial {
  private static _metallicProp = ShaderProperty.getByName("material_Metal");
  private static _roughnessProp = ShaderProperty.getByName("material_Roughness");
  private static _roughnessMetallicTextureProp = ShaderProperty.getByName("material_RoughnessMetallicTexture");

  private static _iorProp = ShaderProperty.getByName("material_IOR");

  private static _anisotropyInfoProp = ShaderProperty.getByName("material_AnisotropyInfo");
  private static _anisotropyTextureProp = ShaderProperty.getByName("material_AnisotropyTexture");

  private _anisotropyRotation: number = 0;

  /**
   * Index Of Refraction.
   * @defaultValue `1.5`
   */
  get ior(): number {
    return this.shaderData.getFloat(InstancePBRMaterial._iorProp);
  }

  set ior(v: number) {
    this.shaderData.setFloat(InstancePBRMaterial._iorProp, Math.max(v, 0));
  }

  /**
   * Metallic.
   * @defaultValue `1.0`
   */
  get metallic(): number {
    return this.shaderData.getFloat(InstancePBRMaterial._metallicProp);
  }

  set metallic(value: number) {
    this.shaderData.setFloat(InstancePBRMaterial._metallicProp, value);
  }

  /**
   * Roughness. default 1.0.
   * @defaultValue `1.0`
   */
  get roughness(): number {
    return this.shaderData.getFloat(InstancePBRMaterial._roughnessProp);
  }

  set roughness(value: number) {
    this.shaderData.setFloat(InstancePBRMaterial._roughnessProp, value);
  }

  /**
   * Roughness metallic texture.
   * @remarks G channel is roughness, B channel is metallic
   */
  get roughnessMetallicTexture(): Texture2D {
    return <Texture2D>this.shaderData.getTexture(InstancePBRMaterial._roughnessMetallicTextureProp);
  }

  set roughnessMetallicTexture(value: Texture2D) {
    this.shaderData.setTexture(InstancePBRMaterial._roughnessMetallicTextureProp, value);
    if (value) {
      this.shaderData.enableMacro("MATERIAL_HAS_ROUGHNESS_METALLIC_TEXTURE");
    } else {
      this.shaderData.disableMacro("MATERIAL_HAS_ROUGHNESS_METALLIC_TEXTURE");
    }
  }

  /**
   * The strength of anisotropy, when anisotropyTexture is present, this value is multiplied by the blue channel.
   * @defaultValue `0`
   */
  get anisotropy(): number {
    return this.shaderData.getVector3(InstancePBRMaterial._anisotropyInfoProp).z;
  }

  set anisotropy(value: number) {
    const anisotropyInfo = this.shaderData.getVector3(InstancePBRMaterial._anisotropyInfoProp);
    if (!!anisotropyInfo.z !== !!value) {
      if (value === 0) {
        this.shaderData.disableMacro("MATERIAL_ENABLE_ANISOTROPY");
      } else {
        this.shaderData.enableMacro("MATERIAL_ENABLE_ANISOTROPY");
      }
    }
    anisotropyInfo.z = value;
  }

  /**
   * The rotation of the anisotropy in tangent, bitangent space, value in degrees.
   * @defaultValue `0`
   */
  get anisotropyRotation(): number {
    return this._anisotropyRotation;
  }

  set anisotropyRotation(value: number) {
    if (this._anisotropyRotation !== value) {
      this._anisotropyRotation = value;

      const anisotropyInfo = this.shaderData.getVector3(InstancePBRMaterial._anisotropyInfoProp);
      const rad = MathUtil.degreeToRadFactor * value;
      anisotropyInfo.x = Math.cos(rad);
      anisotropyInfo.y = Math.sin(rad);
    }
  }

  /**
   * The anisotropy texture.
   * @remarks
   * Red and green channels represent the anisotropy direction in [-1, 1] tangent, bitangent space, to be rotated by anisotropyRotation.
   * The blue channel contains strength as [0, 1] to be multiplied by anisotropy.
   */
  get anisotropyTexture(): Texture2D {
    return <Texture2D>this.shaderData.getTexture(InstancePBRMaterial._anisotropyTextureProp);
  }

  set anisotropyTexture(value: Texture2D) {
    this.shaderData.setTexture(InstancePBRMaterial._anisotropyTextureProp, value);

    if (value) {
      this.shaderData.enableMacro("MATERIAL_HAS_ANISOTROPY_TEXTURE");
    } else {
      this.shaderData.disableMacro("MATERIAL_HAS_ANISOTROPY_TEXTURE");
    }
  }

  /**
   * Create a pbr metallic-roughness workflow material instance.
   * @param engine - Engine to which the material belongs
   */
  constructor(engine: Engine) {

    // super(engine, Shader.find("pbr"));
    super(engine, instancePBRshader);
    const shaderData = this.shaderData;
    shaderData.setFloat(InstancePBRMaterial._metallicProp, 1);
    shaderData.setFloat(InstancePBRMaterial._roughnessProp, 1);
    shaderData.setFloat(InstancePBRMaterial._iorProp, 1.5);
    shaderData.setVector3(InstancePBRMaterial._anisotropyInfoProp, new Vector3(1, 0, 0));
  }

  /**
   * @inheritdoc
   */
  override clone(): InstancePBRMaterial {
    const dest = new InstancePBRMaterial(this._engine);
    this.cloneTo(dest);
    return dest;
  }
}
