import { Appointment } from '../types';
import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ClientPortalProps {
  userEmail: string;
  appointments: Appointment[];
  onCancelAppointment: (id: number, reason: string) => void;
  onLogout: () => void;
}

export function ClientPortal({ userEmail, appointments, onCancelAppointment, onLogout }: ClientPortalProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const userAppointments = appointments.filter(apt => apt.email === userEmail);

  const canCancelAppointment = (appointmentDate: string) => {
    const aptDate = new Date(appointmentDate);
    const today = new Date();
    const diffTime = aptDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 1;
  };

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (selectedAppointment && cancellationReason.trim()) {
      onCancelAppointment(selectedAppointment.id, cancellationReason);
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancellationReason('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'approved':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'cancelled':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Confirmada';
      case 'rejected':
        return 'Rechazada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBF6] to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2">Mis Citas</h2>
              <p className="text-gray-600">{userEmail}</p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Appointments List */}
        {userAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No tienes citas agendadas</h3>
            <p className="text-gray-500">Agenda tu primera cita para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userAppointments.map(appointment => {
              const canCancel = canCancelAppointment(appointment.date) && 
                               (appointment.status === 'pending' || appointment.status === 'approved');
              
              return (
                <div
                  key={appointment.id}
                  className={`bg-white rounded-2xl shadow-md border-2 p-6 transition-all hover:shadow-lg ${getStatusColor(appointment.status)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-gray-900 mb-1">{appointment.service}</h3>
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                        appointment.status === 'approved' ? 'bg-green-200 text-green-800' :
                        appointment.status === 'rejected' ? 'bg-red-200 text-red-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {getStatusText(appointment.status)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{appointment.client_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{appointment.phone}</span>
                    </div>
                  </div>

                  {canCancel && (
                    <Button
                      onClick={() => handleCancelClick(appointment)}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 rounded-xl transition-all gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancelar Cita
                    </Button>
                  )}

                  {!canCancel && (appointment.status === 'pending' || appointment.status === 'approved') && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                      <span>No puedes cancelar con menos de 1 día de anticipación</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-gray-900 mb-4">Cancelar Cita</h3>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Servicio:</strong> {selectedAppointment.service}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Fecha:</strong> {selectedAppointment.date}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Hora:</strong> {selectedAppointment.time}
              </p>
            </div>

            <Label className="mb-2">Motivo de cancelación (obligatorio)</Label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Por favor indica el motivo de la cancelación..."
              className="w-full border border-gray-200 rounded-xl p-3 mb-4 min-h-[100px] focus:outline-none focus:border-[#B8D4A8] transition-colors"
            />
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                  setCancellationReason('');
                }}
                variant="outline"
                className="flex-1 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Volver
              </Button>
              <Button
                onClick={handleConfirmCancel}
                disabled={!cancellationReason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all disabled:opacity-50"
              >
                Confirmar Cancelación
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
