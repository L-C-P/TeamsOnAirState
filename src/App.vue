<template>
    <on-air-sign :connected="connected"
                 :is-camera-on="meetingState?.isCameraOn"
                 :is-in-meeting="meetingState?.isInMeeting"
                 :is-muted="meetingState?.isMuted"/>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {TeamsWsResponse} from "@/abstract/TeamsWsResponse";
import {MeetingState} from "@/abstract/MeetingState";
import {TeamsWsRequest} from "@/abstract/TeamsWsRequest";
import OnAirSign from "@/components/OnAirSign.vue";

const socket = ref<WebSocket | null>();
const connected = ref(false);
const meetingState = ref<MeetingState | null>(null);
const teamsURL = ref<string | null>();
const teamsToken = ref<string | null>();
const timeoutHandler = ref<number | null>();

onMounted(async () => {
    teamsURL.value = 'localhost';
    teamsToken.value = '2bc6cbe8-1ef9-4150-970b-e68e47540de5';
    await connect2Teams();
})

onBeforeUnmount(async () => {
    if (timeoutHandler.value) {
        clearTimeout(timeoutHandler.value);
        timeoutHandler.value = null;
    }

    await disconnectTeams();
})

const connect2Teams = async () => {
    try {
        if (teamsURL.value && teamsToken.value) {
            console.log(`Connect to Teams via ${teamsURL.value}`);
            socket.value = new WebSocket(`ws://${teamsURL.value}:8124?token=${teamsToken.value}&protocol-version=1.0.0&manufacturer=Denis%20Sowa&device=Browser&app=OnAir&app-version=1.0.0`)

            socket.value.onopen = async (message) => {
                console.log('Connected to Teams');
                connected.value = true;
                await requestStatusUpdate();
            };

            socket.value.onclose = async (message) => {
                console.log('Connection to Teams closed');
                connected.value = false;
                activateReconnect2Teams();
            };

            socket.value.onerror = async (message) => {
                console.error('Connection to Teams errored:');
                console.error(message);
                activateReconnect2Teams();
            };

            socket.value.onmessage = async (message) => {
                console.info(`Received message from Teams: ${message.data}`);
                const teamsWsResponse = JSON.parse(message.data) as TeamsWsResponse;
                meetingState.value = teamsWsResponse.meetingUpdate.meetingState;
            };
        } else
            activateReconnect2Teams();
    } catch (e) {
        console.error('Connection to Teams error:');
        console.error(e);
        activateReconnect2Teams();
    }
}

const activateReconnect2Teams = () => {
    timeoutHandler.value = setTimeout(async () => {
        await connect2Teams();
    }, 10000);
}

const disconnectTeams = async () => {
    socket.value?.close();
    socket.value = null;
}

const requestStatusUpdate = async () => {
    const req: TeamsWsRequest = {
        apiVersion: '1.0.0',
        action: 'query-meeting-state',
        manufacturer: 'Denis Sowa',
        device: 'Browser',
        timestamp: 0,
        service: 'query-meeting-state'
    };

    socket.value?.send(JSON.stringify(req));
}
</script>

<style lang="scss">
body, html {
  height: 100%;
  margin: 0;
  background-color: black;
  color: white;
}

#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  display: flex;
}
</style>