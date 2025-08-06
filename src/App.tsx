import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/PopupStyles.css";
import "./styles/ApplicationPageStyles.css";
import "./styles/Header.css";
import "./styles/Login.css";

import "./styles/ApplicationsList.css";

import Header from "./components/Header";
import ApplicationsList from "./components/ApplicationsListPage";
import ApplicationPage from "./components/ApplicationPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/applications" element={<ApplicationsList />} />
        <Route
          path="/applications/:application_id"
          element={<ApplicationPage />}
        />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
