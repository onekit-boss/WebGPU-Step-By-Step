<template>
  <div class="grid">
      <div class="item1">
         <h1>Sinc Surface</h1><br>
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
               <input id="id-scaley" type="text" value="0.3" />
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
       import { SimpleSurfaceData } from '../surface-data';
import { Sinc } from '../math-func';
import { CreateSurfaceWithColormap, LightInputs } from './surface';
import $ from 'jquery';
import "./site.css";

export default{
    mounted(){
 
const CreateSurface = async (li, isAnimation = true, colormapName = 'jet', scale = 2, scaley = 0) => {
    const data = SimpleSurfaceData(Sinc, -8, 8, -8, 8, 30, 30, scale, scaley, colormapName);
    await CreateSurfaceWithColormap(data.vertexData, data.normalData, data.colorData, li, isAnimation);
}

let li = {};
let isAnimation = true;
let colormapName = 'jet';
let scale = 2;
let scaley = 0.3;

CreateSurface(li, isAnimation, colormapName, scale, scaley);

$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') isAnimation = true;
    else isAnimation = false;
    CreateSurface(li, isAnimation, colormapName, scale, scaley);
});

$('#btn-redraw').on('click', function(){
    li.isTwoSideLighting = parseFloat($('#id-istwoside').val().toString());    
    scale = parseFloat($('#id-scale').val().toString());  
    scaley = parseFloat($('#id-scaley').val().toString());     
    CreateSurface(li, isAnimation, colormapName, scale, scaley);
});

$('#id-colormap').on('change',function(){
    const ele = this ;
    colormapName = ele.options[ele.selectedIndex].text;
    CreateSurface(li, isAnimation, colormapName, scale, scaley);
});

window.addEventListener('resize', function(){
    CreateSurface(li, isAnimation, colormapName, scale, scaley);
});
    }
}
</script>