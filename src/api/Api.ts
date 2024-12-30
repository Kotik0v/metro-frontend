// src/api/Api.ts

import axios, { AxiosInstance } from "axios";
import { StationResult } from "../modules/stationsStorageApi";

class Api {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  stations = {
    stationsList: (params?: { title?: string }) =>
        this.axiosInstance.get<StationResult>("/stations", { params }),

    stationsRead: (id: string) =>
        this.axiosInstance.get(`/stations/${id}`),

    stationsAddStationCreate: (id: string, data: { station_id: string }) =>
        this.axiosInstance.post(`/stations/add/${id}`, data),
  };

  users = {
    usersLoginCreate: (data: { username: string; password: string }) =>
        this.axiosInstance.post("/users/login", data),

    usersRegisterCreate: (data: {
      username: string;
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }) => this.axiosInstance.post("/users/register", data),

    usersLogoutCreate: () =>
        this.axiosInstance.post("/users/logout"),
  };

  flowAnalyses = {
    flowAnalysesList: () =>
        this.axiosInstance.get("/flow-analyses"),

    flowAnalysesRead: (id: string) =>
        this.axiosInstance.get(`/flow-analyses/${id}`),

    flowAnalysesUpdateUpdate: (id: string, data: any) =>
        this.axiosInstance.put(`/flow-analyses/update/${id}`, data),

    flowAnalysesDeleteDelete: (id: string) =>
        this.axiosInstance.delete(`/flow-analyses/delete/${id}`),

    flowAnalysesDeleteStationDelete: (flowAnalysisId: string, stationId: string) =>
        this.axiosInstance.delete(`/flow-analyses/${flowAnalysisId}/delete-station/${stationId}`),

    flowAnalysesUpdateStationUpdate: (flowAnalysisId: string, stationId: string, data: { flow: number }) =>
        this.axiosInstance.put(`/flow-analyses/${flowAnalysisId}/update-station/${stationId}`, data),
  };
}

export const api = new Api();