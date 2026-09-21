const display = document.getElementById("display");
const historyEl = document.getElementById("history");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

function updateDisplay() {
  display.textContent = current;
  historyEl.textContent =
    previous !== null && operator ? `${previous} ${operator}` : "";
}

function inputNumber(digit) {
  if (justEvaluated) {
    current = digit === "." ? "0." : digit;
    justEvaluated = false;
    return;
  }
  if (current === "0" && digit !== ".") {
    current = digit;
  } else if (digit === "." && current.includes(".")) {
    return;
  } else {
    current += digit;
  }
}

function setOperator(op) {
  if (operator && previous !== null && !justEvaluated) {
    evaluate();
  }
  previous = current;
  operator = op;
  current = "0";
  justEvaluated = false;
}

function evaluate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result = 0;

  switch (operator) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      result = b === 0 ? NaN : a / b;
      break;
  }

  current = Number.isNaN(result) ? "Error" : trimResult(result);
  previous = null;
  operator = null;
  justEvaluated = true;
}

function trimResult(num) {
  return parseFloat(num.toFixed(10)).toString();
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
}

function negate() {
  if (current === "0") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
}

function percent() {
  current = trimResult(parseFloat(current) / 100);
}

document.querySelectorAll(".key").forEach((btn) => {
  btn.addEventListener("click", () => {
    const digit = btn.dataset.number;
    const action = btn.dataset.action;

    if (digit !== undefined) {
      inputNumber(digit);
    } else if (action === "decimal") {
      inputNumber(".");
    } else if (["add", "subtract", "multiply", "divide"].includes(action)) {
      setOperator(action);
    } else if (action === "equals") {
      evaluate();
    } else if (action === "clear") {
      clearAll();
    } else if (action === "negate") {
      negate();
    } else if (action === "percent") {
      percent();
    }

    updateDisplay();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputNumber(e.key);
  else if (e.key === ".") inputNumber(".");
  else if (e.key === "+") setOperator("add");
  else if (e.key === "-") setOperator("subtract");
  else if (e.key === "*") setOperator("multiply");
  else if (e.key === "/") {
    e.preventDefault();
    setOperator("divide");
  } else if (e.key === "Enter" || e.key === "=") evaluate();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "Backspace") {
    current = current.length > 1 ? current.slice(0, -1) : "0";
  } else {
    return;
  }
  updateDisplay();
});

updateDisplay();