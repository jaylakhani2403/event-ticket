import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AddEvent() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    ticketLimit: '',
    approvalMode: 'auto',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE_URL ;
  const token = localStorage.getItem('token')
//   console.log(token);

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!token) {
      setMessage('Please login as organizer to add events.')
      return
    }

    try {
      setLoading(true)
      const url = `${API_BASE}/event`
      const payload = {
        ...form,
        ticketLimit: Number(form.ticketLimit) || 0,
      }
      const { data } = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage(data?.message || 'Event created successfully.')
      setTimeout(() => navigate('/org/events'), 600)
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setMessage(apiMessage || 'Unable to create event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Add new event</h1>
        <p className="text-sm text-slate-600">Create an event for your organization.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="venue">
            Venue
          </label>
          <input
            id="venue"
            name="venue"
            type="text"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200"
            value={form.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="ticketLimit">
              Ticket limit (0 = unlimited)
            </label>
            <input
              id="ticketLimit"
              name="ticketLimit"
              type="number"
              min="0"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200"
              value={form.ticketLimit}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="approvalMode">
            Approval mode
          </label>
          <select
            id="approvalMode"
            name="approvalMode"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200"
            value={form.approvalMode}
            onChange={handleChange}
            required
          >
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating…' : 'Create event'}
        </button>
      </form>

      {message && (
        <p className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-800">
          {message}
        </p>
      )}
    </div>
  )
}

export default AddEvent
