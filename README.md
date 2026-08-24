# VoiceCart — Voice Command Shopping Assistant

VoiceCart is a voice-based shopping assistant that allows users to manage their shopping list using natural-language voice commands, receive smart product suggestions, and search for products using voice or text.

## Live Demo

**Live Application:**  
https://YOUR_USERNAME.github.io/voice-command-shopping-assistant/

**GitHub Repository:**  
https://github.com/YOUR_USERNAME/voice-command-shopping-assistant

> Replace `YOUR_USERNAME` with your GitHub username after deployment.

---

## Features

### 1. Voice Input

- Add shopping items using natural voice commands.
- Remove items using voice commands.
- Modify item quantities using voice commands.
- Supports multiple voice languages/locales:
  - English (India)
  - Hindi
  - English (US)
  - English (UK)
- Displays the recognized speech in real time.
- Provides visual feedback while voice recognition is active.
- Includes basic voice-support detection and error handling.

### 2. Natural Language Commands

The application accepts natural variations of shopping commands rather than requiring a fixed command format.

Examples:

```text
Add milk
I need apples
Add 2 bottles of water
Buy 5 oranges
Remove milk
Find organic apples
Find toothpaste under ₹300
Show suggestions
````

The recognized command is processed on the client side and mapped to the appropriate shopping-list or search action.

### 3. Shopping List Management

* Add items to the shopping list.
* Remove items from the list.
* Modify item quantities.
* Increase or decrease quantities using list controls.
* Mark items as completed.
* Automatically categorize products.
* Display the total number of items.
* Calculate the shopping-list subtotal.
* Clear the complete shopping list.
* Persist shopping-list data using browser `localStorage`.

### 4. Smart Suggestions

The application provides shopping suggestions based on:

* Previous shopping activity/history.
* Product preferences.
* Seasonal recommendations.
* Product substitutes and alternatives.

Suggestions can be refreshed directly from the interface.

### 5. Voice-Activated Product Search

Users can search for products using either voice commands or text.

Search supports:

* Product names.
* Brands.
* Categories.
* Maximum price filtering.
* Product details.
* Product prices.
* Adding search results directly to the shopping list.

Example:

```text
Find organic apples
Find toothpaste under ₹300
Find NutriBite snacks
```

### 6. Product Filtering

Products can be filtered by:

* Brand
* Maximum price
* Category

Available categories include:

```text
Produce
Dairy
Beverages
Snacks
Bakery
Household
Personal Care
Pantry
```

### 7. User Interface

The application provides a minimalist and responsive interface designed for both desktop and mobile use.

UI features include:

* Voice interaction interface.
* Live speech transcript.
* Visual microphone feedback.
* Shopping-list display.
* Smart suggestion cards.
* Product search interface.
* Loading/processing state.
* Toast notifications.
* Recent activity log.
* Responsive mobile layout.
* Accessible labels and controls.

---

## Technology Stack

The project intentionally uses a lightweight client-side architecture.

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Browser APIs

* Web Speech API for voice recognition.
* `localStorage` for persistent shopping-list and shopping-history data.

### External Resources

* Google Fonts for typography.

No frontend framework or package manager is required.

---

## Architecture

The application is implemented as a static client-side web application.

```text
User
 │
 ├── Voice Command
 │       │
 │       ▼
 │   Web Speech API
 │       │
 │       ▼
 │  Command Processing
 │       │
 │       ├── Add / Remove / Modify
 │       │
 │       ├── Product Search
 │       │
 │       └── Suggestions
 │
 └── Text / UI Interaction
         │
         ▼
     Application Logic
         │
         ├── Shopping List
         ├── Product Catalogue
         ├── Recommendations
         └── Activity History
                 │
                 ▼
             localStorage
