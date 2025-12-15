import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const BookTicket = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    event: "",
    name: "",
    email: ""
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketData, setTicketData] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const today = useMemo(() => new Date().setHours(0, 0, 0, 0), []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/event`);
        const list = data?.data || data || [];
        const upcoming = list.filter((evt) => {
          const d = evt.date ? new Date(evt.date).setHours(0, 0, 0, 0) : null;
          return d === null ? true : d >= today;
        });
        setEvents(upcoming);
        if (id) {
          const match = upcoming.find((e) => (e._id || e.id) === id);
          setFormData((prev) => ({ ...prev, event: match ? (match._id || match.id) : id }));
        }
      } catch (err) {
        setMessage("Unable to load events right now.");
      }
    };
    fetchEvents();
  }, [API_URL, id, today]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generatePDF = async (ticket) => {
    const doc = new jsPDF();
    const qrDataUrl = await QRCode.toDataURL(ticket.ticketId);

    doc.setFontSize(18);
    doc.text("EVENT TICKET", 70, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${ticket.name}`, 20, 40);
    doc.text(`Email: ${ticket.email}`, 20, 50);
    doc.text(`Event ID: ${ticket.event}`, 20, 60);
    doc.text(`Status: ${ticket.status}`, 20, 70);
    doc.text(`Ticket ID: ${ticket.ticketId}`, 20, 80);

    doc.text("Scan QR at entry gate", 20, 100);
    doc.addImage(qrDataUrl, "PNG", 20, 110, 50, 50);

    doc.save(`ticket-${ticket.ticketId}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!formData.event) {
      setMessage("Please choose an event.");
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/registrations`, formData, {
        headers: { "Content-Type": "application/json" }
      });
      setTicketData(data?.data || data);
      setMessage("🎉 Ticket booking successful!");
      setFormData({ event: "", name: "", email: "" });
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setMessage(apiMessage || "Booking failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedEvent = events.find((e) => (e._id || e.id) === formData.event);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Tickets</p>
          <h1 className="text-2xl font-semibold text-slate-900">Book your ticket</h1>
          <p className="text-sm text-slate-600">Choose an upcoming event and get your ticket.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="event">
              Event
            </label>
            <select
              id="event"
              name="event"
              value={formData.event}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:bg-white focus:ring-2"
            >
              <option value="" disabled>
                Select an event
              </option>
              {events.map((evt) => (
                <option key={evt._id || evt.id} value={evt._id || evt.id}>
                  {evt.title || evt.name} — {evt.date ? new Date(evt.date).toLocaleDateString() : 'TBD'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="name">
              Your name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:bg-white focus:ring-2"
              placeholder="Alex Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:bg-white focus:ring-2"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Booking..." : "Book ticket"}
          </button>
        </form>

        {selectedEvent && (
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{selectedEvent.title || selectedEvent.name}</p>
            <p>{selectedEvent.venue}</p>
            <p>{selectedEvent.date ? new Date(selectedEvent.date).toLocaleString() : 'TBD'}</p>
          </div>
        )}

        {message && (
          <p className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-800 text-center">
            {message}
          </p>
        )}

        {ticketData?.ticketId && ticketData?.status === "approved" && (
          <button
            onClick={() => generatePDF(ticketData)}
            className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Download Ticket
          </button>
        )}

        {ticketData?.status === "pending" && (
          <p className="mt-3 text-center text-sm text-slate-600">
            ⏳ Ticket pending approval
          </p>
        )}
      </div>
    </div>
  );
};

export default BookTicket;
