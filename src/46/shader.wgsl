 // vertex shader 
struct Uniforms {
    viewProjectionMatrix : mat4x4<f32>,
    modelMatrix : mat4x4<f32>,      
    normalMatrix : mat4x4<f32>,            
};
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct Input {
    @location(0) position : vec4<f32>,
    @location(1) normal : vec4<f32>,
    @location(2) uv : vec2<f32>,
    @location(3) color : vec3<f32>,
};
struct Output {
    @builtin(position) Position : vec4<f32>,
    @location(0) vPosition : vec4<f32>,
    @location(1) vNormal : vec4<f32>,
    @location(2) vUV : vec2<f32>,
    @location(3) vColor : vec3<f32>,
};

@vertex
fn vs_main(input: Input) -> Output {        
    var output: Output;        
    let mPosition:vec4<f32> = uniforms.modelMatrix * input.position; 
    output.vPosition = mPosition;                  
    output.vNormal =  uniforms.normalMatrix*input.normal;
    output.Position = uniforms.viewProjectionMatrix * mPosition;     
    output.vUV = input.uv;      
    output.vColor = input.color;          
    return output;
}

// fragment shader
struct FragUniforms {
    lightPosition : vec4<f32>,
    eyePosition : vec4<f32>,
};
@binding(1) @group(0) var<uniform> fragUniforms : FragUniforms;

struct LightUniforms {
    ambientIntensity: f32,
    diffuseIntensity: f32,
    specularIntensity: f32,    
    shininess: f32,
    specularColorR:f32,
    specularColorG:f32,
    specularColorB:f32,
    isPhong: f32,
    isTwoSideLighting: f32,
};
@binding(2) @group(0) var<uniform> lightUniforms : LightUniforms;
@binding(3) @group(0) var textureSampler : sampler;
@binding(4) @group(0) var textureData : texture_2d<f32>;

struct FragInput {
    @location(0) vPosition : vec4<f32>,
    @location(1) vNormal : vec4<f32>,
    @location(2) vUV : vec2<f32>,
    @location(3) vColor : vec3<f32>,
};

@fragment
fn fs_main(input: FragInput) -> @location(0) vec4<f32> {
    let textureColor:vec3<f32> = (textureSample(textureData, textureSampler, input.vUV)).rgb;
    let N:vec3<f32> = normalize(input.vNormal.xyz);                
    let L:vec3<f32> = normalize(fragUniforms.lightPosition.xyz - input.vPosition.xyz);     
    let V:vec3<f32> = normalize(fragUniforms.eyePosition.xyz - input.vPosition.xyz);          
    let H:vec3<f32> = normalize(L + V);
    let twoSide:i32 = i32(lightUniforms.isTwoSideLighting);
    var diffuse:f32 = lightUniforms.diffuseIntensity * max(dot(N, L), 0.0);
    if(twoSide == 1){
        diffuse = diffuse + lightUniforms.diffuseIntensity * max(dot(-N, L), 0.0);
    } 
    var specular:f32;
     var isp:i32 =i32(lightUniforms.isPhong);
    if(isp == 1){                   
        specular = lightUniforms.specularIntensity * pow(max(dot(V, reflect(-L, N)),0.0), lightUniforms.shininess);
        if(twoSide == 1) {
            specular = specular + lightUniforms.specularIntensity * pow(max(dot(V, reflect(-L, -N)),0.0), lightUniforms.shininess);
        }
    } else {
        specular = lightUniforms.specularIntensity * pow(max(dot(N, H),0.0), lightUniforms.shininess);
        if(twoSide == 1){                     
            specular = specular + lightUniforms.specularIntensity * pow(max(dot(-N, H),0.0), lightUniforms.shininess);
        }
    }               
    let ambient:f32 = lightUniforms.ambientIntensity;   
    let specularColor = vec3<f32>(lightUniforms.specularColorR, lightUniforms.specularColorG, lightUniforms.specularColorB);            
    let finalColor:vec3<f32> = (textureColor + input.vColor) * (ambient + diffuse) + specularColor * specular; 
    return vec4<f32>(finalColor, 1.0);
}