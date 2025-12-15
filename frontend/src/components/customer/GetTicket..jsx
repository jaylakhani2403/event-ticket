import { useState } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import QRCode from "qrcode"

function GetTicket() {
  const [email, setEmail] = useState("")
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const API_URL = import.meta.env.VITE_API_BASE_URL

  const handleFetch = async (e) => {
    e.preventDefault()
    setMessage("")
    setTickets([])
    if (!email) {
      setMessage("Please enter your email.")
      return
    }
    try {
      setLoading(true)
      const { data } = await axios.get(`${API_URL}/registrations/my`, {
        params: { email },
      })
      const list = data?.data || data || []
      setTickets(Array.isArray(list) ? list : [])
      if (!list || list.length === 0) {
        setMessage("No tickets found for this email.")
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setMessage(apiMessage || "Unable to fetch tickets.")
    } finally {
      setLoading(false)
    }
  }

  const downloadPdf = async (ticket) => {
    const doc = new jsPDF()
    const qrDataUrl = await QRCode.toDataURL(ticket.ticketId)

    doc.setFontSize(18)
    doc.text("EVENT TICKET", 70, 20)

    doc.setFontSize(12)
    doc.text(`Name: ${ticket.name}`, 20, 40)
    doc.text(`Email: ${ticket.email}`, 20, 50)
    doc.text(`Event: ${ticket.event?.title || ticket.event?.name || ticket.event}`, 20, 60)
    doc.text(`Status: ${ticket.status}`, 20, 70)
    doc.text(`Ticket ID: ${ticket.ticketId}`, 20, 80)

    doc.text("Scan QR at entry gate", 20, 100)
    doc.addImage(qrDataUrl, "PNG", 20, 110, 50, 50)

    doc.save(`ticket-${ticket.ticketId}.pdf`)
  }

  const statusBadge = (status) => {
    const colors = {
      approved: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      rejected: "bg-rose-100 text-rose-700",
    }
    return colors[status] || "bg-slate-100 text-slate-700"
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Tickets</p>
          <h1 className="text-2xl font-semibold text-slate-900">Find your tickets</h1>
          <p className="text-sm text-slate-600">Enter your email to see ticket status.</p>
        </div>

        <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleFetch}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200"
            placeholder="you@example.com"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Searching..." : "Find tickets"}
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {tickets.map((tkt) => (
            <div key={tkt._id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                  {tkt.event?.title || tkt.event?.name || "Event"}
                </p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(tkt.status)}`}>
                  {tkt.status}
                </span>
              </div>
              <p className="text-sm text-slate-600">{tkt.email}</p>
              <p className="text-sm text-slate-600">{tkt.ticketId ? `Ticket ID: ${tkt.ticketId}` : "Pending ticket ID"}</p>
              {tkt.event?.date && (
                <p className="text-xs text-slate-500">
                  {new Date(tkt.event.date).toLocaleString()}
                </p>
              )}

              {tkt.status === "approved" ? (
                <button
                  onClick={() => downloadPdf(tkt)}
                  className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Download ticket
                </button>
              ) : (
                <p className="mt-3 text-sm text-slate-600 text-center">
                  {tkt.status === "pending" ? "Ticket not approved yet." : "Ticket not approved."}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GetTicket
