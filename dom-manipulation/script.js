const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const showNewQuoteBtn = document.getElementById("newQuote-btn");
const quoteList = document.getElementById("quote-list");
const showModal = document.getElementById("quoteModal");
const closeModal = document.querySelector(".close-btn");

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
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Realization" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

function addQuoteToDom(quoteObj) {
  const newQuote = document.createElement("li");
  const textNode = document.createTextNode(
    `"${quoteObj.text}" - ${quoteObj.category}`
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
  document.getElementById(
    "modalQuoteText"
  ).innerHTML = `"${randomQuote.text}"`;
  document.getElementById(
    "modalQuoteCategory"
  ).innerHTML = `-${randomQuote.category}`;

  //show-modal
  showModal.style.display = "block";
}

showNewQuoteBtn.addEventListener("click", showRandomQuote)

//close model when clicked
closeModal.onclick = function () {
  showModal.style.display = "none";
};

//close modal when clicking outside the modal
window.onclick = function (event){
    const modal = showModal;
    if(event.target === modal){
        modal.style.display = "none"
    }
}
showNewQuoteBtn.addEventListener("click", showRandomQuote);

// quotes.forEach(addQuoteToDom); //showing default quotes
