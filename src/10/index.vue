<template>
 <div class="grid">
      <div class="item1">
         <h1>Cube with Distinct Face Color</h1><br>
      </div>
      <div class="item2">
         <canvas id="canvas-webgpu"></canvas>
      </div>
   </div>
</template>
<script>
        import { InitGPU, CreateGPUBuffer, CreateTransforms, CreateViewProjection } from '../helper';
import shader from './shader.wgsl';
import "./site.css";
import { CubeData } from '../vertex_data';
import { mat4 } from 'gl-matrix';
export default{
    mounted(){


const Create3DObject = async () => {
    const gpu = await InitGPU();
    const device = gpu.device;

    // create vertex buffers
    const cubeData = CubeData();
    const numberOfVertices = cubeData.positions.length / 3;
    const vertexBuffer = CreateGPUBuffer(device, cubeData.positions);
    const colorBuffer = CreateGPUBuffer(device, cubeData.colors);
 
    const pipeline = device.createRenderPipeline({
        layout:'auto',
        vertex: {
            module: device.createShaderModule({                    
                code: shader
            }),
            entryPoint: "vs_main",
            buffers:[
                {
                    arrayStride: 12,
                    attributes: [{
                        shaderLocation: 0,
                        format: "float32x3",
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
            cullMode: 'back'
        },
        depthStencil:{
            format: "depth24plus",
            depthWriteEnabled: true,
            depthCompare: "less"
        }
    });

    // create uniform data
    const modelMatrix = mat4.create();
    const mvpMatrix = mat4.create();
    let vpMatrix = mat4.create();
    const vp = CreateViewProjection(gpu.canvas.width/gpu.canvas.height);
    vpMatrix = vp.viewProjectionMatrix;

    // create uniform buffer and bind group
    const uniformBuffer = device.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer,
                    offset: 0,
                    size: 64
                }
            }
        ]
    });

    const textureView = gpu.context.getCurrentTexture().createView();
    const depthTexture = device.createTexture({
        size: [gpu.canvas.width, gpu.canvas.height, 1],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    const renderPassDescription = {
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0  }, //background color
            //loadValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0  }, 
            loadOp: 'clear',
            storeOp: 'store'
        }],
        depthStencilAttachment: {
            view: depthTexture.createView(),
            depthLoadValue: 1.0,
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: "store",
            /*stencilClearValue: 0,
            stencilLoadValue: 0,
            stencilLoadOp: 'clear',
            stencilStoreOp: "store"*/
        }
    };
    
    CreateTransforms(modelMatrix);
    mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);
    device.queue.writeBuffer(uniformBuffer, 0, mvpMatrix );

    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass(renderPassDescription );
    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setVertexBuffer(1, colorBuffer);
    renderPass.setBindGroup(0, uniformBindGroup);
    renderPass.draw(numberOfVertices);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
}

Create3DObject();

window.addEventListener('resize', function(){
    Create3DObject();
});
    }
}
</script>