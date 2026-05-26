'use client'
import { useEffect, useState } from 'react'

type BlockedSlot = {
  id: string
  type: string
  label: string
  reason?: string
  isGlobal: boolean
  dateFrom?: string
  dateTo?: string
  startTime?: string
  endTime?: string
  dayOfWeek?: number
  mode: string
  autoEnableAt?: string
  clientMessage?: string
  isActive: boolean
}

const DAYS = ['', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle']
const MODES = [
  { value: 'blocked', label: 'Zcela zablokováno' },
  { value: 'vip_only', label: 'Pouze VIP klientky' },
  { value: 'phone_only', label: 'Pouze telefonicky' },
  { value: 'waitlist', label: 'Čekací listina' },
  { value: 'reduced', label: 'Zkrácený provoz' },
]

const QUICK_PRESETS = [
  { label: 'Dovolená', type: 'DATE_RANGE', mode: 'blocked', clientMessage: 'Studio je na dovolené. Rezervace obnovíme brzy.' },
  { label: 'Nemoc', type: 'GLOBAL', mode: 'blocked', clientMessage: 'Studio je momentálně uzavřeno. Omlouváme se.' },
  { label: 'Státní svátek', type: 'DATE', mode: 'blocked', clientMessage: 'Studio je dnes zavřeno z důvodu státního svátku.' },
  { label: 'Oběd 12-13h', type: 'TIME_BLOCK', mode: 'blocked', startTime: '12:00', endTime: '13:00', clientMessage: 'Tento čas je rezervován pro přestávku.' },
  { label: 'Každé pondělí zavřeno', type: 'RECURRING', mode: 'blocked', dayOfWeek: 1, clientMessage: 'V pondělí studio nepracuje.' },
  { label: 'Školení / kurz', type: 'DATE', mode: 'blocked', clientMessage: 'Stylistka je na školení. Děkujeme za pochopení.' },
  { label: 'Fotografování', type: 'DATE', mode: 'phone_only', clientMessage: 'Tento den přijímáme rezervace pouze telefonicky.' },
  { label: 'Pouze VIP pátek', type: 'RECURRING', mode: 'vip_only', dayOfWeek: 5, clientMessage: 'Pátky jsou vyhrazeny pro VIP klientky.' },
]

export default function BlockedSlotsManager() {
  const [slots, setSlots] = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [globalOn, setGlobalOn] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    type: 'DATE',
    label: '',
    reason: '',
    isGlobal: false,
    dateFrom: '',
    dateTo: '',
    startTime: '',
    endTime: '',
    dayOfWeek: '',
    mode: 'blocked',
    clientMessage: '',
  })

  const load = async () => {
    const res = await fetch('/api/blocked-slots').then(r => r.json())
    setSlots(res)
    setGlobalOn(res.some((s: BlockedSlot) => s.isGlobal && s.isActive))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleGlobal = async () => {
    setSaving(true)
    const existing = slots.find(s => s.isGlobal)
    if (existing) {
      await fetch('/api/blocked-slots', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: existing.id, isActive: !existing.isActive }) })
    } else {
      await fetch('/api/blocked-slots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'GLOBAL', label: 'Globální vypnutí', isGlobal: true, mode: 'blocked', clientMessage: 'Rezervace jsou momentálně pozastaveny. Brzy se vrátíme.' }) })
    }
    await load()
    setSaving(false)
  }

  const applyPreset = (preset: any) => {
    setForm(f => ({ ...f, ...preset, dayOfWeek: preset.dayOfWeek?.toString() || '', startTime: preset.startTime || '', endTime: preset.endTime || '', isGlobal: preset.type === 'GLOBAL', label: preset.label }))
    setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    const data: any = { type: form.type, label: form.label, reason: form.reason, isGlobal: form.isGlobal, mode: form.mode, clientMessage: form.clientMessage }
    if (form.dateFrom) data.dateFrom = form.dateFrom
    if (form.dateTo) data.dateTo = form.dateTo
    if (form.startTime) data.startTime = form.startTime
    if (form.endTime) data.endTime = form.endTime
    if (form.dayOfWeek) data.dayOfWeek = parseInt(form.dayOfWeek)
    await fetch('/api/blocked-slots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setShowForm(false)
    setForm({ type: 'DATE', label: '', reason: '', isGlobal: false, dateFrom: '', dateTo: '', startTime: '', endTime: '', dayOfWeek: '', mode: 'blocked', clientMessage: '' })
    await load()
    setSaving(false)
  }

  const toggle = async (slot: BlockedSlot) => {
    await fetch('/api/blocked-slots', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: slot.id, isActive: !slot.isActive }) })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Smazat tuto blokaci?')) return
    await fetch('/api/blocked-slots', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const s: any = {
    box: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,107,168,0.1)', borderRadius: 14, padding: 16, marginBottom: 12 },
    label: { fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 3, color: 'rgba(245,238,242,0.25)', textTransform: 'uppercase' as const, marginBottom: 10 },
    inp: { width: '100%', background: 'rgba(255,107,168,0.04)', border: '1px solid rgba(255,107,168,0.12)', borderRadius: 8, padding: '8px 12px', color: 'rgba(245,238,242,0.8)', fontFamily: 'Georgia,serif', fontSize: 13, outline: 'none' },
    btn: { padding: '10px 20px', borderRadius: 10, background: 'rgba(255,107,168,0.12)', border: '1px solid rgba(255,107,168,0.25)', color: '#FF6BA8', fontFamily: 'Georgia,serif', fontSize: 13, cursor: 'pointer' },
  }

  const formatSlot = (slot: BlockedSlot) => {
    if (slot.isGlobal) return 'Globální vypnutí'
    if (slot.type === 'DATE_RANGE' && slot.dateFrom && slot.dateTo) return `${slot.dateFrom} — ${slot.dateTo}`
    if (slot.type === 'DATE' && slot.dateFrom) return slot.dateFrom
    if (slot.type === 'RECURRING' && slot.dayOfWeek) return `Každý ${DAYS[slot.dayOfWeek]}`
    if (slot.type === 'TIME_BLOCK' && slot.startTime && slot.endTime) return `${slot.startTime} — ${slot.endTime} (každý den)`
    return ''
  }

  const getModeLabel = (mode: string) => MODES.find(m => m.value === mode)?.label || mode

  return (
    <div>
      {/* GLOBAL TOGGLE */}
      <div style={{ ...s.box, background: globalOn ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.03)', border: globalOn ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(255,107,168,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: globalOn ? '#f87171' : 'rgba(245,238,242,0.9)', marginBottom: 4 }}>
              {globalOn ? 'Rezervace jsou VYPNUTY' : 'Rezervace jsou zapnuty'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(245,238,242,0.4)' }}>
              {globalOn ? 'Klientky nemohou rezervovat — klikněte pro zapnutí' : 'Klikněte pro okamžité vypnutí všech rezervací'}
            </div>
          </div>
          <button onClick={toggleGlobal} disabled={saving}
            style={{ padding: '12px 24px', borderRadius: 12, background: globalOn ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${globalOn ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, color: globalOn ? '#4ade80' : '#f87171', fontFamily: 'Georgia,serif', fontSize: 14, cursor: 'pointer', minWidth: 120 }}>
            {saving ? '...' : globalOn ? 'Zapnout' : 'Vypnout vše'}
          </button>
        </div>
      </div>

      {/* QUICK PRESETS */}
      <div style={s.box}>
        <div style={s.label}>Rychlé předvolby — jedním klikem</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
          {QUICK_PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)}
              style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(255,107,168,0.06)', border: '1px solid rgba(255,107,168,0.15)', color: '#FF6BA8', fontFamily: 'Georgia,serif', fontSize: 12, cursor: 'pointer' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div style={{ ...s.box, border: '1px solid rgba(255,107,168,0.2)' }}>
          <div style={{ ...s.label, marginBottom: 16 }}>Nová blokace</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ ...s.label, marginBottom: 5 }}>Název</div>
              <input style={s.inp} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="např. Dovolená" />
            </div>
            <div>
              <div style={{ ...s.label, marginBottom: 5 }}>Typ</div>
              <select style={s.inp} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value, isGlobal: e.target.value === 'GLOBAL' }))}>
                <option value="GLOBAL">Globální (vše)</option>
                <option value="DATE">Konkrétní den</option>
                <option value="DATE_RANGE">Rozsah dní</option>
                <option value="TIME_BLOCK">Časový blok</option>
                <option value="RECURRING">Opakující se</option>
              </select>
            </div>
          </div>

          {(form.type === 'DATE' || form.type === 'DATE_RANGE') && (
            <div style={{ display: 'grid', gridTemplateColumns: form.type === 'DATE_RANGE' ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <div style={{ ...s.label, marginBottom: 5 }}>Datum od</div>
                <input type="date" style={s.inp} value={form.dateFrom} onChange={e => setForm(f => ({ ...f, dateFrom: e.target.value }))} />
              </div>
              {form.type === 'DATE_RANGE' && (
                <div>
                  <div style={{ ...s.label, marginBottom: 5 }}>Datum do</div>
                  <input type="date" style={s.inp} value={form.dateTo} onChange={e => setForm(f => ({ ...f, dateTo: e.target.value }))} />
                </div>
              )}
            </div>
          )}

          {form.type === 'RECURRING' && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ ...s.label, marginBottom: 5 }}>Den v týdnu</div>
              <select style={s.inp} value={form.dayOfWeek} onChange={e => setForm(f => ({ ...f, dayOfWeek: e.target.value }))}>
                <option value="">Vyberte den</option>
                {DAYS.slice(1).map((d, i) => <option key={i+1} value={i+1}>{d}</option>)}
              </select>
            </div>
          )}

          {(form.type === 'TIME_BLOCK' || form.startTime) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <div style={{ ...s.label, marginBottom: 5 }}>Čas od</div>
                <input type="time" style={s.inp} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
              </div>
              <div>
                <div style={{ ...s.label, marginBottom: 5 }}>Čas do</div>
                <input type="time" style={s.inp} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ ...s.label, marginBottom: 5 }}>Režim</div>
              <select style={s.inp} value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}>
                {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{ ...s.label, marginBottom: 5 }}>Interní poznámka</div>
              <input style={s.inp} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Pouze pro Vás" />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ ...s.label, marginBottom: 5 }}>Zpráva pro klientky</div>
            <input style={s.inp} value={form.clientMessage} onChange={e => setForm(f => ({ ...f, clientMessage: e.target.value }))} placeholder="Zobrazí se klientce při výběru termínu" />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} disabled={saving || !form.label} style={s.btn}>
              {saving ? 'Ukládám...' : 'Uložit blokaci'}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ padding: '10px 20px', borderRadius: 10, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,238,242,0.4)', fontFamily: 'Georgia,serif', fontSize: 13, cursor: 'pointer' }}>
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* ADD BUTTON */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{ ...s.btn, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          + Přidat blokaci
        </button>
      )}

      {/* LIST */}
      {loading ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'rgba(245,238,242,0.3)', fontFamily: 'Georgia,serif' }}>Načítám...</div>
      ) : slots.filter(s => !s.isGlobal).length === 0 ? (
        <div style={{ ...s.box, textAlign: 'center', padding: 32 }}>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: 'rgba(245,238,242,0.3)' }}>Žádné blokace</div>
          <div style={{ fontSize: 12, color: 'rgba(245,238,242,0.2)', marginTop: 6 }}>Přidejte blokaci pomocí tlačítka nebo rychlých předvoleb výše</div>
        </div>
      ) : (
        <div>
          {slots.filter(s => !s.isGlobal).map(slot => (
            <div key={slot.id} style={{ ...s.box, opacity: slot.isActive ? 1 : 0.5, border: slot.isActive ? '1px solid rgba(255,107,168,0.1)' : '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: 'rgba(245,238,242,0.9)' }}>{slot.label}</div>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: slot.isActive ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)', color: slot.isActive ? '#4ade80' : 'rgba(245,238,242,0.3)', border: `1px solid ${slot.isActive ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
                      {slot.isActive ? 'Aktivní' : 'Neaktivní'}
                    </span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,107,168,0.08)', color: '#FF6BA8', border: '1px solid rgba(255,107,168,0.15)' }}>
                      {getModeLabel(slot.mode)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(245,238,242,0.4)' }}>{formatSlot(slot)}</div>
                  {slot.reason && <div style={{ fontSize: 11, color: 'rgba(245,238,242,0.25)', marginTop: 3 }}>Poznámka: {slot.reason}</div>}
                  {slot.clientMessage && <div style={{ fontSize: 11, color: 'rgba(212,170,112,0.5)', marginTop: 3 }}>Zpráva: {slot.clientMessage}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => toggle(slot)}
                    style={{ padding: '6px 14px', borderRadius: 8, background: slot.isActive ? 'rgba(248,113,113,0.08)' : 'rgba(74,222,128,0.08)', border: `1px solid ${slot.isActive ? 'rgba(248,113,113,0.2)' : 'rgba(74,222,128,0.2)'}`, color: slot.isActive ? '#f87171' : '#4ade80', fontFamily: 'Georgia,serif', fontSize: 12, cursor: 'pointer' }}>
                    {slot.isActive ? 'Vypnout' : 'Zapnout'}
                  </button>
                  <button onClick={() => remove(slot.id)}
                    style={{ padding: '6px 10px', borderRadius: 8, background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,238,242,0.3)', fontFamily: 'Georgia,serif', fontSize: 12, cursor: 'pointer' }}>
                    Smazat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
