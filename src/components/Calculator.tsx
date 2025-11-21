import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./calculator.module.scss";
import {
  faDeleteLeft,
  faDivide,
  faMinus,
  faMoon,
  faPlus,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, type JSX } from "react";
import { evaluate } from "mathjs";

const Calculator = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [calculator, setCalculator] = useState("");
  const [calculated, setCalculated] = useState(false);

  const operators = ["+", "-", "*", "/", "."];

  const clear = (): void => {
    setCalculator("");
    setCalculated(false);
  };

  const deleteLast = (): void => {
    if (calculated) {
      clear();
      return;
    }
    if (calculator !== "") {
      const newCalculator = calculator.slice(0, -1);
      setCalculator(newCalculator);
    }
    setCalculated(false);
  };

  const specialButtons = [
    { label: "C", action: clear },
    { label: "(", action: () => updateCalculator("(") },
    { label: ")", action: () => updateCalculator(")") },
  ];

  const bottomButtons = [
    { label: ".", action: () => updateCalculator(".") },
    { label: "0", action: () => updateCalculator("0") },
    { label: <FontAwesomeIcon icon={faDeleteLeft} />, action: deleteLast },
  ];

  const operatorButtons = [
    { icon: faDivide, value: "/" },
    { icon: faXmark, value: "*" },
    { icon: faMinus, value: "-" },
    { icon: faPlus, value: "+" },
  ];

  const toggleTheme = (): void => {
    document.body.classList.toggle("darkTheme", !darkTheme);
    setDarkTheme((prev) => !prev);
  };

  const updateCalculator = (value: string): void => {
    setCalculated(false);
    const lastChar = calculator.slice(-1);

    if (operators.includes(value)) {
      if (calculator === "" || operators.includes(lastChar)) {
        setCalculator(prev => prev.slice(0, -1) + value);
        return;
      };
    }

    if (
      value === ")" &&
      calculator.split("(").length <= calculator.split(")").length
    )
      return;

    if (value === ".") {
      const currentNumber = calculator.split(/[+\-*/]/).at(-1) ?? "";
      if (currentNumber.includes(".")) return;
    }

    if (value === "0") {
      const lastNumber = calculator.split(/[+\-*/]/).at(-1) ?? "";
      if (lastNumber === "0") return;
    }

    setCalculator(prev => {
      if (prev === "Error") return value;
      else return prev + value;
    });
  };
  useEffect(() => console.log(calculated), [calculated]);
  const createDigits = (): JSX.Element[] => {
    const digits: JSX.Element[] = [];
    for (let i = 1; i <= 9; i++) {
      digits.push(
        <button key={i} onClick={() => updateCalculator(i.toString())}>
          {i}
        </button>
      );
    }

    return digits;
  };

  const calculate = (): void => {
    try {
      const expression = operators.includes(calculator.slice(-1))
        ? calculator.slice(0, -1)
        : calculator;

      const result = evaluate(expression);

      if (typeof result !== "number" || !isFinite(result)) {
        setCalculator("Error");
      } else {
        setCalculator(result.toString());
      }
    } catch {
      setCalculator("Error");
    }

    setCalculated(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const key = e.key;

      if (/^[0-9]$/.test(key) || operators.includes(key)) {
        updateCalculator(key);
        return;
      }

      switch (key) {
        case "Enter":
          calculate();
          break;
        case "Backspace":
          if (calculated) {
            clear();
          } else deleteLast();
          break;
        case "Escape":
          clear();
          break;
        case "(":
          updateCalculator(key);
          break;
        case ")":
          updateCalculator(key);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calculator]);

  return (
    <div className={styles.calculator}>
      <div className={styles.themeBtnCnr}>
        <button
          className={`${styles.themeBtn} ${darkTheme ? styles.darkTheme : ""}`}
          onClick={toggleTheme}
        >
          <div className={styles.iconCnr}>
            {darkTheme ? (
              <FontAwesomeIcon icon={faMoon} />
            ) : (
              <FontAwesomeIcon icon={faSun} />
            )}
          </div>
        </button>
      </div>

      <div className={styles.display}>{calculator || "0"}</div>

      <div className={styles.buttonsCnr}>
        <div className={styles.leftSide}>
          {specialButtons.map((btn, i) => (
            <button key={i} onClick={btn.action}>
              {btn.label}
            </button>
          ))}

          {createDigits()}

          {bottomButtons.map((btn, i) => (
            <button key={i} onClick={btn.action}>
              {btn.label}
            </button>
          ))}
        </div>

        <div className={styles.operators}>
          {operatorButtons.map((btn, i) => (
            <button key={i} onClick={() => updateCalculator(btn.value)}>
              <FontAwesomeIcon icon={btn.icon} />
            </button>
          ))}
          <button onClick={calculate}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
