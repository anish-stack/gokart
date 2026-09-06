import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getShipments, getShipmentDetail } from '../api/shipments';
import Modal from '../components/Modal';

export default function ShipmentsPage() {
  const { data: shipments, isLoading } = useQuery({ queryKey: ['shipments-admin'], queryFn: getShipments });
  const [selectedId, setSelectedId] = useState(null);

  const detailQuery = useQuery({
    queryKey: ['shipment-detail', selectedId],
    queryFn: () => getShipmentDetail(selectedId),
    enabled: !!selectedId,
  });

  return (
    <div>
      <div className="page-header">
        <h2>Shipments</h2>
      </div>
      <p style={{ color: 'var(--go-muted)', fontSize: 14, marginTop: -12 }}>
        Shipments tracked by the mobile app, cached from the active tracking provider.
      </p>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Loading...</div>
        ) : !shipments?.length ? (
          <div className="empty-state">No shipments tracked yet. Try tracking a demo AWB from the mobile app.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>AWB</th>
                <th>Courier</th>
                <th>Route</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s._id}>
                  <td>{s.awb}</td>
                  <td>{s.courier}</td>
                  <td>{s.origin} → {s.destination}</td>
                  <td><span className="badge status">{s.status}</span></td>
                  <td>{new Date(s.lastUpdated).toLocaleString()}</td>
                  <td className="actions-cell">
                    <button className="icon-btn" type="button" onClick={() => setSelectedId(s._id)}>View timeline</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedId && (
        <Modal title="Shipment Timeline" onClose={() => setSelectedId(null)}>
          {detailQuery.isLoading ? (
            <div className="empty-state">Loading...</div>
          ) : (
            <div>
              <p><strong>AWB:</strong> {detailQuery.data?.shipment?.awb}</p>
              <p><strong>Route:</strong> {detailQuery.data?.shipment?.origin} → {detailQuery.data?.shipment?.destination}</p>
              <ul style={{ paddingLeft: 18 }}>
                {(detailQuery.data?.events || []).map((event) => (
                  <li key={event._id} style={{ marginBottom: 10 }}>
                    <strong>{event.status}</strong> — {event.location}
                    <br />
                    <span style={{ color: 'var(--go-muted)', fontSize: 13 }}>
                      {event.description} {event.occurredAt ? `(${new Date(event.occurredAt).toLocaleString()})` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