```

Voice recognition is handled directly by the browser using the Web Speech API. Recognized speech is processed by the application and mapped to shopping-list actions, product searches, or suggestion requests.

Shopping-list information and relevant user activity are persisted locally using browser `localStorage`, allowing the list to remain available after refreshing the page.

---

## Running Locally

### Requirements

* Google Chrome or another browser with Web Speech API support.
* Python 3 or VS Code with the Live Server extension.

No `npm install` or dependency installation is required.

### Option 1 — VS Code Live Server

Open the project folder in VS Code.

Open `index.html` using Live Server.

The application will be available at a URL similar to:

```text
http://127.0.0.1:5500/index.html
```

### Option 2 — Python HTTP Server

Open Terminal in the project directory and run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Chrome is recommended for testing voice recognition.

---

## Example Voice Commands

### Add items

```text
Add milk
Add apples
Add 2 bottles of water
Buy 5 oranges
I need bread
```

### Remove items

```text
Remove milk
Remove apples from my list
Delete bread
```

### Modify quantities

```text
Change quantity to 3 for oranges
Add 2 more bottles of water
```

### Search

```text
Find organic apples
Find toothpaste under ₹300
Find snacks
Find FreshFarm products
```

### Suggestions

```text
Show suggestions
Give me recommendations
What should I buy?
```

---

## Data and Product Catalogue

The application uses a local product catalogue for the assessment demonstration.

Product information such as:

* Product name
* Brand
* Category
* Price
* Product attributes
* Substitutes

is represented locally in the application.

The catalogue is intended for demonstration purposes and does not represent real-time retailer inventory.

---

## Limitations

* Voice recognition depends on browser support for the Web Speech API.
* Microphone permission is required for voice commands.
* Voice recognition accuracy can vary depending on browser, microphone quality, pronunciation, language, and background noise.
* Product prices and availability are demonstration data.
* The application does not connect to a real-time retailer inventory system.
* The assessment version does not include payment or checkout functionality.
* Shopping-list data is stored locally in the browser rather than in a server-side database.
* Clearing browser site data will remove locally stored shopping-list information.

---

## Deployment

The application is deployed as a static website using **GitHub Pages**.

The project does not require a backend server or paid cloud service for the assessment version.

---

## Project Structure

```text
voice-command-shopping-assistant/
│
├── index.html
├── app.js
├── styles.css
├── README.md
└── .gitignore
```

### `index.html`

Contains the application structure and user interface.

### `app.js`

Contains:

* Voice recognition
* Natural-language command processing
* Shopping-list management
* Product search
* Filtering
* Smart suggestions
* Product substitutions
* Local storage
* Activity tracking
* UI interactions

### `styles.css`

Contains:

* Application styling
* Responsive layouts
* Voice interaction states
* Shopping-list styling
* Search and filter styling
* Suggestion cards
* Mobile responsiveness
* Accessibility-related styling

---

## Design Approach

The application was designed with the assessment's limited time and dependency requirements in mind.

Instead of introducing a large frontend framework or backend infrastructure, the project uses vanilla JavaScript and browser APIs. This keeps the application lightweight, easy to run, easy to review, and simple to deploy.

The main focus was placed on demonstrating the complete user flow:

```text
Voice Input
     ↓
Command Understanding
     ↓
Shopping/Search Action
     ↓
Visual Feedback
     ↓
Persistent User Data
```

This approach also avoids exposing API keys or requiring paid external services.

---

## Error Handling and User Feedback

The application provides feedback for important user interactions, including:

* Unsupported voice recognition.
* Microphone permission issues.
* Unrecognized commands.
* Empty searches.
* Invalid quantities.
* Search results.
* Successful shopping-list actions.
* Loading/processing states.

Visual feedback is provided through the microphone state, transcript area, loading overlay, status indicators, activity log, and toast notifications.

---

## Assessment Requirements Coverage

| Requirement                 | Implementation                                 |
| --------------------------- | ---------------------------------------------- |
| Voice command recognition   | Web Speech API                                 |
| Natural language processing | Client-side command parsing                    |
| Multilingual support        | Multiple speech recognition locales            |
| Add/remove items            | Voice and UI controls                          |
| Quantity management         | Voice commands and UI controls                 |
| Automatic categorization    | Product/category mapping                       |
| Shopping history            | Browser localStorage                           |
| Product recommendations     | Local recommendation logic                     |
| Seasonal recommendations    | Seasonal suggestion logic                      |
| Product substitutes         | Alternative product suggestions                |
| Voice product search        | Web Speech API + search processing             |
| Price filtering             | Maximum-price filter                           |
| Brand filtering             | Brand filter                                   |
| Responsive UI               | CSS responsive layouts                         |
| Visual feedback             | Transcript, status, loading and toast feedback |
| Error handling              | Client-side validation and status handling     |
| Persistent data             | Browser localStorage                           |
| Hosting                     | GitHub Pages                                   |

---

## Future Improvements

If this application were extended beyond the assessment scope, potential improvements would include:

* Integration with a real supermarket/product API.
* Real-time inventory and price information.
* User authentication and cloud synchronization.
* Personalized recommendation models.
* More advanced multilingual NLP.
* Barcode scanning.
* Location-aware store recommendations.
* Real-time sale and availability detection.
* Server-side data storage.
* Integration with online grocery checkout systems.

---

## License

This project was developed as a technical assessment project.

````

### Before you save it

There are **two placeholders** you should change after creating your GitHub repository:

```text
YOUR_USERNAME
````