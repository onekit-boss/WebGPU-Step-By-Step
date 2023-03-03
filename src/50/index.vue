<template>
<div class="grid">
      <div class="item1">
         <h1>Cubes Created with Instances</h1><br>
      </div>
      <div class="item2">
         <canvas id="canvas-webgpu"></canvas>
      </div>
   </div>
</template>
<script>
        import { InitGPU, CreateGPUBuffer, CreateGPUBufferUint, CreateViewProjection, CreateAnimation } from '../helper';
import shader from './shader.wgsl';
import { CubeData1 } from './vertex_data';
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
    const nx = 7;
    const ny = 5;
    const ni = nx * ny;  // number of instances

    const matrixSize = 4 * 16;
    const uniformBufferSize = ni * matrixSize;

    let rotation = vec3.fromValues(0, 0, 0);  

    const uniformBuffer = device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: {
                buffer: uniformBuffer
            }
        }]
    });

    const vp = CreateViewProjection(gpu.canvas.width/gpu.canvas.height);
    const projectMatrix = vp.projectionMatrix;

    const modelMat = new Array(ni);
    const mvpMatricesData = new Float32Array(16 * ni);
    
    let i = 0;
    for(let x = 0; x < nx; x++){
        for(let y = 0; y < ny; y++){
            modelMat[i] = mat4.create();
            mat4.translate(
                modelMat[i], 
                modelMat[i], 
                vec3.fromValues(
                    4*(x - nx/2 + 0.5), 
                    4*(y - ny/2 + 0.5), 
                    0
                )
            );
            i++;
        }
    }

    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -16));
    const tmpMat = mat4.create();

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
            loadOp: "clear",
            storeOp: 'store'
        }],
        depthStencilAttachment: {
            view: depthTexture.createView(),
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: "store",
            /*stencilClearValue: 0,
            stencilLoadOp: 'clear',
            stencilStoreOp: "store"*/
        }
    };
    
    function draw() {
        let m = 0, i = 0;
        for(let x = 0; x < nx; x++){
            for(let y = 0; y < ny; y++){
                mat4.rotate(
                    tmpMat,
                    modelMat[i],
                    1,
                    vec3.fromValues(
                        Math.sin((x+0.5)*2*rotation[0]), 
                        Math.cos((y+0.5)*2*rotation[1]), 
                        Math.sin(2*rotation[2])*Math.cos(2*rotation[2])
                    )
                );
                mat4.multiply(tmpMat, viewMatrix, tmpMat);
                mat4.multiply(tmpMat, vp.projectionMatrix, tmpMat);

                mvpMatricesData.set(tmpMat, m);
                i++;
                m += 16;
            }
        }

        device.queue.writeBuffer(
            uniformBuffer,
            0,
            mvpMatricesData.buffer,
            mvpMatricesData.byteOffset,
            mvpMatricesData.byteLength
        );

        textureView = gpu.context.getCurrentTexture().createView();
        renderPassDescription.colorAttachments[0].view = textureView;
        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescription );

        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, uniformBindGroup);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setIndexBuffer(indexBuffer, 'uint32');
        renderPass.drawIndexed(numberOfVertices, ni);

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