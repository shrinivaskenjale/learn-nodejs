const EventEmitter = require("events");

// This is how many modules in node implement events by extending EventEmitter class.
class Sale extends EventEmitter {
  constructor(customer, product) {
    super();
  }
}

const sale = new Sale();

// Register the event handlers.
// Event handlers execute in the order in which they are registered in the code.
sale.on("newSale", () => {
  console.log("There was a new sale.");
});

sale.on("newSale", () => {
  console.log("Customer name: Shrinivas");
});

sale.on("cancel", (customer, product) => {
  console.log(`${customer.name} cancelled the order of ${product}`);
});

// Emit the event
sale.emit("newSale");

// We can pass arguments to event handler callbacks by passing them to emit() starting from 2nd argument.
sale.emit("cancel", { name: "Shrinivas" }, "Shirt");
