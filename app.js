const STORAGE_KEY = "voicecart-state-v2";

const catalog = [
  { id: 1, name: "Organic Apples", brand: "FreshFarm", category: "produce", price: 180, unit: "1 kg", tags: ["apple", "apples", "organic", "fruit"] },
  { id: 2, name: "Bananas", brand: "FreshFarm", category: "produce", price: 65, unit: "1 kg", tags: ["banana", "bananas", "fruit"] },
  { id: 3, name: "Oranges", brand: "FreshFarm", category: "produce", price: 90, unit: "1 kg", tags: ["orange", "oranges", "fruit"] },
  { id: 4, name: "Tomatoes", brand: "FreshFarm", category: "produce", price: 75, unit: "1 kg", tags: ["tomato", "tomatoes", "vegetable"] },
  { id: 5, name: "Mangoes", brand: "FreshFarm", category: "produce", price: 140, unit: "1 kg", tags: ["mango", "mangoes", "fruit"] },
  { id: 6, name: "Whole Milk", brand: "DailyChoice", category: "dairy", price: 72, unit: "1 litre", tags: ["milk", "dairy"] },
  { id: 7, name: "Almond Milk", brand: "NatureBest", category: "dairy", price: 190, unit: "1 litre", tags: ["almond milk", "plant milk"] },
  { id: 8, name: "Brown Bread", brand: "DailyChoice", category: "bakery", price: 55, unit: "400 g", tags: ["bread", "bakery"] },
  { id: 9, name: "Multigrain Bread", brand: "NatureBest", category: "bakery", price: 85, unit: "400 g", tags: ["multigrain bread", "multigrain"] },
  { id: 10, name: "Bottled Water", brand: "DailyChoice", category: "beverages", price: 40, unit: "1 litre", tags: ["water", "bottle"] },
  { id: 11, name: "Orange Juice", brand: "NatureBest", category: "beverages", price: 140, unit: "1 litre", tags: ["juice", "orange juice"] },
  { id: 12, name: "Toothpaste", brand: "CleanCo", category: "personal care", price: 115, unit: "150 g", tags: ["toothpaste", "oral care"] },
  { id: 13, name: "Herbal Toothpaste", brand: "CleanCo", category: "personal care", price: 135, unit: "150 g", tags: ["herbal toothpaste", "herbal"] },
  { id: 14, name: "Shampoo", brand: "CleanCo", category: "personal care", price: 230, unit: "340 ml", tags: ["shampoo", "hair"] },
  { id: 15, name: "Potato Chips", brand: "NutriBite", category: "snacks", price: 45, unit: "100 g", tags: ["chips", "snack"] },
  { id: 16, name: "Oats", brand: "NutriBite", category: "pantry", price: 160, unit: "500 g", tags: ["oats", "breakfast"] },
  { id: 17, name: "Dishwash Liquid", brand: "CleanCo", category: "household", price: 155, unit: "500 ml", tags: ["dishwash", "cleaning"] },
  { id: 18, name: "Almond Cookies", brand: "NutriBite", category: "snacks", price: 120, unit: "200 g", tags: ["almond cookies", "cookies"] }
];

const seasonalNames = { months: [3, 4, 5, 6], names: ["Mangoes", "Oranges", "Tomatoes"] };
const substituteMap = {
  milk: { name: "Almond Milk", reason: "a plant-based alternative to regular milk" },
  bread: { name: "Multigrain Bread", reason: "a higher-fibre alternative to standard bread" },
  toothpaste: { name: "Herbal Toothpaste", reason: "a herbal alternative in the same category" }
};
const commonStaples = ["Whole Milk", "Brown Bread", "Bananas", "Oats"];

let state = loadState();
let recognition = null;
let isListening = false;
let activeVoiceTarget = "command";

const $ = (id) => document.getElementById(id);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.items)) return saved;
  } catch (_) {}
  return { items: [], history: [], actions: [] };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalize(text) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s₹$.,-]/gu, " ").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch]));
}

