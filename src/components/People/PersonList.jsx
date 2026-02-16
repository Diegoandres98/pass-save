import { useState } from 'react';
import { usePeople } from '../../hooks/usePeople';
import PersonCard from './PersonCard';
import PersonForm from './PersonForm';

export default function PersonList() {
  const { people, loading, addPerson, updatePerson, removePerson } =
    usePeople();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  const filtered = people.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.nickname && p.nickname.toLowerCase().includes(q))
    );
  });

  const handleSave = async (form, id) => {
    if (id) {
      await updatePerson(id, form);
    } else {
      await addPerson(form);
    }
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta persona?')) {
      await removePerson(id);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditEntry(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Cargando personas...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
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
            placeholder="Buscar personas..."
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

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">👤</div>
          <p className="text-gray-400">
            {people.length === 0
              ? 'Aún no tienes personas. ¡Agrega la primera!'
              : 'No se encontraron personas.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <PersonCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <PersonForm
          entry={editEntry}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
