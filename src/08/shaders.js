export const Shaders = () => {
    const vertex = `
        struct Output {
            @builtin(position) Position : vec4<f32>,
            @location(0) vColor : vec4<f32>,
        };
        @vertex
        fn main(@location(0) pos: vec4<f32>, @location(1) color: vec4<f32>) -> Output {
            var output: Output;
            output.Position = pos;
            output.vColor = color;
            return output;
        }`;

    const fragment = `
        @fragment
        fn main(@location(0) vColor: vec4<f32>) -> @location(0) vec4<f32> {
            return vColor;
        }`;

    return {
        vertex, 
        fragment
    };
}

export const ShadersOld = () => {
    const vertex = `
        [[location(0)]] var<in> position : vec4<f32>;
        [[location(1)]] var<in> color : vec4<f32>;
        [[builtin(position)]] var<out> Position : vec4<f32>;
        [[location(0)]] var<out> vColor : vec4<f32>;

        [[stage(vertex)]]
        fn main() -> void {
            Position = position;
            vColor = color;
            return;
        }`;

    const fragment = `
        [[location(0)]] var<in> vColor : vec4<f32>;
        [[location(0)]] var<out> fragColor : vec4<f32>;

        [[stage(fragment)]]
        fn main() -> void {
            fragColor = vColor;
            return;
        }`;

    return {
        vertex, 
        fragment
    };
}
