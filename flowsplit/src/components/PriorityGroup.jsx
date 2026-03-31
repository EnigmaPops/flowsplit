import React, { useState } from 'react';
import GoalRow from './GoalRow';

export default function PriorityGroup({ group, goals, groupPct, currency, allocs, onSetPct, onAdd, onUpdate, onRemove, onBlurName, nameHistory }) {
  const [open, setOpen] = useState(group.key !== 'optional');

  return (
    <div style={{
      background:'var(--card)', border:'1px solid var(--border)',
      borderRadius:14, overflow:'visible',
      animation:'fadeUp .4s ease both'
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'12px 16px', cursor:'pointer', userSelect:'none',
          borderRadius: open ? '14px 14px 0 0' : 14,
          transition:'background .18s'
        }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.02)'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}
      >
        <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
          <div style={{
            width:8, height:8, borderRadius:'50%', flexShrink:0,
            background:group.color, boxShadow:`0 0 5px ${group.color}`
          }} />
          <span style={{ fontSize:13, fontWeight:700, color:group.color }}>
            {group.label}
          </span>
          <span style={{
            fontSize:9, fontWeight:600, padding:'2px 8px', borderRadius:20,
            letterSpacing:'.04em', fontFamily:"'JetBrains Mono',monospace",
            background:group.pillBg, color:group.pillTxt
          }}>
            ~{groupPct}% after tithe
          </span>
          {/* Editable pct */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ display:'flex', alignItems:'center', gap:4 }}
          >
            <input
              type="number"
              value={groupPct}
              onChange={e => onSetPct(group.key, e.target.value)}
              style={{
                fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:600,
                width:40, padding:'2px 5px', background:'var(--card2)',
                border:'1px solid var(--border)', borderRadius:6,
                color:'var(--text)', outline:'none', textAlign:'center'
              }}
              onFocus={e => e.target.style.borderColor='var(--amber)'}
              onBlur={e  => e.target.style.borderColor='var(--border)'}
            />
            <span style={{ fontSize:10, color:'var(--muted)' }}>%</span>
          </div>
        </div>
        <span style={{
          color:'var(--muted)', fontSize:10,
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition:'transform .2s', marginLeft:6
        }}>▾</span>
      </div>

      {/* Body */}
      {open && (
        <div style={{ borderTop:'1px solid var(--border)', padding:'12px 14px' }}>
          {/* Col headers */}
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 100px 80px 28px',
            gap:7, padding:'0 2px', marginBottom:8
          }}>
            {['Goal name','Target amt','Allocated',''].map((h,i) => (
              <div key={i} style={{
                fontSize:9, fontWeight:700, letterSpacing:'.1em',
                textTransform:'uppercase', color:'var(--muted)'
              }}>{h}</div>
            ))}
          </div>

          {/* Goals */}
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {goals.map(goal => (
              <GoalRow
                key={goal.id}
                goal={goal}
                groupKey={group.key}
                groupColor={group.color}
                currency={currency}
                allocAmt={allocs[goal.id] || 0}
                onUpdate={onUpdate}
                onRemove={onRemove}
                onBlurName={onBlurName}
                nameHistory={nameHistory}
              />
            ))}
          </div>

          <button
            onClick={() => onAdd(group.key)}
            style={{
              width:'100%', marginTop:8, padding:'8px',
              background:'transparent', border:'1px dashed rgba(255,255,255,.07)',
              borderRadius:9, color:'var(--muted)', fontFamily:'inherit',
              fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .18s'
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--green)';e.currentTarget.style.color='var(--green)';e.currentTarget.style.background='rgba(52,211,153,.05)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.color='var(--muted)';e.currentTarget.style.background='transparent';}}
          >
            + Add {group.label.toLowerCase()} goal
          </button>
        </div>
      )}
    </div>
  );
}
