<template>
 
 <div class="grid">
      <div class="item1">
         <h1>Peaks Surface</h1><br>
         <h2>Motion Control</h2>
         <div id="id-radio">
            <label><input type="radio" name="options" value="animation" checked>Animation</label>
            <label style="margin-left:30px;"><input type="radio" name="options" value="camera">Camera Control</label>   
         </div>
         <br>
         <h2>Set Parameters</h2>  
         <div class="grid1">
            <div class="item3">2-side light</div>
            <div class="item4">
               <input id="id-istwoside" type="text" value="1" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">colormap</div>
            <div class="item4">
               <select id="id-colormap">
                  <option>jet</option>
                  <option>autumn</option>
                  <option>bone</option>
                  <option>cool</option>
                  <option>copper</option>
                  <option>greys</option>
                  <option>hot</option>
                  <option>hsv</option>
                  <option>spring</option>
                  <option>summer</option>
                  <option>winter</option>        
               </select>
            </div>
         </div>
         <div class="grid1">
            <div class="item3">scale</div>
            <div class="item4">
               <input id="id-scale" type="text" value="2" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">scaley</div>
            <div class="item4">
               <input id="id-scaley" type="text" value="0" />
            </div>
         </div>
         <br><button type="button" id="btn-redraw"><b>Redraw</b></button>
      </div>
      <div class="item2">
         <canvas id="canvas-webgpu"></canvas>
      </div>
   </div>

</template>
<script>

import { LightInputs } from './shaders.js';
import { SimpleSurfaceData } from '../surface-data';
import { Peaks } from '../math-func';
import { CreateSurfaceWithColormap } from './surface';
import $ from 'jquery';
export default{
    mounted(){

const CreateSurface = async (li, isAnimation = true, colormapName = 'jet', scale = 2, scaley = 0) => {
    const data = SimpleSurfaceData(Peaks, -3, 3, -3, 3, 51, 51, scale, scaley, colormapName);
    await CreateSurfaceWithColormap(data.vertexData, data.normalData, data.colorData, li, isAnimation);
}

let li = {};
let isAnimation = true;
let colormapName = 'jet';
let scale = 2;
let scaley = 0;

CreateSurface(li, isAnimation, colormapName, scale, scaley);

$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') isAnimation = true;
    else isAnimation = false;
    CreateSurface(li, isAnimation, colormapName, scale, scaley);
});

$('#btn-redraw').on('click', function(){
    li.isTwoSideLighting = $('#id-istwoside').val().toString();   
    scale = parseFloat($('#id-scale').val().toString());  
    scaley = parseFloat($('#id-scaley').val().toString());    
    CreateSurface(li, isAnimation, colormapName, scale, scaley);
});

$('#id-colormap').on('change',function(){
    const ele = this ;
    colormapName = ele.options[ele.selectedIndex].text;
    CreateSurface(li, isAnimation, colormapName, scale, scaley);
});
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
