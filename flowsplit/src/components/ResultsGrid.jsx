import React from 'react';
import { fmt } from '../utils/format';
import { GROUPS, GOAL_COLORS } from '../utils/calc';

export default function ResultsGrid({ gross, tithe, titheEnabled, allocs, goals, currency, freeCash, totalAllocated }) {
  if (!gross || gross <= 0) {
    return (
      <div style={{ textAlign:'center', padding:'32px 20px', color:'var(--muted)', fontSize:13 }}>
        Enter your income to see the breakdown.
      </div>
    );
  }

  let ci = 0;
  const cards = [];

  if (titheEnabled && tithe > 0) {
    cards.push(
      <div key="tithe" style={{
        background:'rgba(52,211,153,.03)', border:'1px solid rgba(52,211,153,.12)',
        borderRadius:13, padding:'14px', position:'relative', overflow:'hidden',
        animation:'slideIn .3s ease both'
      }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--green)' }} />
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:5 }}>Tithe</div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:17, marginBottom:2 }}>{fmt(tithe, currency)}</div>
        <div style={{ fontSize:10, color:'var(--muted2)' }}>10% off the top</div>
        <div style={{ marginTop:8, height:2, background:'var(--card2)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:'10%', background:'var(--green)', borderRadius:2 }} />
        </div>
      </div>
    );
  }

  GROUPS.forEach(g => {
    (goals[g.key] || []).forEach(goal => {
      const amt = allocs[goal.id] || 0;
      if (amt <= 0) return;
      const pct   = gross > 0 ? ((amt / gross) * 100).toFixed(1) : 0;
      const color = GOAL_COLORS[ci++ % GOAL_COLORS.length];
      const months = goal.target && Number(goal.target) > 0 && amt > 0
        ? Math.ceil(Number(goal.target) / amt) : null;

      cards.push(
        <div key={goal.id} style={{
          background:'var(--card)', border:'1px solid var(--border)',
          borderRadius:13, padding:14, position:'relative', overflow:'hidden',
          transition:'transform .18s, box-shadow .18s',
          animation:`slideIn .3s ease ${ci * .04}s both`,
          cursor:'default'
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 22px rgba(0,0,0,.3)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}
        >
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:g.color }} />
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:5 }}>
            {goal.name || 'Goal'}
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:17, marginBottom:2 }}>
            {fmt(amt, currency)}
          </div>
          <div style={{ fontSize:10, color:'var(--muted2)' }}>
            {pct}% · {g.label}
          </div>
          {months && (
            <div style={{ fontSize:10, color:'var(--muted)', marginTop:1 }}>
              Target {fmt(Number(goal.target), currency)} · ~{months} mo
            </div>
          )}
          <div style={{ marginTop:8, height:2, background:'var(--card2)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${Math.min(pct,100)}%`, background:g.color, borderRadius:2, transition:'width .55s cubic-bezier(.34,1.56,.64,1)' }} />
          </div>
        </div>
      );
    });
  });

  const over = freeCash < -0.01;
  const fcPct = gross > 0 ? ((Math.abs(freeCash) / gross) * 100).toFixed(1) : 0;

  return (
    <>
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))',
        gap:9, marginBottom:10
      }}>
        {cards}
      </div>
      <div style={{
        padding:'13px 18px', borderRadius:12,
        border:`1px solid ${over ? 'rgba(248,113,113,.2)' : 'rgba(52,211,153,.18)'}`,
        background: over ? 'rgba(248,113,113,.03)' : 'rgba(52,211,153,.03)',
        display:'flex', justifyContent:'space-between', alignItems:'center'
      }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)' }}>
            {over ? '⚠ Over Budget' : '🟢 Free Cash / Buffer'}
          </div>
          <div style={{ fontSize:10, color:'var(--muted)', marginTop:2 }}>
            {over ? 'Reduce allocations' : `${fcPct}% unallocated`}
          </div>
        </div>
        <div style={{
          fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:17,
          color: over ? 'var(--red)' : 'var(--green)'
        }}>
          {fmt(Math.abs(freeCash), currency)}
        </div>
      </div>
    </>
  );
}
