import { useQuery } from '@tanstack/react-query';
import { getShipments } from '../api/shipments';
import { getServices } from '../api/services';
import { getProducts } from '../api/products';
import { getContactSubmissions } from '../api/contactAreas';
import { useAuth } from '../context/AuthContext';

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: 180 }}>
      <div style={{ color: 'var(--go-muted)', fontSize: 13, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const shipments = useQuery({ queryKey: ['shipments'], queryFn: getShipments });
  const services = useQuery({ queryKey: ['services'], queryFn: getServices });
  const products = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const submissions = useQuery({ queryKey: ['submissions'], queryFn: getContactSubmissions });

  const newSubmissions = (submissions.data || []).filter((s) => s.status === 'NEW').length;

  return (
    <div>
      <div className="page-header">
        <h2>Welcome back, {user?.name?.split(' ')[0]}</h2>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard label="Tracked Shipments" value={shipments.data?.length ?? '—'} />
        <StatCard label="Active Services" value={services.data?.length ?? '—'} />
        <StatCard label="Active Products" value={products.data?.length ?? '—'} />
        <StatCard label="New Contact Requests" value={newSubmissions} />
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Quick links</h3>
        <p style={{ color: 'var(--go-muted)', fontSize: 14 }}>
          Manage services, products and CMS content shown in the GO! Track Express mobile app,
          configure regional support contacts, monitor shipment tracking activity, and review
          push notification delivery — all from this console.
        </p>
      </div>
    </div>
  );
}
