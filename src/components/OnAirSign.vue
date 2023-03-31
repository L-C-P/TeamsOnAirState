<template>
    <div v-if="connected" :class="{ 'in-meeting': isInMeeting }" class="border style-neon1">
        <div class="on-air">On Air</div>
        <div class="toggles">
            <div>
                Mic off
                <div v-if="!isMuted && isInMeeting" class="toggle-on">Mic on</div>
                <div v-if="isMuted || !isInMeeting" class="toggle-off">Mic off</div>
            </div>
            <div>
                Cam off
                <div v-if="isCameraOn && isInMeeting" class="toggle-on">Cam on</div>
                <div v-if="!isCameraOn || !isInMeeting" class="toggle-off">Cam off</div>
            </div>
        </div>
    </div>

    <div v-if="!connected" class="no-connection style-neon1">
        No Connection
    </div>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";

defineProps({
    connected: Boolean,
    isMuted: Boolean,
    isInMeeting: Boolean,
    isCameraOn: Boolean,
});
</script>

<style lang="scss">
@import "@/assets/styles/neno1";
</style>