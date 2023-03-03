export const Shaders = () => {
    const vertex = `
        @vertex
        fn main(@builtin(vertex_index) VertexIndex: u32) -> @builtin(position) vec4<f32> {
            var pos = array<vec2<f32>, 6>(             
                vec2<f32>(-0.5,  0.7),
                vec2<f32>( 0.3,  0.6),
                vec2<f32>( 0.5,  0.3),
                vec2<f32>( 0.4, -0.5),
                vec2<f32>(-0.4, -0.4),
                vec2<f32>(-0.3,  0.2)
            );
            return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
        }`;

    const fragment = `
        @fragment
        fn main() ->  @location(0) vec4<f32> {
            return vec4<f32>(1.0, 1.0, 0.0, 1.0);
        }`;
    return {vertex, fragment};
}

export const ShadersOld1 = () => {
    const vertex = `
    let pos : array<vec2<f32>, 6> = array<vec2<f32>, 6>(             
        vec2<f32>(-0.5,  0.7),
        vec2<f32>( 0.3,  0.6),
        vec2<f32>( 0.5,  0.3),
        vec2<f32>( 0.4, -0.5),
        vec2<f32>(-0.4, -0.4),
        vec2<f32>(-0.3,  0.2)
    );

    [[stage(vertex)]]
    fn main([[builtin(vertex_index)]] VertexIndex: u32) -> [[builtin(position)]] vec4<f32> {
      return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
    }`

    const fragment = `
        [[stage(fragment)]]
        fn main() ->  [[location(0)]] vec4<f32> {
            return vec4<f32>(1.0, 1.0, 0.0, 1.0);
        }
    `;
    return {vertex, fragment};
}

export const ShadersOld = () => {
    const vertex = `
    const pos : array<vec2<f32>, 6> = array<vec2<f32>, 6>(             
        vec2<f32>(-0.5,  0.7),
        vec2<f32>( 0.3,  0.6),
        vec2<f32>( 0.5,  0.3),
        vec2<f32>( 0.4, -0.5),
        vec2<f32>(-0.4, -0.4),
        vec2<f32>(-0.3,  0.2)
    );

    [[builtin(position)]] var<out> Position : vec4<f32>;
    [[builtin(vertex_idx)]] var<in> VertexIndex : i32;

    [[stage(vertex)]]
    fn main() -> void {
      Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
      return;
    }`

    const fragment = `
        [[location(0)]] var<out> outColor : vec4<f32>;
        
        [[stage(fragment)]]
        fn main() -> void {
            outColor = vec4<f32>(1.0, 1.0, 0.0, 1.0);
            return;
        }
    `;
    return {vertex, fragment};
}
