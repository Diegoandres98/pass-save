export const CONTACT_CATEGORIES = [
  { id: 'electricista', label: 'Electricista', color: 'bg-yellow-500' },
  { id: 'plomero', label: 'Plomero', color: 'bg-blue-500' },
  { id: 'albanil', label: 'Albañil', color: 'bg-orange-500' },
  { id: 'doctor', label: 'Doctor', color: 'bg-red-500' },
  { id: 'abogado', label: 'Abogado', color: 'bg-purple-500' },
  { id: 'mecanico', label: 'Mecánico', color: 'bg-gray-500' },
  { id: 'cerrajero', label: 'Cerrajero', color: 'bg-amber-600' },
  { id: 'contador', label: 'Contador', color: 'bg-green-500' },
  { id: 'dentista', label: 'Dentista', color: 'bg-cyan-500' },
  { id: 'veterinario', label: 'Veterinario', color: 'bg-emerald-500' },
  { id: 'tecnico-it', label: 'Técnico IT', color: 'bg-indigo-500' },
  { id: 'otro', label: 'Otro', color: 'bg-slate-500' },
];

export function getContactCategoryById(id) {
  return (
    CONTACT_CATEGORIES.find((c) => c.id === id) || {
      id,
      label: id,
      color: 'bg-gray-500',
    }
  );
}
