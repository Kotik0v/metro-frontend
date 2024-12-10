import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StationsPage from "./pages/StationsPage";
import StationDetailsPage from "./pages/StationDetailsPage";

function App() {
    return (
        <BrowserRouter basename="/BMSTU_RIP_frontend">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stations" element={<StationsPage />} />
                <Route path="/stations/:id" element={<StationDetailsPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;