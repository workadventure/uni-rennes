export interface AvatarProps {
    name: string;
    image: string;
}

export class AvatarComponent implements AvatarProps {
    name: string;
    image: string;

    private avatarContainer: HTMLDivElement;

    constructor(name: string = 'Unknown', image: string = '/dialogue-box/unknown.webp') {
        this.name = name;
        this.image = image;

        this.avatarContainer = document.createElement('div');
        this.avatarContainer.className = 'avatar-container';

        this.setupDOM();
    }

    private setupDOM(): void {
        let imageContainer = document.createElement('div');
        imageContainer.className = 'avatar';

        let avatarImage = document.createElement('img');
        avatarImage.src = this.image;
        imageContainer.appendChild(avatarImage);
        this.avatarContainer.appendChild(imageContainer);

        let avatarName = document.createElement('span');
        avatarName.textContent = this.name;
        this.avatarContainer.appendChild(avatarName);
    }

    render(): HTMLElement {
        return this.avatarContainer;
    }
}
