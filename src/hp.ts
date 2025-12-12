/// <reference types="@workadventure/iframe-api-typings" />

import { ActionMessage } from "@workadventure/iframe-api-typings";
import * as extraUtils from "./extra-utilities";
import { areaobjects } from "./extra-types";
import "./main_new.js";

console.log('Script started successfully');

let toggle : boolean = true;

// Waiting for the API to be ready
WA.onInit().then(async () => {

    let triggerMessage!: ActionMessage;
    let map = await WA.room.getTiledMap();
    let EntryAreas : Array<areaobjects> = extraUtils.getAreaObjects("EntryAreas", "associatedLayers", map);
    let ExitAreas : Array<areaobjects> = extraUtils.getAreaObjects("ExitAreas", "associatedLayers", map);

    await setRoofDisplayonArrival(EntryAreas, ExitAreas);
    setBuildingEntries(EntryAreas);
    setBuildingExits(ExitAreas);
    extraUtils.setAllExitPrompts("ExitZones", "exitPromptUrl", "exitPromptMessage", triggerMessage, map)
}).catch(e => console.error(e));

async function setRoofDisplayonArrival(EntryAreas : Array<areaobjects>, ExitAreas : Array<areaobjects>): Promise<void> {
    let player = await WA.player.getPosition();
    let currentarea!: areaobjects;
    for (let areaobject of EntryAreas.concat(ExitAreas)) {
        let area = await WA.room.area.get(areaobject.name);
        if (extraUtils.isinArea(player, area)) {
            currentarea = areaobject;
            break;
        }
    }
    if (!currentarea)
        return;
    if (EntryAreas.map(obj => obj.name).includes(currentarea.name)) {
        for (let layer of currentarea.associatedlayers)
            WA.room.hideLayer(layer);
        toggle = false;
        return;
    }
    //---- A décommenter si le toit commence caché sur la map et que isRoofVisible est false par défaut (et aussi commenter la partie du "if" précedent) ----
    //if (ExitAreas.map(obj => obj.name).includes(currentarea.name)) {
    //    for (let layer of currentarea.associatedlayers)
    //        WA.room.showLayer(layer);
    //    toggle = true;
    //    return;
    //}
};
function setBuildingExits(areas : Array<areaobjects>) {
    for (let area of areas) {
        WA.room.area.onEnter(area.name).subscribe(() => {
            if (!toggle){
                 for (let layer of area.associatedlayers)
                    WA.room.showLayer(layer);
                toggle = true;
            }
        });
    }
};
function setBuildingEntries(areas : Array<areaobjects>) {
    for (let area of areas) {
        WA.room.area.onEnter(area.name).subscribe(() => {
            if (toggle) {
                for (let layer of area.associatedlayers)
                    WA.room.hideLayer(layer);
                toggle = false;
            }
        });
    }
};

export {};
