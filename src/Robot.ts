import {OpenAI} from 'openai';

import {RemotePlayer} from '@workadventure/iframe-api-typings/play/src/front/Api/Iframe/Players/RemotePlayer';

export class Robot {
    private mode: "waiting" | "chatting" = "waiting";

    private openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: (WA.room as any).hashParameters.openaiApiKey,
    });

    private formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

    private chatHistory: any;

    public init(): void {
        console.log("Robot is starting...");

        WA.player.proximityMeeting.onJoin().subscribe((users) => {
            // When we join a proximity meeting, we start chatting
            this.mode = "chatting";

            this.startChat(users);
        });


        WA.player.proximityMeeting.onLeave().subscribe(() => {
            // When we leave a proximity meeting, we stop chatting
            this.mode = "waiting";
        });

        WA.chat.onChatMessage((message: string, event: any) => {
            (async () => {
                if (this.mode !== "chatting") {
                    return;
                }

                if (!event.author) {
                    // We are receiving a message from the local user (i.e. ourselves), let's ignore it.
                    return;
                }

                this.chatHistory.push({
                    role: "user",
                    player: event.author,
                    content: event.author.name + ": " + message,
                });

                const response = await this.triggerGpt();

                WA.chat.sendChatMessage(response, {
                    scope: "bubble",
                });
            })().catch(e => console.error(e));
        }, {
            scope: "bubble",
        });

    }


    private async startChat(users: RemotePlayer[]) {
        // Let's generate the prompt
        const chatPrompt = await this.getChatPrompt(users);

        this.chatHistory = [{
            role: "system",
            content: chatPrompt,
        }];

        const response = await this.triggerGpt();

        WA.chat.sendChatMessage(response, {
            scope: "bubble",
        });
    }


    private async triggerGpt() {
        // Let's create the list of messages to send to OpenAI
        const messages = this.chatHistory.map((message:any) => {
            return {
                role: message.role,
                content: message.content,
            }
        });

        // Send the messages to OpenAPI GPT 3.5-turbo model (i.e. ChatGPT)
        const chatCompletion = await this.openai.chat.completions.create({
            messages,
            model: 'gpt-3.5-turbo',
        });

        const response = chatCompletion.choices[0]?.message.content;
        if (response === null || response === undefined) {
            throw new Error("OpenAI returned no response: " + JSON.stringify(chatCompletion))
        }
        console.log("OpenAI response:", response);

        // Let's add the response to the chat history. The response will be sent back to OpenAPI on subsequent calls to triggerGpt()
        this.chatHistory.push({
            role: "assistant",
            content: response,
        });

        return response;
    }


    private async getChatPrompt(users: RemotePlayer[]): Promise<string> {
        return `You're a French-talking chat bot in a conversation with ${this.usersList(users)}.
You are engaged in a chat, please keep your answers short and to the point.

The chat is in French only. You have to answer in French language.

Because there are many people in this chat, when someone is talking to you, the message sent will be prefixed by the name of the person talking to you.
When you answer, do not put any prefix.

You start first. Please engage the conversation with a short welcome message.
`;
    }


    private usersList(users: RemotePlayer[]): string {
        return this.formatter.format(users.map(user => user.name));
    }
}
