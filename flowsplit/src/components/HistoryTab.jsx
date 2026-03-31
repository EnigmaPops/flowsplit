import React, { useState } from 'react';
import { fmt, symChar, exportCSV } from '../utils/format';

export default function HistoryTab({ store }) {
  const { currency, period, history, addHistory, deleteHistory } = store;
  const [amt, setAmt]   = useState('');
  const [note, setNote] = useState('');

  function handleSave() {
    const a = parseFloat(amt);
    if (!a || a <= 0) return;
    addHistory(a, note, currency, period);
    setAmt(''); setNote('');
  }

  const total = history.reduce((s, e) => s + (e.amt || 0), 0);

  return (
    <div>
      {/* Add entry */}
      <div style={{
        background:'var(--card)', border:'1px solid var(--border)',
        borderRadius:14, padding:'16px 18px', marginBottom:14
      }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:12 }}>
          Log Income Entry
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, alignItems:'flex-end' }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:5 }}>Amount</div>
            <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
              <span style={{ position:'absolute', left:10, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:600, color:'var(--muted)', pointerEvents:'none' }}>
                {symChar(currency)}
              </span>
              <input type="number" value={amt} onChange={e=>setAmt(e.target.value)}
                placeholder="0.00"
                onKeyDown={e => e.key==='Enter' && handleSave()}
                style={{
                  background:'var(--card2)', border:'1px solid var(--border)',
                  borderRadius:9, padding:'9px 12px 9px 22px',
                  fontFamily:'inherit', fontSize:13, color:'var(--text)',
                  outline:'none', width:'100%', transition:'border-color .18s'
                }}
                onFocus={e=>e.target.style.borderColor='rgba(96,165,250,.4)'}
                onBlur={e=>e.target.style.borderColor='var(--border)'}
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:5 }}>Source / Note</div>
            <input type="text" value={note} onChange={e=>setNote(e.target.value)}
              placeholder="e.g. Outlier AI payment…"
              onKeyDown={e => e.key==='Enter' && handleSave()}
              style={{
                background:'var(--card2)', border:'1px solid var(--border)',
                borderRadius:9, padding:'9px 12px',
                fontFamily:'inherit', fontSize:13, color:'var(--text)',
                outline:'none', width:'100%', transition:'border-color .18s'
              }}
              onFocus={e=>e.target.style.borderColor='rgba(96,165,250,.4)'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}
            />
          </div>
          <button onClick={handleSave} style={{
            padding:'9px 16px',
            background:'rgba(52,211,153,.1)', border:'1px solid rgba(52,211,153,.25)',
            borderRadius:9, color:'var(--green)', fontFamily:'inherit',
            fontWeight:700, fontSize:12, cursor:'pointer', transition:'all .18s', whiteSpace:'nowrap'
          }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(52,211,153,.18)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(52,211,153,.1)'}
          >+ Log</button>
        </div>
      </div>

      {/* Summary + export */}
      {history.length > 0 && (
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'12px 16px', background:'var(--card)', border:'1px solid var(--border)',
          borderRadius:12, marginBottom:10
        }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)' }}>Total Logged</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:18, color:'var(--green)', marginTop:3 }}>
              {fmt(total, currency)}
            </div>
          </div>
          <button onClick={() => exportCSV(history)} style={{
            padding:'8px 14px', background:'rgba(96,165,250,.08)',
            border:'1px solid rgba(96,165,250,.2)', borderRadius:9,
            color:'var(--blue)', fontFamily:'inherit', fontWeight:600,
            fontSize:12, cursor:'pointer', transition:'all .18s'
          }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(96,165,250,.15)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(96,165,250,.08)'}
          >
            ↓ Export CSV
          </button>
        </div>
      )}

      {/* List */}
      {history.length === 0 ? (
        <div style={{ textAlign:'center', padding:'32px 20px', color:'var(--muted)', fontSize:13 }}>
          No income logged yet. Add your first entry above.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {history.map((e, i) => (
            <div key={e.id} style={{
              background:'var(--card)', border:'1px solid var(--border)',
              borderRadius:12, padding:'13px 16px',
              display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
              animation:`slideIn .3s ease ${i*.03}s both`
            }}>
              <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'var(--muted)' }}>{e.date}</div>
                <div style={{ fontSize:13, fontWeight:600 }}>{e.note}</div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:2 }}>
                  <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:600, background:'rgba(96,165,250,.1)', color:'var(--blue)' }}>{e.currency}</span>
                  <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:600, background:'rgba(52,211,153,.1)', color:'var(--green)' }}>{e.period}</span>
                </div>
              </div>
              <div style={{ textAlign:'right', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:16, color:'var(--green)' }}>
                  {e.currency==='NGN'?'₦':'$'}{Number(e.amt).toLocaleString()}
                </div>
                <button onClick={() => deleteHistory(e.id)} style={{
                  background:'transparent', border:'none', color:'var(--muted)',
                  fontSize:16, cursor:'pointer', padding:'2px 6px',
                  borderRadius:6, transition:'all .18s'
                }}
                onMouseEnter={e2=>{e2.currentTarget.style.color='var(--red)';e2.currentTarget.style.background='rgba(248,113,113,.08)';}}
                onMouseLeave={e2=>{e2.currentTarget.style.color='var(--muted)';e2.currentTarget.style.background='transparent';}}
                >×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
