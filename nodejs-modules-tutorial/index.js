/* 
Each function gets its own arguments object except arrow functions which is a array of arguments received when called.

We have access to arguments object in top level code in node. This proves that code inside each module is wrapped in wrapper functions.

This wrapper function receives 5 arguments, which we can use like global objects in each module.
    1. require - function to require modules
    2. module - reference to the current module
    3. exports - a reference to module.exports, used to export object from a module
    4. __filename - absolute path of the current module's file
    5. __dirname - absolute path to folder of the current module
*/
// console.log(arguments);
// console.log(require("module").wrapper);

// To require/import own modules we need to provide path relative to current module starting with the './' or '../'.

// module.exports
const Calc = require("./test-module-1");
const calculator = new Calc();
console.log(calculator.add(1, 2));

// exports
// We can destructure the values if module exports the object. Exported value will always be a object if exports is used.
const { add, multiply } = require("./test-module-2");
console.log(add(5, 3));
console.log(multiply(5, 3));

// Caching
// Top level code in required modules executes only once.
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
