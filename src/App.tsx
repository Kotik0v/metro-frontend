import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from './pages/HomePage/HomePage';
import PartsPage from './pages/StationsPage/StationsPage';
import  LoginPage  from './pages/LoginPage/LoginPage';
import  RegisterPage  from './pages/RegisterPage/RegisterPage';
import StationPage from './pages/StationPage/StationPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { ROUTES } from "./Routes";
import 'bootstrap/dist/css/bootstrap.min.css';
import BasicNavbar from './components/navbar/navbar.tsx';
import { useEffect } from "react";
import FlowAnalysisPage from "./pages/FlowAnalysisPage/FlowAnalysisPage";
import FlowAnalysisesPage from "./pages/FlowAnalysisesPage/FlowAnalysisesPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ForbiddenPage from "./pages/ForbiddenPage/ForbiddenPage";

function App() {
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).__TAURI__?.tauri) {
            const { invoke } = (window as any).__TAURI__.tauri;

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
        <BrowserRouter>
            <div>
                <BasicNavbar />
                <div className="top">
                    <Routes>
                        <Route path={ROUTES.HOME} index element={<HomePage />} />
                        <Route path={ROUTES.STATIONS} element={<PartsPage />} />
                        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                        <Route path={`${ROUTES.STATIONS}/:id`} element={<StationPage />} />
                        <Route path={`${ROUTES.PROFILE}`} element={<ProfilePage />} />
                        <Route path={`${ROUTES.FLOW_ANALYSES}/:id`} element={<FlowAnalysisPage />} />
                        <Route path={`${ROUTES.FLOW_ANALYSES}`} element={<FlowAnalysisesPage />} />
                        <Route path={`${ROUTES.PAGE403}`} element={<ForbiddenPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;