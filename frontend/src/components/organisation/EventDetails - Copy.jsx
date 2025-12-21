import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const EventDetails = () => {
  const { id } = useParams(); // event id
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  /* ---------------- FETCH EVENT INFO ---------------- */
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/event/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setEvent(res.data?.data || res.data);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to load event.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH REGISTRATIONS ---------------- */
  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/event/allRegUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistrations(res.data?.data || []);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to load registrations");
    }
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (regId, status) => {
    try {
      await axios.patch(
        `${API_BASE}/registrations/${regId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRegistrations();
    } catch (err) {
      alert(err?.response?.data?.message || "Status update failed");
    }
  };

  /* ---------------- DELETE EVENT ---------------- */
  const handleDelete = async () => {
    if (!confirm("Delete this event?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/org/events");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to delete event.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    if (id) {
      fetchEvent();
      fetchRegistrations();
    }
  }, [id]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Event Details
          </h1>
          <p className="text-sm text-slate-600">
            View event info and manage registrations
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/org/events"
            className="rounded border px-4 py-2 text-sm"
          >
            Back
          </Link>
          <button
            onClick={handleDelete}
            className="rounded bg-rose-600 px-4 py-2 text-sm text-white"
          >
            Delete
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded bg-amber-50 p-2 text-sm text-amber-800">
          {message}
        </div>
      )}

      {/* EVENT INFO */}
      {event && (
        <div className="rounded-lg border p-6">
          <p className="text-xs uppercase text-indigo-600 font-semibold">
            {event.approvalMode} approval
          </p>
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-sm">{new Date(event.date).toLocaleString()}</p>
          <p className="text-sm">{event.venue}</p>
          <p className="mt-3">{event.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Ticket Limit:</strong> {event.ticketLimit || "Unlimited"}
              <br/>
              <strong>Total Registration:</strong> {event.totalRegister }

            </div>
            {event.organizer && (
              <div>
                <strong>Organizer:</strong> {event.organizer.name}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REGISTRATIONS */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Registrations</h2>

        {registrations.length === 0 && (
          <p className="text-sm text-slate-600">No registrations yet</p>
        )}

        {registrations.length > 0 && (
          <table className="w-full border text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg._id} className="border-t">
                  <td className="p-2">{reg.name}</td>
                  <td className="p-2">{reg.email}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        reg.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : reg.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>
                  <td className="p-2 space-x-2">
                    {reg.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(reg._id, "approved")}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(reg._id, "rejected")}
                          className="bg-rose-600 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {reg.status === "approved" && reg.ticketId && (
                      <span className="text-xs text-slate-600">
                        Ticket: {reg.ticketId}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
