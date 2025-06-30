const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const addQuoteBtn = document.getElementsByClassName("addQuote");
const showNewQuote = document.getElementById("newQuote");
const quoteList = document.getElementById("quote-list");

let quotes = [];

function addQuoteToDom(quoteText) {
  const newQuote = document.createElement("li");
  const textNode = document.createTextNode(quoteText);
  newQuote.appendChild(textNode);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.classList.add("remove-btn");

  removeBtn.onclick = function () {
    quoteList.removeChild(newQuote);
    quotes = quotes.filter((quote) => quote !== quoteText);
  };
  newQuote.appendChild(removeBtn)
  quoteList.prepend(newQuote);
}

function addQuote() {
  const quoteText = newQuoteText.value.trim();

  if (quoteText === "") {
    alert("Please enter a quote.");
    return;
  }

  addQuoteToDom(quoteText);
  quotes.push(quoteText);
  newQuoteText.value = "";
}
