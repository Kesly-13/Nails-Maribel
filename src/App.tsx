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
import { Toaster, toast } from 'sonner@2.0.3';

type Page = 'home' | 'about' | 'services' | 'book' | 'notifications' | 'login' | 'dashboard' | 'client-portal';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  rejectionReason?: string;
  cancellationReason?: string;
}

interface Notification {
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

interface Service {
  id: string;
  name: string;
  price: string;
}

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
  
  // Admin configuration
  const [services, setServices] = useState<Service[]>([
    { id: 'manicure-semi', name: 'Manicure Semipermanente', price: '$60.000' },
    { id: 'acrilicas', name: 'Uñas Acrílicas', price: '$80.000' },
    { id: 'gel', name: 'Uñas de Gel', price: '$75.000' },
    { id: 'nail-art', name: 'Nail Art Personalizado', price: '$100.000 - $135.000' },
    { id: 'retiro', name: 'Retiro de Esmaltado', price: '$30.000' },
    { id: 'mantenimiento', name: 'Mantenimiento', price: '$40.000' },
  ]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [disabledTimeSlots, setDisabledTimeSlots] = useState<string[]>([]);

  // Cargar datos de ejemplo al inicio
  useEffect(() => {
    const sampleAppointments: Appointment[] = [
      {
        id: '1',
        name: 'Laura Martínez',
        phone: '+57 300 123 4567',
        email: 'laura@email.com',
        date: '2026-01-25',
        time: '10:00 AM',
        service: 'Manicure Semipermanente',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Carolina Gómez',
        phone: '+57 310 987 6543',
        email: 'carolina@email.com',
        date: '2026-01-26',
        time: '2:00 PM',
        service: 'Uñas Acrílicas',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'María Rodríguez',
        phone: '+57 315 555 1234',
        email: 'maria@email.com',
        date: '2026-01-27',
        time: '11:00 AM',
        service: 'Nail Art Personalizado',
        status: 'approved',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Andrea López',
        phone: '+57 320 444 5678',
        email: 'andrea@email.com',
        date: '2026-01-28',
        time: '3:00 PM',
        service: 'Uñas de Gel',
        status: 'cancelled',
        createdAt: new Date().toISOString(),
        cancellationReason: 'Tengo un compromiso laboral urgente'
      },
      {
        id: '5',
        name: 'Sofía Vargas',
        phone: '+57 318 333 9999',
        email: 'sofia@email.com',
        date: '2026-01-25',
        time: '3:00 PM',
        service: 'Mantenimiento',
        status: 'approved',
        createdAt: new Date().toISOString()
      }
    ];
    setAppointments(sampleAppointments);
    
    // Crear notificaciones de ejemplo
    const sampleNotifications: Notification[] = [
      {
        id: '1',
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
          service: 'Manicure Semipermanente',
          date: '2026-01-25',
          time: '10:00 AM'
        }
      }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
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

  const handleBookAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment]);
    
    // Crear notificación de cita pendiente
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
  };

  const handleApproveAppointment = (id: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id ? { ...apt, status: 'approved' as const } : apt
      )
    );

    const appointment = appointments.find(apt => apt.id === id);
    if (appointment) {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'approved',
        title: 'Cita Confirmada',
        message: '¡Excelente! Tu cita ha sido confirmada. Te esperamos.',
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
      
      setNotifications(prev => [notification, ...prev]);
      toast.success(`Cita de ${appointment.name} aprobada`);
    }
  };

  const handleRejectAppointment = (id: string, reason?: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id 
          ? { ...apt, status: 'rejected' as const, rejectionReason: reason } 
          : apt
      )
    );

    const appointment = appointments.find(apt => apt.id === id);
    if (appointment) {
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
      
      setNotifications(prev => [notification, ...prev]);
      toast.error(`Cita de ${appointment.name} rechazada`);
    }
  };

  const handleCancelAppointment = (id: string, reason: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id 
          ? { ...apt, status: 'cancelled' as const, cancellationReason: reason } 
          : apt
      )
    );

    const appointment = appointments.find(apt => apt.id === id);
    if (appointment) {
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
      
      setNotifications(prev => [notification, ...prev]);
      toast.success('Cita cancelada');
    }
  };

  const handleUpdateServicePrice = (serviceId: string, newPrice: string) => {
    setServices(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, price: newPrice } : service
      )
    );
    toast.success('Precio actualizado');
  };

  const handleToggleBlockDate = (date: string) => {
    setBlockedDates(prev => {
      if (prev.includes(date)) {
        toast.success('Fecha desbloqueada');
        return prev.filter(d => d !== date);
      } else {
        toast.success('Fecha bloqueada');
        return [...prev, date];
      }
    });
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
    .filter(apt => apt.status === 'approved' || apt.status === 'pending')
    .map(apt => ({ date: apt.date, time: apt.time }));

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
        <Login 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
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