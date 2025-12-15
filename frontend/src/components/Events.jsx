import { Link } from 'react-router-dom'

function Events({ events = [], loading = false, message = '' }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">All events</h1>
          <p className="text-sm text-slate-600">
            Browse every upcoming event and book tickets in a few clicks.
          </p>
        </div>
        <Link
          to="/login"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Manage my tickets
        </Link>
      </div>

      {message && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {message}
        </div>
      )}

      {loading && <p className="text-sm text-slate-600">Loading events…</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((evt) => (
          <div
            key={evt._id || evt.id}
            className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-indigo-600">
              <span>{evt.category}</span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
                {evt.ticketLimit-evt.totalRegister} left
              </span>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{evt.name || evt.title}</h3>
            <p className="text-sm text-slate-600">{evt.location}</p>
            <p className="text-sm text-slate-600">{evt.date}</p>
            <p className="mt-2 line-clamp-3 text-sm text-slate-600">{evt.description}</p>
            <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-900">
              <span>{evt.price}</span>
              <Link
                className="text-indigo-600 hover:text-indigo-700"
                to={`/book/${evt._id || evt.id}`}
              >
                Book now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
          No events yet. Add your first event to start selling tickets.
        </div>
      )}
    </div>
  )
}

export default Events

