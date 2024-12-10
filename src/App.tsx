import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StationsPage from "./pages/StationsPage";
import StationDetailsPage from "./pages/StationDetailsPage";
import {useEffect} from "react";

function App() {
    useEffect(() => {
         // Check if we're in a Tauri environment
         if (window.__TAURI__) {
             const { invoke } = window.__TAURI__.tauri;

             invoke('tauri', { cmd: 'create' })
                 .then((response: any) => console.log(response))
                 .catch((error: any) => console.log(error));

             return () => {
                 invoke('tauri', { cmd: 'close' })
                     .then((response: any) => console.log(response))
                     .catch((error: any) => console.log(error));
             };
         }
     }, []);

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