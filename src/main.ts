/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    const mapUrl = WA.room.mapURL
    const root = mapUrl.substring(0, mapUrl.lastIndexOf("/"))
    let currentMapName = "campus"

    if(WA.player.tags.includes("admin")) {
        WA.player.setOutlineColor(0, 119, 141);
    }

    WA.ui.actionBar.addButton({
        id: 'move-btn',
        type: 'action',
        imageSrc: root + '/../arrows-to-center.svg',
        toolTip: "M'envoyer à l'accueil",
        callback: () => {
            // If the player is already on the destination map, the page won't reload and the moveTo parameter won't be applied
            // So we make a direct call to the moveTo feature instead using the API
            if (currentMapName === "Accueil_Villejean") {
                const x = 25 * 32;
                const y = 7 * 32;
                WA.player.moveTo(x, y);
            } else {
                WA.nav.goToRoom("https://play.workadventu.re/@/universite-rennes-2/metavers/accueil-villejean#moveTo=from-presidence")
            }
        }
    });

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');

        if(!WA.player.state.tutorialDone){
            WA.ui.modal.openModal({
                title: "Tutorial",
                src: 'https://workadventure.github.io/scripting-api-extra/tutorialv1.html',
                allow: "fullscreen; clipboard-read; clipboard-write",
                allowApi: true,
                position: "right",
            });
        }
    }).catch(e => console.error(e));
}).catch(e => console.error(e));

export {};
