import type { StatusMedico, StatusSala } from '@/types';
import { STATUS_MEDICO_COR, STATUS_MEDICO_DOT, STATUS_MEDICO_LABEL, STATUS_SALA_LABEL, STATUS_SALA_COR } from '@/lib/utils';

export function BadgeMedico({ status }: { status: StatusMedico }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_MEDICO_COR[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_MEDICO_DOT[status]} ${status === 'em_atendimento' ? 'animate-pulse' : ''}`} />
      {STATUS_MEDICO_LABEL[status]}
    </span>
  );
}

export function BadgeSala({ status }: { status: StatusSala }) {
  const cores: Record<StatusSala, string> = {
    ocupada:    'bg-green-100 text-green-800 border-green-300',
    livre:      'bg-slate-100 text-slate-600 border-slate-200',
    manutencao: 'bg-orange-100 text-orange-800 border-orange-300',
    reservada:  'bg-yellow-100 text-yellow-800 border-yellow-300',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cores[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_SALA_COR[status]}`} />
      {STATUS_SALA_LABEL[status]}
    </span>
  );
}
