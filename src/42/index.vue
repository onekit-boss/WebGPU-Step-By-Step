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
         <canvas id="canvas-webgpu"></canvas>
      </div>
   </div>
</template>
<script>
        import { CreateChartWithTexture } from './chart';
import { SimpleSurfaceData } from '../surface-data';
import { Sinc } from '../math-func';
import $ from 'jquery';

export default{
    mounted(){

const CreateChart = async (textureFile, colormapName, isAnimation = true) => {
    const data = SimpleSurfaceData(Sinc,-8, 8, -8, 8,30, 30, 2, 0.3, colormapName, [0,0,0]);
    await CreateChartWithTexture(data?.vertexData, data?.normalData, data?.uv1Data, data?.colorData, textureFile, isAnimation);
}

let textureFile = 'whiteSquare2.png';
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
    const ele = this;
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