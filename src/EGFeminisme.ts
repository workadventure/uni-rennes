/// <reference types="@workadventure/iframe-api-typings" />
import "./main.js";

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.info('Script started successfully');

WA.onInit().then(async() => {
    // Disable tutotial
    WA.player.state.tutorialDone = true;
    WA.controls.restorePlayerProximityMeeting();
    const url = new URL(WA.room.mapURL);

    WA.room.onEnterLayer('to-hall').subscribe(() => {
        WA.ui.actionBar.removeButton("Tableau");
        WA.ui.actionBar.removeButton("Briefing");
    });

    for (let i = 1; i < 6; i++) {
        console.log(`Saving variable Enigme${i}`);
        WA.player.state.saveVariable(`Enigme${i}`, 0, {public: true, persist: true, ttl: 60 * 35, scope: "room"});
        console.log(`Saved variable Enigme${i} as`, WA.player.state.loadVariable(`Enigme${i}`));
    }

    WA.players.onVariableChange("Enigme1").subscribe((event) => {WA.player.state.Enigme1 = event.value});
    WA.players.onVariableChange("Enigme2").subscribe((event) => {WA.player.state.Enigme2 = event.value});
    WA.players.onVariableChange("Enigme3").subscribe((event) => {WA.player.state.Enigme3 = event.value});
    WA.players.onVariableChange("Enigme4").subscribe((event) => {WA.player.state.Enigme4 = event.value});
    WA.players.onVariableChange("Enigme5").subscribe((event) => {WA.player.state.Enigme5 = event.value});

    function enigmaCheck(zoneName :string) {
        WA.room.area.onEnter(zoneName).subscribe(() => {
            WA.ui.modal.openModal({
                title: zoneName,
                src: `${url.protocol}//${url.host}${url.protocol === 'https:' ? "/uni-rennes/" : '/'}EGFeminisme/${zoneName}.html`, // ligne vaudou pour ouvrir le fichier html
                allowApi: true,
                allow: "microphone; camera",
                position: "center",
            }, () => {
                WA.ui.modal.closeModal();
            });
        });
        WA.room.area.onLeave(zoneName).subscribe(() => {
            WA.ui.modal.closeModal();
        });
    }

    const enigmas = ["E1", "E2", "E3", "E4", "E4B", "E5", "E6"];
    for (let enigma of enigmas) {
        enigmaCheck(enigma);
    }

    interface CreateUIWebsiteEvent {
        url: string,            // Website URL
        visible?: boolean,      // The website is visible or not
        allowApi?: boolean,     // Allow scripting API on the website
        allowPolicy?: string,   // The list of feature policies allowed
        position: {
            vertical: "top"|"middle"|"bottom",
            horizontal: "left"|"middle"|"right",
        },
        size: {                 // Size on the UI (available units: px|em|%|cm|in|pc|pt|mm|ex|vw|vh|rem and others values auto|inherit)
            height: string,
            width: string,
        },
        margin: {              // Website margin (available units: px|em|%|cm|in|pc|pt|mm|ex|vw|vh|rem and others values auto|inherit)
            top?: string,
            bottom?: string,
            left?: string,
            right?: string,
        },
    }

    let brief: CreateUIWebsiteEvent = { // briefing video
        url: "https://www.youtube.com/embed/aFZ4mV52XFE?si=9vaLPfWDeUxbN3Xf&autoplay=1;&amp;controls=0&amp;",
        visible: false,
        allowApi: false,
        allowPolicy: "autoplay",
        position: {
            vertical: "top",
            horizontal: "left",
          },
        size: {
            height: "30vh",
            width: "30vw",
        },
        margin: {
          left: "5vw",
          top: "30vh",
        },
      }

    let tableau: CreateUIWebsiteEvent = { // tableau de bord
        url: `${url.protocol}//${url.host}${url.protocol === 'https:' ? "/uni-rennes/" : '/'}EGFeminisme/Tableau_de_bord.html`,
        visible: false,
        allowApi: true,
        allowPolicy: "",
        position: {
            vertical: "middle",
            horizontal: "middle",
          },
        size: {
            height: "75vh",
            width: "75vw",
        },
        margin: {
            right: "15vw",
            top: "0vh",
        },
      }

    let tab = await WA.ui.website.open(tableau);
    

    WA.ui.actionBar.addButton({ // Ajout du bouton de briefing avec timout pour couper la vidéo
        id: "Tableau",
        type: "button",
        label: "Tableau de bord",
        callback: async() => {tab.visible = !tab.visible;}
    });

    WA.ui.actionBar.addButton({ // Ajout du bouton de briefing avec timout pour couper la vidéo
        id: "Briefing",
        type: "button",
        label: "Briefing Escape game",
        callback: async() => {
        brief.visible = true;
        let website = await WA.ui.website.open(brief);
            WA.ui.actionBar.removeButton("Briefing");
            console.log("Starting briefing");
            WA.controls.disablePlayerControls();
            setTimeout(() => {
                website.url = "https://www.youtube.com/embed/aFZ4mV52XFE?si=9vaLPfWDeUxbN3Xf&autoplay=1;&amp;controls=0&amp;&amp;start=82";
                website.size.height = "15vh";
                website.size.width = "15vw";
                website.margin.left = "0vw";
                website.margin.top = "0vh";
                WA.controls.restorePlayerControls();
            }, 82000);
            setTimeout(() => {
                website.visible = false;
            }, 22 * 60 * 1000 + 3000);
        }
    });

    bootstrapExtra().then(() => {
        console.info('Scripting API Extra ready');
        WA.controls.disablePlayerProximityMeeting();
    }).catch(e => console.error(e));
});