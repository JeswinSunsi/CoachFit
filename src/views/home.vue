<template>
    <div class="main">
        <h1>POC for CoachFit</h1>
        <canvas id="canvas" width="640" height="480"></canvas>
        <video id="video" width="640" height="480" autoplay style="display: none"></video>
        <div @click="baseFunction">Start</div>
        <div @click="toggleModelState(false)">Break</div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import useBase from '../models/useBase';


import { useMainStore } from "../store/useMainStore";
const main = useMainStore();
const { toggleModelState } = main

const { baseFunction } = useBase();
onMounted(() => {
    baseFunction;
})

</script>

<style scoped></style>