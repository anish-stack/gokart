import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getContactSubmissions, updateSubmissionStatus } from '../api/contactAreas';

const STATUS_OPTIONS = ['NEW', 'IN_PROGRESS', 'RESOLVED'];

export default function ContactSubmissionsPage() {
  const queryClient = useQueryClient();
  const { data: submissions, isLoading } = useQuery({ queryKey: ['submissions-admin'], queryFn: getContactSubmissions });

  const updateMut = useMutation({
    mutationFn: ({ id, status }) => updateSubmissionStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['submissions-admin'] }),
  });

  return (
    <div>
      <div className="page-header">
        <h2>Contact Submissions</h2>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Loading...</div>
        ) : !submissions?.length ? (
          <div className="empty-state">No contact form submissions yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone / Email</th>
                <th>Location</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.phone}<br />{s.email}</td>
                  <td>{[s.city, s.state, s.pincode].filter(Boolean).join(', ')}</td>
                  <td style={{ maxWidth: 320 }}>{s.message}</td>
                  <td>
                    <select
                      value={s.status}
                      onChange={(e) => updateMut.mutate({ id: s._id, status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
