import {MeetingState} from "@/abstract/MeetingState";
import {MeetingPermissions} from "@/abstract/MeetingPermissions";

export interface MeetingUpdate {
    meetingState: MeetingState;
    meetingPermissions: MeetingPermissions;
}