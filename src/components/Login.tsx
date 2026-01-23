import { useState } from 'react';
import { Lock, Mail, Sparkles, User, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginProps {
  onLogin: (email: string, password: string, isAdmin: boolean) => void;
  onRegister: (name: string, email: string, phone: string, password: string) => void;
}

export function Login({ onLogin, onRegister }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      // Check if admin
      if (email === 'admin@nailsmaribel.com' && password === 'admin123') {
        onLogin(email, password, true);
      } else {
        // Client login
        onLogin(email, password, false);
      }
    } else {
      // Register
      if (!name || !email || !phone || !password) {
        setError('Todos los campos son obligatorios');
        return;
      }
      onRegister(name, email, phone, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBF6] to-white py-12 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#B8D4A8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#B8D4A8]" />
            </div>
            <h2 className="mb-2">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-gray-600 text-sm">
              {mode === 'login' 
                ? 'Ingresa tus credenciales para continuar' 
                : 'Regístrate para gestionar tus citas'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                mode === 'login' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                mode === 'register' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#B8D4A8]" />
                    Nombre completo
                  </Label>
                  <Input
                    type="text"
                    placeholder="María González"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#B8D4A8]"
                    required
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#B8D4A8]"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-[#B8D4A8]" />
                Correo electrónico
              </Label>
              <Input
                type="email"
                placeholder={mode === 'login' ? 'tu@email.com' : 'tu@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-[#B8D4A8]"
                required
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-[#B8D4A8]" />
                Contraseña
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-[#B8D4A8]"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button 
              type="submit"
              className="w-full bg-[#B8D4A8] hover:bg-[#A5C496] text-white py-6 rounded-full transition-all"
            >
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Button>
          </form>

          {/* Demo Credentials - Only show in login mode */}
          {mode === 'login' && (
            <div className="mt-6 p-4 bg-[#B8D4A8]/5 rounded-xl border border-[#B8D4A8]/20">
              <p className="text-xs text-gray-600 mb-2">
                <strong>Acceso Administrador:</strong>
              </p>
              <p className="text-xs text-gray-500">Email: admin@nailsmaribel.com</p>
              <p className="text-xs text-gray-500">Contraseña: admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}