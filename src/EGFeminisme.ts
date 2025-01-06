/// <reference types="@workadventure/iframe-api-typings" />
import "./main.js";

console.info('Script started successfully');

WA.onInit().then(async() => {
    WA.player.state.tutorialDone = true; // removing the tutorial
    const url = new URL(WA.room.mapURL);

    WA.room.onEnterLayer('to-hall').subscribe(() => { // removing buttons inherent to the room
        WA.ui.actionBar.removeButton("Tableau");
        WA.ui.actionBar.removeButton("Briefing");
        WA.ui.banner.closeBanner();
    });

    for (let i = 1; i < 6; i++) { // Init variables
        WA.player.state.saveVariable(`Enigme${i}`, 0, {public: true, persist: true, ttl: 60 * 35, scope: "room"});
    }

    // Ajout de l'écoute des variables des autres joueurs de la salle
    WA.players.onVariableChange("Enigme1").subscribe((event) => {WA.player.state.Enigme1 = event.value});
    WA.players.onVariableChange("Enigme2").subscribe((event) => {WA.player.state.Enigme2 = event.value});
    WA.players.onVariableChange("Enigme3").subscribe((event) => {WA.player.state.Enigme3 = event.value});
    WA.players.onVariableChange("Enigme4").subscribe((event) => {WA.player.state.Enigme4 = event.value});
    WA.players.onVariableChange("Enigme5").subscribe((event) => {WA.player.state.Enigme5 = event.value});

    function enigmaCheck(zoneName :string) { // Ouvre l'enigme correspondant à la zone sur laquelle le joueur se trouve
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

    await WA.ui.website.open({ // briefing video
        url: "https://www.youtube.com/embed/aFZ4mV52XFE?si=9vaLPfWDeUxbN3Xf&autoplay=1;&amp;controls=0&amp;",
        visible: true,
        allowApi: false,
        allowPolicy: "autoplay",
        position: {
            vertical: "top",
            horizontal: "right",
          },
        size: {
            height: "20vh",
            width: "20vw",
        },
        margin: {
          right: "2vw",
          top: "5vh",
        },
      });

    
    let toggle = true;
    WA.ui.actionBar.addButton({ // Ajout du bouton du tableau de bord
        id: "Tableau",
        type: "button",
        label: "Tableau de bord",
        callback: async() => {
            if (toggle) {
                WA.ui.modal.openModal({
                    title: "Tableau de bord",
                    src: `${url.protocol}//${url.host}${url.protocol === 'https:'? "/uni-rennes/" : '/'}EGFeminisme/Tableau_de_bord.html`,
                    allowApi: true,
                    allow: "",
                    position: "center",
                }, () => {WA.ui.modal.closeModal();});
            } else {
                WA.ui.modal.closeModal();
            }
            toggle =!toggle;
        }
    });

    const indices: string[] = [
        "1,2,3 Retracez l'histoire de la lutte féministe grâce à quelques grandes figures. N’oubliez pas le symbole de la relique",
        "Le symbole de Vénus peut livrer ses mystères en morceaux.",
        "Des questions à répondre pour un coffret à 3 chiffres à ouvrir ! N’oubliez pas le symbole de la relique !",
        "Une clé à trouver… La bibliothèque pourrait-elle vous aider ? Enigme n°4… N’oubliez pas le symbole et le titre de la relique !",
        "Deux groupes vont vous donner un code de 5 lettres. La relique de l’énigme n° 5 est un peu particulière..."
    ];

    let i = 0;

    function delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function got_all_relics() {
        for (let i = 1; i < 6; i++) {
            if (WA.player.state.loadVariable(`Enigme${i}`) == 1) {
                console.log("Player has variable", WA.player.state.loadVariable(`Enigme${i}`));
            }
            if (WA.player.state.loadVariable(`Enigme${i}`) != 1) {
                return false;
            }
        }
        return true;
    }

    if (got_all_relics()) {
        const x = 32 * 24;
        const y = 32 * 15;
        const w = 416; // 13 tuiles de large (13 * 32)
        const h = w / (16 / 10);

        console.log(x, y, h, w);

        WA.room.website.create({
            name: "Salle2",
            url: `${url.protocol}//${url.host}${url.protocol === 'https:' ? "/uni-rennes/" : "/"}EGFeminisme/S2.html`,
            position: { x: x - 28, y: y, width: w, height: h },
            visible: true,
            allowApi: false,
            origin: "map",
            scale: 1,
        });
        WA.camera.set(x + w / 2 + 32, y + h / 2 - 6, w, h, true, true);
        WA.ui.banner.closeBanner();
    } else {
        console.error("WA API is not available.");
    }

    while (true && !got_all_relics()) {
        await delay(40000); // Wait for 30 seconds
        WA.ui.banner.openBanner({
            id: "banner-test",
            text: indices[i % 4],
            bgColor: "#272727",
            textColor: "#ffffff",
            closable: false,
            timeToClose: 30 * 60 * 1000,
        });
        i++;
    }
});