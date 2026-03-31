import React, { useState, useCallback } from 'react';
import { fmt, symChar } from '../utils/format';
import { RmButton } from './UI';

let _sid = 1;
function sid() { return ++_sid; }

const INIT_ROWS = [
  { id: sid(), name: 'Food & Groceries', pct: '', amt: '' },
  { id: sid(), name: 'Transport',        pct: '', amt: '' },
  { id: sid(), name: 'Savings',          pct: '', amt: '' },
];

export default function QuickSplitTab({ currency }) {
  const [total,   setTotal]   = useState('');
  const [rows,    setRows]    = useState(INIT_ROWS);

  const gross = parseFloat(total) || 0;

  const updateRow = useCallback((id, field, val, derive) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: val };
      if (derive === 'from_pct' && gross > 0) {
        const p = parseFloat(val) || 0;
        updated.amt = p > 0 ? (currency === 'NGN' ? Math.round((p/100)*gross) : +((p/100)*gross).toFixed(2)) : '';
      }
      if (derive === 'from_amt' && gross > 0) {
        const a = parseFloat(val) || 0;
        updated.pct = a > 0 ? Math.round((a/gross)*1000)/10 : '';
      }
      return updated;
    }));
  }, [gross, currency]);

  function addRow() {
    setRows(prev => [...prev, { id: sid(), name: '', pct: '', amt: '' }]);
  }

  function removeRow(id) {
    setRows(prev => prev.filter(r => r.id !== id));
  }

  const allocPct = Math.round(rows.reduce((s,r) => s + (parseFloat(r.pct)||0), 0) * 10) / 10;
  const allocAmt = rows.reduce((s,r) => s + (parseFloat(r.amt)||0), 0);
  const remPct   = Math.round((100 - allocPct) * 10) / 10;
  const remAmt   = gross - allocAmt;
  const over     = allocPct > 100;

  return (
    <div>
      {/* Total */}
      <div style={{
        background:'var(--card)', border:'1px solid var(--border)',
        borderRadius:18, padding:'18px 22px', marginBottom:14,
        position:'relative', overflow:'hidden'
      }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,var(--green),transparent)' }} />
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:10 }}>
          Amount to Split
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:600, color:'var(--green)', flexShrink:0 }}>
            {symChar(currency)}
          </span>
          <input
            type="number" value={total} onChange={e => setTotal(e.target.value)}
            placeholder="0.00"
            style={{
              flex:1, background:'transparent', border:'none', outline:'none',
              fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'clamp(26px,5.5vw,42px)',
              fontWeight:800, color:'var(--text)', caretColor:'var(--green)', minWidth:0
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:9, marginBottom:18 }}>
        {[
          { label:'Allocated %', val: allocPct+'%', color: over?'var(--red)':'var(--text)', border:'var(--border)', bg:'var(--card)' },
          { label:'Remaining %', val: (over?'+':'')+Math.abs(remPct)+'%', color: over?'var(--red)':'var(--green)', border: over?'rgba(248,113,113,.2)':'rgba(52,211,153,.18)', bg: over?'rgba(248,113,113,.03)':'rgba(52,211,153,.03)' },
          { label:'Remaining Amt', val: gross>0 ? fmt(Math.abs(remAmt),currency) : '—', color: remAmt<0?'var(--red)':gross>0?'var(--green)':'var(--text)', border: remAmt<0?'rgba(248,113,113,.2)':gross>0?'rgba(52,211,153,.18)':'var(--border)', bg: remAmt<0?'rgba(248,113,113,.03)':gross>0?'rgba(52,211,153,.03)':'var(--card)' },
        ].map((s,i) => (
          <div key={i} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:12, padding:'13px 14px' }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:5 }}>{s.label}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:17, color:s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Col headers */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 95px 110px 28px', gap:8, padding:'0 2px', marginBottom:7 }}>
        {['Recipient','% share','Amount',''].map((h,i)=>(
          <div key={i} style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)' }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:10 }}>
        {rows.map(row => (
          <div key={row.id} style={{ display:'grid', gridTemplateColumns:'1fr 95px 110px 28px', gap:8, alignItems:'center' }}>
            <input
              type="text" value={row.name}
              onChange={e => updateRow(row.id,'name',e.target.value)}
              placeholder="Recipient…"
              style={{
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:10, padding:'10px 12px',
                fontFamily:'inherit', fontSize:13, fontWeight:500,
                color:'var(--text)', outline:'none', width:'100%'
              }}
              onFocus={e=>e.target.style.borderColor='rgba(96,165,250,.4)'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}
            />
            <input
              type="number" value={row.pct}
              onChange={e => updateRow(row.id,'pct',e.target.value,'from_pct')}
              placeholder="%"
              style={{
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:10, padding:'10px', fontFamily:"'JetBrains Mono',monospace",
                fontWeight:500, fontSize:13, color:'var(--text)', outline:'none',
                width:'100%', textAlign:'right'
              }}
              onFocus={e=>e.target.style.borderColor='var(--green)'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}
            />
            <input
              type="number" value={row.amt}
              onChange={e => updateRow(row.id,'amt',e.target.value,'from_amt')}
              placeholder={symChar(currency)+'0'}
              style={{
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:10, padding:'10px', fontFamily:"'JetBrains Mono',monospace",
                fontWeight:500, fontSize:13, color:'var(--text)', outline:'none',
                width:'100%', textAlign:'right'
              }}
              onFocus={e=>e.target.style.borderColor='var(--green)'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}
            />
            <RmButton onClick={() => removeRow(row.id)} />
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        style={{
          width:'100%', padding:'10px', background:'transparent',
          border:'1px dashed rgba(255,255,255,.08)', borderRadius:10,
          color:'var(--muted)', fontFamily:'inherit', fontSize:12,
          fontWeight:600, cursor:'pointer', transition:'all .18s'
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--green)';e.currentTarget.style.color='var(--green)';e.currentTarget.style.background='rgba(52,211,153,.05)';}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.08)';e.currentTarget.style.color='var(--muted)';e.currentTarget.style.background='transparent';}}
      >
        + Add recipient
      </button>
    </div>
  );
}
