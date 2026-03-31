import React, { useState } from 'react';
import Header from './components/Header';
import BudgetTab from './components/BudgetTab';
import DashboardTab from './components/DashboardTab';
import HistoryTab from './components/HistoryTab';
import QuickSplitTab from './components/QuickSplitTab';
import { useStore } from './hooks/useStore';

const TABS = [
  { key:'budget',    label:'📊 Budget'    },
  { key:'dashboard', label:'🏠 Dashboard' },
  { key:'history',   label:'📋 History'   },
  { key:'split',     label:'⚡ Quick Split'},
];

export default function App() {
  const store  = useStore();
  const [tab, setTab] = useState('budget');

  return (
    <div style={{ position:'relative', zIndex:1, maxWidth:900, margin:'0 auto', padding:'28px 18px 100px' }}>
      <Header
        currency={store.currency}     setCurrency={store.setCurrency}
        period={store.period}         setPeriod={store.setPeriod}
        titheEnabled={store.titheEnabled} toggleTithe={store.toggleTithe}
      />

      {/* Tabs */}
      <div style={{
        display:'flex', gap:3, marginBottom:18,
        background:'var(--card)', border:'1px solid var(--border)',
        borderRadius:13, padding:4, animation:'fadeUp .4s ease .05s both',
        overflowX:'auto'
      }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex:1, minWidth:80, padding:'9px 10px',
              border:'none', borderRadius:10,
              background: tab===t.key ? 'var(--card2)' : 'transparent',
              fontFamily:'inherit', fontWeight:600, fontSize:12,
              color: tab===t.key ? 'var(--text)' : 'var(--muted2)',
              cursor:'pointer', transition:'all .2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:5,
              whiteSpace:'nowrap',
              boxShadow: tab===t.key ? '0 2px 10px rgba(0,0,0,.3)' : 'none'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ animation:'fadeUp .3s ease both' }}>
        {tab==='budget'    && <BudgetTab    store={store} />}
        {tab==='dashboard' && <DashboardTab store={store} />}
        {tab==='history'   && <HistoryTab   store={store} />}
        {tab==='split'     && <QuickSplitTab currency={store.currency} />}
      </div>
    </div>
  );
}
