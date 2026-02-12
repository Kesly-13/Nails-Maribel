import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import type { Page } from '../App';


interface HomeProps {
  onNavigate: (page: Page) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBF6] to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8D4A8]/10 rounded-full">
              <Sparkles className="w-4 h-4 text-[#B8D4A8]" />
              <span className="text-sm text-gray-600">Tu belleza es nuestra pasión</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Bienvenida a<br />
              <span className="text-[#B8D4A8]">Nails Maribel</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Transforma tus manos en obras de arte. Servicios profesionales de uñas con los mejores productos y técnicas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => onNavigate('book')}
                className="bg-[#B8D4A8] hover:bg-[#A5C496] text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Agendar Cita
              </Button>
              
              <Button 
                onClick={() => onNavigate('services')}
                variant="outline"
                className="border-[#B8D4A8] text-[#B8D4A8] hover:bg-[#B8D4A8] hover:text-white px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
              >
                Ver Servicios
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              <div className="absolute inset-0 bg-[#B8D4A8]/20 rounded-3xl blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1754799670312-8e7da8e40ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWlsJTIwYXJ0JTIwbWFuaWN1cmUlMjBoYW5kc3xlbnwxfHx8fDE3NjkwODk0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Nail art"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#B8D4A8]/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="mb-2">Calidad Premium</h3>
            <p className="text-gray-600">Productos de la más alta calidad para resultados duraderos y hermosos.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#B8D4A8]/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💅</span>
            </div>
            <h3 className="mb-2">Profesionalismo</h3>
            <p className="text-gray-600">Técnicas especializadas y atención personalizada en cada servicio.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#B8D4A8]/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="mb-2">Diseños Únicos</h3>
            <p className="text-gray-600">Creatividad sin límites para que tus uñas reflejen tu personalidad.</p>
          </div>
        </div>
      </div>
    </div>
  );
}