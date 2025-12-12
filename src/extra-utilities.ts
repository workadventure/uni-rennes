/// <reference types="@workadventure/iframe-api-typings" />

import { ActionMessage, Area, Position } from '@workadventure/iframe-api-typings';
import { areaobjects } from "./extra-types";

/**
 * Returns an object from the array passed as argument if the name matches. The object msut have a "name" field for this to work.
 *
 * @param {Array<any>} array Array containing the desired object
 * @param {string} name Name of the desired object (contained in a "name" field)
 * @returns {any | undefined} Returns the first object with a matching name found in the array. If nothing matches, returns undefined.
 */
export function getObjectbyName(array: Array<any>, name: string): any {
    if (array === undefined || array.length === 0)
        return undefined;
    for (let Object of array) {
        if ("name" in Object && Object.name === name)
            return Object;
    }
    return undefined;
}
/**
 * Returns an array of zones from a given object layer with their name and the content of a given property.
 *
 * @param {string} objectlayer Array of the zones
 * @param {string} linkedproperty Name of the given property
 * @returns {Array<areaobjects>} Returns the filled array of areaobjects
 */
export function getAreaObjects(objectlayer: string, linkedproperty: string, map: any): Array<areaobjects> {
    let buf: Array<areaobjects> = [];
    let layer = getObjectbyName(map.layers, objectlayer);
    if (typeof layer === undefined || layer.type != "objectgroup")
        return buf;
    for (let object of layer.objects) {
        let property = getObjectbyName(object.properties, linkedproperty);
        if (property.value != undefined && property.type === "string") {
            buf.push({name:object.name as string, associatedlayers:(property.value as string).split(",")});
        }
    }
    return buf;
}
/**
 * Sets the display behavior for given areas.
 *
 * @param {Array<areaobjects>} displayareas Array containing the area's name and the layers that will be displayed with it.
 * @returns {void}
 */
export function setAreaDisplayBehaviour(displayareas: Array<areaobjects>): void {
    for (let area of displayareas) {
        for (let layer of area.associatedlayers) {
            WA.room.area.onEnter(area.name).subscribe(() => {
                WA.room.showLayer(layer);
            });
            WA.room.area.onLeave(area.name).subscribe(() => {
                WA.room.hideLayer(layer);
            });
        }
    }
}
/**
 * Checks if the player is in the area.
 *
 * @param {Position} player Position of the player
 * @param {Area} object Area you want to check
 * @returns {boolean} Returns true if the player is in the area
 */
export function isinArea(player: Position, object: Area): boolean {
    if (object.x < player.x && player.x < object.x + object.width && object.y < player.y && player.y < object.y + object.height)
        return true;
    return false;
}
/**
 * Displays the layers associated with the area where the player is after arriving on the map (see onEnter behavior for reference).
 *
 * @param {Array<areaobjects>} displayareas Array of areaobjects for each display area
 * @returns {Promise<void>}
 */
export async function displayOnArrival(displayareas: Array<areaobjects>): Promise<void> {
    let position = await WA.player.getPosition()
    for (let area of displayareas) {
        let object = await WA.room.area.get(area.name);
        if (object != undefined && isinArea(position, object)) {
            for (let layers of area.associatedlayers) {
                WA.room.showLayer(layers);
            }
            return;
        }
    }
}
/**
 * Sets the prompt for an exit zone.
 *
 * @param {string} layername Name of the exit layer
 * @param {string} promptmessage Message that will be displayed on the prompt
 * @param {string} url Url of the room that you want to move to
 * @param {ActionMessage} triggerMessage Variable for the prompt object
 * @param {string | undefined} location If the exit layer is within a layer group, path to the group
 * @returns {void}
 */
export function setExitPrompt(layername: string, promptmessage: string, url: string, triggerMessage: ActionMessage, location?: string): void {
    let path = location === undefined ? layername : location[location.length] === "/" ? location + layername : location + "/" + layername;
    WA.room.onEnterLayer(path).subscribe(() => {
        triggerMessage = WA.ui.displayActionMessage({
            message: promptmessage,
            callback: () => {
                WA.nav.goToRoom(url);
            }
        });
    });
    WA.room.onLeaveLayer(path).subscribe(() => {
        if (triggerMessage)
            triggerMessage.remove();
    });
}
/**
 * Sets all of the exit prompts for the layers of a layer group.
 *
 * @param {string} layergroup Path to the layer group
 * @param {string} exitproperty Name of the property containing the exit url
 * @param {string} exitmsgproperty Name of the property containing the message for the prompt
 * @param {ActionMessage} triggerMessage Variable for the prompt object
 * @param {any} map The current Tiled map (see the WA.room.getTiledMap() method)
 * @returns {void}
 */
export function setAllExitPrompts(layergroup: string, exitproperty: string, exitmsgproperty: string, triggerMessage: ActionMessage, map: any): void {
    let group = getObjectbyName(map.layers, layergroup);
    if (group === undefined || group.type != "group" || group.layers.length === 0)
        return;
    for (let layer of group.layers) {
        let property = getObjectbyName(layer.properties, exitproperty);
        let message = getObjectbyName(layer.properties, exitmsgproperty);
        if (property != undefined && property.type === "string")
            setExitPrompt(layer.name, (message != undefined ? message.value : "Go to room ?"), property.value, triggerMessage, layergroup);
    }
}
/**
 * Hides every layer.
 *
 * @param {any} object The object that has the layers which must be hidden (must have a "layers" property)
 * @param {Array<string>} alwaysShown Array of the excluded layers
 * @returns {void}
 */
export function hideAll(object: any, alwaysShown: Array<string>): void {
    if (!("layers" in object))
        return;
    for (let layer of object.layers) {
        if (alwaysShown.includes(layer.name) === false)
            WA.room.hideLayer(layer.name);
    }
}

export default { getObjectbyName, getAreaObjects, setAreaDisplayBehaviour, isinArea, displayOnArrival, setExitPrompt, setAllExitPrompts, hideAll };
