// API client placeholder
// Will be implemented when backend is ready

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // GET /submissions
  getSubmissions: async () => {
    throw new Error('Not implemented');
  },

  // GET /submissions/{id}
  getSubmission: async (id: string) => {
    throw new Error(`Not implemented: ${id}`);
  },

  // POST /submissions
  createSubmission: async (data: unknown) => {
    throw new Error(`Not implemented: ${JSON.stringify(data)}`);
  },

  // PUT /submissions/{id}
  updateSubmission: async (id: string, data: unknown, version: number) => {
    throw new Error(`Not implemented: ${id}, ${version}, ${JSON.stringify(data)}`);
  },

  // POST /submissions/{id}/submit
  submitSubmission: async (id: string, version: number) => {
    throw new Error(`Not implemented: ${id}, ${version}`);
  },

  // GET /export
  exportSubmissions: async () => {
    throw new Error('Not implemented');
  },
};

export { API_BASE_URL };
