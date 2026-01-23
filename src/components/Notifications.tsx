import { Bell, CheckCircle, XCircle, Clock } from 'lucide-react';

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

interface NotificationsProps {
  notifications: Notification[];
}

export function Notifications({ notifications }: NotificationsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-gray-500" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      case 'cancelled':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusText = (type: string) => {
    switch (type) {
      case 'approved':
        return 'Cita Confirmada';
      case 'rejected':
        return 'Cita Rechazada';
      case 'cancelled':
        return 'Cita Cancelada';
      default:
        return 'Cita Pendiente';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBF6] to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#B8D4A8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-[#B8D4A8]" />
          </div>
          <h1 className="mb-2">Notificaciones</h1>
          <p className="text-gray-600">Mantente al día con el estado de tus citas</p>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No tienes notificaciones</h3>
            <p className="text-gray-500">Cuando tengas novedades sobre tus citas, aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`bg-white rounded-2xl shadow-md border-2 p-6 transition-all hover:shadow-lg ${getColor(notification.type)}`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900">{getStatusText(notification.type)}</h3>
                      <span className="text-xs text-gray-500">{notification.date}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{notification.message}</p>

                    {/* Appointment Details */}
                    {notification.appointmentDetails && (
                      <div className="bg-white/50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Servicio:</span>
                          <span className="font-medium">{notification.appointmentDetails.service}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Fecha:</span>
                          <span className="font-medium">{notification.appointmentDetails.date}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Hora:</span>
                          <span className="font-medium">{notification.appointmentDetails.time}</span>
                        </div>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {notification.rejectionReason && (
                      <div className="bg-red-100/50 rounded-xl p-4 mt-3">
                        <p className="text-sm text-gray-700">
                          <strong>Motivo:</strong> {notification.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}