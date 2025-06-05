import { Route, Routes } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import ApplicationsList from "./components/ApplicationsList";

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/applications" element={<ApplicationsList />} />
      </Routes>
    </main>
  );
}

export default App;
