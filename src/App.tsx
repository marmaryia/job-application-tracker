import { Route, Routes } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import ApplicationsList from "./components/ApplicationsList";
import ApplicationPage from "./components/ApplicationPage";

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/applications" element={<ApplicationsList />} />
        <Route
          path="/applications/:application_id"
          element={<ApplicationPage />}
        />
      </Routes>
    </main>
  );
}

export default App;