function titleCase(value) {
  return value.replace(/\b\w/g, c => c.toUpperCase());
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function logAction(message) {
  state.actions.unshift({ message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
  state.actions = state.actions.slice(0, 8);
  saveState();
  renderActivity();
}

function setLoading(value) {
  $("loadingOverlay").hidden = !value;
}

function findCatalogMatch(name) {
  const text = normalize(name);
  const tokens = text.split(" ").filter(Boolean);
  if (!tokens.length) return null;

  const exact = catalog.find(p => normalize(p.name) === text);
  if (exact) return exact;

  let best = null;
  let bestScore = 0;
  for (const product of catalog) {
    for (const tag of product.tags) {
      const tagWords = tag.split(" ");
      const allPresent = tagWords.every(w => tokens.includes(w));
      if (allPresent && tagWords.length > bestScore) {
        bestScore = tagWords.length;
        best = product;
      }
    }
  }
  return best;
}

function categoryFor(name) {
  const match = findCatalogMatch(name);
  if (match) return match.category;
  const text = normalize(name);
  if (/\b(milk|cheese|yogurt|butter)\b/.test(text)) return "dairy";
  if (/\b(apple|banana|orange|mango|tomato|potato|onion|carrot)\b/.test(text)) return "produce";
  if (/\b(bread|bun|croissant)\b/.test(text)) return "bakery";
  if (/\b(water|juice|cola|drink)\b/.test(text)) return "beverages";
  if (/\b(chip|cookie|snack)\b/.test(text)) return "snacks";
  if (/\b(soap|shampoo|toothpaste)\b/.test(text)) return "personal care";
  return "other";
}

function parseQuantity(text) {
  const match = text.match(/\b(\d+(?:\.\d+)?)\b/);
  return match ? Number(match[1]) : 1;
}

function cleanItemName(text) {
  let s = normalize(text);
  s = s.replace(/\b(i|add|buy|get|need|want|please|put|include|order|purchase|to|from|my|list|on|the|of|some|a|an)\b/g, " ");
  s = s.replace(/\b\d+(?:\.\d+)?\b/g, " ");
  s = s.replace(/\b(bottles?|packs?|packets?|kgs?|litres?|liters?|grams?|ml|units?)\b/g, " ");
  return s.replace(/\s+/g, " ").trim();
}

function inferUnit(name) {
  const n = normalize(name);
  if (/(water|juice|milk)/.test(n)) return "bottle";
  if (/(apple|banana|orange|mango|tomato)/.test(n)) return "unit";
  return "unit";
}

// Resolves a spoken/typed name to an existing list item, preferring a
// catalog-id match (robust across "milk" vs the canonical "Whole Milk")
// and falling back to substring matching for custom items.
function resolveListItem(name) {
  const cleaned = cleanItemName(name);
  const product = findCatalogMatch(cleaned);
  if (product) {
    const byId = state.items.find(i => i.catalogId === product.id);
    if (byId) return byId;
  }
  const target = normalize(cleaned);
  if (!target) return null;
  return state.items.find(i => normalize(i.name).includes(target) || target.includes(normalize(i.name)));
}

function addItem(rawName, quantity = 1, explicitUnit = "") {
  const clean = cleanItemName(rawName) || rawName.trim();
  if (!clean) return false;

  const product = findCatalogMatch(clean);
  const canonicalName = product ? product.name : titleCase(clean);
  const category = product ? product.category : categoryFor(clean);
  const unit = explicitUnit || (product ? product.unit : inferUnit(clean));
  const price = product ? product.price : null;
  const brand = product ? product.brand : null;
  const catalogId = product ? product.id : null;

  const existing = catalogId
    ? state.items.find(i => i.catalogId === catalogId)
    : state.items.find(i => !i.catalogId && normalize(i.name) === normalize(canonicalName));

  if (existing) {
    existing.quantity += quantity;
    showToast(`${existing.name} quantity updated to ${existing.quantity}`);
    logAction(`Updated ${existing.name} → ${existing.quantity}`);
  } else {
    state.items.push({
      id: Date.now() + Math.random(),
      catalogId,
      name: canonicalName,
      brand,
      quantity,
      unit,
      price,
      category,
      done: false
    });
    state.history.push(normalize(clean));
    state.history = state.history.slice(-30);
    showToast(`Added ${canonicalName}`);
    logAction(`Added ${canonicalName} × ${quantity}`);
  }
  saveState();
  renderAll();
  return true;
}

function removeItem(name) {
  const item = resolveListItem(name);
  if (!item) {
    showToast(`Couldn't find "${cleanItemName(name) || name}" on your list`);
    return false;
  }
  state.items = state.items.filter(i => i.id !== item.id);
  showToast(`Removed ${item.name}`);
  logAction(`Removed ${item.name}`);
  saveState();
  renderAll();
  return true;
}

function modifyQuantity(name, quantity) {
  const item = resolveListItem(name);
  if (!item) return addItem(cleanItemName(name), quantity);
  item.quantity = quantity;
  item.done = false;
  showToast(`${item.name} set to ${quantity}`);
  logAction(`Changed ${item.name} quantity to ${quantity}`);
  saveState();
  renderAll();
  return true;
}

function renderList() {
  const container = $("listContainer");
  $("itemCount").textContent = state.items.length;
  $("emptyState").style.display = state.items.length ? "none" : "block";

  const subtotal = state.items.reduce((sum, i) => sum + (i.price != null ? i.price * i.quantity : 0), 0);
  $("listSubtotal").textContent = subtotal > 0 ? `₹${subtotal.toFixed(0)} subtotal` : "";

  container.innerHTML = state.items.map(item => `
    <div class="list-item ${item.done ? "done" : ""}">
      <button class="check ${item.done ? "checked" : ""}" data-action="toggle" data-id="${item.id}" aria-label="Mark ${escapeHtml(item.name)} ${item.done ? "not done" : "done"}">${item.done ? "✓" : ""}</button>
      <div class="item-main">
        <div class="item-top">
          <span class="item-name">${escapeHtml(item.name)}</span>
          <span class="item-price">${item.price != null ? "₹" + (item.price * item.quantity).toFixed(0) : "—"}</span>
        </div>
        <div class="item-meta">
          ${item.quantity} × ${escapeHtml(item.unit)}
          <span class="dot cat-${escapeHtml(slug(item.category))}"></span>${escapeHtml(item.category)}
          ${item.price != null ? `· ₹${item.price} each` : ""}
        </div>
      </div>
      <div class="item-actions">
        <button class="mini-button" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
        <button class="mini-button" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">＋</button>
        <button class="mini-button danger" data-action="remove" data-id="${item.id}" aria-label="Remove item">✕</button>
      </div>
    </div>
  `).join("");
}

function slug(category) {
  return (category || "other").replace(/\s+/g, "-");
}

function renderActivity() {
  const log = $("activityLog");
  if (!state.actions.length) {
    log.innerHTML = `<div class="muted">No actions yet.</div>`;
    return;
  }
  log.innerHTML = state.actions.map(a => `
    <div class="activity-entry">
      <span>${escapeHtml(a.message)}</span>
      <span class="activity-time">${escapeHtml(a.time)}</span>
    </div>
  `).join("");
}

function buildSuggestions() {
  const listNames = state.items.map(i => normalize(i.name));
  const history = state.history || [];
  const suggestions = [];
  const already = (name) => listNames.some(n => n.includes(normalize(name)) || normalize(name).includes(n));

  history.slice().reverse().forEach(h => {
    const product = findCatalogMatch(h);
    if (product && !already(product.name) && !suggestions.some(s => s.name === product.name)) {
      suggestions.push({ ...product, reason: "Based on your recent shopping activity." });
    }
  });

  commonStaples.forEach(n => {
    const product = catalog.find(p => p.name === n);
    if (product && !already(product.name) && !suggestions.some(s => s.name === product.name)) {
      suggestions.push({ ...product, reason: "A common everyday staple." });
    }
  });

  const month = new Date().getMonth() + 1;
  if (seasonalNames.months.includes(month)) {
    seasonalNames.names.forEach(n => {
      const product = catalog.find(p => p.name === n);
      if (product && !already(product.name) && !suggestions.some(s => s.name === product.name)) {
        suggestions.push({ ...product, reason: "In season right now." });
      }
    });
  }

  Object.keys(substituteMap).forEach(key => {
    if (listNames.some(n => n.includes(key))) {
      const sub = substituteMap[key];
      const product = catalog.find(p => p.name === sub.name);
      if (product && !already(product.name) && !suggestions.some(s => s.name === product.name)) {
        suggestions.push({ ...product, reason: `Substitute idea: ${sub.reason}.` });
      }
    }
  });

  return suggestions.slice(0, 6);
}

function renderSuggestions() {
  const suggestions = buildSuggestions();
  $("suggestions").innerHTML = suggestions.length ? suggestions.map(s => `
    <div class="suggestion-card">
      <div class="suggestion-top">
        <strong>${escapeHtml(s.name)}</strong>
        <span class="price">₹${s.price}</span>
      </div>
      <div class="reason">${escapeHtml(s.reason || "Suggested for you.")}</div>
      <button class="secondary-button" data-suggestion="${escapeHtml(s.name)}">+ Add to list</button>
    </div>
  `).join("") : `<div class="muted">Add a few products to start getting personalized suggestions.</div>`;
}

function renderAll() {
  renderList();
  renderSuggestions();
  renderActivity();
}

function searchProducts() {
  const q = normalize($("searchInput").value);
  const qTokens = q.split(" ").filter(Boolean);
  const brand = $("brandFilter").value.toLowerCase();
  const category = $("categoryFilter").value.toLowerCase();
  const maxPrice = Number($("maxPrice").value) || Infinity;

  const results = catalog.filter(p => {
    const haystackTokens = normalize(`${p.name} ${p.brand} ${p.category} ${p.tags.join(" ")}`).split(" ");
    const matchesQuery = !q || qTokens.every(t => haystackTokens.some(h => h.includes(t) || t.includes(h)));
    return matchesQuery
      && (!brand || p.brand.toLowerCase() === brand)
      && (!category || p.category.toLowerCase() === category)
      && p.price <= maxPrice;
  });

  $("searchResults").innerHTML = results.length ? results.map(p => `
    <div class="product-tile">
      <div class="product-top">
        <span class="dot cat-${slug(p.category)}"></span>
        <span class="product-category">${escapeHtml(p.category)}</span>
      </div>
      <div class="product-name">${escapeHtml(p.name)}</div>
      <div class="product-meta">${escapeHtml(p.brand)} · ${escapeHtml(p.unit)}</div>
      <div class="product-bottom">
        <span class="price">₹${p.price}</span>
        <button class="secondary-button" data-product="${p.id}">+ Add</button>
      </div>
    </div>
  `).join("") : `<div class="search-placeholder">No products match those filters. Try a different search or widen the price range.</div>`;

  $("searchStatus").textContent = `${results.length} result${results.length === 1 ? "" : "s"}`;
}

function parseCommand(raw) {
  const text = normalize(raw);
  if (!text) return { type: "unknown" };

  if (/\b(clear|empty)\b.*\b(list|shopping)\b/.test(text)) return { type: "clear" };

  if (/\b(show|give|display|what are)\b.*\b(suggestion|recommendation|recommend|ideas)\b/.test(text)) {
    return { type: "suggestions" };
  }

  const removeMatch = text.match(/\b(remove|delete|drop|take off)\b(.+)/);
  if (removeMatch) return { type: "remove", name: cleanItemName(removeMatch[2]) };

  const quantityMatch = text.match(/\b(change|set|update)\b.*?\b(\d+(?:\.\d+)?)\b.*?\b(?:for|of)\b(.+)/);
  if (quantityMatch) return { type: "modify", name: cleanItemName(quantityMatch[3]), quantity: Number(quantityMatch[2]) };

  const searchIntent = /\b(find|search|look for|show me|where can i find)\b/.test(text);
  if (searchIntent) return { type: "search", query: raw };

  const addIntent = /\b(add|buy|get|need|want|purchase|put|include|order|pick up)\b/.test(text);
  if (addIntent) {
    const quantity = parseQuantity(text);
    return { type: "add", name: cleanItemName(text), quantity };
  }

  return { type: "search", query: raw };
}

function executeCommand(raw) {
  $("transcript").innerHTML = `<strong>You said:</strong> ${escapeHtml(raw)}`;
  const command = parseCommand(raw);
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
    switch (command.type) {
      case "add":
        if (command.name) addItem(command.name, command.quantity);
        else showToast("Please tell me what you'd like to add.");
        break;
      case "remove":
        removeItem(command.name);
        break;
      case "modify":
        modifyQuantity(command.name, command.quantity);
        break;
      case "clear":
        state.items = [];
        saveState();
        renderAll();
        showToast("Shopping list cleared");
        logAction("Cleared the shopping list");
        break;
      case "suggestions":
        $("suggestions").scrollIntoView({ behavior: "smooth", block: "center" });
        showToast("Here are your smart suggestions");
        break;
      case "search":
        $("searchInput").value = command.query.replace(/^(find|search|look for|show me)\s+/i, "");
        searchProducts();
        $("searchResults").scrollIntoView({ behavior: "smooth", block: "center" });
        logAction(`Searched for "${command.query}"`);
        break;
      default:
        showToast("I didn't understand that. Try “add milk” or “find toothpaste under ₹150”.");
    }
  }, 280);
}


function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    $("voiceSupport").textContent = "Voice unavailable in this browser";
    $("micButton").disabled = true;
    $("micButton").title = "Use Chrome or another browser supporting Web Speech API";
    return;
  }

  $("voiceSupport").textContent = "Voice ready";
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    $("micButton").classList.add("listening");
    $("micLabel").textContent = activeVoiceTarget === "search" ? "Listening for search…" : "Listening…";
  };

  recognition.onresult = event => {
    let finalText = "";
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += text;
      else interimText += text;
    }
    if (interimText) $("transcript").innerHTML = `<span class="muted">Hearing:</span> ${escapeHtml(interimText)}`;
    if (finalText) {
      if (activeVoiceTarget === "search") {
        $("searchInput").value = finalText.trim();
        searchProducts();
        $("searchStatus").textContent = "Voice search complete";
        logAction(`Voice search: "${finalText.trim()}"`);
      } else {
        executeCommand(finalText.trim());
      }
    }
  };

  recognition.onerror = event => {
    if (event.error === "not-allowed") showToast("Microphone permission was denied.");
    else if (event.error !== "aborted") showToast(`Voice error: ${event.error}`);
  };

  recognition.onend = () => {
    isListening = false;
    $("micButton").classList.remove("listening");
    $("micLabel").textContent = "Tap to speak";
  };
}

