import React from 'react';
import { fmt, symChar } from '../utils/format';
import { Chip } from './UI';

export default function IncomeCard({ income, setIncome, currency, period, titheEnabled, tithe, net }) {
  return (
    <div style={{
      background:'var(--card)', border:'1px solid var(--border)',
      borderRadius:18, padding:'18px 22px', marginBottom:14,
      position:'relative', overflow:'hidden',
      animation:'fadeUp .4s ease .1s both'
    }}>
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:1,
        background:'linear-gradient(90deg,transparent,var(--green),transparent)'
      }} />
      <div style={{
        fontSize:10, fontWeight:700, letterSpacing:'.1em',
        textTransform:'uppercase', color:'var(--muted)', marginBottom:10
      }}>
        {period === 'monthly' ? 'Monthly' : 'Weekly'} Income
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace", fontSize:26,
          fontWeight:600, color:'var(--green)', flexShrink:0, lineHeight:1
        }}>
          {symChar(currency)}
        </span>
        <input
          type="number"
          value={income}
          onChange={e => setIncome(e.target.value)}
          placeholder="0.00"
          style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            fontFamily:'Plus Jakarta Sans, sans-serif',
            fontSize:'clamp(26px, 5.5vw, 42px)', fontWeight:800,
            color:'var(--text)', caretColor:'var(--green)',
            minWidth:0, width:'100%'
          }}
        />
      </div>

      {titheEnabled && income > 0 && (
        <div style={{
          marginTop:10, paddingTop:10, borderTop:'1px solid var(--border)',
          display:'flex', alignItems:'center', gap:10, flexWrap:'wrap',
          fontSize:11, color:'var(--muted2)',
          animation:'fadeUp .3s ease both'
        }}>
          <Chip>✝ Tithe: {fmt(tithe, currency)}</Chip>
          <span style={{ color:'var(--muted)', fontSize:12 }}>→</span>
          <span style={{ color:'var(--muted2)', fontSize:11 }}>Working with</span>
          <span style={{
            fontFamily:"'JetBrains Mono',monospace",
            fontWeight:600, fontSize:13, color:'var(--text)'
          }}>
            {fmt(net, currency)}
          </span>
          <Chip color='var(--blue)' bg='rgba(96,165,250,.08)' border='rgba(96,165,250,.2)'>
            {period}
          </Chip>
        </div>
      )}
    </div>
  );
}
