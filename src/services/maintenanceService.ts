import { API_BASE_URL } from '@/lib/api';

export interface MaintenanceLog {
  _id?: string;
  id?: string;
  vehicleId: string;
  maintenanceType: string;
  status: string;
  date?: string;
  cost?: number | string;
  technician?: string;
  notes?: string;
  createdAt?: string;
}

export const maintenanceService = {
  async getLogs(): Promise<MaintenanceLog[]> {
    const useMock = localStorage.getItem('useMock') === '1';
    if (useMock) {
      // keep same shape as existing mock in the page
      return Promise.resolve([
        { id: 'MNT-001', vehicleId: 'TRK-001', maintenanceType: 'Oil Change', status: 'completed', date: 'Nov 15, 2024', cost: '$450', technician: 'Bob Miller', notes: 'Full synthetic oil change, filter replaced' },
        { id: 'MNT-002', vehicleId: 'TRK-003', maintenanceType: 'Brake Repair', status: 'in_progress', date: 'Dec 13, 2024', cost: '$1,200', technician: 'Tom Harris', notes: 'Front and rear brake pads replacement' },
      ]);
    }

    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/api/v1/fleet/maintenance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch maintenance logs');
    const data = await res.json();
    return data.data || [];
  }
,

  async createLog(payload: Partial<MaintenanceLog>) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/api/v1/fleet/maintenance`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create maintenance log');
    const data = await res.json();
    return data.data;
  },

  async updateLog(id: string, payload: Partial<MaintenanceLog>) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/api/v1/fleet/maintenance/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update maintenance log');
    const data = await res.json();
    return data.data;
  },

  async deleteLog(id: string) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/api/v1/fleet/maintenance/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete maintenance log');
    return true;
  }
,

  async reportIssue(payload: { plateNumber: string; maintenanceType: string; notes?: string }, photos?: File[]) {
    const token = localStorage.getItem('authToken');
    const form = new FormData();
    form.append('plateNumber', payload.plateNumber);
    form.append('maintenanceType', payload.maintenanceType);
    if (payload.notes) form.append('notes', payload.notes);
    if (photos && photos.length) {
      for (const p of photos) form.append('files', p);
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/driver/maintenance/report`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) throw new Error('Failed to report maintenance');
    const data = await res.json();
    return data.data;
  }
,

  async getMyDriverProfile() {
    const useMock = localStorage.getItem('useMock') === '1';
    if (useMock) {
      return Promise.resolve({ currentVehicleId: null });
    }
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/api/v1/driver/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch driver profile');
    const data = await res.json();
    return data.data;
  }
,

  async getMyReports(): Promise<MaintenanceLog[]> {
    const useMock = localStorage.getItem('useMock') === '1';
    if (useMock) {
      return Promise.resolve([]);
    }
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/api/v1/driver/maintenance`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch my maintenance reports');
    const data = await res.json();
    return data.data || [];
  }
};
