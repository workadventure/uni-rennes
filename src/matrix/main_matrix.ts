/// <reference types="@workadventure/iframe-api-typings" />

import { ActionMessage } from "@workadventure/iframe-api-typings";
import extraUtilities from "../extra-utilities";
import "../main_new.js";

WA.onInit().then(async() => {
    const alwaysShown = ["collisions", "background"];
    let triggerMessage!: ActionMessage;
    let map = await WA.room.getTiledMap();

    extraUtilities.hideAll(map, alwaysShown);
    let currareaprop = extraUtilities.getAreaObjects("drawZones", "associatedLayer", map);
    extraUtilities.setAreaDisplayBehaviour(currareaprop);
    extraUtilities.displayOnArrival(currareaprop);
    extraUtilities.setAllExitPrompts("ExitZones", "exitPromptUrl", "exitPromptMessage", triggerMessage, map);

}).catch(e => console.error(e));

export {};
