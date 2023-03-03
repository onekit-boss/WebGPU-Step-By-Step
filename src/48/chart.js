import { InitGPU, CreateGPUBuffer, CreateTransforms, CreateViewProjection, CreateAnimation } from '../helper';
import shader from './shader.wgsl';
import { GetTexture } from '../texture-data';
import { vec3, mat4 } from 'gl-matrix';
const createCamera = require('3d-view-controls');

let ambientIntensity = 0.2;
let diffuseIntensity = 0.8;
let specularIntensity = 0.4;
let shininess = 30;
let specularColor = [1, 1, 1];
let isPhong = 0;
let isTwoSideLighting = 1;

export const CreateChartWithTexture = async (vertexData, normalData, uvData, 
    colorData, textureFile, isAnimation = true) => {
    const gpu = await InitGPU();
    const device = gpu.device;

    // create vertex buffers
    const numberOfVertices = vertexData.length/3;
    const vertexBuffer = CreateGPUBuffer(device, vertexData);   
    const normalBuffer = CreateGPUBuffer(device, normalData);
    const uvBuffer = CreateGPUBuffer(device, uvData);
    const colorBuffer = CreateGPUBuffer(device, colorData);
 
    //const shader = Shaders({});
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
                },
                {
                    arrayStride: 8,
                    attributes: [{
                        shaderLocation: 2,
                        format: "float32x2",
                        offset: 0
                    }]
                },
                {
                    arrayStride: 12,
                    attributes: [{
                        shaderLocation: 3,
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
        },
        depthStencil:{
            format: "depth24plus",
            depthWriteEnabled: true,
            depthCompare: "less"
        }
    });

    // create uniform data
    const normalMatrix = mat4.create();
    const modelMatrix = mat4.create();
    let vMatrix = mat4.create();
    let vpMatrix = mat4.create();
    const vp = CreateViewProjection(gpu.canvas.width/gpu.canvas.height);
    vpMatrix = vp.viewProjectionMatrix;

    // add rotation and camera:
    let rotation = vec3.fromValues(0, 0, 0);       
    var camera = createCamera(gpu.canvas, vp.cameraOption);
    let eyePosition = new Float32Array(vp.cameraOption.eye);
    let lightPosition = eyePosition;

    // create uniform buffer and layout
    const vertexUniformBuffer = device.createBuffer({
        size: 192,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const fragmentUniformBuffer = device.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    // create light buffer
    const light_params = [
        ambientIntensity,
        diffuseIntensity,
        specularIntensity,
        shininess,
        specularColor,
        isPhong,
        isTwoSideLighting,
    ];
    const lightUniformBuffer = device.createBuffer({
        size: 36,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    if(isAnimation){
        device.queue.writeBuffer(vertexUniformBuffer, 0, vp.viewProjectionMatrix );
        device.queue.writeBuffer(fragmentUniformBuffer, 0, lightPosition);
        device.queue.writeBuffer(fragmentUniformBuffer, 16, eyePosition);
    }
    device.queue.writeBuffer(lightUniformBuffer, 0, new Float32Array((light_params ).flat()));

    // get texture and sampler data
    const ts = await GetTexture(device, textureFile, 'clamp-to-edge', 'clamp-to-edge');

    const uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer,
                    offset: 0,
                    size: 192
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: fragmentUniformBuffer,
                    offset: 0,
                    size: 32
                }
            },
            {
                binding: 2,
                resource: {
                    buffer: lightUniformBuffer,
                    offset: 0,
                    size: 36
                }
            },
            {
                binding: 3,
                resource: ts.sampler
            },
            {
                binding: 4,
                resource: ts.texture.createView()
            }         
        ]
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
            clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0 }, //background color
            loadOp: 'clear',
            storeOp: 'store'
        }],
        depthStencilAttachment: {
            view: depthTexture.createView(),
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: "store",           
        }
    };
    
    function draw() {
        if(!isAnimation){
            if(camera.tick()){
                const pMatrix = vp.projectionMatrix;
                vMatrix = camera.matrix;
                mat4.multiply(vpMatrix, pMatrix, vMatrix);

                eyePosition = new Float32Array(camera.eye.flat());
                lightPosition = eyePosition;
                device.queue.writeBuffer(vertexUniformBuffer, 0, vpMatrix);
                device.queue.writeBuffer(fragmentUniformBuffer, 0, eyePosition);
                device.queue.writeBuffer(fragmentUniformBuffer, 16, lightPosition);
            }
        }

        CreateTransforms(modelMatrix,[0,0,0], rotation);
        mat4.invert(normalMatrix, modelMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        device.queue.writeBuffer(vertexUniformBuffer, 64, modelMatrix );
        device.queue.writeBuffer(vertexUniformBuffer, 128, normalMatrix );

        textureView = gpu.context.getCurrentTexture().createView();
        renderPassDescription.colorAttachments[0].view = textureView;
        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescription );

        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setVertexBuffer(1, normalBuffer);
        renderPass.setVertexBuffer(2, uvBuffer);
        renderPass.setVertexBuffer(3, colorBuffer);

        renderPass.setBindGroup(0, uniformBindGroup);       
        renderPass.draw(numberOfVertices);
        renderPass.end();

        device.queue.submit([commandEncoder.finish()]);
    }

    CreateAnimation(draw, rotation, isAnimation);
}