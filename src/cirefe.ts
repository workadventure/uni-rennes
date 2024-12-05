/// <reference types="@workadventure/iframe-api-typings" />
import "./main.js";

console.log("cirefe lancé")

WA.onInit().then(async() => {

let pos = (await WA.player.getPosition()) ;

WA.camera.set(pos.x, pos.y, 1600, 1800, false, true);

const live = await WA.ui.website.open({
    url: "https://www.youtube.com/embed/live_stream?channel=UCDX5M3-pP_EoSfWPPyV6qnQ",
    allowPolicy: "fullscreen; autoplay; picture-in-picture",
    position: {
        vertical: "middle",
        horizontal: "left",
        },
    visible: true,
    size: {
        height: "30vh",
        width: "30vw",
    },
    margin: {
        left: "5vw"
    }
});

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

WA.room.onEnterLayer("floor/speaker").subscribe(() => {live.visible = true;});
WA.room.onLeaveLayer("floor/speaker").subscribe(() => { live.visible = false});
WA.room.onEnterLayer("public").subscribe(() => {live.visible = true;});
WA.room.onEnterLayer("floor/raie").subscribe(() => {live.visible = false;});

});