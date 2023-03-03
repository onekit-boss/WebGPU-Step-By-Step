<template>
  <div>  
     <h1>Create Point or Line Primitives</h1><br>
     <label><b>Select a primitive type:</b></label>
     <select id="id-primitive">
        <option value="point-list">point-list</option>
        <option value="line-list">line-list</option>
        <option value="line-strip">line-strip</option>
     </select>
     <br><br>
     <canvas id="canvas-webgpu" width="640" height="480"></canvas>
   </div>
</template>
<script>

import $ from 'jquery';
import { CheckWebGPU } from '../helper';
import { Shaders } from './shaders';
export default{
    mounted(){

const CreatePrimitive = async (primitiveType = 'point-list') => { 
    const checkgpu = CheckWebGPU();
    if(checkgpu.includes('Your current browser does not support WebGPU!')){
        console.log(checkgpu);
        throw('Your current browser does not support WebGPU!');
    }

    let indexFormat = undefined;
    if(primitiveType === 'line-strip'){
        indexFormat = 'uint32'
    }
    
    const canvas = document.getElementById('canvas-webgpu') ;
    const adapter = await navigator.gpu.requestAdapter() ;       
    const device = await adapter.requestDevice() ;
    const context = canvas.getContext('webgpu') ;

    const format = 'bgra8unorm';
    context.configure({
        device: device,
        format: format,
        alphaMode:'opaque'
    });

    const shader = Shaders();
    const pipeline = device.createRenderPipeline({
        layout:'auto',
        vertex: {
            module: device.createShaderModule({
                code: shader.vertex
            }),
            entryPoint: "main"
        },
        fragment: {
            module: device.createShaderModule({
                code: shader.fragment
            }),
            entryPoint: "main",
            targets: [{
                format: format 
            }]
        },
        primitive:{
            topology: primitiveType ,
            stripIndexFormat: indexFormat 
        }
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();
    
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView ,
            clearValue: [0.5, 0.5, 0.8, 1], //background color
            loadOp:'clear',
            storeOp: 'store'
        }]
    });
    renderPass.setPipeline(pipeline);
    renderPass.draw(6);
    renderPass.end();
    
    device.queue.submit([commandEncoder.finish()]);
}

CreatePrimitive();
$('#id-primitive').on('change', ()=>{
    const primitiveType = $('#id-primitive').val() ;
    CreatePrimitive(primitiveType);
});



    }
}
</script>