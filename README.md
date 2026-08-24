You're right. **Everything inside the block below is the README.** Copy from `# VoiceCart...` all the way down to `This project was developed...` — **nothing outside the block needs to be copied.**

````markdown
# VoiceCart — Voice Command Shopping Assistant

A voice-controlled shopping list with natural-language commands, smart suggestions, product categorization, and voice-activated search — built as a lightweight static web app using plain HTML, CSS, and JavaScript with no JavaScript/package dependencies or build step.

**Live Demo:** YOUR_DEPLOYED_URL

**GitHub Repository:** https://github.com/RishikaYadav18/voice-command-shopping-assistant

## Approach

VoiceCart is a static web app so it can be deployed without build tooling or a backend. Voice input uses the browser's native Web Speech API rather than a paid speech-to-text service. A small rule-based parser (`parseCommand`) matches intent phrases such as "add", "I need", "remove", and "find ... under ₹150", and extracts item, quantity, and price filters.

The core design decision is that add, search, and suggestion flows resolve against one shared product catalogue (`findCatalogMatch`). Matching prefers the most specific catalogue entry, keeping categorization and pricing consistent instead of relying on loose substring guesses. Once a list item is matched to the catalogue, it carries its corresponding price, allowing the application to display per-item costs and a running subtotal without separate pricing logic.

Suggestions combine three signals: recent shopping history, a small seasonal calendar, and a substitutes map. Suggested products are resolved through the same catalogue so their displayed prices remain consistent with the products that can be added to the list.

Application state persists per browser using `localStorage`.

## Features

### Voice Input

- Voice-controlled shopping-list actions using the Web Speech API.
- Live speech transcript with interim recognition feedback.
- Natural-language command variations such as:
  - "Add milk"
  - "I need apples"
  - "I want to buy bananas"
  - "Add 2 bottles of water"
  - "Remove milk"
- Visual listening and processing states.
- Basic browser and microphone error handling.

### Multilingual Voice Recognition

The language selector supports:

- English (India)
- Hindi
- English (US)
- English (UK)

The selected locale is applied to browser speech recognition.

### Smart Suggestions

Suggestions combine:

- Recent shopping history.
- Seasonal recommendations.
- Product substitutes.

Examples include suggesting almond milk as an alternative to regular milk.

Suggested products are resolved against the product catalogue and display their catalogue price.

### Shopping List Management

- Add items by voice or through the interface.
- Remove items by voice.
- Modify quantities.
- Specify quantities using natural-language commands.
- Automatic product categorization.
- Per-item pricing.
- Running subtotal.
- Item completion state.
- Clear-all functionality.
- Persistent browser state using `localStorage`.

### Voice-Activated Product Search

Products can be searched using voice or text.

Search supports:

- Product names.
- Brands.
- Categories.
- Maximum price filtering.

Example commands:

```text
Find organic apples
Find toothpaste under ₹150
Find snacks
````

Search results are displayed as product cards and can be added directly to the shopping list.

### UI/UX

* Minimalist responsive interface.
* Mobile-friendly layout.
* Category-based visual organization.
* Live speech transcript.
* "Listening..." and "Processing command..." states.
* Toast confirmations and error messages.
* Recent activity log.
* Empty-state guidance.
* Accessible labels for interactive controls.

## Not Implemented / Simplifications

The product catalogue and purchase history use local mock data rather than a live retailer API or server-side user account. This keeps the assessment version lightweight and avoids requiring paid infrastructure.

The NLP layer is rule-based using phrase and regular-expression matching rather than a trained language model. It is designed to handle the command patterns required by the assessment rather than act as a general-purpose NLP system.

There are no user accounts or cloud synchronization. Shopping-list state is stored per browser using `localStorage`.

Product prices and availability are demonstration data and do not represent real-time retailer inventory.

## Technology

* HTML5
* CSS3
* Vanilla JavaScript
* Web Speech API
* Browser `localStorage`
* Google Fonts

No framework, `package.json`, npm installation, or build process is required.

## Project Structure

```text
voicecart/
├── index.html
├── app.js
├── styles.css
├── README.md
└── .gitignore
```

* `index.html` — application markup and layout.
* `app.js` — product catalogue, command parsing, shopping-list state, speech recognition, search, suggestions, and UI logic.
* `styles.css` — application styling, responsive layouts, states, and component styling.
* `README.md` — project documentation.
* `.gitignore` — excludes unnecessary and sensitive local files.

## Running Locally

For reliable browser voice-recognition behavior, serve the application through a local HTTP server rather than opening the HTML directly using `file://`.

### Using VS Code Live Server

Open the project folder in VS Code and open `index.html` using Live Server.

The application will be available at a URL similar to:

```text
http://127.0.0.1:5500/index.html
```

### Using Python

From the project directory:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Google Chrome or Microsoft Edge is recommended for voice recognition. Grant microphone permission when prompted.

## Example Voice Commands

### Add

```text
Add milk
I need apples
I want to buy 3 bananas
Add 2 bottles of water
```

### Remove

```text
Remove milk
Remove milk from my list
```

### Search

```text
Find toothpaste under 150
Find organic apples
```

### Suggestions

```text
Show suggestions
```

### Clear List

```text
Clear my list
```

## Error Handling & UX States

The application provides feedback for common interaction and voice-recognition failures:

* Unsupported voice recognition → status feedback and unavailable microphone state.
* Microphone permission or recognition errors → explanatory toast messages.
* Unrecognized commands → prompt with an example command.
* Item not found during removal → notification identifying the missing item.
* Empty or invalid searches → appropriate search feedback.
* "Listening..." and "Processing command..." states provide visual feedback during voice interactions.

## Deployment

The application is deployed as a static website using GitHub Pages.

Because the project contains only client-side HTML, CSS, and JavaScript, no backend server or build process is required for deployment.

## Limitations

* Voice recognition accuracy depends on browser support, microphone quality, pronunciation, language, and background noise.
* Product prices and catalogue information are demonstration data.
* The application does not connect to real-time retailer inventory.
* Shopping-list data is stored locally in the browser.
* Clearing browser site data removes locally stored application state.
* The assessment version does not include payment or checkout functionality.

## Future Improvements

Potential extensions beyond the assessment scope include:

* Real-time retailer inventory and pricing.
* User accounts and cloud synchronization.
* More advanced multilingual NLP.
* Personalized recommendation models.
* Barcode scanning.
* Location-aware store recommendations.
* Online grocery checkout integration.

## License

This project was developed as a technical assessment project.

```
```
