import React from 'react';

export function ToggleGroup({ options, value, onChange }) {
  return (
    <div style={{
      display:'flex', background:'var(--card2)', border:'1px solid var(--border)',
      borderRadius:10, padding:3, gap:2
    }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding:'4px 13px', borderRadius:7, border:'none',
          background: value===o.value ? 'var(--green)' : 'transparent',
          color: value===o.value ? '#0b1a12' : 'var(--muted2)',
          fontFamily:'inherit', fontWeight:700, fontSize:12,
          cursor:'pointer', transition:'all .18s', letterSpacing:'.03em',
          boxShadow: value===o.value ? '0 2px 8px rgba(52,211,153,.3)' : 'none',
        }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Card({ children, style, accent }) {
  return (
    <div style={{
      background:'var(--card)', border:'1px solid var(--border)',
      borderRadius:16, padding:'18px 22px', position:'relative',
      overflow:'hidden', ...style
    }}>
      {accent && (
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:1,
          background:'linear-gradient(90deg,transparent,var(--green),transparent)'
        }} />
      )}
      {children}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize:10, fontWeight:700, letterSpacing:'.1em',
      textTransform:'uppercase', color:'var(--muted)', margin:'20px 0 10px'
    }}>
      {children}
    </div>
  );
}

export function Chip({ children, color='var(--green)', bg='rgba(52,211,153,.1)', border='rgba(52,211,153,.2)' }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      background:bg, border:`1px solid ${border}`,
      borderRadius:20, padding:'3px 10px',
      fontSize:11, fontWeight:600, color,
      fontFamily:"'JetBrains Mono',monospace",
    }}>
      {children}
    </span>
  );
}

export function MonoVal({ children, size=17, color='var(--text)' }) {
  return (
    <span style={{
      fontFamily:"'JetBrains Mono',monospace",
      fontWeight:600, fontSize:size, color
    }}>
      {children}
    </span>
  );
}

export function FieldInput({ value, onChange, placeholder, style, type='text', onBlur }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      style={{
        background:'var(--card2)', border:'1px solid var(--border)',
        borderRadius:9, padding:'8px 11px',
        fontFamily:'inherit', fontSize:12, fontWeight:500,
        color:'var(--text)', outline:'none', width:'100%',
        transition:'border-color .18s',
        ...style
      }}
      onFocus={e => e.target.style.borderColor='rgba(96,165,250,.4)'}
    />
  );
}

export function NumberInput({ value, onChange, placeholder, prefix, style }) {
  return (
    <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
      {prefix && (
        <span style={{
          position:'absolute', left:8, fontFamily:"'JetBrains Mono',monospace",
          fontSize:11, fontWeight:600, color:'var(--muted)', pointerEvents:'none', zIndex:1
        }}>
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background:'var(--card2)', border:'1px solid var(--border)',
          borderRadius:9, padding: prefix ? '8px 8px 8px 20px' : '8px 10px',
          fontFamily:"'JetBrains Mono',monospace", fontSize:12,
          color:'var(--muted2)', outline:'none', width:'100%',
          transition:'border-color .18s, color .18s',
          ...style
        }}
        onFocus={e => { e.target.style.borderColor='rgba(52,211,153,.35)'; e.target.style.color='var(--text)'; }}
        onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.06)'; }}
      />
    </div>
  );
}

export function RmButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      width:28, height:28, borderRadius:7,
      border:'1px solid var(--border)', background:'transparent',
      color:'var(--muted)', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:15, transition:'all .18s', flexShrink:0
    }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--red)';e.currentTarget.style.color='var(--red)';e.currentTarget.style.background='rgba(248,113,113,.07)';}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--muted)';e.currentTarget.style.background='transparent';}}
    >×</button>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', userSelect:'none' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width:36, height:20, borderRadius:10, position:'relative',
          background: checked ? 'var(--green)' : 'var(--card2)',
          border:`1px solid ${checked ? 'var(--green)' : 'var(--border2)'}`,
          transition:'all .2s', flexShrink:0, cursor:'pointer'
        }}
      >
        <div style={{
          position:'absolute', top:2,
          left: checked ? 16 : 2,
          width:14, height:14, borderRadius:'50%',
          background: checked ? '#0b1a12' : 'var(--muted)',
          transition:'left .2s, background .2s',
        }} />
      </div>
      {label && <span style={{ fontSize:12, color:'var(--muted2)', fontWeight:600 }}>{label}</span>}
    </label>
  );
}
