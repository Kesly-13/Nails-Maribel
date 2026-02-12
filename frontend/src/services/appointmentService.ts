const API_URL = 'http://localhost:3001';

export async function getAppointments() {
  const response = await fetch(`${API_URL}/appointments`);

  if (!response.ok) {
    throw new Error('Error al obtener las citas');
  }

  return response.json();
}

export async function createAppointment(appointment: any) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointment),
  });

  if (!response.ok) {
    throw new Error('Error al crear la cita');
  }

  return response.json();
}


export const updateAppointmentStatus = async (
  id: string,  // Cambia de number a string
  status: 'approved' | 'rejected' | 'cancelled',
  reason?: string
) => {
  const response = await fetch(
    `http://localhost:3001/appointments/${id}`,  // id ya es string
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason })
    }
  );

  if (!response.ok) {
    throw new Error('Error al actualizar la cita');
  }

  return response.json();
};

export async function getBlockedDates() {
  const response = await fetch(`${API_URL}/blocked-dates`);

  if (!response.ok) {
    throw new Error('Error al obtener fechas bloqueadas');
  }

  return response.json();
}

export async function blockDate(date: string) {
  const response = await fetch(`${API_URL}/blocked-dates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date })
  });

  if (!response.ok) {
    throw new Error('Error al bloquear fecha');
  }

  return response.json();
}

export async function unblockDate(date: string) {
  const response = await fetch(`${API_URL}/blocked-dates/${date}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Error al desbloquear fecha');
  }

  return response.json();
}
