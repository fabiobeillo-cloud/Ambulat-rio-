'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DoorOpen, Trash2 } from 'lucide-react';
import { UNIDADES, MEDICOS, TODAS_SALAS } from '@/data/dados-mestres';
import { useMapaManualEstados } from '@/lib/mapaManualStore';
import type { StatusSala } from '@/types';
import { STATUS_SALA_LABEL } from '@/lib/utils';

const STATUS_OPCOES: StatusSala[] = ['livre', 'ocupada', 'manutencao', 'reservada'];

const COR_STATUS: Record<StatusSala, string> = {
  ocupada:    'bg-green-500 text-white',
  livre:      'bg-white text-slate-700 border border-slate-200',
  manutencao: 'bg-orange-400 text-white',
  reservada:  'bg-yellow-300 text-yellow-900',
};

const COR_LEGENDA: Record<StatusSala, string> = {
  ocupada:    'bg-green-500',
  livre:      'bg-slate-200',
  manutencao: 'bg-orange-400',
  reservada:  'bg-yellow-300',
};

export default function MapaManualUnidade() {
  const { unidadeId } = useParams<{ unidadeId: string }>();
  const { estados, atualizarSala, limparSala, limparUnidade } = useMapaManualEstados();
  const [salaEditando, setSalaEditando] = useState<string | null>(null);
  const [filtroAndar, setFiltroAndar] = useState<number | null>(null);

  const unidade = UNIDADES.find((u) => u.id === unidadeId);
  const salasUnidade = useMemo(() => TODAS_SALAS.filter((s) => s.unidadeId === unidadeId), [unidadeId]);
  const andares = useMemo(() => [...new Set(salasUnidade.map((s) => s.andar))].sort((a, b) => a - b), [salasUnidade]);
  const medicosUnidade = useMemo(
    () => MEDICOS.filter((m) => m.unidadesAtendimento.includes(unidadeId as string)),
    [unidadeId]
  );

  if (!unidade) return (
    <div className="p-6">
      <p className="text-slate-500">Unidade não encontrada.</p>
      <Link href="/mapa-manual" className="text-violet-600 text-sm hover:underline mt-2 block">← Voltar</Link>
    </div>
  );

  const salasFiltradas = filtroAndar ? salasUnidade.filter((s) => s.andar === filtroAndar) : salasUnidade;

  const contadores: Record<StatusSala, number> = { ocupada: 0, livre: 0, manutencao: 0, reservada: 0 };
  salasUnidade.forEach((s) => {
    const st = estados[s.id]?.status ?? 'livre';
    contadores[st]++;
  });

  const sala = salaEditando ? salasUnidade.find((s) => s.id === salaEditando) : null;
  const estadoSala = salaEditando ? estados[salaEditando] : undefined;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/mapa-manual" className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
            <ArrowLeft size={16} className="text-slate-500" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: unidade.cor }}>
              {unidade.sigla.slice(0,2)}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{unidade.nome}</h1>
              <p className="text-xs text-slate-500">Edição manual · sem simulação automática</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm('Limpar todas as marcações manuais desta unidade?')) {
              limparUnidade(salasUnidade.map((s) => s.id));
            }
          }}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 transition-colors">
          <Trash2 size={13} /> Limpar unidade
        </button>
      </div>

      {/* Legenda + filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-3 flex-wrap">
          {(Object.entries(contadores) as [StatusSala, number][]).map(([st, n]) => (
            <div key={st} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className={`w-3 h-3 rounded-sm ${COR_LEGENDA[st]}`} />
              {STATUS_SALA_LABEL[st]} ({n})
            </div>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setFiltroAndar(null)}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${filtroAndar === null ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
            Todos os andares
          </button>
          {andares.map((a) => (
            <button key={a} onClick={() => setFiltroAndar(a)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${filtroAndar === a ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              {a}º andar
            </button>
          ))}
        </div>
      </div>

      {/* Grade de salas por andar */}
      <div className="space-y-6">
        {andares.filter((a) => filtroAndar === null || a === filtroAndar).map((andar) => {
          const salasAndar = salasFiltradas.filter((s) => s.andar === andar);
          return (
            <div key={andar}>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                {andar}º Andar — {salasAndar.length} salas
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {salasAndar.map((s) => {
                  const estado = estados[s.id];
                  const status: StatusSala = estado?.status ?? 'livre';
                  const medico = estado?.medicoId ? MEDICOS.find((m) => m.id === estado.medicoId) : null;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSalaEditando(s.id)}
                      className={`text-left rounded-xl p-3 transition-all duration-200 select-none ${COR_STATUS[status]} shadow-sm hover:shadow-md hover:scale-[1.02]`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-bold opacity-80">{s.numero}</span>
                        <DoorOpen size={12} className="opacity-60" />
                      </div>
                      <p className="text-xs font-medium leading-tight truncate">{s.nome}</p>
                      {medico && (
                        <p className="text-xs opacity-75 mt-1 truncate">{medico.nome.replace(/^(Dr\.|Dra\.)\s+/, '')}</p>
                      )}
                      {!medico && status === 'livre' && (
                        <p className="text-xs opacity-40 mt-1">Toque para editar</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel de edição */}
      {sala && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={() => setSalaEditando(null)}>
          <div className="card w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">{sala.numero} – {sala.nome}</h3>
              <button onClick={() => setSalaEditando(null)} className="text-slate-400 hover:text-slate-600 text-xs">
                Fechar
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">{sala.especialidade} · {sala.andar}º andar</p>

            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Status</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {STATUS_OPCOES.map((st) => (
                <button key={st}
                  onClick={() => atualizarSala(sala.id, { status: st })}
                  className={`text-xs px-2 py-1.5 rounded-lg border transition-all ${
                    (estadoSala?.status ?? 'livre') === st
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}>
                  {STATUS_SALA_LABEL[st]}
                </button>
              ))}
            </div>

            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Médico</label>
            <select
              value={estadoSala?.medicoId ?? ''}
              onChange={(e) => atualizarSala(sala.id, { medicoId: e.target.value || null })}
              className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 mb-3">
              <option value="">— Nenhum —</option>
              {medicosUnidade.map((m) => (
                <option key={m.id} value={m.id}>{m.nome} ({m.especialidade})</option>
              ))}
            </select>

            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Observação</label>
            <textarea
              value={estadoSala?.observacao ?? ''}
              onChange={(e) => atualizarSala(sala.id, { observacao: e.target.value })}
              rows={2}
              className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 mb-3 resize-none"
              placeholder="Anotações sobre esta sala…"
            />

            {estadoSala?.atualizadoEm && (
              <p className="text-xs text-slate-400 mb-3">
                Atualizado em {new Date(estadoSala.atualizadoEm).toLocaleString('pt-BR')}
              </p>
            )}

            <button
              onClick={() => limparSala(sala.id)}
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5">
              <Trash2 size={12} /> Limpar marcação desta sala
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
