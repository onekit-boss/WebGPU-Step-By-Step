<template>
   <canvas id="canvas-webgpu"></canvas>
</template>
<script>
import { CreateShapeWithTexture } from './texture';
import { CubeData } from '../vertex_data';
import $ from 'jquery';

export default {
   mounted() {

      const CreateShape = async (ul, vl, li, textureFile,
         addressModeU, addressModeV, isAnimation) => {
         const data = CubeData(ul, vl);
         await CreateShapeWithTexture(data.positions, data.normals, data.uvs, textureFile, addressModeU, addressModeV, li, isAnimation);
      }

      let textureFile = 'brick.png';
      let addressModeU = 'repeat';
      let addressModeV = 'repeat';
      let li = {};
      let isAnimation = true;
      let ul = 1;
      let vl = 1;
      CreateShape(ul, vl, li, textureFile, addressModeU, addressModeV, isAnimation);

   }
}
</script>
<style>
body {
   margin: 0
}
</style>