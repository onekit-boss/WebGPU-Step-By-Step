<template>
    <div>
        <h2 id="id-gpu-check"></h2>
    </div>
</template>
<script>
import $ from 'jquery';
import { CheckWebGPU } from '../helper';
export default{
    mounted(){
        $('#id-gpu-check').html(CheckWebGPU());
    }
}
</script>