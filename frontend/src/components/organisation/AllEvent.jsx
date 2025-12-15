import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function AllEvent() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
  const token = localStorage.getItem('token')

  const fetchEvents = useCallback(async () => {
    if (!token) {
      setMessage('Please login as organizer to view your events.')
      return
    }
    try {
      setLoading(true)
      const url = `${API_BASE}/event/my-events`
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const list = data?.data || data || []
      setEvents(Array.isArray(list) ? list : [])
      setMessage('')
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setMessage(apiMessage || 'Unable to fetch events.')
    } finally {
      setLoading(false)
    }
  }, [API_BASE, token])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleDelete = async (id) => {
    if (!token) {
      setMessage('Please login as organizer to delete events.')
      return
    }
    if (!confirm('Delete this event?')) return
    try {
      setLoading(true)
      const url = `${API_BASE}/event/${id}`
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEvents((prev) => prev.filter((evt) => evt._id !== id))
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setMessage(apiMessage || 'Unable to delete event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My events</h1>
          <p className="text-sm text-slate-600">Manage events you created for your organization.</p>
        </div>
        <Link
          to="/org/events/add"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Add new event
        </Link>
      </div>

      {message && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((evt) => (
          <div key={evt._id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{evt.approvalMode}</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{evt.title}</h3>
            <p className="text-sm text-slate-600">{evt.venue}</p>
            <p className="text-sm text-slate-600">
              {evt.date ? new Date(evt.date).toLocaleDateString() : 'No date'}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{evt.description}</p>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
              <span>Tickets: {evt.ticketLimit ?? 0}</span>
              <span className="text-indigo-600">{evt.approvalMode}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                to={`/org/events/${evt._id}`}
                className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
              >
                Details
              </Link>
              <button
                onClick={() => handleDelete(evt._id)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && events.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
          No events yet. Create your first one.
        </div>
      )}
    </div>
  )
}

export default AllEvent

