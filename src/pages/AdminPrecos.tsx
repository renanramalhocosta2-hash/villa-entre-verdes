import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, ChevronLeft, Loader2, AlertCircle, Check, Sparkles } from 'lucide-react'
import type { PricingConfig, PricingRule } from '@/utils/pricingEngine'
import { suggestRulesForYear, DEFAULT_CONFIG } from '@/utils/pricingEngine'

const API = '/api/pricing'

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function RuleRow({ rule, onChange, onDelete }: {
  rule: PricingRule
  onChange: (r: PricingRule) => void
  onDelete: () => void
}) {
  return (
    <div className={`grid gap-2 items-center py-2.5 border-b border-gray-100 ${rule.type === 'suggestion' ? 'bg-amber-50' : ''}`}
      style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto' }}>
      <input
        type="text"
        value={rule.label}
        onChange={e => onChange({ ...rule, label: e.target.value })}
        className="text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2D5016]"
        placeholder="Nome do período"
      />
      <input
        type="date"
        value={rule.from}
        onChange={e => onChange({ ...rule, from: e.target.value })}
        className="text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2D5016]"
      />
      <input
        type="date"
        value={rule.to}
        onChange={e => onChange({ ...rule, to: e.target.value })}
        className="text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2D5016]"
      />
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">R$</span>
        <input
          type="number"
          value={rule.pricePerNight}
          onChange={e => onChange({ ...rule, pricePerNight: Number(e.target.value) })}
          className="w-full text-sm border border-gray-200 rounded pl-7 pr-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2D5016]"
          min={0}
          step={100}
        />
      </div>
      <select
        value={rule.minNights}
        onChange={e => onChange({ ...rule, minNights: Number(e.target.value) })}
        className="text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2D5016]"
      >
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <option key={n} value={n}>{n} {n === 1 ? 'noite' : 'noites'} mín.</option>
        ))}
      </select>
      <button
        onClick={onDelete}
        className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
        title="Remover"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function AdminPrecos() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_CONFIG)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    document.title = 'Admin — Preços | Villa Entre Verdes'
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    try {
      const verify = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ _ping: true }),
      })
      if (verify.status === 401) {
        setAuthError('Senha incorreta. Tente novamente.')
        setLoading(false)
        return
      }
      const data = await fetch(API).then(r => r.json())
      setConfig({ ...DEFAULT_CONFIG, ...data })
      setAuthed(true)
    } catch {
      setAuthError('Erro de conexão. Verifique sua internet.')
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    setSaveMsg('')
    try {
      const payload: PricingConfig = {
        ...config,
        rules: config.rules.map(r => ({ ...r, type: 'explicit' as const })),
      }
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setSaveMsg('Salvo! Mudanças publicadas no site.')
      setTimeout(() => setSaveMsg(''), 4000)
    } catch {
      setSaveMsg('Erro ao salvar. Tente novamente.')
    }
    setSaving(false)
  }

  function addRule() {
    const today = new Date()
    const from = today.toISOString().slice(0, 10)
    const to = new Date(today.getTime() + 3 * 86400000).toISOString().slice(0, 10)
    setConfig(c => ({
      ...c,
      rules: [...c.rules, {
        id: crypto.randomUUID(),
        label: '',
        from,
        to,
        pricePerNight: c.baseWeekend,
        minNights: 2,
        type: 'explicit',
      }],
    }))
  }

  function updateRule(id: string, updated: PricingRule) {
    setConfig(c => ({ ...c, rules: c.rules.map(r => r.id === id ? updated : r) }))
  }

  function deleteRule(id: string) {
    setConfig(c => ({ ...c, rules: c.rules.filter(r => r.id !== id) }))
  }

  function generateSuggestions() {
    const today = new Date().toISOString().slice(0, 10)
    const thisYear = new Date().getFullYear()
    const nextYear = thisYear + 1

    const s2026 = suggestRulesForYear(thisYear, config, today)
    const s2027 = suggestRulesForYear(nextYear, config)
    const suggestions = [...s2026, ...s2027]

    if (suggestions.length === 0) {
      setSaveMsg(`Todos os feriados de ${thisYear} e ${nextYear} já estão cobertos.`)
      setTimeout(() => setSaveMsg(''), 3000)
      return
    }
    setConfig(c => ({ ...c, rules: [...c.rules, ...suggestions] }))
  }

  const sortedRules = [...config.rules].sort((a, b) => a.from.localeCompare(b.from))

  // ── Login screen ──────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🌿</div>
            <h1 className="text-xl font-bold text-[#2D5016]">Villa Entre Verdes</h1>
            <p className="text-gray-400 text-sm mt-1">Painel de Preços</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha de administrador</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" /> {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#2D5016] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#1e3a0f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
          <p className="text-center mt-6">
            <a href="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
              <ChevronLeft className="h-3 w-3" /> Voltar ao site
            </a>
          </p>
        </div>
      </div>
    )
  }

  // ── Admin panel ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <a href="/" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </a>
          <div>
            <span className="font-semibold text-[#2D5016] text-sm">Painel de Preços</span>
            <span className="text-gray-400 text-xs ml-2 hidden sm:inline">Villa Entre Verdes</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2D5016] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1e3a0f] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Salvando...' : 'Publicar'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
        {/* Save feedback */}
        {saveMsg && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${saveMsg.includes('Salvo') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {saveMsg.includes('Salvo') ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {saveMsg}
          </div>
        )}

        {/* Base prices */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-1">Diária base</h2>
          <p className="text-xs text-gray-400 mb-4">Usada quando a data não está em nenhum período especial.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Segunda a Quinta</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                <input
                  type="number"
                  value={config.baseWeekday}
                  onChange={e => setConfig(c => ({ ...c, baseWeekday: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                  step={100} min={0}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sexta a Domingo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                <input
                  type="number"
                  value={config.baseWeekend}
                  onChange={e => setConfig(c => ({ ...c, baseWeekend: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                  step={100} min={0}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Periods */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4 gap-3">
            <div>
              <h2 className="font-semibold text-gray-800">Períodos especiais</h2>
              <p className="text-xs text-gray-400 mt-0.5">Feriados, temporadas e datas com preço diferente. Períodos mais curtos têm prioridade sobre os mais longos.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={generateSuggestions}
                className="flex items-center gap-1.5 border border-amber-400 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors whitespace-nowrap"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Auto-gerar feriados
              </button>
              <button
                onClick={addRule}
                className="flex items-center gap-1.5 bg-[#2D5016] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1e3a0f] transition-colors whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar
              </button>
            </div>
          </div>

          {sortedRules.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm space-y-2">
              <p>Nenhum período cadastrado ainda.</p>
              <p className="text-xs">Clique em <strong>Adicionar</strong> para criar manualmente ou em <strong>Auto {new Date().getFullYear() + 1}</strong> para gerar os feriados e temporadas automaticamente.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide pb-2 border-b border-gray-100 min-w-[640px]"
                style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto' }}>
                <div>Nome</div>
                <div>Check-in</div>
                <div>Check-out</div>
                <div>R$/noite</div>
                <div>Mínimo</div>
                <div />
              </div>
              <div className="min-w-[640px]">
                {sortedRules.map(rule => (
                  <RuleRow
                    key={rule.id}
                    rule={rule}
                    onChange={r => updateRule(rule.id, r)}
                    onDelete={() => deleteRule(rule.id)}
                  />
                ))}
              </div>
              {sortedRules.some(r => r.type === 'suggestion') && (
                <p className="mt-3 text-xs text-amber-700 flex items-center gap-1.5 bg-amber-50 px-3 py-2 rounded-lg">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  Linhas em amarelo são sugestões automáticas — ajuste os valores e clique em Publicar para confirmar.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        {sortedRules.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">Resumo de preços cadastrados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {sortedRules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                  <span className="text-gray-600 truncate mr-2">{rule.label || '—'}</span>
                  <span className="font-semibold text-[#2D5016] shrink-0">{formatBRL(rule.pricePerNight)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
          <p className="font-semibold mb-2">Como funciona</p>
          <p>• A diária base é usada quando a data não está em nenhum período especial</p>
          <p>• Sexta, sábado e domingo usam a diária de fim de semana</p>
          <p>• Se dois períodos se sobrepõem, o período mais curto (mais específico) vence</p>
          <p>• "Auto-gerar feriados" cria sugestões para os feriados e temporadas restantes de 2026 e todo o ano de 2027, baseadas nos seus preços atuais</p>
          <p>• Após editar, clique em <strong>Publicar</strong> para atualizar o site</p>
          {config.updatedAt && (
            <p className="text-blue-400 pt-1">
              Última atualização: {new Date(config.updatedAt).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
