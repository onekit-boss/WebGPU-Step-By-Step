<template>
    <div>
        <canvas id="canvas-webgpu"></canvas>
        <div>
            <input ref="rA" type="color" @input="changeA($event)" />
            <input ref="rB" type="color" @input="changeB($event)" />
            <input ref="rC" type="color" @input="changeC($event)" />
        </div>
    </div>
</template>
<script>
import { InitGPU, CreateGPUBuffer } from '../helper';
import shader from './shader.wgsl';

var a = [1, 0, 0]
var b = [0, 1, 0]
var c = [0, 0, 1]
function hex2float(hex) {
    var float = parseInt(hex,16).toString(10) / 255.0
    return float
}
export default {
    mounted() {
        this.$refs.rA.value = "#ff0000"
        this.$refs.rB.value = "#00ff00"
        this.$refs.rC.value = "#0000ff"
        this.CreateSquare();

        window.addEventListener('resize', () => {
            this.CreateSquare();
        });
    },

    methods: {
        async changeA(e) {
            var color = e.currentTarget.value
            a = this.fixColor(color)
            await this.CreateSquare()
        },
        async changeB(e) {
            var color = e.currentTarget.value
            b = this.fixColor(color)
            console.error(color, b)
            await this.CreateSquare();
        },
        async changeC(e) {
            var color = e.currentTarget.value
            c = this.fixColor(color)
            console.error(color, c)
            await this.CreateSquare();
        },
        fixColor(hex) {
            hex = hex.substr(1)
            return [
                hex2float(hex.substr(0, 2)),
                hex2float(hex.substr(2, 2)),
                hex2float(hex.substr(4, 2))
            ]
        },
        async CreateSquare() {
            const gpu = await InitGPU();
            const device = gpu.device;

            const vertexData = new Float32Array([
                -0.5, -0.5,  // vertex a
                0.5, -0.5,  // vertex b
                -0.5, 0.5,  // vertex d
            ]);

            const colorData = new Float32Array([
                a,    // vertex a: red
                b,    // vertex b: green
                c,    // vertex d: yellow
            ].flat());

            const vertexBuffer = CreateGPUBuffer(device, vertexData);
            const colorBuffer = CreateGPUBuffer(device, colorData);

            const pipeline = device.createRenderPipeline({
                layout: 'auto',
                vertex: {
                    module: device.createShaderModule({
                        code: shader
                    }),
                    entryPoint: "vs_main",
                    buffers: [
                        {
                            arrayStride: 8,
                            attributes: [{
                                shaderLocation: 0,
                                format: "float32x2",
                                offset: 0
                            }]
                        },
                        {
                            arrayStride: 12,
                            attributes: [{
                                shaderLocation: 1,
                                format: "float32x3",
                                offset: 0
                            }]
                        }
                    ]
                },
                fragment: {
                    module: device.createShaderModule({
                        code: shader
                    }),
                    entryPoint: "fs_main",
                    targets: [
                        {
                            format: gpu.format
                        }
                    ]
                },
                primitive: {
                    topology: "triangle-list",
                }
            });

            const commandEncoder = device.createCommandEncoder();
            const textureView = gpu.context.getCurrentTexture().createView();
            const renderPass = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: textureView,
                    clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store'
                }]
            });
            renderPass.setPipeline(pipeline);
            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setVertexBuffer(1, colorBuffer);
            renderPass.draw(3);
            renderPass.end();

            device.queue.submit([commandEncoder.finish()]);
        }
    }
}
</script>