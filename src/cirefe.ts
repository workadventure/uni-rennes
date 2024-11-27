/// <reference types="@workadventure/iframe-api-typings" />
import "./main.js";

console.log("cirefe lancé")

WA.onInit().then(async() => {

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

WA.room.area.onEnter("scene").subscribe(() => { // Accorder l'accès à la scene selon les tags
    console.log("Tags: ", WA.player.tags);
    if ("admin" in WA.player.tags || "speaker" in WA.player.tags || "lecteur" in WA.player.tags) {
        WA.room.hideLayer("floor/collisions-scene");
    }
});
WA.room.area.onLeave("scene").subscribe(() => { // Accorder l'accès à la scene selon les tags
    WA.room.hideLayer("floor/collisions-scene");
});

WA.room.area.onEnter("Podium").subscribe(() => {live.visible = false;}); // Couper le live pour ceux sur scène
WA.room.onEnterLayer("floor/speaker").subscribe(() => { // Couper le son des participants en backstage
    live.visible = true;
});
WA.room.onLeaveLayer("floor/speaker").subscribe(() => { // Rétablir le son des participants en quittant les backstage
    live.visible = false;
});

});