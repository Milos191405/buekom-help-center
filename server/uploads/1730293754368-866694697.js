const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const products = [
  {
    name: "Espresso",
    price: 1.99,
  },
  {
    name: "Double Espresso",
    price: 2.99,
  },
  {
    name: "Americano",
    price: 3.59,
  },
  {
    name: "Latte",
    price: 3.9,
  },
  {
    name: "Cappuccino",
    price: 4.5,
  },
  {
    name: "Macchiato",
    price: 2.69,
  },
  {
    name: "Mocha",
    price: 3.5,
  },
  {
    name: "Flatwhite",
    price: 4.99,
  },
  {
    name: "Mocha2",
    price: 5.99,
  },
  {
    name: "Dopio",
    price: 3.19,
  },
];

function displayOffer() {
  console.log("Coffee shop offer");
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name} - ${product.price}€`);
  });
}

function askForOrder() {
  rl.question("Would you like to place an order? yes/no: ", (answer) => {
    if (answer.toLowerCase() === "yes") {
      askForOrderDetails();
    } else {
      console.log("Thank you for visiting! Have a great day!");
      rl.close();
    }
  });
}

function askForOrderDetails() {
  rl.question(
    "What product would you like to order? Enter the product name (type 'end' to finish): ",
    (productName) => {
      if (productName.trim().toLowerCase() === "end") {
        displayBasket();
        rl.close();
      } else {
        const selectedProduct = products.find(
          (product) => product.name.toLowerCase() === productName.toLowerCase()
        );

console.log("Welcome to the Coffee Shop!");
displayOffer();
askForOrder();
