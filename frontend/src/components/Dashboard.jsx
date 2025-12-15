import { Link } from 'react-router-dom'

function Dashboard({ events = [] }) {
  const featured = events.slice(0, 3)
  const totalTickets = events.reduce((sum, evt) => sum + evt.ticketsLeft, 0)

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-indigo-100">Event ticketing</p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Book tickets and track upcoming events with ease.
          </h1>
          <p className="text-indigo-100">
            Manage sales, view featured events, and keep your attendees engaged.
          </p>
          <div className="flex gap-3">
            <Link
              to="/events"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
            >
              View all events
            </Link>
            <Link
              to="/signup"
              className="rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Start selling
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-4 shadow-sm backdrop-blur">
            <p className="text-sm text-indigo-100">Events live</p>
            <p className="text-3xl font-bold">{events.length}</p>
            <p className="text-xs text-indigo-100">Currently published</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 shadow-sm backdrop-blur">
            <p className="text-sm text-indigo-100">Tickets available</p>
            <p className="text-3xl font-bold">{totalTickets}</p>
            <p className="text-xs text-indigo-100">Across all events</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 shadow-sm backdrop-blur md:col-span-2">
            <p className="text-sm text-indigo-100">Highlight</p>
            <p className="text-lg font-semibold">{featured[0]?.name ?? 'TBD'}</p>
            <p className="text-sm text-indigo-100">{featured[0]?.location ?? 'Add your first event'}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Featured events</h2>
            <p className="text-sm text-slate-600">A quick look at what’s live right now.</p>
          </div>
          <Link className="text-sm font-semibold text-indigo-600 hover:text-indigo-700" to="/events">
            See all
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{evt.category}</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{evt.name}</h3>
              <p className="text-sm text-slate-600">{evt.location}</p>
              <p className="text-sm text-slate-600">{evt.date}</p>
              <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-900">
                <span>{evt.price}</span>
                <span className="text-indigo-600">{evt.ticketsLeft} left</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{evt.description}</p>
              <div className="mt-3 flex gap-2">
                <Link
                  to="/events"
                  className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Book ticket
                </Link>
                <Link
                  to="/events"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Need to add a new event?</h3>
            <p className="text-sm text-slate-600">
              Set up pricing, capacities, and publish instantly to your attendees.
            </p>
          </div>
          <Link
            to="/signup"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 md:w-auto"
          >
            Create organizer account
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
