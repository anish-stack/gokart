export default function StatusBadge({ active }) {
  return <span className={`badge ${active ? 'active' : 'inactive'}`}>{active ? 'Active' : 'Inactive'}</span>;
}
