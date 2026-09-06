import { useQuery } from '@tanstack/react-query';
import { getNotificationLogs } from '../api/notificationLogs';

export default function NotificationLogsPage() {
  const { data: logs, isLoading } = useQuery({ queryKey: ['notification-logs'], queryFn: getNotificationLogs });

  return (
    <div>
      <div className="page-header">
        <h2>Notification Logs</h2>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Loading...</div>
        ) : !logs?.length ? (
          <div className="empty-state">No push notifications sent yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>AWB</th>
                <th>Status</th>
                <th>Title</th>
                <th>Device</th>
                <th>Sent</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{log.awb}</td>
                  <td><span className="badge status">{log.status}</span></td>
                  <td>{log.title}</td>
                  <td>{log.device?.deviceId?.slice(0, 10)}... ({log.device?.platform})</td>
                  <td>{new Date(log.sentAt).toLocaleString()}</td>
                  <td><span className={`badge ${log.success ? 'active' : 'inactive'}`}>{log.success ? 'Sent' : 'Failed'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
