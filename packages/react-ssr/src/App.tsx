import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import styles from "./App.module.css";
import classNames from "classnames";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.app}>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className={classNames(styles.logo, styles.react)}
            alt="React logo"
          />
        </a>
      </div>
      <h1 className={classNames(styles.text, styles.header)}>Vite + React</h1>
      <div className={styles.card}>
        <button
          className={classNames(styles.text, styles.button)}
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className={classNames(styles.text)}>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={classNames(styles.text, styles["read-the-docs"])}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
