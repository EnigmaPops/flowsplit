import React, { useState } from 'react';
import { GROUPS, calcAllocations, GOAL_COLORS } from '../utils/calc';
import { fmt, symChar } from '../utils/format';

export default function DashboardTab({ store }) {
  const { currency, titheEnabled, groupPcts, goals, history } = store;
  const [income, setIncome] = useState('');
  const gross = parseFloat(income) || 0;
  const { tithe, net, allocs, totalAllocated, freeCash } = calcAllocations({ gross, titheEnabled, groupPcts, goals });

  const histTotal = history.reduce((s, e) => s + (e.amt || 0), 0);
  const histCount = history.length;

  const statCards = [
    { label:'Income (this session)', val: fmt(gross, currency), color:'var(--green)', border:'rgba(52,211,153,.18)' },
    { label:'Total Allocated',       val: fmt(totalAllocated, currency), color:'var(--blue)',  border:'rgba(96,165,250,.18)' },
    { label:'Tithe',                 val: titheEnabled ? fmt(tithe, currency) : 'Off', color:'var(--amber)', border:'rgba(251,191,36,.18)' },
    { label:'Free Cash / Buffer',    val: fmt(Math.max(0,freeCash), currency), color: freeCash < 0 ? 'var(--red)' : 'var(--green)', border: freeCash < 0 ? 'rgba(248,113,113,.18)' : 'rgba(52,211,153,.18)' },
    { label:'Logged Income (total)', val: fmt(histTotal, currency), color:'var(--purple)', border:'rgba(167,139,250,.18)' },
    { label:'Log Entries',           val: histCount, color:'var(--teal)',   border:'rgba(45,212,191,.18)' },
  ];

  let ci = 0;

  return (
    <div>
      {/* Income input for dashboard */}
      <div style={{
        background:'var(--card)', border:'1px solid var(--border)',
        borderRadius:14, padding:'14px 18px', marginBottom:14
      }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:8 }}>
          Enter income to preview
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:600, color:'var(--green)', flexShrink:0 }}>
            {symChar(currency)}
          </span>
          <input
            type="number" value={income} onChange={e => setIncome(e.target.value)}
            placeholder="0.00"
            style={{
              flex:1, background:'transparent', border:'none', outline:'none',
              fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:28, fontWeight:800,
              color:'var(--text)', caretColor:'var(--green)', minWidth:0
            }}
          />
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:10, marginBottom:22 }}>
        {statCards.map((s,i) => (
          <div key={i} style={{
            background:'var(--card)', border:`1px solid ${s.border}`,
            borderRadius:13, padding:'14px 16px'
          }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:6 }}>
              {s.label}
            </div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:18, color:s.color }}>
              {s.val}
            </div>
          </div>
        ))}
      </div>

      {/* Visual category bars */}
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:12 }}>
        Category Overview
      </div>

      {gross <= 0 ? (
        <div style={{ color:'var(--muted)', fontSize:13, padding:'16px 0' }}>Enter income above to see the overview.</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {titheEnabled && tithe > 0 && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--green)' }}>Tithe</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'var(--muted2)' }}>
                  {fmt(tithe, currency)} · 10%
                </span>
              </div>
              <div style={{ height:6, background:'var(--card2)', borderRadius:3, overflow:'hidden' }}>
                <div style={{ height:'100%', width:'10%', background:'var(--green)', borderRadius:3, transition:'width .6s cubic-bezier(.34,1.56,.64,1)' }} />
              </div>
            </div>
          )}

          {GROUPS.map(g =>
            (goals[g.key] || []).map(goal => {
              const amt = allocs[goal.id] || 0;
              if (amt <= 0) return null;
              const pct = gross > 0 ? ((amt / gross) * 100).toFixed(1) : 0;
              const color = GOAL_COLORS[ci++ % GOAL_COLORS.length];
              const months = goal.target && Number(goal.target) > 0 && amt > 0
                ? Math.ceil(Number(goal.target) / amt) : null;
              return (
                <div key={goal.id}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, alignItems:'flex-end' }}>
                    <span style={{ fontSize:12, fontWeight:600, color:g.color }}>
                      {goal.name || 'Goal'}{' '}
                      <span style={{ fontSize:10, color:'var(--muted)', fontWeight:400 }}>{g.label}</span>
                    </span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'var(--muted2)' }}>
                      {fmt(amt, currency)} · {pct}%{months ? ` · ~${months} mo` : ''}
                    </span>
                  </div>
                  <div style={{ height:6, background:'var(--card2)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.min(pct,100)}%`, background:g.color, borderRadius:3, transition:'width .6s cubic-bezier(.34,1.56,.64,1)' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
