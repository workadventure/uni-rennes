import { DialogueBoxComponent } from './components/DialogueBoxComponent';
import { DialogueInterface, dialogues } from '../../src/dialogues';

console.info('"Dialogue Box" script started successfully')

let currentNPC: DialogueInterface|undefined

async function process() {
  const url = new URL(window.location.toString())
  const npcId = url.searchParams.get("id")

  currentNPC = dialogues.find(c => c.id === npcId)

  if (currentNPC && currentNPC.message) {

    const dialogueBoxComponent = new DialogueBoxComponent(currentNPC);

    if (appElement) {
      appElement.appendChild(dialogueBoxComponent.render());
    } else {
      console.error("Element with ID 'app' not found.");
    }
  } else {
    console.error("Undefined NPC data");
  }
}

const appElement = document.getElementById('app');

// Why this weird syntax ?
// Flexibility: Works well whether the script is in the `<head>` or `<body>`.
// Efficiency: Avoids setting up unnecessary event listeners if the DOM is already loaded.
// Robustness: Handles both scenarios (loading or loaded) to prevent race conditions.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", process)
} else {
  process()
}
