// Observer patter

const EventEmitter = require("events");

// Celebrity is a race driver.
const celebrity = new EventEmitter();

// Subscribe to celebrity for observer 1 who is biggest fan of the celebrity.
celebrity.on("race", (result) => {
  if (result === "win") console.log("Congrats! You are the best!");
});

// Subscribe to celebrity for observer 2 who is the competitor of the celebrity.
celebrity.on("race", (result) => {
  if (result === "win") console.log("Boo! I should have won that!");
});

// Celebrity emits/triggers the event called 'race'. All the observers who are subscribed to this event get notified.
// Any extra parameters passed to emit() are passed to listener.
celebrity.emit("race", "win");

// Celebrity emits another event called 'race'.
celebrity.emit("race", "lose");

// process object is instance of EventEmitter class.
process.on("exit", (code) => {
  console.log(`Process exit event with code: ${code}`);
});
