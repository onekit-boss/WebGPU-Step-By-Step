<template>

<div class="grid">
      <div class="item1">
         <h1>Cone with Lighting</h1><br>
         <h2>Motion Control</h2>
         <div id="id-radio">
            <label><input type="radio" name="options" value="animation" checked>Animation</label>
            <label style="margin-left:30px;"><input type="radio" name="options" value="camera">Camera Control</label>   
         </div>
         <br>
         <h2>Set Parameters</h2>  
         <div class="grid1">
            <div class="item3">object color</div>
            <div class="item4">
               <input id="id-color" type="text" value="(1.0, 0.0, 0.0)" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">isPhong</div>
            <div class="item4">
               <input id="id-isphong" type="text" value="0" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">ambient</div>
            <div class="item4">
               <input id="id-ambient" type="text" value="0.1" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">diffuse</div>
            <div class="item4">
               <input id="id-diffuse" type="text" value="0.8" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">specular</div>
            <div class="item4">
               <input id="id-specular" type="text" value="0.4" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">shininess</div>
            <div class="item4">
               <input id="id-shininess" type="text" value="30.0" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">specular color</div>
            <div class="item4">
               <input id="id-scolor" type="text" value="(1.0, 1.0, 1.0)" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">rtop</div>
            <div class="item4">
               <input id="id-rtop" type="text" value="0.7" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">rbottom</div>
            <div class="item4">
               <input id="id-rbottom" type="text" value="2" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">height</div>
            <div class="item4">
               <input id="id-height" type="text" value="2.5" />
            </div>
         </div>
         <div class="grid1">
            <div class="item3">n</div>
            <div class="item4">
               <input id="id-n" type="text" value="30" />
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
   import { CreateShapeWithLight } from './light';
import { LightInputs } from './shaders';
import { ConeData } from '../vertex_data';
import $ from 'jquery';

export default{
    mounted(){
const CreateShape = async (li, rtop = 0.7, rbottom = 2, height = 2.5, n = 30, isAnimation = true) => {
    const data =ConeData(rtop, rbottom, height, n);
    await CreateShapeWithLight(data?.vertexData, data?.normalData, li, isAnimation);
}

let rtop = 0.7;
let rbottom = 2;
let height = 2.5;
let n = 30;
let li = {};
let isAnimation = true;

CreateShape(li,rtop, rbottom, height, n, isAnimation);

$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') isAnimation = true;
    else isAnimation = false;
    CreateShape(li,rtop, rbottom, height, n, isAnimation);
});

$('#btn-redraw').on('click', function(){
    li.color = $('#id-color').val()?.toString();
    li.isPhong = $('#id-isphong').val()?.toString();
    li.ambientIntensity = $('#id-ambient').val()?.toString();
    li.diffuseIntensity = $('#id-diffuse').val()?.toString();
    li.specularIntensity= $('#id-specular').val()?.toString();
    li.shininess= $('#id-shininess').val()?.toString();
    li.specularColor = $('#id-scolor').val()?.toString();
    rtop = parseFloat($('#id-rtop').val().toString());
    rbottom = parseFloat($('#id-rbottom').val().toString());
    height = parseFloat($('#id-height').val().toString());
    n = parseInt($('#id-n').val().toString());
    CreateShape(li,rtop, rbottom, height, n, isAnimation);
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
