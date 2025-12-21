/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags);

    let currentMapName = WA.room.mapURL;
    const mapUrl = WA.room.mapURL;
    const re = new RegExp(/^http(s)?:\/\/\w+((\.)?(\-)?\w+)*(:[0-9]+)?/);
    const root2 = mapUrl.match(re);
    const root = root2 != undefined ? root2[0] : undefined;

    if (WA.player.tags.includes("admin")) {
        WA.player.setOutlineColor(0, 119, 141);
    }

    WA.ui.actionBar.addButton({
        id: 'home',
        imageSrc: root + "/arrows-to-center.svg",
        toolTip: "M'envoyer à l'accueil de Villejean",
        callback: () => {
            console.log("Returning to starting point from " + currentMapName);
            // changes the url to homepage
            if (currentMapName === "accueil-villejean") {
                const x = 9 * 32;
                const y = 8 * 32;
                WA.player.moveTo(x, y);
            } else {
                WA.nav.goToRoom("https://mondevirtuel.univ-rennes2.fr/@/accueil-villejean")
            }
        }
    });

    WA.ui.actionBar.addButton({
        id: 'menu-btn',
        imageSrc: root + "/brochure.png",
        toolTip: 'Interactive Menu',
        callback: () => {
            openInteractiveMenu();
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
                allowFullScreen: false,
            });
        }
    }).catch(e => console.error(e));
}).catch(e => console.error(e));

const openInteractiveMenu = () => {
    WA.ui.modal.closeModal();
    WA.ui.modal.openModal({
        src: "https://menu.lgeorget.eu/",
        allow: "fullscreen",
        title: "Map Overview",
        allowApi: true,
        position: "center",
        allowFullScreen: false,
    });
}
/*
const openMapOverview = async() => {
    WA.ui.modal.closeModal();
    const pos = await WA.player.getPosition();
    WA.ui.modal.openModal({
        --- TODO fix map overview projet ---
        src: "https://hugoaverty.github.io/map-overview/index.html?x="+pos.x+"&y="+pos.y+"",
        allow: "fullscreen",
        title: "Map Overview",
        allowApi: true,
        position: "center",
        allowFullScreen: false,
    });
}
*/
export {};
