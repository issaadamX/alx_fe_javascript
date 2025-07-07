const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

const quoteDisplay = document.getElementById('showRandomQuote');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');
const exportQuotesBtn = document.getElementById('exportQuotes');
const importQuotesBtn = document.getElementById('importQuotes');
const importFileInput = document.getElementById('importFile');

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    try {
      const parsedQuotes = JSON.parse(storedQuotes);
      if (Array.isArray(parsedQuotes)) {
        quotes.length = 0; // Clear current quotes
        quotes.push(...parsedQuotes);
      }
    } catch (e) {
      console.error('Failed to parse quotes from localStorage', e);
    }
  }
}

function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — Category: ${quote.category}`;
  // Save last displayed quote index in sessionStorage (optional)
  sessionStorage.setItem('lastQuoteIndex', randomIndex);
}

function createAddQuoteForm() {
  const form = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';
  form.appendChild(quoteInput);

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';
  form.appendChild(categoryInput);

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);
  form.appendChild(addButton);

  addQuoteFormContainer.appendChild(form);
}

function addQuote() {
  const quoteInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const newQuoteText = quoteInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newQuoteText || !newCategory) {
    alert('Please enter both a quote and a category.');
    return;
  }

  quotes.push({ text: newQuoteText, category: newCategory });
  saveQuotes();
  quoteInput.value = '';
  categoryInput.value = '';
  displayRandomQuote();
}

function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.length = 0;
        quotes.push(...importedQuotes);
        saveQuotes();
        displayRandomQuote();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format: Expected an array of quotes.');
      }
    } catch (err) {
      alert('Failed to parse JSON file.');
    }
  };
  reader.readAsText(file);
}

newQuoteBtn.addEventListener('click', displayRandomQuote);
exportQuotesBtn.addEventListener('click', exportQuotes);
importQuotesBtn.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', importFromJsonFile);

// Initialize
loadQuotes();
displayRandomQuote();
createAddQuoteForm();
