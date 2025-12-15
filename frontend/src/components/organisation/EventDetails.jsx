import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const url = `${API_BASE}/event/${id}`
        const { data } = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        setEvent(data?.data || data || null)
      } catch (err) {
        const apiMessage = err?.response?.data?.message
        setMessage(apiMessage || 'Unable to load event.')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchEvent()
  }, [API_BASE, id, token])

  const handleDelete = async () => {
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
      navigate('/org/events')
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setMessage(apiMessage || 'Unable to delete event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Event details</h1>
          <p className="text-sm text-slate-600">Review event info and manage actions.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/org/events"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to my events
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Delete
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</div>
      )}

      {loading && <p className="text-sm text-slate-600">Loading...</p>}

      {event && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {event.approvalMode}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">{event.title}</h2>
          <p className="text-sm text-slate-600">
            {event.date ? new Date(event.date).toLocaleString() : 'No date'}
          </p>
          <p className="text-sm text-slate-600">{event.venue}</p>
          <p className="mt-3 text-slate-700">{event.description}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Ticket limit</p>
              <p>{event.ticketLimit ?? 0}</p>
            </div>
            {event.organizer && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Organizer</p>
                <p>{event.organizer.name} ({event.organizer.email})</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetails

