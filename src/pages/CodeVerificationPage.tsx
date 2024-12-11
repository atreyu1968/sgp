import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { KeyRound, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { validateCode } from '../services/verificationCodeService';

const CodeVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const validCode = await validateCode(verificationCode);
      if (!validCode) {
        navigate('/invalid-code');
        return;
      }

      // Redirect based on role
      navigate(`/register/${validCode.type.toLowerCase()}`);
    } catch (error) {
      console.error('Error validating code:', error);
      setError('Error al validar el código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <img
              src={settings?.appearance?.branding?.logo}
              alt="Logo"
              className="h-24 mx-auto"
            />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Verificar Código
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Introduce el código de verificación que has recibido
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Código de verificación
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Introduce el código"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !verificationCode}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Verificar código'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
          alt="Background"
        />
        <div className="absolute inset-0 bg-blue-900 mix-blend-multiply opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-xl text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Únete a la innovación
            </h2>
            <p className="text-xl text-blue-100">
              Transforma el futuro con tus ideas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeVerificationPage;