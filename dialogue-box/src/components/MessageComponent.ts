export interface MessageProps {
  message: string;
  hasContent: boolean;
}

const BTN_LABEL = {
  MORE_TEXT: 'Next',
  NO_MORE_TEXT: 'Close',
  NO_MORE_TEXT_BUT_CONTENT: 'VOIR',
}
const MAX_CHAR = 240;

export class MessageComponent implements MessageProps {
  message: string;
  hasContent: boolean;

  private messageContainer: HTMLDivElement;
  private messageElement: HTMLParagraphElement;
  private paginationElement: HTMLSpanElement;
  private buttonElement: HTMLButtonElement;
  private currentPageIndex: number;
  private numberOfPages: number;
  private pages: string[];

  constructor(message: string = 'No message has been defined.', hasContent: boolean = false) {
    this.message = message;
    this.hasContent = hasContent;

    this.messageContainer = document.createElement('div');
    this.messageContainer.className = 'message-container';

    this.messageElement = document.createElement('p');
    this.paginationElement = document.createElement('span');
    this.buttonElement = document.createElement('button');
    this.currentPageIndex = 0;
    this.numberOfPages = 0;
    this.pages = this.paginateMessage();

    this.setupDOM();
  }

  private setupDOM(): void {
    let paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    paginationContainer.appendChild(this.paginationElement);
    paginationContainer.appendChild(this.buttonElement);

    this.messageContainer.appendChild(this.messageElement);
    this.messageContainer.appendChild(paginationContainer);

    this.buttonElement.addEventListener('click', () => {
      this.updateUI();
    });

    this.updateUI();
  }

  render(): HTMLElement {
    return this.messageContainer;
  }

  private paginateMessage(): string[] {
    // Extract sentences patterns from the message using a regular expression
    const sentences = this.message.match(/\b.*?[.!?](?=\s|$)/g) || [];
    const result: string[] = [];

    // Initialize variables to keep track of the current page content and page count
    let currentPageContent = sentences.shift() || ''; // Start with the first sentence
    let pagesCount = 1;

    // Iterate through the remaining sentences
    while (sentences.length > 0) {
      const currentSentence = sentences.shift() || '';

      if (currentPageContent.length + currentSentence.length + 1 <= MAX_CHAR) {
        // If the current sentence fits within the character limit, add it to the current page
        currentPageContent = currentPageContent + ' ' + currentSentence;
      } else {
        // If the sentence doesn't fit in one page, use word-based pagination for that sentence only
        if (currentPageContent.length > MAX_CHAR) {
          const words = currentPageContent.split(' ');
          currentPageContent = words.shift() || '';

          while (words.length > 0) {
            const currentWord = words.shift() || '';

            if (currentPageContent.length + currentWord.length + 1 <= MAX_CHAR) {
              // If the current word fits within the character limit, add it to the current page
              currentPageContent = currentPageContent + ' ' + currentWord;
            } else {
              // If the word exceeds the character limit, start a new page
              pagesCount++;
              result.push(currentPageContent);
              currentPageContent = currentWord;
            }
          }
        } else {
          // If the sentence doesn't fit in the current page but can fit in one page, save the current page and start a new page
          pagesCount++;
          result.push(currentPageContent);
          currentPageContent = currentSentence;
        }
      }
    }

    // Add the last page or the last part of the sentence
    result.push(currentPageContent);

    // Update the total number of pages
    this.numberOfPages = pagesCount;

    return result;
  }

  private updateUI(): void {
    const currentPage = this.currentPageIndex + 1
    this.messageElement.textContent = this.pages[this.currentPageIndex];

    // Don't show pagination if there is only one page
    if (this.numberOfPages > 1) {
      this.paginationElement.textContent = currentPage + "/" + this.numberOfPages;
    }

    if (currentPage === this.numberOfPages) {
      // Display last page
      this.buttonElement.className = 'close';
      this.buttonElement.textContent = this.hasContent ? BTN_LABEL.NO_MORE_TEXT_BUT_CONTENT : BTN_LABEL.NO_MORE_TEXT;

      // Prepare the final button to close the UI
      this.buttonElement.addEventListener('click', () => {
        const closeEvent = new CustomEvent('destroy');
        document.dispatchEvent(closeEvent);
      });
    } else {
      // More pages to display
      this.buttonElement.className = 'next';
      this.currentPageIndex++
      this.buttonElement.textContent = BTN_LABEL.MORE_TEXT;
    }
  }

}