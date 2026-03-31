import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'flowsplit_v1';

const DEFAULT_STATE = {
  currency: 'USD',
  period: 'monthly',
  titheEnabled: false,
  groupPcts: { critical: 50, important: 30, optional: 12 },
  goals: { critical: [], important: [], optional: [] },
  history: [],
  goalNameHistory: [],
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { return DEFAULT_STATE; }
}

function save(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

let _uid = Date.now();
function uid() { return ++_uid; }

export function useStore() {
  const [state, setState] = useState(load);

  useEffect(() => { save(state); }, [state]);

  const set = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  }, []);

  // ── CURRENCY / PERIOD / TITHE ──
  const setCurrency = (c) => set({ currency: c });
  const setPeriod   = (p) => set({ period: p });
  const toggleTithe = () => set(s => ({ titheEnabled: !s.titheEnabled }));

  // ── GROUP PCTS ──
  const setGroupPct = (key, val) => set(s => ({
    groupPcts: { ...s.groupPcts, [key]: Math.min(100, Math.max(0, parseFloat(val) || 0)) }
  }));

  // ── GOALS ──
  const addGoal = (groupKey, name = '', target = '') => {
    const goal = { id: uid(), name, target: target === '' ? '' : Number(target) };
    set(s => ({
      goals: { ...s.goals, [groupKey]: [...s.goals[groupKey], goal] }
    }));
    return goal.id;
  };

  const updateGoal = (groupKey, id, field, value) => {
    set(s => ({
      goals: {
        ...s.goals,
        [groupKey]: s.goals[groupKey].map(g =>
          g.id === id ? { ...g, [field]: value } : g
        )
      }
    }));
  };

  const removeGoal = (groupKey, id) => {
    set(s => {
      const goal = s.goals[groupKey].find(g => g.id === id);
      const newNames = goal?.name?.trim()
        ? [goal.name.trim(), ...s.goalNameHistory.filter(n => n !== goal.name.trim())].slice(0, 40)
        : s.goalNameHistory;
      return {
        goals: { ...s.goals, [groupKey]: s.goals[groupKey].filter(g => g.id !== id) },
        goalNameHistory: newNames,
      };
    });
  };

  const saveGoalName = (name) => {
    if (!name?.trim()) return;
    set(s => ({
      goalNameHistory: [name.trim(), ...s.goalNameHistory.filter(n => n !== name.trim())].slice(0, 40)
    }));
  };

  // ── HISTORY ──
  const addHistory = (amt, note, currency, period) => {
    const entry = {
      id: uid(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amt: parseFloat(amt),
      note: note || 'Income',
      currency,
      period,
    };
    set(s => ({ history: [entry, ...s.history] }));
  };

  const deleteHistory = (id) => {
    set(s => ({ history: s.history.filter(e => e.id !== id) }));
  };

  return {
    ...state,
    setCurrency, setPeriod, toggleTithe,
    setGroupPct,
    addGoal, updateGoal, removeGoal, saveGoalName,
    addHistory, deleteHistory,
  };
}
