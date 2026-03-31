import React from 'react';
import { ToggleGroup, Toggle } from './UI';

export default function Header({ currency, setCurrency, period, setPeriod, titheEnabled, toggleTithe }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      flexWrap:'wrap', gap:12, marginBottom:20,
      animation:'fadeDown .5s ease both'
    }}>
      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          width:34, height:34, borderRadius:10,
          background:'linear-gradient(135deg,#34d399,#2dd4bf)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:17, boxShadow:'0 4px 14px rgba(52,211,153,.25)'
        }}>💸</div>
        <div style={{ fontSize:19, fontWeight:800, letterSpacing:'-.03em' }}>
          Flow<span style={{ color:'var(--green)' }}>Split</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        <Toggle checked={titheEnabled} onChange={toggleTithe} label="10% Tithe" />

        <ToggleGroup
          value={period}
          onChange={setPeriod}
          options={[{ value:'monthly', label:'Monthly' }, { value:'weekly', label:'Weekly' }]}
        />
        <ToggleGroup
          value={currency}
          onChange={setCurrency}
          options={[{ value:'NGN', label:'₦ NGN' }, { value:'USD', label:'$ USD' }]}
        />
      </div>
    </div>
  );
}
