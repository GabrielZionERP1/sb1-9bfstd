import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { dbService } from '../../services/dbService';

interface NavbarProps {
  onCityChange: (city: string) => void;
}

export const Navbar = ({ onCityChange }: NavbarProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('Buscando localização...');
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDbConnection = async () => {
      const connected = await dbService.checkConnection();
      setIsDbConnected(connected);
    };
    checkDbConnection();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=pt`
          );
          const data = await response.json();
          const city = data.city || 'Localização não encontrada';
          setCurrentCity(city);
          onCityChange(city);
        } catch (error) {
          setCurrentCity('Localização indisponível');
        }
      }, () => {
        setCurrentCity('Acesso à localização negado');
      });
    } else {
      setCurrentCity('Geolocalização não suportada');
    }
  }, [onCityChange]);

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="Diretório Empresarial"
                className="h-12 w-36 object-contain"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 text-indigo-500 mr-1" />
                <select 
                  className="border-0 bg-transparent focus:ring-0 text-sm text-gray-600 cursor-pointer"
                  value={currentCity}
                  onChange={(e) => {
                    setCurrentCity(e.target.value);
                    onCityChange(e.target.value);
                  }}
                >
                  <option value={currentCity}>{currentCity}</option>
                </select>
                {isDbConnected !== null && (
                  <span className={`ml-2 text-sm font-medium ${isDbConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isDbConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
};