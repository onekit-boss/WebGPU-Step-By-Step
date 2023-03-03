// vertex shader

struct Uniforms {   
    view_project_mat : mat4x4<f32>,
    model_mat : mat4x4<f32>,                  
    normal_mat : mat4x4<f32>,            
};
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct Input {
    @location(0) pos : vec4<f32>,
    @location(1) normal : vec4<f32>,
    @location(2) color : vec3<f32>,
};

struct Output {
    @builtin(position) position : vec4<f32>,
    @location(0) v_position : vec4<f32>,
    @location(1) v_normal : vec4<f32>,
    @location(2) v_color : vec3<f32>,
};

@vertex
fn vs_main(in: Input) -> Output {    
    var output: Output;            
    let m_position:vec4<f32> = uniforms.model_mat * in.pos; 
    output.v_position = m_position;                  
    output.v_normal =  uniforms.normal_mat * in.normal;
    output.position = uniforms.view_project_mat * m_position;   
    output.v_color = in.color;            
    return output;
}

// fragment shader 

struct FragUniforms {
    light_position : vec4<f32>,  
    eye_position : vec4<f32>,
};
@binding(1) @group(0) var<uniform> frag_uniforms : FragUniforms;

struct LightUniforms {
    specular_color : vec4<f32>,
    params: vec4<f32>, // ambient_intensity, diffuse_intensity, specular_intensity, specular_shininess
    param2: vec4<f32>, // is _two_side
};
@binding(2) @group(0) var<uniform> light_uniforms : LightUniforms;

@fragment
fn fs_main(in:Output) ->  @location(0) vec4<f32> {
    let N:vec3<f32> = normalize(in.v_normal.xyz);                
    let L:vec3<f32> = normalize(frag_uniforms.light_position.xyz - in.v_position.xyz);     
    let V:vec3<f32> = normalize(frag_uniforms.eye_position.xyz - in.v_position.xyz);          
    let H:vec3<f32> = normalize(L + V);

    // front side
    var diffuse:f32 = light_uniforms.params[1] * max(dot(N, L), 0.0);
    var specular: f32 = light_uniforms.params[2] * pow(max(dot(N, H),0.0), light_uniforms.params[3]);

    // back side
    if(i32(light_uniforms.param2[0]) == 1){
        diffuse = diffuse + light_uniforms.params[1] * max(dot(-N, L), 0.0);
        specular = specular +  light_uniforms.params[2] * pow(max(dot(-N, H),0.0), light_uniforms.params[3]);
    }

    let ambient:f32 = light_uniforms.params[0];               
    let final_color = in.v_color*(ambient + diffuse) + light_uniforms.specular_color.rgb * specular; 
    return vec4<f32>(final_color.rgb, 1.0);
}
