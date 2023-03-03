<template>
 
 <div class="grid">
      <div class="item1">
         <h1>Cube with Multiple Textures</h1><br>
         <h2>Motion Control</h2>
         <div id="id-radio">
            <label><input type="radio" name="options" value="animation" checked>Animation</label>
            <label style="margin-left:30px;"><input type="radio" name="options" value="camera">Camera Control</label>   
         </div>
         <br>
         <h2>Set Parameters</h2>              
         <div class="grid1">
            <div class="item3">shininess</div>
            <div class="item4">
               <input id="id-shininess" type="text" value="100.0" />
            </div>
         </div>
         <br><button type="button" id="btn-redraw"><b>Redraw</b></button>
      </div>
      <div class="item2">
         <canvas id="canvas-webgpu" width="640" height="480"></canvas>
      </div>
   </div>
</template>
<script>
      import { LightInputs } from './shaders';
import { CreateShapeWithTexture } from './texture';
import { CubeData } from '../vertex_data';
import $ from 'jquery';
export default{
    mounted(){


const CreateShape = async (li = {}, isAnimation = true) => {
    const data = CubeData();
    await CreateShapeWithTexture(data?.positions, data?.normals, data?.uv1, 'multiple.png','repeat', 'repeat', li, isAnimation);
}

let li = {};
let isAnimation = true;
CreateShape(li, isAnimation);

$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') isAnimation = true;
    else isAnimation = false;
    CreateShape(li, isAnimation);
});

$('#btn-redraw').on('click', function(){
    li.shininess = $('#id-shininess').val()?.toString() ;  
    CreateShape(li, isAnimation);
});

function reportWindowSize() {
    CreateShape(li, isAnimation);
}
window.onresize = reportWindowSize;

    }
}
</script>
<style>
      .grid {
         display: grid;
         height: calc(100vh - 20px);
         grid-template-columns: repeat(8, 1fr);
         grid-template-rows: 100%;
      }
      .grid1 {
         display: grid;
         height: 35px;
         grid-template-columns: repeat(8, 1fr);
         grid-template-rows: 35px;
      }
      .item1 {
         grid-column: 1/3;
      }
      .item2 {
         grid-column: 3/9;
      }
      .item3 {
         grid-column: 1/4;
      }
      .item4 {
         grid-column: 4/8;
      }

      select, input[type="text"]{
         width:100%;
         height:22px;
         box-sizing:border-box;
      }
   </style>