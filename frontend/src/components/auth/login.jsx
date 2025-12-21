import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate= useNavigate();

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

    if (!form.email || !form.password) {
      setMessage('Please fill in both email and password.')
      return
    }

    try {
      setLoading(true)
      const url = `${API_BASE}/auth/login`
      const { data } = await axios.post(url, {
        email: form.email,
        password: form.password,
        remember: form.remember,
      })
     const token=data.data.token;
     console.log(token);
      localStorage.setItem("token",token);
      setMessage(data?.message || 'Signed in successfully.')
      window.dispatchEvent(new Event('auth-changed'))
      navigate('/org/events/add');
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setMessage(apiMessage || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Organizer login
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          For event organizers only. Customers can book tickets without an account.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
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
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:bg-white focus:ring-2"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Remember me
          </label>
          <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-800">
          {message}
        </p>
      )}
    </div>
  )
}

export default Login
