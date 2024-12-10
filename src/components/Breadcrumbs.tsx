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
            <Breadcrumb.Item as={Link} to="/BMSTU_RIP_frontend/">
                Главная
            </Breadcrumb.Item>
            {segments.map((segment, index) => {
                const fullPath = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                return (
                    <Breadcrumb.Item
                        key={index}
                        active={isLast}
                        linkAs={isLast ? undefined : Link}
                        linkProps={isLast ? {} : { to: fullPath }}
                    >
                        {paths[segment] || segment}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

export default Breadcrumbs;