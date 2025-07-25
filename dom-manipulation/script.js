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
const categoryFilter = document.getElementById('categoryFilter');

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

function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  // Restore last selected category from localStorage
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory && categories.has(savedCategory)) {
    categoryFilter.value = savedCategory;
  } else {
    categoryFilter.value = 'all';
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  if (selectedCategory === 'all') {
    displayRandomQuote();
  } else {
    const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available for this category.";
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" — Category: ${quote.category}`;
    // Save last displayed quote index in sessionStorage (optional)
    sessionStorage.setItem('lastQuoteIndex', randomIndex);
  }
}

function displayRandomQuote() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory && selectedCategory !== 'all') {
    filterQuotes();
    return;
  }
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
  populateCategories();
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
        populateCategories();
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

// New implementation to fully meet task requirements

const SYNC_INTERVAL_MS = 30000; // 30 seconds sync interval
const syncNotification = document.getElementById('syncNotification');
const syncMessage = document.getElementById('syncMessage');
const manualSyncBtn = document.getElementById('manualSyncBtn');

const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Using JSONPlaceholder for simulation

// Fetch quotes from mock API (simulate server fetch)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(MOCK_API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // Map data to quote format (simulate)
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: 'Server'
    }));
    return serverQuotes;
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    throw error;
  }
}

// Post local quotes to mock API (simulate server update)
async function postQuotesToServer(quotesToPost) {
  try {
    const response = await fetch(MOCK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotesToPost)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting quotes to server:', error);
    throw error;
  }
}

function quotesAreEqual(q1, q2) {
  return q1.text === q2.text && q1.category === q2.category;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (!quotesAreEqual(arr1[i], arr2[i])) return false;
  }
  return true;
}

// Sync function to fetch from server, resolve conflicts, update local storage, and post local changes
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    if (!arraysEqual(serverQuotes, quotes)) {
      // Conflict or update detected, resolve by favoring server data
      quotes.length = 0;
      quotes.push(...serverQuotes);
      saveQuotes();
      populateCategories();
      displayRandomQuote();
      showSyncNotification('Quotes updated from server. Conflicts resolved in favor of server data.');
      // Optionally post local changes back to server (simulate)
      await postQuotesToServer(quotes);
    } else {
      showSyncNotification('Quotes synced with server!');
    }
  } catch (error) {
    showSyncNotification('Failed to sync with server.');
  }
}

function showSyncNotification(message) {
  syncMessage.textContent = message;
  syncNotification.style.display = 'block';
  // Hide notification after 5 seconds
  setTimeout(() => {
    syncNotification.style.display = 'none';
  }, 5000);
}

manualSyncBtn.addEventListener('click', () => {
  showSyncNotification('Manual sync started...');
  syncQuotes();
});

// Initialize
loadQuotes();
populateCategories();
displayRandomQuote();
createAddQuoteForm();

// Start periodic sync
setInterval(syncQuotes, SYNC_INTERVAL_MS);

// Initial sync on load
syncQuotes();
