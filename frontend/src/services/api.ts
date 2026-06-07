let API_BASE_URL = import.meta.env.VITE_API_URL || "";

if (API_BASE_URL && API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

if (!API_BASE_URL) {
  console.error("VITE_API_URL is missing");
}

export const analyzeIncident = async (report: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/incidents/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error analyzing incident:', error);
    return null;
  }
};

export const getMemoryInsight = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/memory-ai/insight`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching memory insight:', error);
    return null;
  }
};

export const generateAlert = async (payload: { incident_type: string; location: string; severity: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/alerts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error generating alert:', error);
    return null;
  }
};

export const saveAlert = async (payload: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/alerts/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error saving alert:', error);
    return null;
  }
};

export const getResources = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resources`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
    return null;
  }
};

export const seedResources = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resources/seed`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error seeding resources:', error);
    return null;
  }
};
export const dispatchResource = async (payload: { resource_id: string | number; location: string; incident_id?: string | number; incident_title?: string }) => {
  try {
    console.log("Dispatch payload:", payload);
    const response = await fetch(`${API_BASE_URL}/api/resources/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error dispatching resource:', error);
    return null;
  }
};

export const updateIncidentStatus = async (id: string, status: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/incidents/update_status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error updating incident status:', error);
    return null;
  }
};

export const createIncident = async (incidentData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/incidents/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error creating incident:', error);
    return null;
  }
};

export const getIncidents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/incidents`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return null;
  }
};

export const getZones = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/zones`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching zones:', error);
    return null;
  }
};

export const getAlerts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/alerts`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return null;
  }
};

export const getTelemetry = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/telemetry`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    return null;
  }
};

export const getPatterns = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/patterns`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching patterns:', error);
    return null;
  }
};
