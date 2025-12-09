/// <reference types="@workadventure/iframe-api-typings" />

import { ActionMessage } from "@workadventure/iframe-api-typings";
import extraUtilities from "./extra-utilities";
import "./main_new.js";

// Waiting for the API to be ready
WA.onInit().then(async() => {
    let map = await WA.room.getTiledMap()
    let triggerMessage!: ActionMessage;

    extraUtilities.setAllExitPrompts("ExitZones", "exitPromptUrl", "exitPromptMessage", triggerMessage, map)

}).catch(e => console.error(e));

export {};
