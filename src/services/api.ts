import axios from 'axios';
import { ClientProject, TaskItem, DeploymentRecord, ProjectSecret } from '../types/project';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexify_dev_token');
    if (token && token !== 'nexify_dev_authenticated_session') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (developerEmail: string, accessKey: string, securityPin?: string) => {
    const res = await apiClient.post('/auth/login', { developerEmail, accessKey, securityPin });
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<ClientProject[]> => {
    const res = await apiClient.get('/projects');
    return res.data.data;
  },
  getById: async (id: string): Promise<ClientProject> => {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data.data;
  },
  create: async (projectData: Partial<ClientProject>): Promise<ClientProject> => {
    const res = await apiClient.post('/projects', projectData);
    return res.data.data;
  },
  update: async (id: string, updates: Partial<ClientProject>): Promise<ClientProject> => {
    const res = await apiClient.put(`/projects/${id}`, updates);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
  addDomain: async (id: string, domain: string): Promise<ClientProject> => {
    const res = await apiClient.post(`/projects/${id}/domains`, { domain });
    return res.data.data;
  },
  removeDomain: async (id: string, domain: string): Promise<ClientProject> => {
    const res = await apiClient.delete(`/projects/${id}/domains/${domain}`);
    return res.data.data;
  },
};

// Tasks API
export const tasksApi = {
  add: async (projectId: string, task: Partial<TaskItem>): Promise<TaskItem> => {
    const res = await apiClient.post(`/projects/${projectId}/tasks`, task);
    return res.data.data;
  },
  update: async (projectId: string, taskId: string, updates: Partial<TaskItem>): Promise<TaskItem> => {
    const res = await apiClient.put(`/projects/${projectId}/tasks/${taskId}`, updates);
    return res.data.data;
  },
  delete: async (projectId: string, taskId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
  },
};

// Deployments API
export const deploymentsApi = {
  trigger: async (projectId: string, version?: string, commitMessage?: string) => {
    const res = await apiClient.post(`/projects/${projectId}/deploy`, { version, commitMessage });
    return res.data;
  },
  add: async (projectId: string, deploy: Partial<DeploymentRecord>): Promise<DeploymentRecord> => {
    const res = await apiClient.post(`/projects/${projectId}/deployments`, deploy);
    return res.data.data;
  },
  delete: async (projectId: string, deploymentId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/deployments/${deploymentId}`);
  },
};

// Secrets API (AES-256 Vault)
export const secretsApi = {
  add: async (projectId: string, secret: { key: string; value: string; environment?: string; description?: string; masked?: boolean }) => {
    const res = await apiClient.post(`/projects/${projectId}/secrets`, secret);
    return res.data.data;
  },
  decrypt: async (projectId: string, secretId: string): Promise<string> => {
    const res = await apiClient.get(`/projects/${projectId}/secrets/${secretId}/decrypt`);
    return res.data.decryptedValue;
  },
  delete: async (projectId: string, secretId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/secrets/${secretId}`);
  },
};

// Uptime Radar & Telemetry API
export const uptimeApi = {
  getHistory: async (projectId?: string) => {
    const res = await apiClient.get('/uptime', { params: { projectId } });
    return res.data.data;
  },
  ping: async (url: string, projectId?: string) => {
    const res = await apiClient.post('/uptime/ping', { url, projectId });
    return res.data;
  },
};

// Audit Trail API
export const auditApi = {
  getAll: async () => {
    const res = await apiClient.get('/audit');
    return res.data.data;
  },
  create: async (log: { action: string; target: string; severity?: string; metadata?: any }) => {
    const res = await apiClient.post('/audit', log);
    return res.data.data;
  },
};

// Proxy API for API Tester
export const proxyApi = {
  sendRequest: async (params: { url: string; method: string; headers?: any; data?: any }) => {
    const res = await apiClient.post('/proxy', params);
    return res.data;
  },
};

// FinOps API
export const finopsApi = {
  getInvoices: async () => {
    const res = await apiClient.get('/finops/invoices');
    return res.data.data;
  },
  createInvoice: async (invoiceData: any) => {
    const res = await apiClient.post('/finops/invoices', invoiceData);
    return res.data.data;
  },
};
