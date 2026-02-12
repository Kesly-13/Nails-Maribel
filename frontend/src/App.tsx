import { Appointment, Service, Notification } from './types';
import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { About } from './components/About';
import { Services } from './components/Services';
import { BookAppointment } from './components/BookAppointment';
import { Notifications } from './components/Notifications';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ClientPortal } from './components/ClientPortal';
import { Toaster, toast } from "sonner";
import { getAppointments, updateAppointmentStatus } from './services/appointmentService';
import { getBlockedDates, blockDate, unblockDate } from './services/appointmentService';
import { createAppointment } from './services/appointmentService';



export type Page = 'home' | 'about' | 'services' | 'book' | 'notifications' | 'login' | 'dashboard' | 'client-portal';

interface ClientUser {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

useEffect(() => {
  const loadBlockedDates = async () => {
    try {
      const data = await getBlockedDates();
      const formatted = data.map((item: any) => item.date);
      setBlockedDates(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  loadBlockedDates();
}, []);

const handleToggleBlockDate = async (date: string) => {
  try {
    const formattedDate = new Date(date)
      .toISOString()
      .split('T')[0];

    if (blockedDates.includes(formattedDate)) {
      await unblockDate(formattedDate);

      setBlockedDates(prev =>
        prev.filter(d => d !== formattedDate)
      );
    } else {
      await blockDate(formattedDate);

      setBlockedDates(prev =>
        [...prev, formattedDate]
      );
    }
  } catch (error) {
    console.error(error);
  }
};



const handleLoginSuccess = (role: 'admin' | 'client') => {
  if (role === 'admin') {
    setIsAdmin(true);
    setIsClient(false);
    setCurrentPage('dashboard');
  } else {
    setIsClient(true);
    setIsAdmin(false);
    setCurrentPage('client-portal');
  }
};


  // Admin configuration
const [services, setServices] = useState<Service[]>([
  { id: 1, name: 'Manicure Semipermanente', price: '$60.000' },
  { id: 2, name: 'Uñas Acrílicas', price: '$80.000' },
  { id: 3, name: 'Uñas de Gel', price: '$75.000' },
  { id: 4, name: 'Nail Art Personalizado', price: '$100.000 - $135.000' },
  { id: 5, name: 'Retiro de Esmaltado', price: '$30.000' },
  { id: 6, name: 'Mantenimiento', price: '$40.000' },
]);


  const [disabledTimeSlots, setDisabledTimeSlots] = useState<string[]>([]);

    
useEffect(() => {
  const sampleNotifications: Notification[] = [
    {
      id: '1',
      type: 'pending',
      title: 'Cita Solicitada',
      message: 'Tu solicitud de cita ha sido enviada.',
      date: new Date().toLocaleString('es-CO'),
    }
  ];
  setNotifications(sampleNotifications);
}, []);

useEffect(() => {
  const loadAppointments = async () => {
    const data = await getAppointments();
    console.log('CITAS DESDE BACKEND 👉', data);
    setAppointments(data);
  };
  loadAppointments();
}, []);


const handleNavigate = (page: string) => {
  setCurrentPage(page as Page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


  const handleLogin = (email: string, password: string, admin: boolean) => {
    if (admin) {
      setIsAdmin(true);
      setIsClient(false);
      setCurrentPage('dashboard');
      toast.success('Bienvenida al Dashboard');
    } else {
      // Check if client exists
      const client = clientUsers.find(u => u.email === email && u.password === password);
      if (client) {
        setIsClient(true);
        setIsAdmin(false);
        setCurrentUserEmail(email);
        setCurrentPage('client-portal');
        toast.success(`Bienvenida ${client.name}`);
      } else {
        toast.error('Email o contraseña incorrectos');
      }
    }
  };

  const handleRegister = (name: string, email: string, phone: string, password: string) => {
    // Check if user already exists
    if (clientUsers.some(u => u.email === email)) {
      toast.error('Este email ya está registrado');
      return;
    }

    const newUser: ClientUser = { name, email, phone, password };
    setClientUsers([...clientUsers, newUser]);
    
    // Auto login
    setIsClient(true);
    setCurrentUserEmail(email);
    setCurrentPage('client-portal');
    toast.success('Cuenta creada exitosamente');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setIsClient(false);
    setCurrentUserEmail('');
    setCurrentPage('home');
    toast.success('Sesión cerrada');
  };

const handleBookAppointment = async (newAppointment: Appointment) => {
  try {
    // 1️⃣ Guardar en la base de datos
    await createAppointment(newAppointment);

    // 2️⃣ Volver a traer las citas reales desde el backend
    const updatedAppointments = await getAppointments();
    setAppointments(updatedAppointments);

    // 3️⃣ Crear notificación
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'pending',
      title: 'Cita Solicitada',
      message: 'Tu solicitud de cita ha sido enviada y está pendiente de confirmación.',
      date: new Date().toLocaleString('es-CO', { 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      appointmentDetails: {
        service: newAppointment.service,
        date: newAppointment.date,
        time: newAppointment.time
      }
    };

    setNotifications(prev => [notification, ...prev]);

    toast.success('Cita agendada exitosamente');
  } catch (error) {
    console.error(error);
    toast.error('Error al agendar la cita');
  }
};

  
const handleApproveAppointment = async (id: number | string) => {
  try {
    const idStr = id.toString();

    await updateAppointmentStatus(idStr, 'approved');

    // 🔥 ACTUALIZAR ESTADO LOCAL
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id ? { ...apt, status: 'approved' } : apt
      )
    );

    const appointment = appointments.find(apt => apt.id === id);
    if (!appointment) return;

    const notification: Notification = {
      id: Date.now().toString(),
      type: 'approved',
      title: 'Cita Confirmada',
      message: '¡Excelente! Tu cita ha sido confirmada.',
      date: new Date().toLocaleString('es-CO'),
      appointmentDetails: {
        service: appointment.service,
        date: appointment.date,
        time: appointment.time
      }
    };

    setNotifications(prev => [notification, ...prev]);

    toast.success(`Cita de ${appointment.client_name} aprobada`);
  } catch (error) {
    console.error(error);
    toast.error('Error al aprobar la cita');
  }
};



const handleRejectAppointment = async  (id: number | string, reason?: string) => {
  try {
    const idStr = id.toString();
    // 1️⃣ Guardar el rechazo en la BASE DE DATOS
    await updateAppointmentStatus(idStr, 'rejected', reason);

  setAppointments(prev =>
  prev.map(apt =>
    apt.id === id ? { ...apt, status: 'rejected' } : apt
  )
);

    // 3️⃣ Obtener la cita para notificación
    const appointment = appointments.find(apt => apt.id === id);
    if (!appointment) return;

    // 4️⃣ Crear notificación
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'rejected',
      title: 'Cita No Disponible',
      message: 'Lamentamos informarte que no podemos confirmar tu cita en este horario.',
      date: new Date().toLocaleString('es-CO', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      appointmentDetails: {
        service: appointment.service,
        date: appointment.date,
        time: appointment.time
      },
      rejectionReason: reason
    };

    // 5️⃣ Guardar notificación en la interfaz
    setNotifications(prev => [notification, ...prev]);

    toast.error(`Cita de ${appointment.client_name} rechazada`);
  } catch (error) {
    console.error(error);
    toast.error('Error al rechazar la cita');
  }
};



const handleCancelAppointment = async (id: number | string, reason: string) => {
  try {
     // Convertir id a string para la URL
    const idStr = id.toString();
    // 1️⃣ Guardar la cancelación en la BASE DE DATOS
    await updateAppointmentStatus(idStr, 'cancelled', reason);


    // 3️⃣ Obtener la cita para la notificación
    const appointment = appointments.find(apt => apt.id === id);
    if (!appointment) return;

    // 4️⃣ Crear notificación
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'cancelled',
      title: 'Cita Cancelada',
      message: 'Has cancelado tu cita exitosamente.',
      date: new Date().toLocaleString('es-CO', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      appointmentDetails: {
        service: appointment.service,
        date: appointment.date,
        time: appointment.time
      }
    };

    // 5️⃣ Guardar notificación en la interfaz
    setNotifications(prev => [notification, ...prev]);

    toast.success('Cita cancelada');
  } catch (error) {
    console.error(error);
    toast.error('Error al cancelar la cita');
  }
};



  const handleUpdateServicePrice = (serviceId: number | string, newPrice: string) => {
    const numericId = typeof serviceId === 'string' ? Number(serviceId) : serviceId;
    
    setServices(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, price: newPrice } : service
      )
    );
    toast.success('Precio actualizado');
  };


  const handleToggleTimeSlot = (timeSlot: string) => {
    setDisabledTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        toast.success(`${timeSlot} activado`);
        return prev.filter(t => t !== timeSlot);
      } else {
        toast.success(`${timeSlot} desactivado`);
        return [...prev, timeSlot];
      }
    });
  };

  const unreadNotifications = notifications.length;

  // Get booked slots from appointments
