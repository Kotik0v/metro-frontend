
const mockStations = {
    stations: [
        {
            id: 1,
            title: "Бауманская",
            picture_url: "http://127.0.0.1:9000/test/1.jpg",
            description: "«Бауманская» — станция Московского метрополитена на Арбатско-Покровской линии.",
            line_number: "3",
            line_name: "Арбатско-Покровская",
            line_color: "#0072BA",
            average_visits: 114,
        },
        {
            id: 2,
            title: "Комсомольская",
            picture_url: "http://127.0.0.1:9000/test/2.jpg",
            description: "«Комсомольская» — станция Московского метрополитена на Кольцевой линии.",
            line_number: "5",
            line_name: "Кольцевая",
            line_color: "#8A0D0B",
            average_visits: 105,
        },
        {
            id: 3,
            title: "Киевская",
            picture_url: "http://127.0.0.1:9000/test/3.jpg",
            description: "«Киевская» — станция Московского метрополитена на Арбатско-Покровской и Кольцевой линии.",
            line_number: "4",
            line_name: "Филёвская",
            line_color: "#1EBCEF",
            average_visits: 87,
        }
    ],
    draft_info: {
        draft_request_id: 0,
        count_stations: 0,
        stations_in_draft: []
    }
};

export default mockStations;