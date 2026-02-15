import { useState } from "react";
import LandingPage from "./pages/LandingPage";

const App = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <LandingPage isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  );
};

export default App;