const bookedSlots = appointments
  .filter(apt => {
    const status = apt.status?.toLowerCase();
    return status === 'approved' || status === 'pending';
  })
  .map(apt => ({
    date: apt.date?.split('T')[0], // 🔥 IMPORTANTE por si viene con formato ISO
    time: apt.time
  }));


  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" richColors />
      
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        isClient={isClient}
        notificationCount={unreadNotifications}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'about' && <About />}
      {currentPage === 'services' && <Services onNavigate={handleNavigate} />}
      {currentPage === 'book' && (
        <BookAppointment 
          onBookAppointment={handleBookAppointment}
          bookedSlots={bookedSlots}
          blockedDates={blockedDates}
          disabledTimeSlots={disabledTimeSlots}
          services={services}
        />
      )}
      {currentPage === 'notifications' && <Notifications notifications={notifications} />}
      {currentPage === 'login' && (
        <Login onSuccess={handleLoginSuccess} />
      )}

      {currentPage === 'dashboard' && isAdmin && (
        <Dashboard
          appointments={appointments}
          services={services}
          blockedDates={blockedDates}
          disabledTimeSlots={disabledTimeSlots}
          onApproveAppointment={handleApproveAppointment}
          onRejectAppointment={handleRejectAppointment}
          onUpdateServicePrice={handleUpdateServicePrice}
          onToggleBlockDate={handleToggleBlockDate}
          onToggleTimeSlot={handleToggleTimeSlot}
        />
      )}
      {currentPage === 'client-portal' && isClient && (
        <ClientPortal
          userEmail={currentUserEmail}
          appointments={appointments}
          onCancelAppointment={handleCancelAppointment}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
