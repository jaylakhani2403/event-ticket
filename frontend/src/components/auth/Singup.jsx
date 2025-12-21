import { useState } from 'react'
import axios from 'axios'

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setMessage('Please fill in all fields.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }
    if (!form.terms) {
      setMessage('Please accept the terms to continue.')
      return
    }

    try {
      setLoading(true)
      const url = `${API_BASE}/auth/signup`
      const { data } = await axios.post(url, {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setMessage(data?.message || 'Account created successfully.')
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setMessage(apiMessage || 'Unable to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Organizer signup
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Create an organizer account to publish and manage events. Customers do not need an
          account to book tickets.
        </p>
      </div>

      <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:bg-white focus:ring-2"
            placeholder="Alex Doe"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:bg-white focus:ring-2"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:bg-white focus:ring-2"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:bg-white focus:ring-2"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 shadow-sm">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              I agree to the Terms of Service and Privacy Policy for Event Ticket.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}
    </div>
  )
}

export default Signup
