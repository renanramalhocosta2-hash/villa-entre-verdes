export interface PricingRule {
  id: string
  label: string
  from: string  // YYYY-MM-DD
  to: string    // YYYY-MM-DD
  pricePerNight: number
  minNights: number
  type: 'explicit' | 'suggestion'
}

export interface PricingConfig {
  rules: PricingRule[]
  baseWeekday: number
  baseWeekend: number
  updatedAt: string
}

export const DEFAULT_CONFIG: PricingConfig = {
  rules: [],
  baseWeekday: 2000,
  baseWeekend: 2800,
  updatedAt: new Date().toISOString(),
}

export function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function ymd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Gauss algorithm for Easter Sunday
function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

interface HolidayTemplate {
  name: string
  from: string
  to: string
  multiplier: number
  minNights: number
}

function holidayTemplates(year: number): HolidayTemplate[] {
  const easter = easterSunday(year)
  const carnival = addDays(easter, -48)

  return [
    { name: 'Réveillon',             from: ymd(year - 1, 12, 27), to: ymd(year, 1, 3),          multiplier: 2.0, minNights: 4 },
    { name: 'Carnaval',              from: toYMD(carnival),         to: toYMD(addDays(easter, -44)), multiplier: 1.8, minNights: 4 },
    { name: 'Páscoa',                from: toYMD(addDays(easter, -2)), to: toYMD(addDays(easter, 1)), multiplier: 1.6, minNights: 3 },
    { name: 'Tiradentes',            from: ymd(year, 4, 19),        to: ymd(year, 4, 22),         multiplier: 1.4, minNights: 2 },
    { name: 'Dia do Trabalho',       from: ymd(year, 4, 30),        to: ymd(year, 5, 3),          multiplier: 1.4, minNights: 2 },
    { name: 'Corpus Christi',        from: toYMD(addDays(easter, 58)), to: toYMD(addDays(easter, 62)), multiplier: 1.4, minNights: 2 },
    { name: 'Independência',         from: ymd(year, 9, 5),         to: ymd(year, 9, 8),          multiplier: 1.4, minNights: 2 },
    { name: 'Nª Sª Aparecida',       from: ymd(year, 10, 10),       to: ymd(year, 10, 13),        multiplier: 1.4, minNights: 2 },
    { name: 'Natal',                 from: ymd(year, 12, 20),       to: ymd(year, 12, 27),        multiplier: 1.7, minNights: 3 },
    { name: 'Férias de Julho',       from: ymd(year, 7, 1),         to: ymd(year, 7, 31),         multiplier: 1.5, minNights: 2 },
  ]
}

// Returns price for a specific date based on rules. Shorter (more specific) rules win.
export function getPriceForDate(date: Date, config: PricingConfig): number {
  const d = toYMD(date)
  const sorted = [...config.rules].sort((a, b) => {
    const lenA = new Date(a.to).getTime() - new Date(a.from).getTime()
    const lenB = new Date(b.to).getTime() - new Date(b.from).getTime()
    return lenA - lenB
  })
  for (const rule of sorted) {
    if (d >= rule.from && d <= rule.to) return rule.pricePerNight
  }
  // Fallback to base price
  const dow = date.getDay()
  return dow === 0 || dow === 5 || dow === 6 ? config.baseWeekend : config.baseWeekday
}

export function getMinNightsForCheckIn(date: Date, config: PricingConfig): number {
  const d = toYMD(date)
  for (const rule of config.rules) {
    if (d >= rule.from && d <= rule.to) return rule.minNights || 1
  }
  return 1
}

export interface StayPricing {
  nights: number
  total: number
  pricePerNight: number  // average
  hasVariation: boolean  // true if price varies across nights
}

export function calculateStay(checkIn: Date, checkOut: Date, config: PricingConfig): StayPricing {
  const nights: number[] = []
  let d = new Date(checkIn)
  while (d < checkOut) {
    nights.push(getPriceForDate(d, config))
    d.setDate(d.getDate() + 1)
  }
  const total = nights.reduce((s, p) => s + p, 0)
  const avg = nights.length ? Math.round(total / nights.length) : 0
  const hasVariation = nights.some(p => p !== nights[0])
  return { nights: nights.length, total, pricePerNight: avg, hasVariation }
}

// Generate suggestions for a given year based on existing rule patterns.
// minFrom: skip holidays that end before this date (YYYY-MM-DD)
export function suggestRulesForYear(year: number, config: PricingConfig, minFrom?: string): PricingRule[] {
  const baseW = config.baseWeekend || 2800

  const explicit = config.rules.filter(r => r.type === 'explicit')
  let inferredBoost = 1
  if (explicit.length > 0) {
    const avgPrice = explicit.reduce((s, r) => s + r.pricePerNight, 0) / explicit.length
    inferredBoost = Math.max(0.8, Math.min(2, avgPrice / baseW))
  }

  const suggestions: PricingRule[] = []

  for (const h of holidayTemplates(year)) {
    if (minFrom && h.to < minFrom) continue
    const overlaps = config.rules.some(r => r.from <= h.to && r.to >= h.from)
    if (overlaps) continue

    const raw = baseW * h.multiplier * inferredBoost
    const price = Math.round(raw / 100) * 100

    suggestions.push({
      id: crypto.randomUUID(),
      label: h.name,
      from: h.from,
      to: h.to,
      pricePerNight: Math.max(price, config.baseWeekday),
      minNights: h.minNights,
      type: 'suggestion',
    })
  }

  return suggestions.sort((a, b) => a.from.localeCompare(b.from))
}
