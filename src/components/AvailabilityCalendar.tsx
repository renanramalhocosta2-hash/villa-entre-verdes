import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ── iCal parser ──────────────────────────────────────────────────────────────

function parseICalDate(raw: string): Date {
  // Formats: 20250401 or 20250401T120000Z or 20250401T120000
  const s = raw.replace(/T.*$/, '').trim()
  const y = parseInt(s.slice(0, 4), 10)
  const m = parseInt(s.slice(4, 6), 10) - 1
  const d = parseInt(s.slice(6, 8), 10)
  return new Date(y, m, d)
}

function parseBlockedRanges(icalText: string): { start: Date; end: Date }[] {
  const ranges: { start: Date; end: Date }[] = []
  const events = icalText.split('BEGIN:VEVENT')

  for (let i = 1; i < events.length; i++) {
    const block = events[i]
    const startMatch = block.match(/DTSTART[^:]*:(\S+)/)
    const endMatch = block.match(/DTEND[^:]*:(\S+)/)
    if (startMatch && endMatch) {
      ranges.push({
        start: parseICalDate(startMatch[1]),
        end: parseICalDate(endMatch[1]),
      })
    }
  }

  return ranges
}

function isDateBlocked(date: Date, ranges: { start: Date; end: Date }[]): boolean {
  const t = date.getTime()
  return ranges.some(({ start, end }) => t >= start.getTime() && t < end.getTime())
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function isBefore(a: Date, b: Date) {
  return a.getTime() < b.getTime()
}

function formatDate(d: Date) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}


// ── Single Month Grid ─────────────────────────────────────────────────────────

interface MonthProps {
  year: number
  month: number
  blocked: { start: Date; end: Date }[]
  checkIn: Date | null
  checkOut: Date | null
  hovered: Date | null
  onSelect: (d: Date) => void
  onHover: (d: Date | null) => void
  today: Date
}

