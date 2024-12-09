import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StationsPage from "./pages/StationsPage";
import StationDetailsPage from "./pages/StationDetailsPage";
import FlowAnalysisPage from "./pages/FlowAnalysisPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stations" element={<StationsPage />} />
                <Route path="/stations/:id" element={<StationDetailsPage />} />
                <Route path="/flow-analysis" element={<FlowAnalysisPage />} />
            </Routes>
        </Router>
    );
}

export default App;