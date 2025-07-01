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

  // Quote text input
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  // Category input
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  // Add button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.classList.add("addQuote-btn");
  addBtn.onclick = addQuote;

  // Append to form
  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addBtn);

  // Add to page (before quote list)
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

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Get unique categories from quotes array
  const categories = [...new Set(quotes.map(q => q.category))];

  // Add each category as an option
  categories.forEach((category) => {
    const filterOption = document.createElement("option");
    filterOption.value = category;
    filterOption.textContent = category;
    categoryFilter.appendChild(filterOption);
  });

}

function filterQuotes() {
  quoteList.innerHTML = "";

  const filteredQuotes =
    categoryFilter.value === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === categoryFilter);

      filteredQuotes.forEach(addQuoteToDom)
}
localStorage.setItem("categoryFilter", categoryFilter)

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
      (q) =>
        !(q.text === quoteObj.text && quoteObj.category === quoteObj.category)
    );
    saveQuotes();
  };
  newQuote.appendChild(removeBtn);
  quoteList.prepend(newQuote);
}

//adding quotes function
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
  populateCategories()

  saveQuotes();
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

  //set-modal content
  modalQuoteText.innerHTML = `"${randomQuote.text}"`;
  modalQuoteCategory.innerHTML = `-${randomQuote.category}`;

  //show-modal
  showModal.style.display = "block";
}

showNewQuoteBtn.addEventListener("click", showRandomQuote);

//close model when clicked
closeModal.onclick = function () {
  showModal.style.display = "none";
};

//close modal when clicking outside the modal
window.onclick = function (event) {
  const modal = showModal;
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
showNewQuoteBtn.addEventListener("click", showRandomQuote);

quotes.forEach(addQuoteToDom); //showing default quotes

//save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

//loading quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    const imported = JSON.parse(storedQuotes);
    //merge
    quotes = imported;
  }
  //clear current DOm list, then re-render
  quoteList.innerHTML = "";
  quotes.forEach(addQuoteToDom);
  populateCategories()
}

function exportToJsonFile() {
  if (quotes.length === 0) {
    alert("No quotes to export!");
    return;
  }

  // Create a blob out of the JSON string
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });

  //turns the blob into a temporary file URL link blob:http://.....
  const url = URL.createObjectURL(blob);

  // Create a temporary <a> to trigger download
  const a = document.createElement("a");
  a.href = url;
  const now = new Date();
  //getting the year
  const year = now.getFullYear();
  //getting the month
  const month = now.getMonth();
  const standardMonth = month + 1;
  //getting the day
  const day = now.getDate();

  a.download = `quotes-${year}-${standardMonth}-${day}.json`;

  document.body.appendChild(a); //adds the (a) to the DOM just briefly so it can be 'clicked
  a.click();
  document.body.removeChild(a); //removes the (a) afterwards

  // release the blob URL
  URL.revokeObjectURL(url);
}

// wire up the export button
document
  .getElementById("exportBtn")
  .addEventListener("click", exportToJsonFile);

function importFromJsonFile(event) {
  const file = event.target.files[0]; //gets the first file the user selected
  if (!file) return; //if no file was uploaded then, return

  const reader = new FileReader(); // creates a fileReader obj, which can read text from files

  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);

      // Validate it’s an array of {text,category} objects
      if (!Array.isArray(imported)) throw new Error();
      imported.forEach((q) => {
        if (typeof q.text !== "string" || typeof q.category !== "string")
          throw new Error(); //if anything is invalid, throw an error
      });

      // Merge into quotes array
      quotes.push(...imported);
      saveQuotes();
      populateCategories()

      // Re-render list
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

  // reset the input so the same file can be re-imported if needed
  event.target.value = "";
}

document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
//load the localStorage as the windows loads
document.addEventListener("DOMContentLoaded", loadQuotes, populateCategories);
