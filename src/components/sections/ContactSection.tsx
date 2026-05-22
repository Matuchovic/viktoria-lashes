'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useToast } from '@/components/ui/Toaster'

const INFO = [
  { icon:'📞', label:'Telefon & WhatsApp', value:'+420 720 307 007\nPo–Ne, 8:00 – 20:00' },
  { icon:'✉',  label:'E-mail',             value:'viktorialadikova23@gmail.com\nOdpovídám co nejdříve' },
  { icon:'🕐', label:'Pracovní doba',       value:'Pondělí – Pátek: 8:00 – 20:00\nSobota: 9:00 – 18:00\nNeděle: 10:00 – 16:00\n\nNehodí se čas? Zavolej a domluvíme se :)' },
  { icon:'🏠', label:'Kde působím',         value:'Mladá Boleslav a okolí\nPřijedu přímo k Vám domů' },
]

const TOWNS = [
  { lat:50.4151, lng:14.9054, name:'Mladá Boleslav', main:true },
  { lat:50.472,  lng:14.826,  name:'Bakov n. J.', tier:1 },
  { lat:50.437,  lng:15.005,  name:'Benátky n. J.', tier:1 },
  { lat:50.533,  lng:14.624,  name:'Mnich. Hradiště', tier:1 },
  { lat:50.380,  lng:14.780,  name:'Brandýs n. L.', tier:1 },
  { lat:50.356,  lng:14.903,  name:'Lysá n. L.', tier:1 },
  { lat:50.235,  lng:15.170,  name:'Nymburk', tier:2 },
  { lat:50.023,  lng:15.268,  name:'Poděbrady', tier:2 },
  { lat:50.028,  lng:15.769,  name:'Kolín', tier:2 },
  { lat:50.340,  lng:14.474,  name:'Mělník', tier:2 },
  { lat:50.693,  lng:14.544,  name:'Liberec', tier:3 },
  { lat:50.431,  lng:15.904,  name:'Jičín', tier:3 },
  { lat:50.099,  lng:14.420,  name:'Praha', tier:3 },
]

function VLMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const L = (window as any).L
      if (!mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [50.4151, 14.9054],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
      })
      mapInstance.current = map

      // CartoDB Dark Matter — looks exactly like Google Maps dark
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Zone circles
      L.circle([50.4151, 14.9054], {
        radius: 10000,
        color: '#FF6BA8', weight: 1.5, opacity: 0.6,
        fillColor: '#FF6BA8', fillOpacity: 0.07,
        dashArray: '',
      }).addTo(map)
      L.circle([50.4151, 14.9054], {
        radius: 30000,
        color: '#D4AA70', weight: 1, opacity: 0.35,
        fillColor: '#D4AA70', fillOpacity: 0.04,
        dashArray: '6 6',
      }).addTo(map)
      L.circle([50.4151, 14.9054], {
        radius: 50000,
        color: '#C4698A', weight: 0.8, opacity: 0.2,
        fillColor: '#C4698A', fillOpacity: 0.02,
        dashArray: '4 8',
      }).addTo(map)

      // Main marker — Mladá Boleslav
      const mainIcon = L.divIcon({
        className: '',
        html: `<div style="position:relative;width:0;height:0">
          <style>
            @keyframes vl-ring{0%{transform:translate(-50%,-50%) scale(0.4);opacity:0.8}100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}}
            @keyframes vl-pulse{0%,100%{box-shadow:0 0 12px #FF6BA8,0 0 24px rgba(255,107,168,0.5)}50%{box-shadow:0 0 20px #FF6BA8,0 0 40px rgba(255,107,168,0.7)}}
          </style>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(255,107,168,0.7);animation:vl-ring 2s ease-out infinite"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,107,168,0.4);animation:vl-ring 2s ease-out infinite 0.55s"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,107,168,0.2);animation:vl-ring 2s ease-out infinite 1.1s"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#FFD0E8,#FF6BA8,#C4698A);animation:vl-pulse 2s ease-in-out infinite;box-shadow:0 0 16px #FF6BA8"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:5px;height:5px;border-radius:50%;background:white;box-shadow:0 0 6px white"></div>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      })
      L.marker([50.4151, 14.9054], { icon: mainIcon })
        .bindPopup(`
          <div style="background:#0d0508;border:1px solid rgba(255,107,168,0.3);border-radius:10px;padding:12px 16px;font-family:Georgia,serif;color:#F5EEF2;min-width:160px">
            <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#FF6BA8;margin-bottom:5px">✦ Centrum</div>
            <div style="font-size:14px;font-weight:300;margin-bottom:4px">Mladá Boleslav</div>
            <div style="font-size:10px;color:rgba(245,238,242,0.4)">Přijedu k Vám domů</div>
          </div>`, {
          className: 'vl-popup',
          closeButton: false,
        })
        .addTo(map)

      // Town markers
      const tierCols = ['', '#E8A4BE', '#D4AA70', '#C4698A']
      const tierSizes = ['', '7', '6', '5']
      TOWNS.filter(t => !t.main).forEach(town => {
        const col = tierCols[town.tier!]
        const sz = tierSizes[town.tier!]
        const tIcon = L.divIcon({
          className: '',
          html: `<div style="position:relative;width:0;height:0">
            <style>@keyframes vl-t{0%{transform:translate(-50%,-50%) scale(1);opacity:0.6}100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}}</style>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${sz}px;height:${sz}px;border-radius:50%;border:1px solid ${col};opacity:0.5;animation:vl-t ${2.2+town.tier!*0.3}s ease-out infinite ${town.lat*0.1 % 1}s"></div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${sz}px;height:${sz}px;border-radius:50%;background:${col};box-shadow:0 0 ${town.tier===1?8:6}px ${col}"></div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:2.5px;height:2.5px;border-radius:50%;background:white"></div>
          </div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        })
        L.marker([town.lat, town.lng], { icon: tIcon })
          .bindTooltip(town.name, { className: 'vl-tooltip', direction: 'top', offset: [0, -6] })
          .addTo(map)
      })

      // Custom CSS
      const css = document.createElement('style')
      css.textContent = `
        .vl-tooltip {
          background: rgba(8,6,8,0.92) !important;
          border: 0.5px solid rgba(255,107,168,0.25) !important;
          border-radius: 8px !important;
          color: rgba(245,238,242,0.85) !important;
          font-family: Georgia, serif !important;
          font-size: 11px !important;
          font-weight: 300 !important;
          padding: 5px 10px !important;
          letter-spacing: 0.5px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .vl-tooltip::before { border-top-color: rgba(255,107,168,0.25) !important; }
        .vl-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
          padding: 0 !important;
          border-radius: 10px !important;
        }
        .vl-popup .leaflet-popup-content { margin: 0 !important; }
        .vl-popup .leaflet-popup-tip-container { display: none !important; }
        .leaflet-control-zoom a {
          background: rgba(8,6,8,0.9) !important;
          color: rgba(255,107,168,0.8) !important;
          border: 0.5px solid rgba(255,107,168,0.2) !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(255,107,168,0.1) !important;
          color: #FF6BA8 !important;
        }
        .leaflet-control-zoom { border: none !important; box-shadow: none !important; }
        .leaflet-bar { box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important; border-radius: 10px !important; overflow: hidden !important; border: 0.5px solid rgba(255,107,168,0.15) !important; }
        .leaflet-tile-pane { filter: brightness(0.9) contrast(1.05) saturate(0.8); }
      `
      document.head.appendChild(css)
    }
    document.head.appendChild(script)

    return () => { mapInstance.current?.remove(); mapInstance.current = null }
  }, [])

  return (
    <div ref={mapRef} style={{ width:'100%', height:'100%', borderRadius:'inherit' }}/>
  )
}

