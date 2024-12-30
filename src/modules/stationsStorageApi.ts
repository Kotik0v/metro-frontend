import { api } from "../api";

export interface Station {
    id: number;
    title: string;
    description: string;
    picture_url: string;
    line_number: number;
    line_name: string;
    line_color: string;
    average_visits: number;
}

export interface DraftInfo {
    draft_request_id: number;
    count_stations: number;
    stations_in_draft: Station[];
}

export interface StationResult {
    stations: Station[];
    draft_info: DraftInfo;
}

interface RequestParams {
    title?: string;
}

const getApiUrl = (): string => {
    return window.location.hostname;
};

export const getStationsByName = async (title: string = ""): Promise<StationResult> => {
    try {
        const response = await api.stations.stationsList({ title } as RequestParams);

        return {
            stations: Array.isArray(response.data.stations)
                ? (response.data.stations as Station[]).map((station: Station) => {
                    const apiUrl = getApiUrl();
                    station.picture_url = station.picture_url?.replace("localhost", apiUrl);
                    return station;
                })
                : [],
            draft_info: response.data.draft_info
        };
    } catch (error) {
        console.error("Error fetching stations:", error);
        throw error;
    }
};

export const getStationById = async (stationId: number | string): Promise<Station> => {
    try {
        const response = await api.stations.stationsRead(stationId.toString());
        const station: Station = response.data as Station;

        const apiUrl = getApiUrl();
        station.picture_url = station.picture_url?.replace("localhost", apiUrl);

        return station;
    } catch (error) {
        console.error("Error fetching station by ID:", error);
        throw error;
    }
};

export interface LoginRequest {
    username: string;
    password: string;
}

export const loginUser = async (data: LoginRequest) => {
    try {
        await api.users.usersLoginCreate(data);
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};