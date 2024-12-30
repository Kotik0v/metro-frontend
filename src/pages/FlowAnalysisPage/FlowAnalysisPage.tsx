import "./FlowAnalysisPage.css";
import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFlowAnalysisById } from "../../store/slices/flowanalysisesSlice";
import { Row, Col, Spinner } from "react-bootstrap";
import Footer from "../../components/footer/footer";
import { RootState } from "../../store/store";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import FlowAnalysisCard from "../../components/FlowAnalysisCard/FlowAnalysisCard";

const FlowAnalysisPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const flowAnalysis = useSelector((state: RootState) => state.flowanalysises.flowanalysis);

    useEffect(() => {
        if (id) {
            dispatch(getFlowAnalysisById(id));
        }
    }, [id, dispatch]);

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
            <BreadCrumbs
                crumbs={[
                    { label: ROUTE_LABELS.FLOW_ANALYSES, path: ROUTES.FLOW_ANALYSES },
                    { label: flowAnalysis.title || "Анализ" },
                ]}
            />
            <div className="flow-analysis-page">
                <Row>
                    <Col xs={12}>
                        <h2 className="page-title">
                            Анализ потока на станции: {flowAnalysis.title}
                        </h2>
                        <div className="analysis-details">
                            <p>
                                <strong>Дата и время:</strong> {new Date(flowAnalysis.created_at).toLocaleString()}
                            </p>
                            <p>
                                <strong>Статус:</strong> {flowAnalysis.status}
                            </p>
                            <p>
                                <strong>Модератор:</strong> {flowAnalysis.moderator?.username || "Не назначен"}
                            </p>
                        </div>
                        <Row className="station-details">
                            {flowAnalysis.stations.map((station, index) => (
                                <Col key={index} md={6}>
                                    <FlowAnalysisCard
                                        station={{
                                            id: station.station.id,
                                            title: station.station.title,
                                            description: station.station.description,
                                            picture_url: station.station.picture_url,
                                            line_number: station.station.line_number,
                                            line_name: station.station.line_name,
                                            line_color: station.station.line_color,
                                            average_visits: station.flow || station.station.average_visits,
                                        }}
                                        showRemoveBtn={flowAnalysis.status === "draft"}
                                        editMode={flowAnalysis.status === "draft"}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </div>
            <Footer />
        </div>
    );
};

export default FlowAnalysisPage;