import type { StatusMedico, StatusSala } from '@/types';

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const STATUS_MEDICO_LABEL: Record<StatusMedico, string> = {
  em_atendimento: 'Em Atendimento',
  disponivel:     'Disponível',
  pausa:          'Pausa',
  ausente:        'Ausente',
  aguardando:     'Aguardando Paciente',
};

export const STATUS_MEDICO_COR: Record<StatusMedico, string> = {
  em_atendimento: 'bg-green-100 text-green-800 border-green-300',
  disponivel:     'bg-blue-100 text-blue-800 border-blue-300',
  pausa:          'bg-yellow-100 text-yellow-800 border-yellow-300',
  ausente:        'bg-red-100 text-red-800 border-red-300',
  aguardando:     'bg-purple-100 text-purple-800 border-purple-300',
};

export const STATUS_MEDICO_DOT: Record<StatusMedico, string> = {
  em_atendimento: 'bg-green-500',
  disponivel:     'bg-blue-500',
  pausa:          'bg-yellow-500',
  ausente:        'bg-red-500',
  aguardando:     'bg-purple-500',
};

export const STATUS_SALA_LABEL: Record<StatusSala, string> = {
  ocupada:     'Ocupada',
  livre:       'Livre',
  manutencao:  'Manutenção',
  reservada:   'Reservada',
};

export const STATUS_SALA_COR: Record<StatusSala, string> = {
  ocupada:     'bg-green-600',
  livre:       'bg-slate-200',
  manutencao:  'bg-orange-400',
  reservada:   'bg-yellow-400',
};

export function iniciais(nome: string): string {
  return nome
    .replace(/^(Dr\.|Dra\.)\s+/, '')
    .split(' ')
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export function formatarHora(iso: string | null): string {
  if (!iso) return '--:--';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export function horaAtual(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export function dataFormatada(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}
