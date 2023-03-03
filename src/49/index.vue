<template>
  <div class="grid">
      <div class="item1">
         <h1>Two Cubes</h1><br>
      </div>
      <div class="item2">
         <canvas id="canvas-webgpu"></canvas>
      </div>
   </div>
</template>
<script>
      import { InitGPU, CreateGPUBuffer, CreateGPUBufferUint, CreateTransforms, CreateViewProjection, CreateAnimation } from '../helper';
import shader from './shader.wgsl';
import { CubeData1 } from '../vertex_data';
import { vec3, mat4 } from 'gl-matrix';
import "./site.css";
export default{
    mounted(){
  

const Create3DObject = async (isAnimation = true) => {
    const gpu = await InitGPU();
    const device = gpu.device;

    // create vertex buffers
    const cubeData = CubeData1();
    const numberOfVertices = cubeData.indexData.length;
    const vertexBuffer = CreateGPUBuffer(device, cubeData.vertexData);
    const indexBuffer = CreateGPUBufferUint(device, cubeData.indexData);
 
    const pipeline = device.createRenderPipeline({
        layout:'auto',
        vertex: {
            module: device.createShaderModule({                    
                code: shader
            }),
            entryPoint: "vs_main",
            buffers:[
                {
                    arrayStride: 24,
                    attributes: [
                        {
                            shaderLocation: 0,
                            format: "float32x3",
                            offset: 0
                        },
                        {
                            shaderLocation: 1,
                            format: "float32x3",
                            offset: 12
                        }
                    ]
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
        },
        depthStencil:{
            format: "depth24plus",
            depthWriteEnabled: true,
            depthCompare: "less"
        }
    });

    // create uniform data
    const matrixSize = 4*16;
    const uniformOffset = 256;

    const uniformBufferSize = uniformOffset + matrixSize;
    let rotation = vec3.fromValues(0, 0, 0);  

    const vp = CreateViewProjection(gpu.canvas.width/gpu.canvas.height);
    const modelMatrix1 = mat4.create();
    const translateMatrix1 = mat4.create();
    CreateTransforms(translateMatrix1, [-2, -1, 0.5], [0, 0, 0], [1, 1, 1]);
    const modelViewProjectionMatrix1 = mat4.create() ;

    const modelMatrix2 = mat4.create();
    const translateMatrix2 = mat4.create();
    CreateTransforms(translateMatrix2, [1, 1, -2], [0, 0, 0], [1, 1, 1]);
    const modelViewProjectionMatrix2 = mat4.create() ;

    // create uniform buffer and layout
    const uniformBuffer = device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const uniformBindGroup1 = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: {
                buffer: uniformBuffer,
                offset: 0,
                size: matrixSize
            }
        }]
    });

    const uniformBindGroup2 = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: {
                buffer: uniformBuffer,
                offset: uniformOffset,
                size: matrixSize
            }
        }]
    });

    let textureView = gpu.context.getCurrentTexture().createView();
    const depthTexture = device.createTexture({
        size: [gpu.canvas.width, gpu.canvas.height, 1],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    const renderPassDescription = {
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0  }, //background color
            loadOp: 'clear',
            storeOp: 'store'
        }],
        depthStencilAttachment: {
            view: depthTexture.createView(),
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: "store",
            /*stencilClearValue: 0,
            stencilStoreOp: "store",
            depthLoadOp: 'clear',
            stencilLoadOp: 'clear'*/
        }
    };
    
    function draw() {
        //transforms on first cube
        mat4.rotate(
            modelMatrix1, 
            translateMatrix1, 
            1, 
            vec3.fromValues(Math.sin(2*rotation[0]), Math.cos(2*rotation[0]), 0)
        );          
        mat4.multiply(modelViewProjectionMatrix1, vp.viewMatrix, modelMatrix1);
        mat4.multiply(modelViewProjectionMatrix1, vp.projectionMatrix, modelViewProjectionMatrix1);

        //transforms on second cube
        mat4.rotate(
            modelMatrix2, 
            translateMatrix2, 
            1, 
            vec3.fromValues(Math.cos(2*rotation[1]), 0, Math.sin(2*rotation[1]))
        );
        mat4.multiply(modelViewProjectionMatrix2, vp.viewMatrix, modelMatrix2);
        mat4.multiply(modelViewProjectionMatrix2, vp.projectionMatrix, modelViewProjectionMatrix2);

        device.queue.writeBuffer(
            uniformBuffer,
            0,
            modelViewProjectionMatrix1.buffer,
            modelViewProjectionMatrix1.byteOffset,
            modelViewProjectionMatrix1.byteLength
        );
        
        device.queue.writeBuffer(
            uniformBuffer,
            uniformOffset,
            modelViewProjectionMatrix2.buffer,
            modelViewProjectionMatrix2.byteOffset,
            modelViewProjectionMatrix2.byteLength
        );

        textureView = gpu.context.getCurrentTexture().createView();
        renderPassDescription.colorAttachments[0].view = textureView;
        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescription );

        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setIndexBuffer(indexBuffer, 'uint32');

        //draw first cube
        renderPass.setBindGroup(0, uniformBindGroup1);
        renderPass.drawIndexed(numberOfVertices);

        //draw second cube
        renderPass.setBindGroup(0, uniformBindGroup2);
        renderPass.drawIndexed(numberOfVertices);

        renderPass.end();

        device.queue.submit([commandEncoder.finish()]);
    }

    CreateAnimation(draw, rotation, isAnimation);
}

Create3DObject();

window.addEventListener('resize', function(){
    Create3DObject();
});



    }
}
</script>