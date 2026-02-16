import { Appointment, Service } from '../types';
import { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createAppointment } from '../services/appointmentService';


interface BookAppointmentProps {
  onBookAppointment: (appointment: any) => void;
  bookedSlots: { date: string; time: string }[];
  blockedDates: string[];
  disabledTimeSlots: string[];
  services: { id: number; name: string; price: string }[];
}

//const services = [
//  { id: 'manicure-semi', name: 'Manicure Semipermanente', price: '$60.000' },
//  { id: 'acrilicas', name: 'Uñas Acrílicas', price: '$80.000' },
//  { id: 'gel', name: 'Uñas de Gel', price: '$75.000' },
//  { id: 'nail-art', name: 'Nail Art Personalizado', price: '$100.000 - $135.000' },
//  { id: 'retiro', name: 'Retiro de Esmaltado', price: '$30.000' },//
//  { id: 'mantenimiento', name: 'Mantenimiento', price: '$40.000' },
// ];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];

export function BookAppointment({ onBookAppointment, bookedSlots, blockedDates, disabledTimeSlots, services: propServices }: BookAppointmentProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });


const isDateBlocked = (date: string) => {
  return blockedDates.includes(date);
};


const displayServices = propServices;

const isTimeUnavailable = (time: string) => {
  if (!selectedDate) return false;

  const time24 = convertTo24Hour(time);

  // Bloqueo global
  if (disabledTimeSlots.includes(time)) return true;

  // Revisar si está reservada
  return bookedSlots.some(
    slot =>
      slot.date === selectedDate &&
      slot.time === time24
  );
};


//actualizacion de recibir citas reals 
const convertTo24Hour = (time12h: string) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:00`;
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

const appointment = {
  client_name: formData.name,   // cambio sin id, phone, email, status,createdAt
  service: displayServices.find(s => s.id === selectedService)?.name || '',
  date: selectedDate,
  time: convertTo24Hour(selectedTime),
  phone: formData.phone,      
  email: formData.email,  
  status: 'pending',
};


  try {
    onBookAppointment(appointment); // actualiza la UI
    setStep('success');
  } catch (error) {
    console.error(error);
    alert('Error al agendar la cita');
  }
};
//actualizacion de recibir citas reals 


  const isFormValid = selectedDate && selectedTime && selectedService && 
                      formData.name && formData.phone && formData.email;

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FBF6] to-white py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-[#B8D4A8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-[#B8D4A8]" />
            </div>
            
            <h2 className="mb-4">¡Cita Agendada!</h2>
            
            <p className="text-gray-600 mb-6">
              Tu solicitud de cita ha sido enviada exitosamente. Recibirás una notificación cuando sea confirmada.
            </p>
            
            <div className="bg-[#B8D4A8]/10 rounded-2xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-2">Estado de tu cita:</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                <span className="font-medium text-yellow-700">Pendiente de confirmación</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setStep('form')}
              className="bg-[#B8D4A8] hover:bg-[#A5C496] text-white rounded-full px-8 transition-all duration-300 hover:scale-105"
            >
              Agendar Otra Cita
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBF6] to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8D4A8]/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#B8D4A8]" />
            <span className="text-sm text-gray-600">Reserva tu espacio</span>
          </div>
          <h1 className="mb-2">Agendar Cita</h1>
          <p className="text-gray-600">Completa el formulario y nos pondremos en contacto contigo</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          {/* Service Selection */}
          <div className="mb-6">
            <Label className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#B8D4A8]" />
              Selecciona tu servicio
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayServices.map(service => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedService === service.id
                      ? 'border-[#B8D4A8] bg-[#B8D4A8]/5'
                      : 'border-gray-200 hover:border-[#B8D4A8]/50'
                  }`}
                >
                  <p className="font-medium text-sm mb-1">{service.name}</p>
                  <p className="text-xs text-[#B8D4A8]">{service.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <Label className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#B8D4A8]" />
              Selecciona la fecha
            </Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="rounded-xl border-gray-200 focus:border-[#B8D4A8]"
              disabled={isDateBlocked(selectedDate)}
            />
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <Label className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#B8D4A8]" />
              Horarios disponibles
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {timeSlots.map(time => {
                const isBooked = isTimeUnavailable(time);
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                    className={`py-3 px-2 rounded-lg text-sm transition-all ${
                      isBooked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                        : selectedTime === time
                        ? 'bg-[#B8D4A8] text-white'
                        : 'bg-gray-50 hover:bg-[#B8D4A8]/10 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4 mb-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[#B8D4A8]" />
                Nombre completo
              </Label>
              <Input
                type="text"
                placeholder="Ej: Kesly Otero"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-gray-200 focus:border-[#B8D4A8]"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-[#B8D4A8]" />
                Teléfono
              </Label>
              <Input
                type="tel"
                placeholder="+57 300 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl border-gray-200 focus:border-[#B8D4A8]"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-[#B8D4A8]" />
                Correo electrónico
              </Label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl border-gray-200 focus:border-[#B8D4A8]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-[#B8D4A8] hover:bg-[#A5C496] text-white py-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Enviar Solicitud de Cita
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Recibirás una confirmación por correo y notificación en la app
          </p>
        </form>
      </div>
    </div>
  );
}