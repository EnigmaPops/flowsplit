import React, { useState } from 'react';
import IncomeCard from './IncomeCard';
import PriorityGroup from './PriorityGroup';
import ResultsGrid from './ResultsGrid';
import { GROUPS, calcAllocations } from '../utils/calc';
import { SectionLabel } from './UI';

export default function BudgetTab({ store }) {
  const {
    currency, period, titheEnabled,
    groupPcts, setGroupPct,
    goals, addGoal, updateGoal, removeGoal, saveGoalName,
    goalNameHistory,
  } = store;

  const [income, setIncome] = useState('');
  const gross = parseFloat(income) || 0;
  const { tithe, net, allocs, totalAllocated, freeCash } = calcAllocations({
    gross, titheEnabled, groupPcts, goals
  });

  const [flashing, setFlashing] = useState(false);

  function handleAutoAlloc() {
    setFlashing(true);
    setTimeout(() => setFlashing(false), 600);
    // allocations are always live — just trigger a visual flash
  }

  return (
    <div>
      <IncomeCard
        income={income} setIncome={setIncome}
        currency={currency} period={period}
        titheEnabled={titheEnabled} tithe={tithe} net={net}
      />

      {/* Auto allocate */}
      <div style={{ display:'flex', gap:8, marginBottom:18, animation:'fadeUp .4s ease .15s both' }}>
        <button
          onClick={handleAutoAlloc}
          style={{
            flex:1, padding:'12px 18px',
            background:'linear-gradient(135deg,rgba(52,211,153,.1),rgba(96,165,250,.06))',
            border:'1px solid rgba(52,211,153,.22)', borderRadius:12,
            color:'var(--text)', fontFamily:'inherit', fontWeight:700, fontSize:13,
            cursor:'pointer', transition:'all .2s',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            animation: flashing ? 'popFlash .5s ease' : 'none'
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--green)';e.currentTarget.style.transform='translateY(-1px)';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(52,211,153,.22)';e.currentTarget.style.transform='translateY(0)';}}
        >
          <span>✦</span>
          <span>Auto-allocate by priority</span>
          <span style={{
            fontSize:9, letterSpacing:'.08em', textTransform:'uppercase',
            background:'rgba(52,211,153,.15)', border:'1px solid rgba(52,211,153,.25)',
            padding:'2px 7px', borderRadius:20, color:'var(--green)'
          }}>instant</span>
        </button>
      </div>

      {/* Priority groups */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
        {GROUPS.map(g => (
          <PriorityGroup
            key={g.key}
            group={g}
            goals={goals[g.key] || []}
            groupPct={groupPcts[g.key]}
            currency={currency}
            allocs={allocs}
            onSetPct={setGroupPct}
            onAdd={addGoal}
            onUpdate={updateGoal}
            onRemove={removeGoal}
            onBlurName={saveGoalName}
            nameHistory={goalNameHistory}
          />
        ))}
      </div>

      <SectionLabel>Where your money goes</SectionLabel>
      <ResultsGrid
        gross={gross} tithe={tithe} titheEnabled={titheEnabled}
        allocs={allocs} goals={goals} currency={currency}
        freeCash={freeCash} totalAllocated={totalAllocated}
      />
    </div>
  );
}
