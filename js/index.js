let firstNumber = "";
let operator = "";
let secondNumber = "";
let shouldResetDisplay = false;

const display = document.querySelector(".display");
const digitButtons = document.querySelectorAll(".digit");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector(".equals");
const clearButton = document.querySelector(".clear");
const decimalButton = document.querySelector(".decimal");
const backspaceButton = document.querySelector(".backspace");


// Digit buttons

digitButtons.forEach(button => {
  button.addEventListener("click", () => {

    // If a result was just displayed,
    // start a new calculation
    if (shouldResetDisplay) {
      firstNumber = "";
      operator = "";
      secondNumber = "";
      shouldResetDisplay = false;
    }

    if (operator === "") {
      firstNumber += button.textContent;
      display.textContent = firstNumber;
    } else {
      secondNumber += button.textContent;

      display.textContent =
        firstNumber + " " + operator + " " + secondNumber;
    }
  });
});

// Operator buttons

// Operator buttons

operatorButtons.forEach(button => {

  button.addEventListener("click", () => {

    const newOperator = button.textContent;

    // Don't allow an operator
    // before entering a number
    if (firstNumber === "") {
      return;
    }

    // If there is already an operator
    // but no second number,
    // replace the operator
    if (operator !== "" && secondNumber === "") {

      operator = newOperator;

      display.textContent =
        firstNumber + " " + operator;

      return;
    }

    // If we already have:
    // first number + operator + second number
    // calculate the result first
    if (operator !== "" && secondNumber !== "") {

      let result = operate(
        operator,
        Number(firstNumber),
        Number(secondNumber)
      );

      // Division by zero
      if (typeof result === "string") {

        display.textContent = result;

        firstNumber = "";
        operator = "";
        secondNumber = "";
        shouldResetDisplay = true;

        return;
      }

      result = roundResult(result);

      firstNumber = String(result);
      secondNumber = "";

      operator = newOperator;

      display.textContent =
        firstNumber + " " + operator;

      return;
    }

    // FIRST OPERATOR
    operator = newOperator;

    display.textContent =
      firstNumber + " " + operator;

  });

});

// Equals button

equalsButton.addEventListener("click", () => {

  // Don't calculate unless we have:
  // first number + operator + second number
  if (
    firstNumber === "" ||
    operator === "" ||
    secondNumber === ""
  ) {
    return;
  }

  let result = operate(
    operator,
    Number(firstNumber),
    Number(secondNumber)
  );

  // Handle division by zero
  if (typeof result === "string") {
    display.textContent = result;

    firstNumber = "";
    operator = "";
    secondNumber = "";
    shouldResetDisplay = true;

    return;
  }

  result = roundResult(result);

  display.textContent = result;

  // Store the result
  firstNumber = String(result);
  operator = "";
  secondNumber = "";

  // Next digit should start a new calculation
  shouldResetDisplay = true;
});

// Clear button

clearButton.addEventListener("click", () => {
  firstNumber = "";
  operator = "";
  secondNumber = "";
  shouldResetDisplay = false;

  display.textContent = "0";
});

decimalButton.addEventListener("click", () => {

  // If a result was just displayed,
  // start a new number
  if (shouldResetDisplay) {
    firstNumber = "";
    operator = "";
    secondNumber = "";
    shouldResetDisplay = false;
  }

  // Adding decimal to first number
  if (operator === "") {

    if (!firstNumber.includes(".")) {

      firstNumber += ".";

      display.textContent = firstNumber;
    }

  } else {

    // Adding decimal to second number
    if (!secondNumber.includes(".")) {

      secondNumber += ".";

      display.textContent =
        firstNumber + " " + operator + " " + secondNumber;
    }
  }

});

backspaceButton.addEventListener("click", () => {

  if (shouldResetDisplay) {
    return;
  }

  if (operator === "") {

    // Remove last character from first number
    firstNumber = firstNumber.slice(0, -1);

    display.textContent = firstNumber || "0";

  } else {

    // Remove last character from second number
    secondNumber = secondNumber.slice(0, -1);

    display.textContent =
      firstNumber + " " + operator + " " + secondNumber;
  }

});


// Math functions

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Nice try! You can't divide by zero.";
  }

  return a / b;
}

// Operate function

function operate(operator, num1, num2) {
  if (operator === "+") {
    return add(num1, num2);
  } else if (operator === "-") {
    return subtract(num1, num2);
  } else if (operator === "*") {
    return multiply(num1, num2);
  } else if (operator === "/") {
    return divide(num1, num2);
  }
}

// Round long decimal answers

function roundResult(number) {
  if (typeof number !== "number") {
    return number;
  }

  return Math.round(number * 100000000) / 100000000;
}


//keyboard event

document.addEventListener("keydown", (event) => {

  // Number keys
  if (event.key >= "0" && event.key <= "9") {

    const number = event.key;

    if (shouldResetDisplay) {
      firstNumber = "";
      operator = "";
      secondNumber = "";
      shouldResetDisplay = false;
    }

    if (operator === "") {

      firstNumber += number;
      display.textContent = firstNumber;

    } else {

      secondNumber += number;

      display.textContent =
        firstNumber + " " + operator + " " + secondNumber;
    }

  }

  // Decimal
  if (event.key === ".") {
    decimalButton.click();
  }

  // Operators
  if (
    event.key === "+" ||
    event.key === "-" ||
    event.key === "*" ||
    event.key === "/"
  ) {

    const operatorButton =
      [...operatorButtons].find(
        button => button.textContent === event.key
      );

    if (operatorButton) {
      operatorButton.click();
    }
  }

  // Equals
  if (event.key === "Enter" || event.key === "=") {
    equalsButton.click();
  }

  // Backspace
  if (event.key === "Backspace") {
    backspaceButton.click();
  }

  // Escape = Clear
  if (event.key === "Escape") {
    clearButton.click();
  }

});