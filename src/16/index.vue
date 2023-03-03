<template>
<div style="margin-left:20px;">  
      <h1>Torus Wireframe</h1><br>

      <div class="grid">
         <div class="item1">
            <h2>Motion Control</h2>
            <div id="id-radio">
               <label><input type="radio" name="options" value="animation" checked>Animation</label>
               <label style="margin-left:30px;"><input type="radio" name="options" value="camera">Camera Control</label>   
            </div>
            <br>
            <h2>Set Parameters</h2>  
            <div class="grid1">
               <div class="item3">center</div>
               <div class="item4">
                  <input id="id-center" type="text" value="0, 0, 0" />
               </div>
            </div>
            <div class="grid1">
               <div class="item3">rlarge</div>
               <div class="item4">
                  <input id="id-rlarge" type="text" value="2" />
               </div>
            </div>
            <div class="grid1">
               <div class="item3">rsmall</div>
               <div class="item4">
                  <input id="id-rsmall" type="text" value="0.5" />
               </div>
            </div>
            <div class="grid1">
               <div class="item3">nlarge</div>
               <div class="item4">
                  <input id="id-nlarge" type="text" value="30" />
               </div>
            </div>
            <div class="grid1">
               <div class="item3">nsmall</div>
               <div class="item4">
                  <input id="id-nsmall" type="text" value="15" />
               </div>
            </div>
            <br><button type="button" id="btn-redraw"><b>Redraw</b></button>
         </div>
         <div class="item2">
            <canvas id="canvas-webgpu" width="640" height="480"></canvas>
         </div>
      </div>
    </div>

</template>
<script>

import { CreateWireframe } from './wireframe';
import { TorusWireframeData } from '../vertex_data';
import { vec3 } from 'gl-matrix';
import $ from 'jquery';
export default{
    mounted(){

const Create3DObject = async (R,r, N, n, center, isAnimation) => {
    const wireframeData = TorusWireframeData(R, r, N, n, center) ;
    await CreateWireframe(wireframeData, isAnimation);
}

let R= 2;
let r = 0.5;
let N = 30;
let n = 15;
let center = [0,0,0];
let isAnimation = true;

Create3DObject(R, r, N, n, center, isAnimation);

$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') isAnimation = true;
    else isAnimation = false;
    Create3DObject(R, r, N, n, center, isAnimation);
});

$('#btn-redraw').on('click', function(){
    const val = $('#id-center').val();
    center = val.toString().split(',').map(Number) ;
    R = parseFloat($('#id-rlarge').val().toString() );
    r = parseFloat($('#id-rsmall').val().toString() );
    N = parseFloat($('#id-nlarge').val().toString() );
    n = parseInt($('#id-nsmall').val().toString() );
    Create3DObject(R, r, N, n, center, isAnimation);
});
    }
}
</script>

<style>
.grid {
   display: grid;
   height: 100%;
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
   grid-column: 1/3;
}
.item4 {
   grid-column: 3/8;
}
</style>