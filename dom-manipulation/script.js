const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const showNewQuoteBtn = document.getElementById("newQuote-btn");
const quoteList = document.getElementById("quote-list");
const showModal = document.getElementById("quoteModal");
const closeModal = document.querySelector(".close-btn");
const modalQuoteText = document.getElementById("modalQuoteText");
const modalQuoteCategory = document.getElementById("modalQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");

function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.classList.add("addQuote-btn");
  addBtn.onclick = addQuote;

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addBtn);

  const container = document.getElementById("quoteDisplay");
  container.insertBefore(formDiv, document.getElementById("quote-list"));
}

let quotes = [
  {
    text: "Be yourself and do what you have to do, because no one cares.",
    category: "Motivation",
  },
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Realization",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
];

function populateCategories() {
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach((category) => {
    const filterOption = document.createElement("option");
    filterOption.value = category;
    filterOption.textContent = category;
    categoryFilter.appendChild(filterOption);
  });
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  quoteList.innerHTML = "";
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter((quote) => quote.category === selectedCategory);
  filteredQuotes.forEach(addQuoteToDom);
}

function addQuoteToDom(quoteObj) {
  const newQuote = document.createElement("li");
  const textNode = document.createTextNode(
    `"${quoteObj.text.toUpperCase()}" - ${quoteObj.category.toUpperCase()}`
  );
  newQuote.appendChild(textNode);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.classList.add("remove-btn");

  removeBtn.onclick = function () {
    quoteList.removeChild(newQuote);
    quotes = quotes.filter(
      (q) => !(q.text === quoteObj.text && q.category === quoteObj.category)
    );
    saveQuotes();
  };
  newQuote.appendChild(removeBtn);
  quoteList.prepend(newQuote);
}

function addQuote() {
  const quoteText = newQuoteText.value.trim();
  const quoteCategory = newQuoteCategory.value.trim();
  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter a quote.");
    return;
  }
  const quoteObj = { text: quoteText, category: quoteCategory };
  quotes.push(quoteObj);
  addQuoteToDom(quoteObj);
  populateCategories();
  saveQuotes();
  postQuoteToServer(quoteObj);
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

function showRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available");
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  modalQuoteText.innerHTML = `"${randomQuote.text}"`;
  modalQuoteCategory.innerHTML = `-${randomQuote.category}`;
  showModal.style.display = "block";
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
  quoteList.innerHTML = "";
  quotes.forEach(addQuoteToDom);
  populateCategories();
}

function exportToJsonFile() {
  if (quotes.length === 0) {
    alert("No quotes to export!");
    return;
  }
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const now = new Date();
  a.download = `quotes-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error();
      imported.forEach((q) => {
        if (typeof q.text !== "string" || typeof q.category !== "string")
          throw new Error();
      });
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      quoteList.innerHTML = "";
      quotes.forEach(addQuoteToDom);
      modalQuoteText.innerHTML = `Quotes imported successfully!`;
      showModal.style.display = "block";
    } catch {
      modalQuoteText.innerHTML = `Invalid JSON file format.`;
      showModal.style.display = `block`;
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const data = await response.json();
    return [
      {
        text: "The future depends on what you do today.",
        category: "Inspiration",
      },
      {
        text: "Success is not final, failure is not fatal.",
        category: "Motivation",
      },
    ];
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
    return [];
  }
}

async function postQuoteToServer(quoteObj) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteObj),
    });
    const data = await response.json();
    console.log("Posted to server:", data);
  } catch (error) {
    console.error("Failed to post to server:", error);
  }
}

function syncQuotes() {
  fetchQuotesFromServer().then((serverQuotes) => {
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const isConflict = JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes);
    if (isConflict) {
      quotes = serverQuotes;
      localStorage.setItem("quotes", JSON.stringify(serverQuotes));
      quoteList.innerHTML = "";
      quotes.forEach(addQuoteToDom);
      populateCategories();
      showNotification("Quotes synced with server!");
    }
  });
}

function showNotification(message) {
  let existing = document.getElementById("notification");
  if (!existing) {
    existing = document.createElement("div");
    existing.id = "notification";
    existing.style.cssText = "background:#ffd700;color:#333;padding:10px;text-align:center;margin-top:10px;";
    document.body.insertBefore(existing, document.body.firstChild);
  }
  existing.textContent = message;
  existing.style.display = "block";
  setTimeout(() => {
    existing.style.display = "none";
  }, 5000);
}

showNewQuoteBtn.addEventListener("click", showRandomQuote);
closeModal.onclick = () => (showModal.style.display = "none");
window.onclick = (event) => {
  if (event.target === showModal) showModal.style.display = "none";
};
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  setInterval(syncQuotes, 30000);
});