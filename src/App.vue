<template>
  <div class="border" :class="{ inmeeting: meetingState?.isInMeeting}" v-if="connected">
    <div class="on-air">On Air</div>
    <div class="toggles">
      <div class="toggle-on" v-if="!meetingState?.isMuted && meetingState?.isInMeeting">Mic on</div>
      <div class="toggle-off" v-if="meetingState?.isMuted || !meetingState?.isInMeeting">Mic off</div>
      <div class="toggle-on" v-if="meetingState?.isCameraOn">Cam on</div>
      <div class="toggle-off" v-if="!meetingState?.isCameraOn">Cam off</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {TeamsWsResponse} from "@/abstract/TeamsWsResponse";
import {MeetingState} from "@/abstract/MeetingState";
import {TeamsWsRequest} from "@/abstract/TeamsWsRequest";

const socket = new WebSocket('ws://localhost:8124?token=2bc6cbe8-1ef9-4150-970b-e68e47540de5&protocol-version=1.0.0&manufacturer=Denis%20Sowa&device=Browser&app=OnAir&app-version=1.0.0')
const connected = ref(false);
const meetingState = ref<MeetingState | null>(null);

onMounted(async () => {
  socket.onopen = async (message) => {
    console.log('OPEN: ' + message);
    connected.value = true;
  };

  socket.onclose = async (message) => {
    console.log('CLOSED: ' + message);
    connected.value = false;
  };

  socket.onerror = async (message) => {
    console.error('ERROR: ' + message);
  };

  socket.onmessage = async (message) => {
    console.log(message.data);
    const res = JSON.parse(message.data) as TeamsWsResponse;
    meetingState.value = res.meetingUpdate.meetingState;
    // meetingState.value.isInMeeting = true;
  };


  setTimeout(async () => {
    const req: TeamsWsRequest = {
      apiVersion: '1.0.0',
      action: 'query-meeting-state',
      manufacturer: 'Denis Sowa',
      device: 'Browser',
      timestamp: 0,
      service: 'query-meeting-state'
    };

    socket.send(JSON.stringify(req));
  }, 1000);
})

onBeforeUnmount(async () => {
  socket.close();
})
</script>

<style lang="scss">
// https://css-tricks.com/how-to-create-neon-text-with-css/
@font-face {
  font-family: "KosanNonCommercial";
  src: local("KosanNonCommercial"),
  url("./../public/KosanNonCommercial.otf") format("opentype");
}

body, html {
  height: 100%;
  margin: 0;
  background-color: black;
  color: white;
}

#app {
  font-family: KosanNonCommercial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  display: flex;
  text-align: center;
}

.border {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2rem;
  border: .5rem solid #666;
  border-radius: 2rem;
}

.on-air {
  font-size: min(20vw, 40vh);
  color: #222;
  text-transform: uppercase;
}

.toggles {
  display: flex;
  gap: min(11vw, 20vh);
  padding-top: calc(min(6vw, 8vh) / 2);
}

.toggle-on, .toggle-off {
  font-size: min(6vw, 13vh);
  color: #222;
  text-transform: uppercase;
  display: inline-block;

}

.inmeeting {
  &.border {
    border-color: #fff;
    box-shadow: 0 0 .2rem #fff,
    0 0 .2rem #fff,
    0 0 2rem #f00,
    0 0 0.8rem #f00,
    0 0 2.8rem #f00,
    inset 0 0 2rem #f00;
  }

  .on-air {
    color: #fff;
    animation: flicker 1.5s infinite alternate;
  }

  .toggle-on {
    color: #fff;
    text-shadow: 0 0 4px #fff,
    0 0 11px #fff,
    0 0 19px #fff,
    0 0 40px #0f0,
    0 0 80px #0f0,
    0 0 90px #0f0,
    0 0 100px #0f0,
    0 0 150px #0f0;
  }

  .toggle-off {
    color: #fff;
    text-shadow: 0 0 4px #fff,
    0 0 11px #fff,
    0 0 19px #fff,
    0 0 40px #f00,
    0 0 80px #f00,
    0 0 90px #f00,
    0 0 100px #f00,
    0 0 150px #f00;
  }
}

@keyframes flicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
    text-shadow: 0 0 4px #fff,
    0 0 11px #fff,
    0 0 19px #fff,
    0 0 40px #f00,
    0 0 80px #f00,
    0 0 90px #f00,
    0 0 100px #f00,
    0 0 150px #f00;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}

@media screen and (prefers-reduced-motion) {
  .on-air {
    animation: none;
  }
}
</style>