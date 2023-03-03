<template>
  <div class="grid">
      <div class="item1">
         <h1>Create Square using GPU Buffer</h1><br>
      </div>
      <div class="item2">
         <canvas id="canvas-webgpu"></canvas>
      </div>
   </div>
</template>
<script>

import { InitGPU, CreateGPUBuffer } from '../helper';
import shader from './shader.wgsl'; 
import "./site.css";

export default{
    mounted(){
const CreateSquare = async () => {
    const gpu = await InitGPU();
    const device = gpu.device;

    const vertexData = new Float32Array([
       -0.5, -0.5,  // vertex a
        0.5, -0.5,  // vertex b
       -0.5,  0.5,  // vertex d
       -0.5,  0.5,  // vertex d
        0.5, -0.5,  // vertex b
        0.5,  0.5,  // vertex c
   ]);

   const colorData = new Float32Array([
        1, 0, 0,    // vertex a: red
        0, 1, 0,    // vertex b: green
        1, 1, 0,    // vertex d: yellow
        1, 1, 0,    // vertex d: yellow
        0, 1, 0,    // vertex b: green
        0, 0, 1     // vertex c: blue
    ]);

    const vertexBuffer = CreateGPUBuffer(device, vertexData);
    const colorBuffer = CreateGPUBuffer(device, colorData);
    
    const pipeline = device.createRenderPipeline({
        layout:'auto',
        vertex: {
            module: device.createShaderModule({                    
                code: shader
            }),
            entryPoint: "vs_main",
            buffers:[
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
        primitive:{
            topology: "triangle-list",
        }
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = gpu.context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: {r: 0.2, g: 0.247, b: 0.314, a: 1.0}, 
            loadOp: 'clear',
            storeOp: 'store'
        }]
    });
    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setVertexBuffer(1, colorBuffer);
    renderPass.draw(6);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
}

CreateSquare();

window.addEventListener('resize', function(){
    CreateSquare();
});



    }
}
</script>