/// <reference types="@workadventure/iframe-api-typings" />
import "./main_new.js";

console.log("cirefe lancé")

WA.onInit().then(async() => {

    WA.room.area.onEnter("scene").subscribe(() => { // Accorder l'accès à la scene selon les tags
        console.log("Tags: ", WA.player.tags);
        if (isAllowed(WA.player.tags)) {
            console.log("Ouverture pour un.e", WA.player.tags);
            WA.room.hideLayer("floor/collisions-scene");
        }
    });

    WA.room.area.onLeave("scene").subscribe(() => { // Accorder l'accès à la scene selon les tags
        WA.room.showLayer("floor/collisions-scene");
    });
});

function isAllowed(tags: string[]): boolean {
    const allowedTags: Array<string> = ["admin", "speaker", "lecteur"];
    for (const tag of tags) {
        if (allowedTags.includes(tag))
            return true;
    }
    return false; // Le joueur ne peut pas entrer en live si il n'est pas admin, speaker ou lecteur
};