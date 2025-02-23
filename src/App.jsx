import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Projets from "./projets/Projets";
import Personnes from "./personnes/Personnes";
import TableauBord from "./Tabdeau de bord/TableauBord";

import Header from "./components/Header";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<TableauBord/>} />
            <Route path="projets" element={<Projets/>} />
            <Route path="personnes" element={<Personnes/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