function startVoice(target = "command") {
  if (!recognition) {
    showToast("Voice recognition is not supported here. Try Chrome on desktop or Android.");
    return;
  }
  activeVoiceTarget = target;
  recognition.lang = $("languageSelect").value;
  try { recognition.start(); } catch (_) {}
}

$("micButton").addEventListener("click", () => startVoice("command"));
$("searchVoiceButton").addEventListener("click", () => startVoice("search"));

document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => executeCommand(btn.dataset.command));
});

$("searchButton").addEventListener("click", searchProducts);
$("searchInput").addEventListener("keydown", e => { if (e.key === "Enter") searchProducts(); });
["brandFilter", "maxPrice", "categoryFilter"].forEach(id => $(id).addEventListener("change", searchProducts));

$("clearList").addEventListener("click", () => {
  if (!state.items.length) return showToast("Your list is already empty.");
  state.items = [];
  saveState();
  renderAll();
  showToast("Shopping list cleared");
  logAction("Cleared the shopping list");
});

$("refreshSuggestions").addEventListener("click", () => {
  renderSuggestions();
  showToast("Suggestions refreshed");
});

$("listContainer").addEventListener("click", e => {
  const button = e.target.closest("[data-action]");
  if (!button) return;
  const item = state.items.find(i => String(i.id) === button.dataset.id);
  if (!item) return;
  if (button.dataset.action === "toggle") item.done = !item.done;
  if (button.dataset.action === "increase") item.quantity += 1;
  if (button.dataset.action === "decrease") item.quantity = Math.max(1, item.quantity - 1);
  if (button.dataset.action === "remove") {
    state.items = state.items.filter(i => i.id !== item.id);
    logAction(`Removed ${item.name}`);
  }
  saveState();
  renderAll();
});

$("suggestions").addEventListener("click", e => {
  const btn = e.target.closest("[data-suggestion]");
  if (!btn) return;
  addItem(btn.dataset.suggestion, 1);
});

$("searchResults").addEventListener("click", e => {
  const btn = e.target.closest("[data-product]");
  if (!btn) return;
  const product = catalog.find(p => String(p.id) === btn.dataset.product);
  if (product) addItem(product.name, 1, product.unit);
});

window.addEventListener("load", () => {
  setupSpeechRecognition();
  renderAll();
  searchProducts();
});
