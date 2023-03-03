<template>

<div style="margin-left:20px;">  
      <h1>Cylinder Wireframe</h1><br>

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
               <div class="item3">rin</div>
               <div class="item4">
                  <input id="id-rin" type="text" value="0.5" />
               </div>
            </div>
            <div class="grid1">
               <div class="item3">rout</div>
               <div class="item4">
                  <input id="id-rout" type="text" value="1.5" />
               </div>
            </div>
            <div class="grid1">
               <div class="item3">height</div>
               <div class="item4">
                  <input id="id-height" type="text" value="3" />
               </div>
            </div>
            <div class="grid1">
               <div class="item3">n</div>
               <div class="item4">
                  <input id="id-n" type="text" value="20" />
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
import { CylinderWireframeData } from '../vertex_data';
import { vec3 } from 'gl-matrix';
import $ from 'jquery';
export default{
    mounted(){


const Create3DObject = async (rin,rout, height, n, center, isAnimation) => {
    const wireframeData = CylinderWireframeData(rin, rout, height, n, center) ;
    await CreateWireframe(wireframeData, isAnimation);
}

let rin = 0.5;
let rout = 1.5;
let height = 3;
let n = 20;
let center = [0,0,0];
let isAnimation = true;

Create3DObject(rin, rout, height, n, center, isAnimation);

$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') isAnimation = true;
    else isAnimation = false;
    Create3DObject(rin, rout, height, n, center, isAnimation);
});

$('#btn-redraw').on('click', function() {
    const val = $('#id-center').val();
    center = val.toString().split(',').map(Number) ;
    rin = parseFloat($('#id-rin').val().toString() );
    rout = parseFloat($('#id-rout').val().toString() );
    height = parseFloat($('#id-height').val().toString() );
    n = parseInt($('#id-n').val().toString() );
    Create3DObject(rin, rout, height, n, center, isAnimation);
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