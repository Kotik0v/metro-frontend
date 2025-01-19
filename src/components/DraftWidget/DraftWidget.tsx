import { FC } from 'react';
import { DraftStation } from '../../modules/types';
import './DraftWidget.css';

interface DraftWidgetProps {
    stations: DraftStation[];
    isOpen: boolean;
}

const DraftWidget: FC<DraftWidgetProps> = ({ stations, isOpen }) => {
    const defaultImage = "http://127.0.0.1:9000/test/default_station.jpg";

    return (
        <div className={`draft-widget ${isOpen ? 'open' : ''}`}>
            {isOpen && (
                <div className="draft-stations-list">
                    {stations.map((draftStation) => (
                        <div key={draftStation.station.id} className="draft-station-item">
                            <img 
                                src={draftStation.station.picture_url || defaultImage} 
                                alt={draftStation.station.title} 
                                className="draft-station-image"
                            />
                            <div className="draft-station-info">
                                <div 
                                    className="draft-line-indicator" 
                                    style={{ backgroundColor: draftStation.station.line_color }}
                                >
                                    {draftStation.station.line_number}
                                </div>
                                <span className="draft-station-title">
                                    {draftStation.station.title}
                                </span>
                                <span className="draft-station-visits">
                                    {draftStation.station.average_visits} тыс.
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DraftWidget; 