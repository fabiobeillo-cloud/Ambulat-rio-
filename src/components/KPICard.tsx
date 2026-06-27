import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icon: LucideIcon;
  corIcon?: string;
  tendencia?: 'up' | 'down' | 'neutral';
  tendenciaValor?: string;
}

export function KPICard({ titulo, valor, subtitulo, icon: Icon, corIcon = 'text-blue-600', tendencia, tendenciaValor }: Props) {
  const corTendencia =
    tendencia === 'up'   ? 'text-green-600' :
    tendencia === 'down' ? 'text-red-600'   : 'text-slate-500';

  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">{titulo}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{valor}</p>
          {subtitulo && <p className="text-xs text-slate-400 mt-0.5">{subtitulo}</p>}
          {tendencia && tendenciaValor && (
            <p className={cn('text-xs font-medium mt-1', corTendencia)}>
              {tendencia === 'up' ? '▲' : tendencia === 'down' ? '▼' : '—'} {tendenciaValor}
            </p>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 ml-3', corIcon.replace('text-','bg-').replace('600','100'))}>
          <Icon className={cn('w-5 h-5', corIcon)} />
        </div>
      </div>
    </div>
  );
}
