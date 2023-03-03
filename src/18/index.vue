<template>
   <div style="margin-left:20px;">        
      <div class="grid">
         <div class="item1">
            <h1>Cube with Lighting</h1><br>
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
                  <input id="id-color" type="text" value="1, 0, 0" />
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
                  <input id="id-shininess" type="text" value="30" />
               </div>
            </div>
            <div class="grid1">
               <div class="item3">specular color</div>
               <div class="item4">
                  <input id="id-scolor" type="text" value="1, 1, 1" />
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
        import { CreateShapeWithLight, LightInputs } from './light';
import { CubeData } from '../vertex_data';
import $ from 'jquery';
import "./site.css"

export default{
    mounted(){

const data = CubeData();
let li = {};
let isAnimation = true;
CreateShapeWithLight(data.positions, data.normals, li, isAnimation);

$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') isAnimation = true;
    else isAnimation = false;
    CreateShapeWithLight(data.positions, data.normals, li, isAnimation);
});

$('#btn-redraw').on('click', function(){
    li.color = ($('#id-color').val().toString()).split(',').map(Number) ;
    li.ambientIntensity = parseFloat($('#id-ambient').val().toString());
    li.diffuseIntensity = parseFloat($('#id-diffuse').val().toString());
    li.specularIntensity= parseFloat($('#id-specular').val().toString());
    li.shininess= parseFloat($('#id-shininess').val().toString());
    li.specularColor = ($('#id-scolor').val().toString()).split(',').map(Number) ;
    CreateShapeWithLight(data.positions, data.normals, li, isAnimation);
});

window.addEventListener('resize', function(){
    CreateShapeWithLight(data.positions, data.normals, li, isAnimation);
});
    }
}
</script>