export function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', message:'' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast('Vyplňte prosím všechna pole.','error'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      if (res.ok) { toast('Zpráva odeslána! Ozveme se vám brzy.','success'); setForm({name:'',email:'',message:''}) }
      else toast('Chyba při odesílání.','error')
    } finally { setLoading(false) }
  }

  return (
    <section id="kontakt" className="bg-black px-8 md:px-16 py-32">
      <motion.div ref={ref} initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}} className="mb-16">
        <div className="section-label mb-5">Kontakt</div>
        <h2 className="section-title">Přijedu <em>k Vám domů</em></h2>
      </motion.div>

      {/* MAP */}
      <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,delay:0.1}}
        className="relative mb-16 rounded-2xl overflow-hidden"
        style={{height:440, border:'1px solid rgba(255,107,168,0.15)', boxShadow:'0 0 60px rgba(255,107,168,0.08)'}}>
        <VLMap />
        {/* Overlay — info card */}
        <div style={{position:'absolute',top:20,left:20,zIndex:1000,background:'rgba(8,6,8,0.88)',border:'0.5px solid rgba(255,107,168,0.25)',borderRadius:14,padding:'14px 18px',backdropFilter:'blur(12px)',pointerEvents:'none'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:1.5,borderRadius:'14px 14px 0 0',background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)'}}/>
          <div style={{fontFamily:'Georgia,serif',fontSize:8,letterSpacing:4,textTransform:'uppercase',color:'rgba(212,170,112,0.8)',marginBottom:5}}>✦ Oblast výjezdů</div>
          <div style={{fontFamily:'Georgia,serif',fontSize:14,fontWeight:300,color:'#F5EEF2',marginBottom:3}}>Mladá Boleslav & okolí</div>
          <div style={{fontFamily:'Georgia,serif',fontSize:9,color:'rgba(245,238,242,0.35)',letterSpacing:1}}>Do 10 km zdarma · nad 10 km příplatek</div>
        </div>
        {/* Legend */}
        <div style={{position:'absolute',bottom:20,right:20,zIndex:1000,background:'rgba(8,6,8,0.88)',border:'0.5px solid rgba(212,170,112,0.15)',borderRadius:14,padding:'12px 16px',pointerEvents:'none'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:1.5,borderRadius:'14px 14px 0 0',background:'linear-gradient(90deg,transparent,#D4AA70,transparent)'}}/>
          {[
            {col:'#FF6BA8', glow:'#FF6BA8', label:'Centrum — zdarma'},
            {col:'#E8A4BE', glow:'#E8A4BE', label:'Do 10 km — zdarma'},
            {col:'#D4AA70', glow:'#D4AA70', label:'10–30 km — příplatek'},
            {col:'rgba(196,105,138,0.5)', glow:'none', label:'30–50 km — dohodou'},
          ].map(l => (
            <div key={l.label} style={{display:'flex',alignItems:'center',gap:9,marginBottom:7}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:l.col,boxShadow:l.glow!=='none'?`0 0 6px ${l.glow}`:'none',flexShrink:0}}/>
              <span style={{fontFamily:'Georgia,serif',fontSize:10,fontWeight:300,color:'rgba(245,238,242,0.6)'}}>{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div initial={{opacity:0,x:-30}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.8,delay:0.2}} className="space-y-8">
          {INFO.map(item=>(
            <div key={item.label} className="flex gap-6 items-start pb-8 border-b border-glass-border last:border-none">
              <div className="w-12 h-12 border border-glass-border flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
              <div>
                <div className="font-light tracking-[3px] uppercase text-pink-neon mb-2" style={{fontSize:11}}>{item.label}</div>
                <div className="text-text-muted font-light leading-relaxed text-sm whitespace-pre-line">{item.value}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-4 pt-2">
            <a href="https://wa.me/420720307007" className="btn-primary py-3 px-6 text-[10px]">WhatsApp</a>
            <a href="mailto:viktorialadikova23@gmail.com" className="btn-ghost py-3 px-6 text-[10px]">E-mail</a>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.8,delay:0.3}} className="relative glass-card p-12">
          <div className="absolute top-0 left-0 right:0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"/>
          <h3 className="font-serif text-3xl font-light mb-2">Napište mi</h3>
          <p className="text-text-muted text-sm font-light mb-8">Máte dotaz? Ozveme se vám co nejdříve.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:11}}>Vaše jméno</label>
              <input className="form-control" placeholder="Jana Nováková" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
            </div>
            <div>
              <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:11}}>E-mail</label>
              <input type="email" className="form-control" placeholder="jana@email.cz" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
            </div>
            <div>
              <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:11}}>Zpráva</label>
              <textarea className="form-control resize-none" rows={5} placeholder="Váš dotaz..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}/>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full border-none font-sans">
              {loading?'Odesílám...':'Odeslat zprávu →'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
