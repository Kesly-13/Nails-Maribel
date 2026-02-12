import { Heart, Award, Clock } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8FBF6] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Sobre Nails Maribel</h1>
          <div className="w-20 h-1 bg-[#B8D4A8] mx-auto rounded-full"></div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-[#B8D4A8]" />
            <h2>Nuestra Historia</h2>
          </div>
          
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Nails Maribel nació del amor por el arte de las uñas y el deseo de hacer sentir hermosa a cada mujer que cruza nuestras puertas. Con más de 5 años de experiencia en el mundo de la belleza, hemos perfeccionado nuestras técnicas para ofrecerte resultados excepcionales.
            </p>
            
            <p>
              Lo que comenzó como un sueño en una pequeña habitación, hoy se ha convertido en un espacio acogedor donde la creatividad y la profesionalidad se unen para brindarte la mejor experiencia en cuidado de uñas.
            </p>
            
            <p>
              Cada clienta es especial para nosotros. Nos tomamos el tiempo de escuchar tus preferencias, entender tu estilo y crear diseños que no solo embellecen tus manos, sino que también reflejan tu personalidad única.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#B8D4A8]/10 rounded-full flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-[#B8D4A8]" />
            </div>
            <h3 className="mb-2">Excelencia</h3>
            <p className="text-gray-600">
              Nos esforzamos por superar tus expectativas en cada visita, utilizando solo los mejores productos del mercado.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#B8D4A8]/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-[#B8D4A8]" />
            </div>
            <h3 className="mb-2">Puntualidad</h3>
            <p className="text-gray-600">
              Valoramos tu tiempo. Cada cita es programada cuidadosamente para garantizar atención sin prisas.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-[#B8D4A8] to-[#A5C496] rounded-3xl shadow-lg p-8 md:p-12 text-white">
          <h2 className="mb-4 text-white">Nuestra Misión</h2>
          <p className="text-lg leading-relaxed opacity-95">
            Hacer que cada mujer se sienta segura, hermosa y única a través del arte del cuidado de uñas. Creamos no solo diseños impecables, sino momentos de relajación y autocuidado que merecen formar parte de tu rutina.
          </p>
        </div>
      </div>
    </div>
  );
}
