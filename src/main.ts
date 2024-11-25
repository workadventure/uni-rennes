/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

(async () => {
    await WA.onInit();
    await WA.players.configureTracking({
      players: true,
      movement: false,
    });
    await WA.player.getPosition();
})();

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    const mapUrl = WA.room.mapURL
    const root = mapUrl.substring(0, mapUrl.lastIndexOf("/"))
    console.log("root is: ", root);
    let currentMapName = WA.room.mapURL;

    if(WA.player.tags.includes("admin")) {
        WA.player.setOutlineColor(0, 119, 141);
    }

    WA.ui.actionBar.addButton({
        id: 'home',
        type: 'action',
        imageSrc: root + '/../arrows-to-center.svg',
        toolTip: "M'envoyer à l'accueil de Villejean",
        callback: () => {
            console.log("Returning to starting point from " + currentMapName);
            // changes the url to homepage
            if (currentMapName === "accueil-villejean") {
                const x = 25 * 32;
                const y = 7 * 32;
                WA.player.moveTo(x, y);
            } else {
                WA.nav.goToRoom("https://mondevirtuel.univ-rennes2.fr/@/accueil-villejean#from-presidence")
            }
        }
    });

    WA.ui.actionBar.addButton({
        id: 'map-btn',
        // @ts-ignore
        type: 'action',
        imageSrc: 'https://hugoaverty.github.io/map-overview/img/map.svg',
        toolTip: 'Map overview',
        callback: () => {
            openMapOverview();
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

const openMapOverview = async() => {
    WA.ui.modal.closeModal();
    const pos = await WA.player.getPosition();
    WA.ui.modal.openModal({
        // TODO fix map overview projet
        //src: "https://hugoaverty.github.io/map-overview/index.html?x="+pos.x+"&y="+pos.y+"",
        src: "https://menu.lgeorget.eu/?x="+pos.x+"&y="+pos.y,
        allow: "fullscreen",
        title: "Map Overview",
        allowApi: true,
        position: "center",
    });
}

export {};
