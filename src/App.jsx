import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Projets from "./projets/Projets";
import Personnes from "./personnes/Personnes";
import TableauBord from "./Tabdeau de bord/TableauBord";

// authentification
import Register from "./authentification/Register";
import Login from "./authentification/Login";

function App() {
  const [userToken, setUserToken] = useState(
    localStorage.getItem("token") || null
  );
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setUserToken={setUserToken} />}
          />
          {userToken ? (
            <Route path="/dashboard" element={<Dashboard  />}>
              <Route index element={<TableauBord />} />
              <Route path="projets" element={<Projets />} />
              <Route path="personnes" element={<Personnes />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
