import {MeetingUpdate} from "@/abstract/MeetingUpdate";

export interface TeamsWsResponse{
    apiVersion: string;
    meetingUpdate: MeetingUpdate;
}