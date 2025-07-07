const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

const quoteDisplay = document.getElementById('showRandomQuote');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');

function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — Category: ${quote.category}`;
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
  quoteInput.value = '';
  categoryInput.value = '';
  displayRandomQuote();
}

newQuoteBtn.addEventListener('click', displayRandomQuote);

// Initialize
displayRandomQuote();
createAddQuoteForm();
