// src/api/Api.ts

import axios, { AxiosInstance } from "axios";
import { StationResult } from "../modules/stationsStorageApi";

export class Api {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      timeout: 5000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Добавляем интерцептор для логирования запросов
    this.axiosInstance.interceptors.request.use(
        (config) => {
            console.log('API - Отправка запроса:', {
                url: config.url,
                method: config.method,
                data: config.data,
                headers: config.headers
            });
            return config;
        },
        (error) => {
            console.error('API - Ошибка запроса:', error);
            return Promise.reject(error);
        }
    );

    // Добавляем интерцептор для логирования ответов
    this.axiosInstance.interceptors.response.use(
        (response) => {
            console.log('API - Успешный ответ:', response);
            return response;
        },
        (error) => {
            console.error('API - Ошибка ответа:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
            return Promise.reject(error);
        }
    );
  }

  stations = {
    stationsList: (params?: { title?: string }) => {
        console.log('Отправка запроса на получение станций:', params);
        return this.axiosInstance.get<StationResult>("/stations/", { params })
            .then(response => {
                console.log('Получен ответ от сервера:', response.data);
                // Если ответ - массив станций (для неавторизованного пользователя)
                if (Array.isArray(response.data)) {
                    return {
                        data: {
                            stations: response.data,
                            draft_info: null
                        }
                    };
                }
                // Если ответ - объект (для авторизованного пользователя)
                return {
                    data: {
                        stations: response.data.stations,
                        draft_info: response.data.draft_info
                    }
                };
            })
            .catch(error => {
                console.error('Ошибка при получении станций:', error);
                throw error;
            });
    },

    stationsRead: (id: string) =>
        this.axiosInstance.get(`/stations/${id}/`),

    stationsAddStationCreate: (data: { station_id: string }) =>
        this.axiosInstance.post('/stations/add/', data),
  };

  users = {
    usersCheckSession: () =>
        this.axiosInstance.get("/users/check-session/"),

    usersLoginCreate: (data: { username: string; password: string }) =>
        this.axiosInstance.post("/users/login/", data, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.cookie.match(/csrftoken=([\w-]+)/)?.[1] || ''
            },
            withCredentials: true
        }),

    usersRegisterCreate: (data: {
      username: string;
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }) => this.axiosInstance.post("/users/register/", data),

    usersLogoutCreate: () =>
        this.axiosInstance.post("/users/logout/", null, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.cookie.match(/csrftoken=([\w-]+)/)?.[1] || ''
            },
            withCredentials: true
        }),
  };

  flowAnalyses = {
    flowAnalysesList: (params?: string) => 
        this.axiosInstance.get(`/flow-analyses/${params ? '?' + params : ''}`),
    flowAnalysesFilter: (params: string) => 
        this.axiosInstance.get(`/flow-analyses/?${params}`),

    flowAnalysesRead: (id: string) =>
        this.axiosInstance.get(`/flow-analyses/${id}/`),

    flowAnalysesUpdateUpdate: (id: string, data: any) =>
        this.axiosInstance.post(`/flow-analyses/update/${id}/`, data),

    flowAnalysesDeleteDelete: (id: string) =>
        this.axiosInstance.post(`/flow-analyses/delete/${id}/`),

    flowAnalysesDeleteStationDelete: (stationId: string) => {
        return this.axiosInstance.post("/flow-analyses/delete-station/", {
            station_id: stationId
        });
    },

    flowAnalysesUpdateStationUpdate: (flowAnalysisId: string, stationId: string, data: { order?: number, flow?: number }) =>
        this.axiosInstance.post(`/flow-analyses/${flowAnalysisId}/update-station/${stationId}/`, data),

    flowAnalysesAddStationCreate: (stationId: string) => {
        console.log('11. Вызов API метода flowAnalysesAddStationCreate, stationId:', stationId);
        return this.axiosInstance.post(`/stations/add/${stationId}/`)
            .then(response => {
                console.log('12. Успешный ответ от API:', response);
                return response;
            })
            .catch(error => {
                console.error('13. Ошибка API:', error);
                throw error;
            });
    },

    flowAnalysesFormUpdate: (id: string) =>
        this.axiosInstance.post(`/flow-analyses/${id}/form/`),
  };
}

export const api = new Api();
