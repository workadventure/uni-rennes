/// <reference types="@workadventure/iframe-api-typings" />

import { AvatarComponent } from './AvatarComponent';
import { MessageComponent } from './MessageComponent';
import { DialogueInterface } from '../../../src/dialogues';

interface DialogueBoxProps {
    npc: DialogueInterface;
}

export class DialogueBoxComponent implements DialogueBoxProps {
    npc: DialogueInterface;

    private dialogueContainer: HTMLDivElement;
    private avatarComponent: AvatarComponent;
    private messageComponent: MessageComponent;

    constructor(npc: DialogueInterface) {
        this.npc = npc;

        this.dialogueContainer = document.createElement('div');
        this.dialogueContainer.className = 'dialogue-box';

        if (this.npc.npcName) {
            this.avatarComponent = new AvatarComponent(this.npc.npcName, `${this.npc.npcName}.png`);
        }
        
        this.messageComponent = new MessageComponent(this.npc.message, !!this.npc.url);

        this.setupDOM();

        // This event is triggered from the pagination logic (when the 'Close' button is clicked)
        document.addEventListener('destroy', async () => {
            await WA.player.state.saveVariable("closeDialogueBoxEvent", {
                forceChange: new Date().getTime(),
                npc: this.npc 
            }, {
                public: false,
                persist: false,
                scope: "room",
            });

            // get current iframe ID
            const websiteId = WA.iframeId;
            if (websiteId) {
                const website = await WA.ui.website.getById(websiteId);
                website?.close()
            }
        });
    }

    private setupDOM(): void {
        if (this.npc.npcName) {
            const avatarContainer = this.avatarComponent.render();
            this.dialogueContainer.appendChild(avatarContainer);
        }
        
        const messageContainer = this.messageComponent.render();
        this.dialogueContainer.appendChild(messageContainer);
    }

    render(): HTMLElement {
        return this.dialogueContainer;
    }
}