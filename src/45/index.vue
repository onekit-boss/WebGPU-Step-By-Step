<template>
   
   <div class="grid">
      <div class="item1">
         <h1>Sphere Surface Chart</h1><br>
         <h2>Motion Control</h2>
         <div id="id-radio">
            <label><input type="radio" name="options" value="animation" checked>Animation</label>
            <label style="margin-left:30px;"><input type="radio" name="options" value="camera">Camera Control</label>   
         </div>
         <br>
         <h2>Set Parameters</h2>  
         <div class="grid1">
            <div class="item3">select image</div>
            <div class="item4">
               <select id="id-texture">
                  <option value="whitesquare">White square</option>
                  <option value="whitesquare2" selected>White square 2</option>
                  <option value="redsquare">Red square</option>
                  <option value="redsquare2">Red square 2</option>
                  <option value="greensquare">Green square</option>
                  <option value="greensquare2">Green square 2</option>
                  <option value="bluesquare">Blue square</option>                        
                  <option value="bluesquare2">Blue square 2</option>     
                  <option value="blacksquare">Black square</option>                        
                  <option value="blacksquare2">Black square 2</option>                   
               </select>
            </div>
         </div>            
         <div class="grid1">
            <div class="item3">select colormap</div>
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
      </div>
      <div class="item2">
         <canvas id="canvas-webgpu"></canvas>
      </div>
   </div>
</template>
<script>
      import { CreateChartWithTexture } from './chart.js';
import { ParametricSurfaceData } from '../surface-data';
import { Sphere } from '../math-func';
import $ from 'jquery';
export default{
    mounted(){
  

const CreateChart = async (textureFile, colormapName, isAnimation = true) => {
    const data = ParametricSurfaceData(Sphere, 0, 2*Math.PI, -Math.PI/2, Math.PI/2, 30, 20, -1, 1, -1, 1, 2, 0, colormapName);
    await CreateChartWithTexture(data?.vertexData, data?.normalData, data?.uv1Data, data?.colorData, textureFile, isAnimation);
}

let textureFile = 'whitesquare.png';
let colormapName = 'jet';
let isAnimation = true;
CreateChart(textureFile, colormapName, isAnimation);

$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') isAnimation = true;
    else isAnimation = false;
    CreateChart(textureFile, colormapName, isAnimation);
});

$('#id-texture').on('change',function(){
    const ele = this ;
    textureFile = ele.options[ele.selectedIndex].value + '.png';
    CreateChart(textureFile, colormapName, isAnimation);
});

$('#id-colormap').on('change',function(){
    const ele = this ;
    colormapName = ele.options[ele.selectedIndex].text;
    CreateChart(textureFile, colormapName, isAnimation);
});

window.addEventListener('resize', function(){
    CreateChart(textureFile, colormapName, isAnimation);
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