import api from "./api";

export const createCase = (data) =>
    api.post("/cases", data);

export const analyzeCase = (caseId) =>
    api.post(`/cases/${caseId}/analyze`);

export const getCaseById = (caseId) =>
    api.get(`/cases/${caseId}`);

export const getMyCases = () =>
    api.get("/cases/my");

export const assignLawyer = (caseId, lawyerId) =>
    api.post(`/cases/${caseId}/assign`, { lawyerId });
