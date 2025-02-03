/// <reference types="@workadventure/iframe-api-typings" />
import "./main.js";

console.log("cirefe lancé")

WA.onInit().then(async() => {




function isAllowed(tags: string[]): boolean {
    for (const tag of tags) {
        if (tag === "admin")
            return true;
        if (tag === "speaker")
            return true;
        if (tag === "lecteur")
            return true; 
    }
    return false; // Le joueur ne peut pas entrer en live si il n'est pas admin, speaker ou lecteur
};

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