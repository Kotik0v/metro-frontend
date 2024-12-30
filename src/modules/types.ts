export type T_Station = {
    id: number;
    title: string;
    description: string;
    picture_url?: string | null;
    line_number: string;
    line_name: string;
    line_color: string;
    average_visits: number;
};

export type T_FlowAnalysis = {
    id: number;
    title?: string;
    user: T_User;
    moderator?: T_User | null;
    created_at: string;
    formed_at?: string | null;
    ended_at?: string | null;
    status: E_FlowAnalysisStatus;
    day_time?: string | null;
    stations: T_FlowAnalysisStation[];
};

export enum E_FlowAnalysisStatus {
    Draft = "draft",
    Formed = "formed",
    Completed = "completed",
    Cancelled = "cancelled",
    Deleted = "deleted"
}

export type T_FlowAnalysisStation = {
    flow_analysis: number;
    station: T_Station;
    order: number;
    flow?: number | null;
};

export type T_User = {
    id: number;
    username: string;
    email: string;
    password?: string;
    is_authenticated: boolean;
    validation_error?: boolean;
    validation_success?: boolean;
    checked?: boolean;
    first_name: string;
    last_name: string;
};

export type T_LoginCredentials = {
    username: string;
    password: string;
};

export type T_RegisterCredentials = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

export type T_StationsListResponse = {
    stations: T_Station[];
    draft_info: {
        draft_request_id: number;
        count_stations: number;
        stations_in_draft: T_FlowAnalysisStation[];
    };
};