/// <reference types="@workadventure/iframe-api-typings" />

import { ActionMessage } from '@workadventure/iframe-api-typings';
import { ITiledMap } from '@workadventure/tiled-map-type-guard'
import { bootstrap } from "./main";

let map!: ITiledMap
let triggerMessage!: ActionMessage;

// Waiting for the API to be ready
WA.onInit().then(async() => {
    bootstrap()

    map = await WA.room.getTiledMap()

    setExitPrompt()

}).catch(e => console.error(e));

function declarePrompt(layerName: string, url: string) {
    WA.room.setProperty("ExitZones/" + layerName, "exitUrl", undefined)
    WA.room.onEnterLayer("ExitZones/" + layerName).subscribe(() => {
        triggerMessage = WA.ui.displayActionMessage({
            message: "Go to room ?",
            callback: () => {
                WA.nav.goToRoom(url)
            }
        });
    })
    WA.room.onLeaveLayer("ExitZones/" + layerName).subscribe(() => {
        setTimeout(() => {
            triggerMessage.remove();
        }, 1000)
    })
}

function setExitPrompt() {
    for (let Group of map.layers)
        if (Group.name === "ExitZones" && Group.type === "group" && Group?.layers != undefined) {
            for (let Layer of Group.layers) {
                if (Layer?.properties != undefined) {
                    for (let property of Layer.properties) {
                        if (property.name === "exitUrl" && property?.value != undefined && property.type === "string")
                            declarePrompt(Layer.name, property.value)
                    }
                }
            }
        }
}

export {};
