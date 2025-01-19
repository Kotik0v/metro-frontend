import "./FlowAnalysisPage.css";
import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFlowAnalysisById, deleteFlowAnalysis, updateFlowAnalysis, formFlowAnalysis } from "../../store/slices/flowanalysisesSlice";
import { Row, Col, Spinner, Button, Form } from "react-bootstrap";
import Footer from "../../components/footer/footer";
import { RootState } from "../../store/store";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import FlowAnalysisCard from "../../components/FlowAnalysisCard/FlowAnalysisCard";

const FlowAnalysisPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const flowAnalysis = useSelector((state: RootState) => state.flowanalysises.flowanalysis);
    const [dayTime, setDayTime] = useState(flowAnalysis?.day_time || '');

    useEffect(() => {
        if (id) {
            dispatch(getFlowAnalysisById(id))
                .unwrap()
                .catch((error) => {
                    console.error('Error fetching flow analysis:', error);
                    navigate(ROUTES.FLOW_ANALYSES);
                });
        }
    }, [id, dispatch, navigate]);

    const handleDelete = async () => {
        try {
            await dispatch(deleteFlowAnalysis(id!)).unwrap();
            navigate(ROUTES.FLOW_ANALYSES);
        } catch (error) {
            console.error('Error deleting flow analysis:', error);
        }
    };

    const handleSaveTime = async () => {
        try {
            await dispatch(updateFlowAnalysis({ 
                id: id!, 
                day_time: dayTime 
            })).unwrap();
            
            // Обновляем данные заявки после сохранения времени
            await dispatch(getFlowAnalysisById(id!)).unwrap();
        } catch (error) {
            console.error('Error updating day time:', error);
        }
    };

    const handleForm = async () => {
        try {
            await dispatch(formFlowAnalysis(id!)).unwrap();
            navigate(ROUTES.FLOW_ANALYSES);
        } catch (error) {
            console.error('Error forming flow analysis:', error);
        }
    };

    if (!flowAnalysis) {
        return (
            <div className="container">
                <h3 className="text-center">Загрузка...</h3>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="custom-container">
            <div className="header-container">
                <BreadCrumbs
                    crumbs={[
                        { label: ROUTE_LABELS.FLOW_ANALYSES, path: ROUTES.FLOW_ANALYSES },
                        { label: flowAnalysis.title || "Анализ" },
                    ]}
                />
                {flowAnalysis.status !== "draft" && (
                    <div className="day-time-info">
                        <span className="day-time-label">Время суток:</span>
                        {flowAnalysis.day_time === "morning" && "Утро"}
                        {flowAnalysis.day_time === "day" && "День"}
                        {flowAnalysis.day_time === "evening" && "Вечер"}
                    </div>
                )}
            </div>
            <div className="flow-analysis-page">
                {flowAnalysis.status === "draft" && (
                    <div className="flow-controls">
                        <Button 
                            variant="danger" 
                            onClick={handleDelete}
                        >
                            Удалить
                        </Button>
                        
                        <Form.Select 
                            value={dayTime}
                            onChange={(e) => setDayTime(e.target.value)}
                            className="time-select"
                        >
                            <option value="">Выберите время</option>
                            <option value="morning">Утро</option>
                            <option value="day">День</option>
                            <option value="evening">Вечер</option>
                        </Form.Select>

                        <Button 
                            variant="primary"
                            onClick={handleSaveTime}
                        >
                            Сохранить
                        </Button>

                        <Button 
                            variant="success"
                            onClick={handleForm}
                            disabled={!flowAnalysis.stations.length || !flowAnalysis.day_time}
                        >
                            Сформировать
                        </Button>
                        {!flowAnalysis.stations.length && (
                            <div className="form-hint">
                                Добавьте хотя бы одну станцию
                            </div>
                        )}
                        {flowAnalysis.stations.length > 0 && !flowAnalysis.day_time && (
                            <div className="form-hint">
                                Выберите и сохраните время суток
                            </div>
                        )}
                    </div>
                )}
                
                <div className="station-details">
                    {[...flowAnalysis.stations]
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((station) => (
                            <FlowAnalysisCard
                                key={station.station.id}
                                station={{
                                    id: station.station.id,
                                    title: station.station.title,
                                    description: station.station.description,
                                    picture_url: station.station.picture_url,
                                    line_number: station.station.line_number,
                                    line_name: station.station.line_name,
                                    line_color: station.station.line_color,
                                    average_visits: station.flow || station.station.average_visits,
                                    order: station.order || 1,
                                }}
                                showRemoveBtn={flowAnalysis.status === "draft"}
                                editMode={flowAnalysis.status === "draft"}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default FlowAnalysisPage;