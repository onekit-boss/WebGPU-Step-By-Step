<template>
    <div class="grid">
        <div class="item1">
            <h1>Multiple Different Objects</h1><br>
            <h2>Motion Control</h2>
            <div id="id-radio">
                <label><input type="radio" name="options" value="animation" checked>Animation</label>
                <label style="margin-left:30px;"><input type="radio" name="options" value="camera">Camera Control</label>
            </div>
            <br>
        </div>
        <div class="item2">
            <canvas id="canvas-webgpu"></canvas>
        </div>
    </div>
</template>
<script>
import { SimpleSurfaceData, ParametricSurfaceData } from '../surface-data';
import { Sinc, Peaks, KleinBottle, Wellenkugel, Float32ArrayConcat } from '../math-func';
import { CreateSurfaceWithColormap } from './surface';
import $ from 'jquery';
import "./site.css";
export default {
    mounted() {


        const CreateSurface = async (isAnimation = true) => {
            // sinc 
            const sincData = SimpleSurfaceData(Sinc, -8, 8, -8, 8, 30, 30, 1, 0.3, 'jet', [-15, -1, -5]);

            // peaks
            const peaksData = SimpleSurfaceData(Peaks, -3, 3, -3, 3, 51, 51, 1, 0.1, 'cool', [6, 0, -5]);

            // klein bottle
            const kleinData = ParametricSurfaceData(KleinBottle, 0, Math.PI, 0, 2 * Math.PI, 70, 30, -2, 2, -2, 3, 1.5, 0, 'hsv', [0, 0, -5]);

            // wellenkugel
            const wellenkugelData = ParametricSurfaceData(Wellenkugel, 0, 14.5, 0, 5, 100, 50, -10, 10, -10, 10, 0.7, 0, 'autumn', [0, 0, 20]);

            // concat data
            let vertexData = Float32ArrayConcat(sincData.vertexData, peaksData.vertexData);
            let colorData = Float32ArrayConcat(sincData.colorData, peaksData.colorData);
            let normalData = Float32ArrayConcat(sincData.normalData, peaksData.normalData);

            vertexData = Float32ArrayConcat(vertexData, kleinData.vertexData);
            colorData = Float32ArrayConcat(colorData, kleinData.colorData);
            normalData = Float32ArrayConcat(normalData, kleinData.normalData);

            vertexData = Float32ArrayConcat(vertexData, wellenkugelData.vertexData);
            colorData = Float32ArrayConcat(colorData, wellenkugelData.colorData);
            normalData = Float32ArrayConcat(normalData, wellenkugelData.normalData);

            await CreateSurfaceWithColormap(vertexData, normalData, colorData, {}, isAnimation);
        }

        let isAnimation = true;

        CreateSurface(isAnimation);

        $('#id-radio input:radio').on('click', function () {
            let val = $('input[name="options"]:checked').val();
            if (val === 'animation') isAnimation = true;
            else isAnimation = false;
            CreateSurface(isAnimation);
        });

        window.addEventListener('resize', function () {
            CreateSurface(isAnimation);
        });

    }
}
</script>