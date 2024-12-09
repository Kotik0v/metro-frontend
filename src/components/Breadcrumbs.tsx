import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

const paths: { [key: string]: string } = {
    stations: "Список станций",
    "flow-analysis": "Заявка",
};

const Breadcrumbs = ({ path }: { path: string }) => {
    const segments = path.split("/").filter(Boolean);

    return (
        <Breadcrumb>
            <Breadcrumb.Item as={Link} to="/">
                Главная
            </Breadcrumb.Item>
            {segments.map((segment, index) => {
                const fullPath = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                return isLast ? (
                    <Breadcrumb.Item active key={index}>
                        <span>{paths[segment] || segment}</span>
                    </Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item as={Link} to={fullPath} key={index}>
                        {paths[segment] || segment}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

export default Breadcrumbs;