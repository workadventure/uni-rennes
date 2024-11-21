/// <reference types="@workadventure/iframe-api-typings" />


const sub = WA.room.onEnterLayer("fireLight").subscribe(() => {
    WA.room.showLayer("fireLight");
    WA.room.showLayer("darkness");
  });
  
  WA.room.onLeaveLayer("fireLight").subscribe(() => {
    WA.room.hideLayer("fireLight");
    WA.room.hideLayer("darkness");
    sub.unsubscribe();
  });

// Create a new website object
const website = WA.room.website.create({
    name: "my_website",
    url: "https://google.com",
    position: {
      x: 64,
      y: 128,
      width: 320,
      height: 240,
    },
    visible: true,
    allowApi: true,
    allow: "fullscreen",
    origin: "map",
    scale: 1,
  });
