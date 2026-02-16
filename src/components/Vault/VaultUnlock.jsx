import { useState } from 'react';
import { useVault } from '../../context/VaultContext';

export default function VaultUnlock() {
  const { hasMasterPassword, createMasterPassword, unlock } = useVault();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSetup = !hasMasterPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSetup && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña maestra debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      if (isSetup) {
        await createMasterPassword(password);
      } else {
        await unlock(password);
      }
    } catch {
      setError('Contraseña maestra incorrecta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{isSetup ? '🔑' : '🔒'}</div>
          <h2 className="text-xl font-bold text-white">
            {isSetup ? 'Crear contraseña maestra' : 'Desbloquear bóveda'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isSetup
              ? 'Esta contraseña encripta todos tus datos. ¡Recuérdala bien!'
              : 'Ingresa tu contraseña maestra para acceder.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Contraseña maestra
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Ingresa tu contraseña maestra"
              autoFocus
            />
          </div>

          {isSetup && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Confirma tu contraseña maestra"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {loading
              ? 'Procesando...'
              : isSetup
                ? 'Crear contraseña maestra'
                : 'Desbloquear'}
          </button>
        </form>
      </div>
    </div>
  );
}
