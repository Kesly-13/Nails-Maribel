import { Appointment, Service } from '../types';
import { useState,  } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, CheckCircle, XCircle, ChevronLeft, ChevronRight, Settings, Edit2, Save, X as XIcon, BanIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DashboardProps {
  appointments: Appointment[];
  services: Service[];
  blockedDates: string[];
  disabledTimeSlots: string[];
  onApproveAppointment: (id: number | string) => void;
  onRejectAppointment: (id: number | string, reason?: string) => void;
  
  onUpdateServicePrice: (serviceId: number, newPrice: string) => void;
  onToggleBlockDate: (date: string) => void;
  onToggleTimeSlot: (timeSlot: string) => void;
}

export function Dashboard({ 
  appointments, 
  services, 
  blockedDates,  
  disabledTimeSlots,
  onApproveAppointment, 
  onRejectAppointment,
  onUpdateServicePrice,
  onToggleBlockDate,
  onToggleTimeSlot
}: DashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingPrices, setEditingPrices] = useState(false);
  const [tempPrices, setTempPrices] = useState<{ [key: string]: string }>({});
  const [selectedDateToBlock, setSelectedDateToBlock] = useState('');

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentsForDate = (day: number) => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return appointments.filter(apt => apt.date === dateStr);
  };

  const isDateBlocked = (day: number) => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return blockedDates.includes(dateStr);
  };

  const handleReject = () => {
    if (selectedAppointment) {
      // Motivo es opcional ahora
      onRejectAppointment(selectedAppointment.id, rejectionReason.trim() || undefined);
      setShowRejectModal(false);
      setSelectedAppointment(null);
      setRejectionReason('');
    }
  };

  

  const handleSavePrices = () => {
    Object.entries(tempPrices).forEach(([serviceId, newPrice]) => {
      if (newPrice.trim()) {
        onUpdateServicePrice(Number(serviceId), newPrice); 
      }
    });
    setEditingPrices(false);
    setTempPrices({});
  };

  const handleCancelEditPrices = () => {
    setEditingPrices(false);
    setTempPrices({});
  };

  const handleBlockDate = () => {
    if (selectedDateToBlock) {
      onToggleBlockDate(selectedDateToBlock);
      setSelectedDateToBlock('');
    }
  };
  

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedMonth);

  const stats = {
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    rejected: appointments.filter(a => a.status === 'rejected').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    total: appointments.length
  };

  // Get appointments for selected day
  const selectedDayAppointments = selectedDay !== null ? getAppointmentsForDate(selectedDay) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBF6] to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Dashboard de Citas</h1>
            <p className="text-gray-600">Gestiona todas las solicitudes de tus clientas</p>
          </div>
          <Button
            onClick={() => setShowSettingsModal(true)}
            className="bg-[#B8D4A8] hover:bg-[#A5C496] text-white rounded-xl gap-2"
          >
            <Settings className="w-4 h-4" />
            Configuración
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-[#B8D4A8] hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-600 mb-1">Pendientes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-600 mb-1">Aprobadas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-600 mb-1">Rechazadas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-gray-500 hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-600 mb-1">Canceladas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
          </div>
        </div>
        

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">
                {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </h3>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                  className="rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                  className="rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {/* Days of week */}
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}



              {/* Empty cells for alignment */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayAppointments = getAppointmentsForDate(day);
                const hasAppointments = dayAppointments.length > 0;
                const hasPending = dayAppointments.some(a => a.status === 'pending');
                const blocked = isDateBlocked(day);
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    className={`aspect-square rounded-lg text-sm transition-all relative ${
                      isSelected
                        ? 'bg-[#B8D4A8] text-white font-bold shadow-md'
                        : blocked
                        ? 'bg-red-100 text-red-600 line-through cursor-not-allowed'
                        : hasAppointments
                        ? 'bg-[#B8D4A8]/20 hover:bg-[#B8D4A8]/30 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                    {hasPending && !blocked && !isSelected && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
                    )}
                    {blocked && (
                      <BanIcon className="absolute bottom-1 right-1 w-3 h-3 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Appointments */}
            {selectedDay !== null && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Citas del {selectedDay} de {monthNames[selectedMonth.getMonth()]}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDay(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
                
                {selectedDayAppointments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No hay citas programadas para este día</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedDayAppointments.map(apt => (
                      <div
                        key={apt.id}
                        className={`p-3 rounded-xl text-sm border-l-4 ${
                          apt.status === 'pending'
                            ? 'bg-yellow-50 border-yellow-500'
                            : apt.status === 'approved'
                            ? 'bg-green-50 border-green-500'
                            : apt.status === 'cancelled'
                            ? 'bg-gray-50 border-gray-500'
                            : 'bg-red-50 border-red-500'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-medium text-gray-900">{apt.client_name}</span>
                          <span className="text-xs text-gray-600">{apt.time}</span>
                        </div>
                        <p className="text-xs text-gray-600">{apt.service}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            apt.status === 'pending'
                              ? 'bg-yellow-200 text-yellow-800'
                              : apt.status === 'approved'
                              ? 'bg-green-200 text-green-800'
                              : apt.status === 'cancelled'
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-red-200 text-red-800'
                          }`}>
                            {apt.status === 'pending' ? 'Pendiente' : 
                            apt.status === 'approved' ? 'Aprobada' : 
                            apt.status === 'cancelled' ? 'Cancelada' : 'Rechazada'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-gray-900 mb-4">Solicitudes de Citas</h3>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay citas agendadas</p>
                </div>
              ) : (
                appointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className={`border-2 rounded-2xl p-4 transition-all hover:shadow-md ${
                      appointment.status === 'pending'
                        ? 'border-yellow-200 bg-yellow-50'
                        : appointment.status === 'approved'
                        ? 'border-green-200 bg-green-50'
                        : appointment.status === 'cancelled'
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.client_name}</h4>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : appointment.status === 'approved'
                          ? 'bg-green-200 text-green-800'
                          : appointment.status === 'cancelled'
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {appointment.status === 'pending' ? 'Pendiente' : 
                      appointment.status === 'approved' ? 'Aprobada' : 
                      appointment.status === 'cancelled' ? 'Cancelada' : 'Rechazada'}
                      </div>
                    </div>

                    <div className="space-y-1 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{appointment.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{appointment.email}</span>
                      </div>
                    </div>

                    {appointment.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
  console.log("APPOINTMENT:", appointment);
  onApproveAppointment(appointment.id);
}}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowRejectModal(true);
                          }}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-gray-900 mb-4">Rechazar Cita</h3>
            <p className="text-sm text-gray-600 mb-4">
              Puedes indicar un motivo del rechazo (opcional):
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ej: Horario no disponible, fecha muy próxima, etc. (opcional)"
              className="w-full border border-gray-200 rounded-xl p-3 mb-4 min-h-[100px] focus:outline-none focus:border-[#B8D4A8] transition-colors"
            />
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedAppointment(null);
                  setRejectionReason('');
                }}
                variant="outline"
                className="flex-1 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleReject}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
              >
                Confirmar Rechazo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Configuración del Sistema</h3>
              <Button
                onClick={() => setShowSettingsModal(false)}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Price Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Gestión de Precios</h4>
                  {!editingPrices ? (
                    <Button
                      onClick={() => setEditingPrices(true)}
                      size="sm"
                      variant="outline"
                      className="gap-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar Precios
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCancelEditPrices}
                        size="sm"
                        variant="outline"
                        className="gap-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSavePrices}
                        size="sm"
                        className="gap-2 bg-[#B8D4A8] hover:bg-[#A5C496] text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Guardar
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {services.map(service => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-700">{service.name}</span> //SOS
                      {editingPrices ? (
                        <Input
                          type="text"
                          placeholder={service.price}
                          value={tempPrices[service.id] || ''}
                          onChange={(e) => setTempPrices({ ...tempPrices, [service.id]: e.target.value })}
                          className="w-32 rounded-lg border-gray-200 focus:border-[#B8D4A8]"
                        />
                      ) : (
                        <span className="font-medium text-[#B8D4A8]">{service.price}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Block Dates */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Bloquear Días</h4>
                <div className="flex gap-2 mb-4">
                  <Input
                    type="date"
                    value={selectedDateToBlock}
                    onChange={(e) => setSelectedDateToBlock(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1 rounded-xl border-gray-200 focus:border-[#B8D4A8]"
                  />
                  <Button
                    onClick={handleBlockDate}
                    disabled={!selectedDateToBlock}
                    className="bg-[#B8D4A8] hover:bg-[#A5C496] text-white rounded-xl transition-all disabled:opacity-50"
                  >
                    Bloquear/Desbloquear
                  </Button>
                </div>
                
                {blockedDates.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Días bloqueados:</p>
                    <div className="flex flex-wrap gap-2">
                      {blockedDates.map(date => (
                        <div key={date} className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg text-sm">
                          <span>{date}</span>
                          <button
                            onClick={() => onToggleBlockDate(date)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Time Slots Management */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Gestión de Horarios</h4>
                <p className="text-sm text-gray-600 mb-3">Activa o desactiva horarios disponibles:</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => {
                    const isDisabled = disabledTimeSlots.includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => onToggleTimeSlot(time)}
                        className={`py-2 px-3 rounded-lg text-sm transition-all ${
                          isDisabled
                            ? 'bg-gray-200 text-gray-500 line-through'
                            : 'bg-[#B8D4A8] text-white hover:bg-[#A5C496]'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
