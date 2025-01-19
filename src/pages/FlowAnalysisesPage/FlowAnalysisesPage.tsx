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
        console.log('FlowAnalysisesPage - Состояние аутентификации:', isAuthenticated);
        if (!isAuthenticated) {
            console.log('FlowAnalysisesPage - Перенаправление на страницу 403');
            navigate(ROUTES.PAGE403);
            return;
        }
        
        console.log('FlowAnalysisesPage - Запуск fetchFlowAnalyses');
        dispatch(fetchFlowAnalyses())
            .unwrap()
            .catch((error) => {
                console.error('FlowAnalysisesPage - Ошибка загрузки:', error);
            });
    }, [dispatch, isAuthenticated, navigate]);

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
                            <option value="">Все</option>
                            <option value="draft">Черновик</option>
                            <option value="formed">Сформирован</option>
                            <option value="completed">Завершён</option>
                            <option value="cancelled">Отклонён</option>
                            <option value="deleted">Удалён</option>
                        </select>
                    </div>
                    <div className="flow-analysis-form-group" >
                        <button type="submit" className="btn btn-outline-dark">
                            Применить
                        </button>
                    </div>
                </form>

                <div className="table-container">
                    {flowAnalyses.length > 0 ? (
                        <div className="flow-analysis-cards">
                            <div className="flow-analysis-card header-card">
                                <div className="card-field">
                                    <span>ID Анализа</span>
                                    <span>Статус</span>
                                    <span>Дата создания</span>
                                    <span>Дата формирования</span>
                                    <span>Дата завершения</span>
                                    <span>Модератор</span>
                                    <span>Время суток</span>
                                </div>
                            </div>
                            {[...flowAnalyses]
                                .sort((a, b) => a.id - b.id)
                                .map((analysis, index) => (
                                    <div 
                                        key={index} 
                                        className="flow-analysis-card"
                                        onClick={() => navigate(`${ROUTES.FLOW_ANALYSES}/${analysis.id}/`)}
                                    >
                                        <div className="card-field">
                                            <span className="text-center">{analysis.id}</span>
                                            <span className="text-center">{analysis.status}</span>
                                            <span className="text-center">{new Date(analysis.created_at).toLocaleDateString()}</span>
                                            <span className="text-center">{analysis.formed_at ? new Date(analysis.formed_at).toLocaleDateString() : 'N/A'}</span>
                                            <span className="text-center">{analysis.completed_at ? new Date(analysis.completed_at).toLocaleDateString() : 'N/A'}</span>
                                            <span className="text-center">{analysis.moderator?.username || 'Не назначен'}</span>
                                            <span className="text-center">{analysis.day_time || 'Не указано'}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <h3 className="text-center">Анализы потоков не найдены</h3>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlowAnalysisesPage;