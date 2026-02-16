import { useAuth } from '../../context/AuthContext';
import { useVault } from '../../context/VaultContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { isUnlocked, lock } = useVault();

  const handleSignOut = () => {
    lock();
    logout();
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔐</span>
          <h1 className="text-xl font-bold text-white">PassSave</h1>
        </div>
        <div className="flex items-center gap-3">
          {isUnlocked && (
            <button
              onClick={lock}
              className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              Bloquear
            </button>
          )}
          <div className="flex items-center gap-2">
            <img
              src={user.photoURL}
              alt=""
              className="w-8 h-8 rounded-full"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm text-gray-300 hidden sm:inline">
              {user.displayName}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
