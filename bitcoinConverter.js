// import { sendTokensToUser } from "./app.js";

async function queryApi() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin",
          vs_currencies: "usd",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}

async function convertbtcToDollars(value) {
  try {
    const response = await queryApi();
    const btcToUsdRate = response.data.bitcoin.usd;

    const dollarsValue = value * btcToUsdRate;

    return dollarsValue;
  } catch (error) {
    console.error("Error converting btc to dollars:", error);
    return null;
  }
}

async function convertDollarsTobtc(value) {
  try {
    const response = await queryApi();
    const btcToUsdRate = response.data.bitcoin.usd;

    const btcValue = value / btcToUsdRate;

    return btcValue;
  } catch (error) {
    console.error("Error converting btc to dollars:", error);
    return null;
  }
}

function removeCurrencyAndNonNumeric(inputString) {
  // Use a regular expression to match numbers (including negative) and decimal points
  const pattern = /[-+]?([0-9]*\.[0-9]+|[0-9]+)/g;

  const cleanedArray = inputString.match(pattern);

  // Join the matched numbers and decimal points back into a single string
  const cleanedString = cleanedArray ? cleanedArray.join("") : "";

  return cleanedString;
}

let btc = document.getElementById("btc-input");
let dollars = document.getElementById("usd-input");

function convertbtcToUsd() {
  let btcValue = removeCurrencyAndNonNumeric(btc.value);
  if (!btcValue) {
    btc.focus();
    return;
  }
  convertbtcToDollars(btcValue).then((dollar) => {
    dollars.value = dollar.toFixed(2);
    // sendTokensToUser(1)
  });
}
btc.addEventListener("input", convertbtcToUsd);

function convertUsdTobtc() {
  let dollarsValue = removeCurrencyAndNonNumeric(dollars.value);
  if (!dollarsValue) {
    dollars.focus();
    return;
  }
  convertDollarsTobtc(dollarsValue).then((bitcoin) => {
    btc.value = bitcoin.toFixed(4);
    // sendTokensToUser(1)
  });
}
dollars.addEventListener("input", convertUsdTobtc);

function isMobileDevice() {
  return window.innerWidth < 768;
}

const arrows = document.getElementById("arrows");
let isClicked = false;
if (isMobileDevice()) {
  arrows.innerHTML = `<i class="fa-solid fa-arrows-up-down"></i>`;
  const mobileDropdowns = document.querySelectorAll(".mobile-dropdown");
  mobileDropdowns.forEach(function (dropdown) {
    const trigger = dropdown.querySelector("a");
    const menu = dropdown.querySelector(".mobile-dropdown-menu");

    trigger.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the link from navigating

      if (isClicked) {
        menu.style.display = "none"; // Hide the menu
      } else {
        menu.style.display = "block"; // Show the menu
      }

      isClicked = !isClicked; // Toggle the menu visibility state
    });
  });
} else {
  arrows.innerHTML = `<i class="fa-solid fa-arrow-right-arrow-left"></i>`;
}

window.addEventListener("DOMContentLoaded", convertbtcToUsd);
document.getElementById("convert-button").addEventListener("click", () => {
  if (btc.value) {
    convertbtcToUsd();
  } else if (dollars.value) {
    convertUsdTobtc();
  } else {
    alert("Enter Bitcoin or Dollars to convert");
  }
});
