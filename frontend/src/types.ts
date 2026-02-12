// src/types.ts

export interface Appointment {
  id: number | string;
  client_name: string;
  phone?: string;
  email?: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  rejectionReason?: string;
  cancellationReason?: string;
}

export interface Service {
  id: number;
  name: string;
  price: string;
}

export interface Notification {
  id: string;
  type: 'pending' | 'approved' | 'rejected' | 'cancelled';
  title: string;
  message: string;
  date: string;
  appointmentDetails?: {
    service: string;
    date: string;
    time: string;
  };
  rejectionReason?: string;
}
