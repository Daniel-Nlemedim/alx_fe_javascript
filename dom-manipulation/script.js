const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const showNewQuoteBtn = document.getElementById("newQuote-btn");
const quoteList = document.getElementById("quote-list");
const showModal = document.getElementById("quoteModal");
const closeModal = document.querySelector(".close-btn");

let quotes = [
  {
    text: "Try to always be yourself; everyone is different",
    category: "Inspiration",
  },
  { text: "Keep pushing in every circumstance", category: "Motivation" },
  { text: "The goal clean and clear of every distraction", category: "Goal" },
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
  ).textContent = `"${randomQuote.text}"`;
  document.getElementById(
    "modalQuoteCategory"
  ).textContent = `-${randomQuote.category}`;

  //show-modal
  showModal.style.display = "block";
}

//close model when clicked
closeModal.onclick = function () {
  document.getElementById("quoteModal").style.display = "none";
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
