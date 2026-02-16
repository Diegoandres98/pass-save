import { useState } from 'react';
import { usePasswords } from '../../hooks/usePasswords';
import { CATEGORIES } from '../../lib/categories';
import PasswordCard from './PasswordCard';
import PasswordForm from './PasswordForm';

export default function PasswordList() {
  const { passwords, loading, addPassword, updatePassword, removePassword } =
    usePasswords();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  const filtered = passwords.filter((p) => {
    const matchesSearch =
      p.site.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      (p.url && p.url.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      categoryFilter === 'todas' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (form, id) => {
    if (id) {
      await updatePassword(id, form);
    } else {
      await addPassword(form);
    }
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta contraseña?')) {
      await removePassword(id);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditEntry(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Cargando contraseñas...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contraseñas..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors cursor-pointer flex-shrink-0"
        >
          + Agregar
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setCategoryFilter('todas')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
            categoryFilter === 'todas'
              ? 'bg-gray-700 text-white'
              : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          Todas
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-gray-700 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🔑</div>
          <p className="text-gray-400">
            {passwords.length === 0
              ? 'Aún no tienes contraseñas. ¡Agrega la primera!'
              : 'No se encontraron contraseñas.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <PasswordCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <PasswordForm
          entry={editEntry}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
