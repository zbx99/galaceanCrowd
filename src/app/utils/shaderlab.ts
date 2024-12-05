// import {ShaderLab} from "@galacean/engine-shader-lab";
// const shaderlab = new ShaderLab()
// 这个是刘志成threejs中的着色器，好像没法用，后续明白了可以调一下
import {Shader} from "@galacean/engine";

export const  StandardShaderVertSource = `
  #define STANDARD
  varying vec3 vViewPosition;

  #ifdef USE_TRANSMISSION

      varying vec3 vWorldPosition;

  #endif

  #include <common>
  #include <uv_pars_vertex>
  #include <uv2_pars_vertex>
  #include <displacementmap_pars_vertex>
  #include <color_pars_vertex>
  #include <fog_pars_vertex>
  #include <normal_pars_vertex>
  #include <morphtarget_pars_vertex>
  #include <skinning_pars_vertex>
  #include <shadowmap_pars_vertex>
  #include <logdepthbuf_pars_vertex>
  #include <clipping_planes_pars_vertex>
  void main() {
      // gl_Position=vec4(0.,0.,-1000.,1.);
      // return;
      #include <uv_vertex>
      #include <uv2_vertex>
      #include <color_vertex>

      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
      #include <normal_vertex>

      #include <begin_vertex>
      #include <morphtarget_vertex>
      #include <skinning_vertex>
      #include <displacementmap_vertex>

      Vertex vertex;
      vertex.position=transformed;
      vertex.normal=vNormal;
      vertex=frameInterpolation(vertex);
      transformed=vertex.position;
      vNormal=vertex.normal;

      instanceColorOut= instanceColorIn;
      #include <project_vertex>

      #include <logdepthbuf_vertex>
      #include <clipping_planes_vertex>

      vViewPosition = - mvPosition.xyz;

      #include <worldpos_vertex>
      #include <shadowmap_vertex>
      #include <fog_vertex>

  #ifdef USE_TRANSMISSION

      vWorldPosition = worldPosition.xyz;

  #endif
  }
`
export const StandardShaderFragSource = `
  #define STANDARD

  #ifdef PHYSICAL
  #define IOR
  #define SPECULAR
  #endif

  uniform vec3 diffuse;
  uniform vec3 emissive;
  uniform float roughness;
  uniform float metalness;
  uniform float opacity;

  #ifdef IOR
  uniform float ior;
  #endif

  #ifdef SPECULAR
  uniform float specularIntensity;
  uniform vec3 specularColor;

  #ifdef USE_SPECULARINTENSITYMAP
  uniform sampler2D specularIntensityMap;
  #endif

  #ifdef USE_SPECULARCOLORMAP
  uniform sampler2D specularColorMap;
  #endif
  #endif

  #ifdef USE_CLEARCOAT
  uniform float clearcoat;
  uniform float clearcoatRoughness;
  #endif

  #ifdef USE_SHEEN
  uniform vec3 sheenColor;
  uniform float sheenRoughness;

  #ifdef USE_SHEENCOLORMAP
  uniform sampler2D sheenColorMap;
  #endif

  #ifdef USE_SHEENROUGHNESSMAP
  uniform sampler2D sheenRoughnessMap;
  #endif
  #endif

  varying vec3 vViewPosition;

  #include <common>
  #include <packing>
  #include <dithering_pars_fragment>
  #include <color_pars_fragment>
  #include <uv_pars_fragment>
  #include <uv2_pars_fragment>
  #include <map_pars_fragment>
  #include <alphamap_pars_fragment>
  #include <alphatest_pars_fragment>
  #include <aomap_pars_fragment>
  #include <lightmap_pars_fragment>
  #include <emissivemap_pars_fragment>
  #include <bsdfs>
  #include <cube_uv_reflection_fragment>
  #include <envmap_common_pars_fragment>
  #include <envmap_physical_pars_fragment>
  #include <fog_pars_fragment>
  #include <lights_pars_begin>
  #include <normal_pars_fragment>

  #include <lights_physical_pars_fragment>

  #include <transmission_pars_fragment>
  #include <shadowmap_pars_fragment>
  #include <bumpmap_pars_fragment>
  #include <normalmap_pars_fragment>
  #include <clearcoat_pars_fragment>
  #include <roughnessmap_pars_fragment>
  #include <metalnessmap_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <clipping_planes_pars_fragment>
  //////////////////////////////////////////////////////
  in vec3 instanceColorOut;
  //////////////////////////////////////////////////////
  void main() {

    #include <clipping_planes_fragment>

    vec4 diffuseColor = vec4( diffuse, opacity );
    /////////////////////////////////////////////////////////////////////
    diffuseColor.xyz +=instanceColorOut;
    /////////////////////////////////////////////////////////////////////
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = emissive;

    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <color_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <roughnessmap_fragment>
    #include <metalnessmap_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>
    #include <clearcoat_normal_fragment_begin>
    #include <clearcoat_normal_fragment_maps>
    #include <emissivemap_fragment>

    // accumulation
    #include <lights_physical_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_maps>
    #include <lights_fragment_end>

    // modulation
    #include <aomap_fragment>

    vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
    vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

    #include <transmission_fragment>

    vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

    #ifdef USE_CLEARCOAT

    float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );

    vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );

    outgoingLight = outgoingLight * ( 1.0 - clearcoat * Fcc ) + clearcoatSpecular * clearcoat;

    #endif

    #include <output_fragment>
    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>

  }`

// 用shaderLab API中写的方法试一下怎么调整
export const ShaderLabVertPBRSource =
`
#include <common>
#include <common_vert>
#include <blendShape_input>
#include <uv_share>
#include <color_share>
#include <normal_share>
#include <worldpos_share>

#include <ShadowVertexDeclaration>
#include <FogVertexDeclaration>

void main() {
    #include <begin_position_vert>

    // set position by instance ID
    int instanceID = gl_InstanceID;
    position.xyz += vec3(instanceID%10*2,0.,instanceID/10*2);

    #include <begin_normal_vert>
    #include <blendShape_vert>
    #include <skinning_vert>
    #include <uv_vert>
    #include <color_vert>
    #include <normal_vert>
    #include <worldpos_vert>
    #include <position_vert>

    #include <ShadowVertex>
    #include <FogVertex>
}
`

export const ShaderLabFragPBRSource =
`#define IS_METALLIC_WORKFLOW
  #include <common>
  #include <camera_declare>

  #include <FogFragmentDeclaration>

  #include <uv_share>
  #include <normal_share>
  #include <color_share>
  #include <worldpos_share>

  #include <light_frag_define>

  #include <pbr_frag_define>
  #include <pbr_helper>

  void main() {
    #include <pbr_frag>
    #include <FogFragment>

    #ifndef ENGINE_IS_COLORSPACE_GAMMA
    gl_FragColor = linearToGamma(gl_FragColor);
    #endif
}`

export const instancePBRshader = Shader.create("Instance-pbr",ShaderLabVertPBRSource,ShaderLabFragPBRSource);