function MonthGrid({ year, month, blocked, checkIn, checkOut, hovered, onSelect, onHover, today }: MonthProps) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const rangeEnd = checkOut ?? hovered

  function dayClasses(day: number) {
    const d = new Date(year, month, day)
    const past = isBefore(d, today) && !sameDay(d, today)
    const occupied = isDateBlocked(d, blocked)

    if (past || occupied) {
      return 'text-gray-300 line-through cursor-not-allowed select-none'
    }

    const isCheckIn = checkIn && sameDay(d, checkIn)
    const isCheckOut = checkOut && sameDay(d, checkOut)

    if (isCheckIn || isCheckOut) {
      return 'bg-[#2D5016] text-white rounded-full font-semibold cursor-pointer'
    }

    if (checkIn && rangeEnd && !isBefore(rangeEnd, checkIn)) {
      const afterStart = isBefore(checkIn, d) || sameDay(d, checkIn)
      const beforeEnd = isBefore(d, rangeEnd) || sameDay(d, rangeEnd)
      if (afterStart && beforeEnd) {
        return 'bg-green-100 text-[#2D5016] cursor-pointer'
      }
    }

    return 'hover:bg-green-50 cursor-pointer rounded-full'
  }

  return (
    <div className="w-full">
      <p className="text-center font-semibold text-[#2D5016] mb-3">
        {MONTHS_PT[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-2">
        {DAYS_PT.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const d = new Date(year, month, day)
          const past = isBefore(d, today) && !sameDay(d, today)
          const occupied = isDateBlocked(d, blocked)
          const disabled = past || occupied

          return (
            <div
              key={day}
              className={`text-center text-sm py-1.5 transition-colors ${dayClasses(day)}`}
              onClick={() => !disabled && onSelect(d)}
              onMouseEnter={() => !disabled && onHover(d)}
              onMouseLeave={() => onHover(null)}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Form state ────────────────────────────────────────────────────────────────

interface BookingForm {
  hospedes: string
  temEvento: 'sim' | 'nao' | ''
  pessoasEvento: string
  observacoes: string
}

const emptyForm: BookingForm = { hospedes: '', temEvento: '', pessoasEvento: '', observacoes: '' }

function buildWhatsAppMsg(checkIn: Date, checkOut: Date, form: BookingForm) {
  const noites = Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000)
  const evento = form.temEvento === 'sim'
    ? `✅ Sim — ${form.pessoasEvento ? form.pessoasEvento + ' pessoas no evento' : 'número de pessoas a definir'}`
    : 'Não'

  const lines = [
    `Olá! Gostaria de solicitar um orçamento para a Villa Entre Verdes.`,
    ``,
    `📅 Check-in: ${formatDate(checkIn)}`,
    `📅 Check-out: ${formatDate(checkOut)} (${noites} noite${noites !== 1 ? 's' : ''})`,
    `👥 Hóspedes com pernoite: ${form.hospedes || 'a informar'}`,
    `🎉 Haverá evento: ${evento}`,
    form.observacoes ? `📝 Observações: ${form.observacoes}` : '',
  ].filter(Boolean)

  return `https://wa.me/5511990222000?text=${encodeURIComponent(lines.join('\n'))}`
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AvailabilityCalendar() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [startMonth, setStartMonth] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [blocked, setBlocked] = useState<{ start: Date; end: Date }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [hovered, setHovered] = useState<Date | null>(null)
  const [form, setForm] = useState<BookingForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch('/api/ical')
      .then(r => {
        if (!r.ok) throw new Error('fetch failed')
        return r.text()
      })
      .then(text => {
        setBlocked(parseBlockedRanges(text))
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  function nextMonth2() {
    const d = new Date(startMonth.year, startMonth.month + 2, 1)
    setStartMonth({ year: d.getFullYear(), month: d.getMonth() })
  }

  function prevMonth2() {
    const d = new Date(startMonth.year, startMonth.month - 1, 1)
    // don't go before current month
    if (d >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setStartMonth({ year: d.getFullYear(), month: d.getMonth() })
    }
  }

  function handleSelect(d: Date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(d)
      setCheckOut(null)
      setShowForm(false)
      setForm(emptyForm)
    } else {
      if (isBefore(d, checkIn)) {
        setCheckIn(d)
        setCheckOut(null)
        setShowForm(false)
      } else if (sameDay(d, checkIn)) {
        setCheckIn(null)
        setShowForm(false)
      } else {
        const rangeBlocked = blocked.some(({ start }) => {
          const s = start.getTime()
          return s >= checkIn.getTime() && s < d.getTime()
        })
        if (rangeBlocked) {
          setCheckIn(d)
          setCheckOut(null)
          setShowForm(false)
        } else {
          setCheckOut(d)
          setShowForm(true)
        }
      }
    }
  }

  const month2 = new Date(startMonth.year, startMonth.month + 1, 1)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mb-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-white border border-gray-200 inline-block" />
          Disponível
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-gray-200 inline-block" />
          Ocupado
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#2D5016] inline-block" />
          Selecionado
        </span>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-2xl shadow-card border border-[#E5E5DC] p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Carregando disponibilidade...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-400">
            <AlertCircle className="h-8 w-8" />
            <p>Não foi possível carregar o calendário. Verifique pelo WhatsApp.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth2}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-5 w-5 text-[#2D5016]" />
              </button>
              <div className="flex-1" />
              <button
                onClick={nextMonth2}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Próximo mês"
              >
                <ChevronRight className="h-5 w-5 text-[#2D5016]" />
              </button>
            </div>

            {/* Two months side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MonthGrid
                year={startMonth.year}
                month={startMonth.month}
                blocked={blocked}
                checkIn={checkIn}
                checkOut={checkOut}
                hovered={hovered}
                onSelect={handleSelect}
                onHover={setHovered}
                today={today}
              />
              <MonthGrid
                year={month2.getFullYear()}
                month={month2.getMonth()}
                blocked={blocked}
                checkIn={checkIn}
                checkOut={checkOut}
                hovered={hovered}
                onSelect={handleSelect}
                onHover={setHovered}
                today={today}
              />
            </div>

            {/* Selection summary + Form */}
            <div className="mt-8 border-t border-[#E5E5DC] pt-6">
              {!checkIn && !checkOut && (
                <p className="text-center text-gray-400 text-sm">
                  Clique em uma data para selecionar sua entrada
                </p>
              )}
              {checkIn && !checkOut && (
                <p className="text-center text-gray-500 text-sm">
                  Entrada: <strong>{formatDate(checkIn)}</strong> — Agora selecione a data de saída
                </p>
              )}
              {checkIn && checkOut && showForm && (
                <div className="space-y-5">
                  {/* Datas selecionadas */}
                  <div className="flex flex-wrap gap-4 justify-center text-sm bg-green-50 rounded-xl p-4">
                    <span>📅 <strong>Check-in:</strong> {formatDate(checkIn)}</span>
                    <span>→</span>
                    <span>📅 <strong>Check-out:</strong> {formatDate(checkOut)}</span>
                    <button
                      className="text-gray-400 underline text-xs hover:text-gray-600 ml-auto"
                      onClick={() => { setCheckIn(null); setCheckOut(null); setShowForm(false); setForm(emptyForm) }}
                    >
                      Alterar datas
                    </button>
                  </div>

                  {/* Formulário */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Hóspedes com pernoite */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de hóspedes com pernoite
                      </label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                        value={form.hospedes}
                        onChange={e => setForm(f => ({ ...f, hospedes: e.target.value }))}
                      >
                        <option value="">Selecione...</option>
                        {Array.from({ length: 22 }, (_, i) => i + 1).map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'pessoa' : 'pessoas'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Vai ter evento? */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Haverá evento (festa, confraternização)?
                      </label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                        value={form.temEvento}
                        onChange={e => setForm(f => ({ ...f, temEvento: e.target.value as 'sim' | 'nao' | '', pessoasEvento: '' }))}
                      >
                        <option value="">Selecione...</option>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                      </select>
                    </div>

                    {/* Pessoas no evento (aparece só se sim) */}
                    {form.temEvento === 'sim' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de pessoas no evento
                        </label>
                        <select
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                          value={form.pessoasEvento}
                          onChange={e => setForm(f => ({ ...f, pessoasEvento: e.target.value }))}
                        >
                          <option value="">Selecione...</option>
                          {[10,15,20,25,30,35,40,45,50,55,60].map(n => (
                            <option key={n} value={n}>Até {n} pessoas</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Observações */}
                    <div className={form.temEvento === 'sim' ? '' : 'sm:col-span-2'}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observações adicionais
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ex: aniversário, lua de mel, necessidades especiais..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016] resize-none"
                        value={form.observacoes}
                        onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Botão WhatsApp */}
                  <a
                    href={buildWhatsAppMsg(checkIn, checkOut, form)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-base font-semibold gap-2">
                      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Solicitar Orçamento via WhatsApp
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        Calendário sincronizado automaticamente com Airbnb
      </p>
    </div>
  )
}
