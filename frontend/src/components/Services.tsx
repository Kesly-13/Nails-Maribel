import { Clock, DollarSign } from 'lucide-react';
import { Button } from './ui/button';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  icon: string;
}

const services: Service[] = [
  {
    id: 'manicure-semi',
    name: 'Manicure Semipermanente',
    description: 'Esmaltado en gel que dura hasta 3 semanas. Colores vibrantes y brillo duradero.',
    price: '$60.000',
    duration: '60 min',
    icon: '✨'
  },
  {
    id: 'acrilicas',
    name: 'Uñas Acrílicas',
    description: 'Extensión de uñas con acrílico. Larga duración y resistencia perfecta para diseños elaborados.',
    price: '$80.000',
    duration: '90 min',
    icon: '💎'
  },
  {
    id: 'gel',
    name: 'Uñas de Gel',
    description: 'Aspecto natural y elegante con gel. Flexibles, duraderas y saludables para tus uñas.',
    price: '$75.000',
    duration: '75 min',
    icon: '🌟'
  },
  {
    id: 'nail-art',
    name: 'Nail Art Personalizado',
    description: 'Diseños únicos y creativos hechos a mano. Desde minimalista hasta elaborado.',
    price: '$100.000 - $135.000',
    duration: '30 - 60 min',
    icon: '🎨'
  },
  {
    id: 'retiro',
    name: 'Retiro de Esmaltado',
    description: 'Retiro profesional de gel o acrílico con cuidado especial para proteger tus uñas naturales.',
    price: '$30.000',
    duration: '30 min',
    icon: '🔧'
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento',
    description: 'Relleno y retoque de uñas acrílicas o de gel para mantenerlas en perfecto estado.',
    price: '$40.000',
    duration: '60 min',
    icon: '💫'
  }
];

export function Services({ onNavigate }: ServicesProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBF6] to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Nuestros Servicios</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra variedad de servicios profesionales diseñados para realzar la belleza de tus manos
          </p>
          <div className="w-20 h-1 bg-[#B8D4A8] mx-auto rounded-full mt-6"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map(service => (
            <div 
              key={service.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#B8D4A8] to-[#A5C496] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                
                {/* Service Name */}
                <h3 className="mb-2 text-gray-900">{service.name}</h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {service.description}
                </p>
                
                {/* Price and Duration */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-[#B8D4A8]">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">{service.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#B8D4A8] to-[#A5C496] rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-white mb-4">¿Lista para lucir uñas perfectas?</h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Agenda tu cita ahora y déjanos consentir tus manos con nuestros servicios profesionales
          </p>
          <Button 
            onClick={() => onNavigate('book')}
            className="bg-white text-[#B8D4A8] hover:bg-gray-50 px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Agendar Cita Ahora
          </Button>
        </div>
      </div>
    </div>
  );
}