import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
    path: string;
}

interface PathNames {
    [key: string]: string;
}

const pathNames: PathNames = {
    'stations': 'Список станций',
    'flow-analysis': 'Заявка'
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path }) => {
    const paths = path.split('/').filter(Boolean);

    return (
        <nav className="breadcrumbs">
            <Link to="/">Главная</Link>
            {paths.map((segment, index) => (
                <React.Fragment key={index}>
                    <span> / </span>
                    {index === paths.length - 1 ? (
                        <span>{pathNames[segment] || segment}</span>
                    ) : (
                        <Link to={`/${paths.slice(0, index + 1).join('/')}`}>
                            {pathNames[segment] || segment}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;