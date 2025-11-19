import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './calculator.module.scss';
import { faDeleteLeft, faDivide, faMinus, faMoon, faPercent, faPlus, faSun, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import { evaluate } from 'mathjs';

const Calculator = () => {
    const [darkTheme, setDarkTheme] = useState(false);
    const [calculator, setCalculator] = useState("");
    const [calculated, setCalculated] = useState(false);

    const operators = ['+', '-', '*', '/', '.', '%'];

    const clear = useCallback(() => {
        setCalculator("");
    }, []);

    const deleteLast = useCallback(() => {
        if (calculator !== "") {
            const newCalculator = calculator.slice(0, -1);
            setCalculator(newCalculator);
        }
    }, [calculator]);

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

    const toggleTheme = () => {
        document.body.classList.toggle("darkTheme", !darkTheme);
        setDarkTheme(prev => !prev);
    };

    const updateCalculator = useCallback((value: string) => {
        const lastChar = calculator.slice(-1);

        if (operators.includes(value)) {
            if (calculator === "" || operators.includes(lastChar)) return;
        }

        if (value === ")" && (calculator.split("(").length <= calculator.split(")").length)) return;

        if (value === ".") {
            const parts = calculator.split(/[+\-*/%]/);
            const currentNumber = parts[parts.length - 1];
            if (currentNumber.includes(".")) return;
        }

        if (calculated) {
            setCalculator(value);
            setCalculated(false);
        } else {
            setCalculator(prev => prev + value);
        }

    }, [calculator, calculated]);

    const createDigits = useCallback(() => {
        const digits: JSX.Element[] = [];
        for (let i = 1; i <= 9; i++) {
            digits.push(
                <button
                    key={i}
                    onClick={() => updateCalculator(i.toString())}
                >
                    {i}
                </button>
            );
        };

        return digits;
    }, [updateCalculator]);

    const calculate = () => {
        try {
            const result = evaluate(calculator);

            if (typeof result !== "number" || !isFinite(result)) {
                setCalculator("Error");
            } else {
                setCalculator(result.toString());
            }

            setCalculated(true);
        } catch {
            setCalculator("Error");
            setCalculated(true);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;

            if (/^[0-9]$/.test(key) || operators.includes(key)) {
                updateCalculator(key);
                return;
            };

            switch (key) {
                case "Enter":
                    calculate();
                    break;
                case "Backspace":
                    deleteLast();
                    break;
                case "Escape":
                    clear();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className={styles.calculator}>
            <div className={styles.themeBtnCnr}>
                <button
                    className={`${styles.themeBtn} ${darkTheme ? styles.darkTheme : ""}`}
                    onClick={toggleTheme}
                >
                    <div className={styles.iconCnr}>
                        {
                            darkTheme
                                ? <FontAwesomeIcon icon={faMoon} />
                                : <FontAwesomeIcon icon={faSun} />
                        }

                    </div>
                </button>
            </div>

            <div className={styles.display}>
                {calculator || "0"}
            </div>

            <div className={styles.buttonsCnr}>
                <div className={styles.leftSide}>
                    {
                        specialButtons.map((btn, i) => (
                            <button key={i} onClick={btn.action}>{btn.label}</button>
                        ))
                    }

                    {
                        createDigits()
                    }

                    {
                        bottomButtons.map((btn, i) => (
                            <button key={i} onClick={btn.action}>{btn.label}</button>
                        ))
                    }
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