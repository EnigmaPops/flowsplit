export function fmt(n, currency) {
  if (!isFinite(n) || n === null || n === undefined) return currency === 'NGN' ? '₦0' : '$0.00';
  if (currency === 'NGN') return '₦' + Math.round(n).toLocaleString('en-NG');
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function symChar(currency) {
  return currency === 'NGN' ? '₦' : '$';
}

export function exportCSV(history) {
  const header = 'Date,Amount,Currency,Period,Note';
  const rows   = history.map(e =>
    `${e.date},${e.amt},${e.currency},${e.period},"${(e.note||'').replace(/"/g,'""')}"`
  );
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'flowsplit-history.csv'; a.click();
  URL.revokeObjectURL(url);
}
