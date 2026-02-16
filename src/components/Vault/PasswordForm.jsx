import { useState, useEffect } from 'react';
import { CATEGORIES } from '../../lib/categories';

export default function PasswordForm({ entry, onSave, onClose }) {
  const [form, setForm] = useState({
    site: '',
    url: '',
    category: 'personal',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setForm({
        site: entry.site || '',
        url: entry.url || '',
        category: entry.category || 'personal',
        username: entry.username || '',
        password: entry.password || '',
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form, entry?.id);
      onClose();
    } catch (err) {
      console.error('Error al guardar:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    const array = new Uint8Array(20);
    crypto.getRandomValues(array);
    const password = Array.from(array, (b) => chars[b % chars.length]).join('');
    setForm((prev) => ({ ...prev, password }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">
          {entry ? 'Editar contraseña' : 'Agregar contraseña'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Nombre del sitio
            </label>
            <input
              name="site"
              value={form.site}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="ej. GitHub"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">URL</label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="https://github.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Categoría
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Usuario / Email
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="usuario@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Contraseña
            </label>
            <div className="flex gap-2">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={generatePassword}
                className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-sm cursor-pointer"
                title="Generar contraseña"
              >
                Generar
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 text-gray-300 hover:bg-gray-700 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
