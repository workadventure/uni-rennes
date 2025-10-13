/// <reference types="@workadventure/iframe-api-typings" />

import { ActionMessage, Area, Position } from "@workadventure/iframe-api-typings";
import { bootstrap } from "./main";

// Adds a class to store each area's name and the associated properties
class areaobjects {
    name!: string;
    associatedlayers!: Array<string>;
}

// Array for all areas
const map = await WA.room.getTiledMap()
let currareaprop: Array<areaobjects> = []
let triggerMessage!: ActionMessage;

// Waiting for the API to be ready
WA.onInit().then(() => {
    bootstrap()

    hideAll()
    getAreaObjects()
    setAreaBehaviour()
    displayOnArrival()
    setExitPrompt()

}).catch(e => console.error(e));

// Used to grab all the relevant data for currareaprop :
// Here, it is looking for an objectgroup named "drawZones" (line 59-60).
// When it is found, it then looks through all the objects of the "area" class with (line 60-62) that also contain properties.
// It then looks through the properties to look for the "associatedLayer" property with a non null value and a "string type" (line 64).
// If all conditions are met, it is added to the list (line 65)
function getAreaObjects() {
    for (let Layer of map.layers) {
        if (Layer.name === "drawZones" && Layer.type === "objectgroup") {
            for (let i: number = 0; i < Layer.objects.length; i++) {
                let properties = Layer.objects[i].properties
                if (Layer.objects[i].class == "area" && properties != undefined) {
                    for (let property of properties) {
                        if (property.name === "associatedLayer" && property?.value != undefined && property.type === "string")
                            currareaprop.push({name:Layer.objects[i].name, associatedlayers:property.value.split(",")})
                    }
                }
            }
            break
        }
    }
}

// Used to set the behaviour for each zone
function setAreaBehaviour() {
    for (let Zone of currareaprop) {
        for (let Layers of Zone.associatedlayers) {
            WA.room.area.onEnter(Zone.name).subscribe(() => {
                WA.room.showLayer(Layers)
            });
            WA.room.area.onLeave(Zone.name).subscribe(() => {
                WA.room.hideLayer(Layers)
            });
        }
    }
}

function isInArea(player: Position, Object: Area) {
    if (Object.x < player.x && player.x < Object.x + Object.width && Object.y < player.y && player.y < Object.y + Object.height)
        return true
    return false
}

async function displayOnArrival() {
    let position = await WA.player.getPosition()
    for (let Zone of currareaprop) {
        let Object = await WA.room.area.get(Zone.name)
        if (Object != undefined && isInArea(position, Object)) {
            for (let Layers of Zone.associatedlayers) {
                WA.room.showLayer(Layers)
            }
            return
        }
    }
}

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

function hideAll() {
    for (let Layer of map.layers) {
        if (Layer.name != "collisions" && Layer.name != "background")
            WA.room.hideLayer(Layer.name)
    }
}

export {};
