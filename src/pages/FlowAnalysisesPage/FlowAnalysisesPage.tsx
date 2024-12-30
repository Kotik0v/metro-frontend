import "./FlowAnalysisesPage.css";
import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchFlowAnalyses, updateFilters, T_FlowAnalysisFilters } from "../../store/slices/flowanalysisesSlice";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/footer";
import { ROUTES } from "../../Routes";

const FlowAnalysisesPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const flowAnalyses = useAppSelector((state) => state.flowanalysises.flowanalyses);
    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
    const filters = useAppSelector<T_FlowAnalysisFilters>((state) => state.flowanalysises.filters);

    const [status, setStatus] = useState(filters.status);
    const [dateStart, setDateStart] = useState(filters.date_start);
    const [dateEnd, setDateEnd] = useState(filters.date_end);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.PAGE403);
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        dispatch(fetchFlowAnalyses());
    }, [dispatch]);

    const applyFilters = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newFilters: T_FlowAnalysisFilters = {
            status,
            date_start: dateStart,
            date_end: dateEnd,
        };

        await dispatch(updateFilters(newFilters));
        await dispatch(fetchFlowAnalyses());
    };

    return (
        <div className="flow-analysises-container">
            <div className="flow-analysises-table-container">
                <form onSubmit={applyFilters} className="flow-analysis-form">
                    <div className="flow-analysis-form-group">
                        <label>От</label>
                        <input
                            type="date"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                        />
                    </div>
                    <div className="flow-analysis-form-group">
                        <label>До</label>
                        <input
                            type="date"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                        />
                    </div>
                    <div className="flow-analysis-form-group">
                        <label>Статус</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="draft">Черновик</option>
                            <option value="formed">Сформирован</option>
                            <option value="completed">Завершён</option>
                            <option value="cancelled">Отклонён</option>
                            <option value="deleted">Удалён</option>
                        </select>
                    </div>
                    <div className="flow-analysis-form-group">
                        <button type="submit" className="btn btn-outline-dark">
                            Применить
                        </button>
                    </div>
                </form>

                <div className="table-container">
                    {flowAnalyses.length > 0 ? (
                        <table className="flow-analysis-table">
                            <thead>
                            <tr>
                                <th>ID Анализа</th>
                                <th>Статус</th>
                                <th>Дата создания</th>
                                <th>Дата формирования</th>
                                <th>Модератор</th>
                                <th>Детали</th>
                            </tr>
                            </thead>
                            <tbody>
                            {flowAnalyses.map((analysis, index) => (
                                <tr
                                    key={index}
                                    onClick={() => navigate(`${ROUTES.FLOW_ANALYSES}/${analysis.id}/`)}
                                    className="flow-analysis-row"
                                >
                                    <td>{analysis.id}</td>
                                    <td>{analysis.status}</td>
                                    <td>{new Date(analysis.created_at).toLocaleDateString()}</td>
                                    <td>{analysis.formed_at ? new Date(analysis.formed_at).toLocaleDateString() : 'N/A'}</td>
                                    <td>{analysis.moderator?.username || 'Не назначен'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`${ROUTES.FLOW_ANALYSES}/${analysis.id}/`);
                                            }}
                                        >
                                            Подробнее
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <h3 className="text-center">Анализы потоков не найдены</h3>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FlowAnalysisesPage;