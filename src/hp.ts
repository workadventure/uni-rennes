/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');

        listenDoor('hallDoor')
        listenDoor('libraryDoor')
        listenDoor('bankDoor')
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function listenDoor(door: string) {
    WA.room.area.onEnter(door).subscribe(() => {
        if (WA.state.isRoofVisible === true) {
            WA.state.isRoofVisible = false
            WA.room.hideLayer('Roof/Roof3')
            WA.room.hideLayer('Roof/Roof2')
            WA.room.hideLayer('Roof/Roof1')
            WA.room.hideLayer('Roof/Roof0')
        } else {
            WA.state.isRoofVisible = true
            WA.room.showLayer('Roof/Roof3')
            WA.room.showLayer('Roof/Roof2')
            WA.room.showLayer('Roof/Roof1')
            WA.room.showLayer('Roof/Roof0')
        }
    })
}

export {};
