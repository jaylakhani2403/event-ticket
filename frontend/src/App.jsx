import { Link, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/login.jsx'
import Signup from './components/auth/Singup.jsx'
import Dashboard from './components/Dashboard.jsx'
import Events from './components/Events.jsx'
import './App.css'

const events = [
  {
    id: 'evt-1',
    name: 'Summer Music Fest',
    date: '2025-07-12',
    location: 'Central Park, NYC',
    price: '$120',
    ticketsLeft: 86,
    category: 'Music',
    description: 'Outdoor live performances from top indie and pop artists.',
  },
  {
    id: 'evt-2',
    name: 'Tech Innovators Summit',
    date: '2025-08-03',
    location: 'Moscone Center, SF',
    price: '$249',
    ticketsLeft: 42,
    category: 'Conference',
    description: 'Talks and demos on AI, cloud, and developer tooling.',
  },
  {
    id: 'evt-3',
    name: 'Championship Finals',
    date: '2025-09-18',
    location: 'Madison Square Garden',
    price: '$180',
    ticketsLeft: 120,
    category: 'Sports',
    description: 'The season’s biggest matchup with live entertainment.',
  },
  {
    id: 'evt-4',
    name: 'Design & UX Expo',
    date: '2025-10-05',
    location: 'Austin Convention Center',
    price: '$95',
    ticketsLeft: 230,
    category: 'Design',
    description: 'Hands-on workshops and keynotes on product design.',
  },
  {
    id: 'evt-5',
    name: 'Food & Wine Fair',
    date: '2025-07-28',
    location: 'Napa Valley',
    price: '$150',
    ticketsLeft: 64,
    category: 'Food',
    description: 'Taste the best regional food, wine, and culinary demos.',
  },
]

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
            Event Ticket
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link className="text-slate-700 hover:text-indigo-600" to="/">
              Dashboard
            </Link>
            <Link className="text-slate-700 hover:text-indigo-600" to="/events">
              All events
            </Link>
            <Link className="rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-800" to="/login">
              Login
            </Link>
            <Link
              className="rounded-lg bg-indigo-600 px-3 py-2 text-white shadow-sm hover:bg-indigo-700"
              to="/signup"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col px-4 py-10">
        <Routes>
          <Route path="/" element={<Dashboard events={events} />} />
          <Route path="/events" element={<Events events={events} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
