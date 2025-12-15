import { useEffect, useState } from 'react'
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Login from './components/auth/login.jsx'
import Signup from './components/auth/Singup.jsx'
import Dashboard from './components/Dashboard.jsx'
import Events from './components/Events.jsx'
import AddEvent from './components/organisation/AddEvent.jsx'
import AllEvent from './components/organisation/AllEvent.jsx'
import EventDetails from './components/organisation/EventDetails.jsx'
import BookTicket from './components/customer/BookTicket.jsx'
import GetTicket from './components/customer/GetTicket..jsx'
import Scanner from './components/organisation/Scanner.jsx'
import './App.css'

function App() {
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventsMessage, setEventsMessage] = useState('')
  const [isAuthed, setIsAuthed] = useState(Boolean(localStorage.getItem('token')))
  const location = useLocation()
  const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true)
        const url = `${API_BASE}/event`
        const { data } = await axios.get(url)
        const list = data?.data || data || []
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const upcomingEvents = list.filter((event) => {
          if (!event.date) return false
          return new Date(event.date) >= today
        })
        setEvents(upcomingEvents)
        setEventsMessage('')
      } catch (err) {
        const apiMessage = err?.response?.data?.message
        setEventsMessage(apiMessage || 'Unable to load events.')
      } finally {
        setEventsLoading(false)
      }
    }
    fetchEvents()
  }, [API_BASE])

  useEffect(() => {
    const syncAuth = () => setIsAuthed(Boolean(localStorage.getItem('token')))
    window.addEventListener('storage', syncAuth)
    window.addEventListener('auth-changed', syncAuth)
    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('auth-changed', syncAuth)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthed(false)
  }

  const navLink = (to, label, primary = false) => (
    <Link
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        location.pathname === to
          ? primary
            ? 'bg-white text-indigo-700 shadow-sm'
            : 'bg-white/20 text-white shadow-sm'
          : primary
            ? 'bg-white/80 text-indigo-700 hover:bg-white'
            : 'text-white/90 hover:bg-white/10 hover:text-white'
      }`}
      to={to}
    >
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Event Ticket
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {navLink('/', 'Dashboard')}
            {navLink('/events', 'All events')}
            {/* {navLink('/book/placeholder', 'Book ticket')} */}
            {navLink('/tickets', 'My tickets')}
            {isAuthed && navLink('/org/events', 'My events')}
            {isAuthed && navLink('/org/events/add', 'Add event')}
            {isAuthed && navLink('/org/scanner', 'Scanner')}
            {!isAuthed && navLink('/login', 'Login')}
            {!isAuthed && navLink('/signup', 'Sign up', true)}
            {isAuthed && (
              <button
                onClick={handleLogout}
                className="rounded-lg bg-white/80 px-3 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-white"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col px-4 py-10">
        <Routes>
          <Route
            path="/"
            element={<Dashboard events={events} loading={eventsLoading} message={eventsMessage} />}
          />
          <Route
            path="/events"
            element={<Events events={events} loading={eventsLoading} message={eventsMessage} />}
          />
          <Route path="/book/:id" element={<BookTicket />} />
          <Route path="/tickets" element={<GetTicket />} />
          <Route path="/org/events" element={<AllEvent />} />
          <Route path="/org/events/add" element={<AddEvent />} />
          <Route path="/org/events/:id" element={<EventDetails />} />
          <Route path="/org/scanner" element={<Scanner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/getTicket" element={<GetTicket />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
