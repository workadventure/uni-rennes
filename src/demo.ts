/// <reference types="@workadventure/iframe-api-typings" />
import "./main.js";
// import { cpSync } from "fs";

// préparer le son "fireSound.ogg" =======================
var fireSound = WA.sound.loadSound("../fireSound.ogg"); // le dossier public est cast en racine du repo donc il faut juste revenir à la racine en chemin relatif
var config = {
      volume : 0.75,
      loop : true,
      rate : 1,
      detune : 1,
      delay : 0,
      seek : 0,
      mute : false
  }
// faire jouer le son: fireSound.play(config);
// arrêter le son: fireSound.stop();
// ==========================================================

const run = async () => {
  // Afficher/Cacher certains layers quand on entre/sort d'un layer ==
  WA.room.onEnterLayer("fireLight").subscribe(() => {
      WA.room.showLayer("fireLight");
      WA.room.showLayer("darkness");
      fireSound.play(config);
    });
    
    WA.room.onLeaveLayer("fireLight").subscribe(() => {
      WA.room.hideLayer("fireLight");
      WA.room.hideLayer("darkness");
      fireSound.stop();
  });

  // =================================================================

  // Ajouter des actions possible qaund on clique sur les autres joueurs=
  WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
      remotePlayer.addAction('Ask to tell a joke', () => {
          console.log('I am NOT telling you a joke!');
      });
      remotePlayer.addAction('This will disappear!', () => {
          WA.room.hideLayer("floor");
      });
  })
  //=====================================================================

  // Ajouter un nouveau site dans une zone sur la carte ====
  WA.room.website.create({
      name: "my_website",
      url: "https://www.youtube.com/embed/lBHkzgN-8ws",
      position: {
        x: 64,
        y: 128,
        width: 200,
        height: 150,
      },
      visible: false,
      allowApi: true,
      allow: "fullscreen",
      origin: "map",
      scale: 1,
    });
  //========================================================

  // Pour ouvir un site internet dans une zone sur l'écran ======


  //Type à metter en paramètre de la fonction
  /*interface CreateUIWebsiteEvent {
      url: string,            // URL du site internet
      visible?: boolean,      // Si la zone doit ou pas être visible
      allowApi?: boolean,     // autoriser le site à utiliser l'api Workadventure
      allowPolicy?: string,   // The list of feature policies allowed
      position: {             // Position de la zone sur l'écran, 1 seule position (par type) utilisable à la fois
          vertical: "top",    // autres possibilités: "middle" ou "bottom"
          horizontal: "left", // autres possibilités: "middle" ou "right"
      },
      size: {                 // Taille de la zone (unités possibles: px|em|%|cm|in|pc|pt|mm|ex|vw|vh|rem et autres valeurs auto|inherit)
          height: string,
          width: string,
      },
      margin?: {              // décalage de la zone
          top?: string,
          bottom?: string,
          left?: string,
          right?: string,
      },
  }*/

  // Type de la "promesse" renvoyée par la fonction, les champs avec "?" sont facultatifs
  /*interface UIWebsite {
      readonly id: string,            // Identifiant unique
      url: string,                    // URL
      visible: boolean,               // visibilité
      readonly allowApi: boolean,     // authorisation d'API
      readonly allowPolicy: string,   // Liste des authorisation
      position: {
          vertical: string,           // position Verticale (top, middle, bottom)
          horizontal: string,         // position Horizontale (left, middle, right)
      },
      size: {                         // Taille de la zone
          height: string,
          width: string,
      },
      margin?: {                      // décalage de la zone
          top?: string,
          bottom?: string,
          left?: string,
          right?: string,
      },
      close(): Promise<void>,         // Fermeture de l'instance actuelle
  }*/

  // -> utilisation: 
  const myWebsite = await WA.ui.website.open({
    url: "https://www.youtube.com/embed/lBHkzgN-8ws",
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

  // Montrer le site en fonction de l'entrée/sortie d'un layer

  WA.room.onEnterLayer("chaise").subscribe(() => {
    myWebsite.visible = false;
  });

  /*WA.room.onLeaveLayer("chaise").subscribe(() => {
    myWebsite.visible = false;
  });
*/
  //========================================================

  // Comment ouvrir un "modal" (menu fermable != popup)

  WA.ui.modal.openModal({
    title: "MyTitle",                 // Titre (obligatoire)
    src: 'https://workadventu.re',    // Site source (obligatoire)
    allow: "fullscreen",              // Autorisation (facultatif)
    allowApi: true,                   // Autorisation (obligatoire)
    position: "left",                 // Position (facultatif) par défaut à droite | "center" OU "left" OU "right"|
  }, () => {                          // Fonction appelée à la fermeture
    console.info  ('The modal was closed');
    WA.ui.modal.closeModal();
  });

  // WA.ui.modal.closeModal() // Pour fermer un modal

  //========================================================

  // Ajouter un bouton de texte à la barre d'outils

  WA.ui.actionBar.addButton({
    id: "Nouveau bouton",
    type: "button",
    label: "Nouveau Bouton",
    callback: (event) => {
      console.log("Nouveau bouton cliqué", event);
    },
  })

  WA.ui.actionBar.removeButton("Nouveau bouton"); // retirer le bouton (toujours par id)

  // Ajouter un nouveau bouton logo au menu

  const Stitch = await WA.ui.website.open({
    url: "https://i.etsystatic.com/42919322/r/il/5da703/5702221647/il_570xN.5702221647_ibkz.jpg",
    position: {
        vertical: "middle",
        horizontal: "middle",
      },
    visible: false,
    size: {
        height: "570px",
        width: "428px",
    },
  });

  WA.ui.actionBar.addButton({
    id: "Nouveau logo",
    type: 'action',
    imageSrc: "https://i.etsystatic.com/42919322/r/il/5da703/5702221647/il_570xN.5702221647_ibkz.jpg", // utiliser une image en ligne sinon ça ne marche pas
    toolTip: "Ahhhh",
    callback: (event) => {
      console.log("Il a cliqué sur le logo chelouuuu", event);
      Stitch.visible === true ? Stitch.visible = false : Stitch.visible = true; // Ligne vaudou pour rendre la visibilité de Stitch en toggle
    }
  });
};


WA.onInit().then(run);

export {};