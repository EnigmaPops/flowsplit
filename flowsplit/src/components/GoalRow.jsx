import React, { useState, useRef } from 'react';
import { RmButton } from './UI';
import { symChar } from '../utils/format';

export default function GoalRow({ goal, groupKey, groupColor, currency, allocAmt, onUpdate, onRemove, onBlurName, nameHistory }) {
  const [acOpen, setAcOpen] = useState(false);
  const [acItems, setAcItems] = useState([]);
  const nameRef = useRef();

  function handleNameChange(val) {
    onUpdate(groupKey, goal.id, 'name', val);
    const q = val.trim().toLowerCase();
    if (q) {
      const matches = nameHistory.filter(n => n.toLowerCase().includes(q) && n !== val);
      setAcItems(matches.slice(0, 6));
      setAcOpen(matches.length > 0);
    } else {
      setAcOpen(false);
    }
  }

  function pickAc(name) {
    onUpdate(groupKey, goal.id, 'name', name);
    setAcOpen(false);
  }

  const progress = goal.target && Number(goal.target) > 0 && allocAmt > 0
    ? Math.min(100, (allocAmt / Number(goal.target)) * 100)
    : 0;

  const months = goal.target && Number(goal.target) > 0 && allocAmt > 0
    ? Math.ceil(Number(goal.target) / allocAmt)
    : null;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:3, marginBottom:2 }}>
      <div style={{
        display:'grid',
        gridTemplateColumns:'1fr 100px 80px 28px',
        gap:7, alignItems:'center'
      }}>
        {/* Name with autocomplete */}
        <div style={{ position:'relative' }}>
          <input
            ref={nameRef}
            type="text"
            value={goal.name}
            onChange={e => handleNameChange(e.target.value)}
            onBlur={() => {
              setTimeout(() => setAcOpen(false), 150);
              if (goal.name.trim()) onBlurName(goal.name.trim());
            }}
            placeholder="Goal name…"
            autoComplete="off"
            style={{
              background:'var(--card2)', border:'1px solid var(--border)',
              borderRadius:9, padding:'8px 11px',
              fontFamily:'inherit', fontSize:12, fontWeight:500,
              color:'var(--text)', outline:'none', width:'100%',
              transition:'border-color .18s'
            }}
            onFocus={e => e.target.style.borderColor='rgba(96,165,250,.4)'}
          />
          {acOpen && (
            <div style={{
              position:'absolute', top:'calc(100% + 4px)', left:0, right:0,
              background:'var(--card2)', border:'1px solid var(--border2)',
              borderRadius:10, zIndex:100, overflow:'hidden',
              boxShadow:'0 8px 24px rgba(0,0,0,.5)'
            }}>
              {acItems.map(item => (
                <div
                  key={item}
                  onMouseDown={() => pickAc(item)}
                  style={{
                    padding:'9px 13px', fontSize:12, cursor:'pointer',
                    transition:'background .15s', color:'var(--text)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.05)'; e.currentTarget.style.color='var(--green)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text)'; }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Target */}
        <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <span style={{
            position:'absolute', left:7,
            fontFamily:"'JetBrains Mono',monospace", fontSize:10,
            fontWeight:600, color:'var(--muted)', pointerEvents:'none', zIndex:1
          }}>
            {symChar(currency)}
          </span>
          <input
            type="number"
            value={goal.target}
            onChange={e => onUpdate(groupKey, goal.id, 'target', e.target.value)}
            placeholder="optional"
            style={{
              background:'var(--card2)', border:'1px solid var(--border)',
              borderRadius:9, padding:'8px 8px 8px 18px',
              fontFamily:"'JetBrains Mono',monospace", fontSize:12,
              color:'var(--muted2)', outline:'none', width:'100%',
              transition:'border-color .18s, color .18s'
            }}
            onFocus={e => { e.target.style.borderColor='rgba(52,211,153,.35)'; e.target.style.color='var(--text)'; }}
            onBlur={e  => { e.target.style.borderColor='var(--border)'; e.target.style.color='var(--muted2)'; }}
          />
        </div>

        {/* Allocated */}
        <div style={{
          background:'var(--card2)', border:'1px solid var(--border)',
          borderRadius:9, padding:'8px 9px',
          fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:600,
          color: allocAmt > 0 ? 'var(--green)' : 'var(--muted)',
          textAlign:'right', transition:'color .2s'
        }}>
          {allocAmt > 0 ? `${''}${allocAmt.toFixed(0)}` : '—'}
        </div>

        <RmButton onClick={() => onRemove(groupKey, goal.id)} />
      </div>

      {/* Progress bar + months */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr auto',
        gap:8, paddingRight:35, alignItems:'center'
      }}>
        <div style={{ height:2, background:'var(--card2)', borderRadius:2, overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:2,
            width: progress + '%',
            background: groupColor,
            transition:'width .5s cubic-bezier(.34,1.56,.64,1)'
          }} />
        </div>
        {months && (
          <span style={{
            fontSize:10, color:'var(--muted)',
            fontFamily:"'JetBrains Mono',monospace",
            whiteSpace:'nowrap'
          }}>
            ~{months} mo
          </span>
        )}
      </div>
    </div>
  );
}
