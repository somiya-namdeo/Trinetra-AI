let API_BASE_URL = import.meta.env.VITE_API_URL || "";

if (API_BASE_URL && API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

if (!API_BASE_URL) {
  console.error("VITE_API_URL is missing");
}

const fetchJson = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
  }
  
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Expected JSON but received ${contentType}. Endpoint: ${url}`);
  }
  
  return await response.json();
};

export const analyzeIncident = async (report: string) => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/incidents/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report }),
    });
  } catch (error) {
    console.error('Error analyzing incident:', error);
    throw error;
  }
};

export const getMemoryInsight = async () => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/memory-ai/insight`);
  } catch (error) {
    console.error('Error fetching memory insight:', error);
    throw error;
  }
};

export const generateAlert = async (payload: { incident_type: string; location: string; severity: string }) => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/alerts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Error generating alert:', error);
    throw error;
  }
};

export const saveAlert = async (payload: any) => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/alerts/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Error saving alert:', error);
    throw error;
  }
};

export const getResources = async () => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/resources`);
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const seedResources = async () => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/resources/seed`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error seeding resources:', error);
    throw error;
  }
};

export const dispatchResource = async (payload: { resource_id: string | number; location: string; incident_id?: string | number; incident_title?: string }) => {
  try {
    console.log("Dispatch payload:", payload);
    return await fetchJson(`${API_BASE_URL}/api/resources/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Error dispatching resource:', error);
    throw error;
  }
};

export const updateIncidentStatus = async (id: string, status: string) => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/incidents/update_status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  } catch (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }
};

export const createIncident = async (incidentData: any) => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/incidents/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData),
    });
  } catch (error) {
    console.error('Error creating incident:', error);
    throw error;
  }
};

export const getIncidents = async () => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/incidents`);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
};

export const getZones = async () => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/zones`);
  } catch (error) {
    console.error('Error fetching zones:', error);
    throw error;
  }
};

export const getAlerts = async () => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/alerts`);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const getTelemetry = async () => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/telemetry`);
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    throw error;
  }
};

export const getPatterns = async () => {
  try {
    return await fetchJson(`${API_BASE_URL}/api/patterns`);
  } catch (error) {
    console.error('Error fetching patterns:', error);
    throw error;
  }
};
