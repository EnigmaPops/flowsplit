export const GROUPS = [
  { key: 'critical',  label: 'Critical',  color: '#f87171', pillBg: 'rgba(248,113,113,.12)', pillTxt: '#fca5a5' },
  { key: 'important', label: 'Important', color: '#60a5fa', pillBg: 'rgba(96,165,250,.12)',  pillTxt: '#93c5fd' },
  { key: 'optional',  label: 'Optional',  color: '#fbbf24', pillBg: 'rgba(251,191,36,.12)',  pillTxt: '#fcd34d' },
];

export const GOAL_COLORS = [
  '#34d399','#60a5fa','#f87171','#a78bfa','#fbbf24','#2dd4bf','#fb7185','#c084fc','#34d399','#f97316'
];

/**
 * Given gross income and store state, returns:
 * { tithe, net, allocs: { goalId -> amount }, totalAllocated, freeCash }
 */
export function calcAllocations({ gross, titheEnabled, groupPcts, goals }) {
  const tithe  = titheEnabled ? gross * 0.10 : 0;
  const net    = gross - tithe;
  const allocs = {};

  GROUPS.forEach(g => {
    const groupGoals = goals[g.key] || [];
    if (!groupGoals.length) return;

    const groupAmt   = net * ((groupPcts[g.key] || 0) / 100);
    const withTarget = groupGoals.filter(x => x.target && Number(x.target) > 0);
    const noTarget   = groupGoals.filter(x => !x.target || Number(x.target) <= 0);
    const tSum       = withTarget.reduce((s, x) => s + Number(x.target), 0);

    let tPool, oPool;
    if (withTarget.length && noTarget.length) { tPool = groupAmt * 0.70; oPool = groupAmt * 0.30; }
    else if (withTarget.length)               { tPool = groupAmt; oPool = 0; }
    else                                      { tPool = 0; oPool = groupAmt; }

    withTarget.forEach(x => {
      allocs[x.id] = tSum > 0 ? (Number(x.target) / tSum) * tPool : tPool / withTarget.length;
    });
    noTarget.forEach(x => {
      allocs[x.id] = noTarget.length > 0 ? oPool / noTarget.length : 0;
    });
  });

  const totalAllocated = tithe + Object.values(allocs).reduce((s, v) => s + (v || 0), 0);
  const freeCash       = gross - totalAllocated;

  return { tithe, net, allocs, totalAllocated, freeCash };
}
