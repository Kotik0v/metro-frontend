import { dest_root } from "../target_config";

export const ROUTES = {
    HOME: `${dest_root}/`,
    STATIONS: `${dest_root}/stations`,
    LOGIN: `${dest_root}/login`,
    REGISTER: `${dest_root}/register`,
    PROFILE: `${dest_root}/profile`,
    FLOW_ANALYSES: `${dest_root}/flow-analyses`,
    PAGE403: `${dest_root}/403`,
    PAGE404: `${dest_root}/404`,
};
export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
    HOME: "Главная",
    STATIONS: "Станции",
    LOGIN: "Аутентификация",
    REGISTER: "Регистрация",
    PROFILE: "Профиль",
    FLOW_ANALYSES: "Анализы потоков",
    PAGE403: "Доступ запрещен",
    PAGE404: "Страница не найдена"
};