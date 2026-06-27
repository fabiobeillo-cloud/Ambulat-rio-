'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DoorOpen } from 'lucide-react';
import { UNIDADES, MEDICOS, TODAS_SALAS } from '@/data/dados-mestres';
import { BadgeSala } from '@/components/StatusBadge';
import { RelogioAtualizacao } from '@/components/RelogioAtualizacao';
import type { EstadoSala, StatusSala } from '@/types';
import { STATUS_SALA_COR, STATUS_SALA_LABEL } from '@/lib/utils';

interface APIData { estadoSalas: EstadoSala[]; timestamp: string; }

export default function MapaUnidade() {
  const { unidadeId } = useParams<{ unidadeId: string }>();
  const [dados, setDados] = useState<APIData | null>(null);
  const [salaHover, setSalaHover] = useState<string | null>(null);
  const [filtroAndar, setFiltroAndar] = useState<number | null>(null);

  const unidade = UNIDADES.find((u) => u.id === unidadeId);
  const salasUnidade = TODAS_SALAS.filter((s) => s.unidadeId === unidadeId);
  const andares = [...new Set(salasUnidade.map((s) => s.andar))].sort();

  const buscarDados = useCallback(async () => {
    try {
      const r = await fetch('/api/estado-atual');
      const d = await r.json();
      setDados(d);
    } catch(e) { console.error(e); }
  }, []);

  useEffect(() => { buscarDados(); }, [buscarDados]);

  if (!unidade) return (
    <div className="p-6">
      <p className="text-slate-500">Unidade não encontrada.</p>
      <Link href="/mapa" className="text-blue-600 text-sm hover:underline mt-2 block">← Voltar</Link>
    </div>
  );

  const salasFiltradas = filtroAndar
    ? salasUnidade.filter((s) => s.andar === filtroAndar)
    : salasUnidade;

  const getEstado = (salaId: string): EstadoSala | undefined =>
    dados?.estadoSalas.find((e) => e.salaId === salaId);

  const contadores: Record<StatusSala, number> = { ocupada: 0, livre: 0, manutencao: 0, reservada: 0 };
  salasUnidade.forEach((s) => {
    const st = getEstado(s.id)?.status ?? 'livre';
    contadores[st]++;
  });

  const salaDetalhe = salaHover
    ? salasUnidade.find((s) => s.id === salaHover) : null;
  const estadoDetalhe = salaHover ? getEstado(salaHover) : null;
  const medicoDetalhe = estadoDetalhe?.medicoId
    ? MEDICOS.find((m) => m.id === estadoDetalhe.medicoId) : null;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/mapa" className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
            <ArrowLeft size={16} className="text-slate-500" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: unidade.cor }}>
              {unidade.sigla.slice(0,2)}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{unidade.nome}</h1>
              <p className="text-xs text-slate-500">{unidade.endereco} · {unidade.telefone}</p>
            </div>
          </div>
        </div>
        <RelogioAtualizacao intervaloSeg={30} onAtualizar={buscarDados} />
      </div>

      {/* Legenda + KPIs */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-3 flex-wrap">
          {(Object.entries(contadores) as [StatusSala, number][]).map(([st, n]) => (
            <div key={st} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className={`w-3 h-3 rounded-sm ${STATUS_SALA_COR[st]}`} />
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
                {salasAndar.map((sala) => {
                  const estado = getEstado(sala.id);
                  const status: StatusSala = estado?.status ?? 'livre';
                  const medico = estado?.medicoId
                    ? MEDICOS.find((m) => m.id === estado.medicoId) : null;
                  const isHover = salaHover === sala.id;

                  const corFundo: Record<StatusSala, string> = {
                    ocupada:    'bg-green-500 text-white',
                    livre:      'bg-white text-slate-700 border border-slate-200',
                    manutencao: 'bg-orange-400 text-white',
                    reservada:  'bg-yellow-300 text-yellow-900',
                  };

                  return (
                    <div
                      key={sala.id}
                      onMouseEnter={() => setSalaHover(sala.id)}
                      onMouseLeave={() => setSalaHover(null)}
                      className={`rounded-xl p-3 cursor-default transition-all duration-200 select-none
                        ${corFundo[status]}
                        ${isHover ? 'shadow-lg scale-105 z-10 relative' : 'shadow-sm hover:shadow-md'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-bold opacity-80">{sala.numero}</span>
                        <DoorOpen size={12} className="opacity-60" />
                      </div>
                      <p className="text-xs font-medium leading-tight truncate">{sala.nome}</p>
                      {medico && (
                        <p className="text-xs opacity-75 mt-1 truncate">{medico.nome.replace(/^(Dr\.|Dra\.)\s+/, '')}</p>
                      )}
                      {!medico && status === 'livre' && (
                        <p className="text-xs opacity-40 mt-1">Disponível</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip flutuante */}
      {salaDetalhe && (
        <div className="fixed bottom-6 right-6 w-64 card shadow-xl border border-slate-200 z-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">{salaDetalhe.numero} – {salaDetalhe.nome}</span>
            <BadgeSala status={estadoDetalhe?.status ?? 'livre'} />
          </div>
          <p className="text-xs text-slate-500">{salaDetalhe.tipo === 'consultorio' ? 'Consultório' : salaDetalhe.tipo} · {salaDetalhe.andar}º andar</p>
          {medicoDetalhe && (
            <>
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-700">{medicoDetalhe.nome}</p>
                <p className="text-xs text-slate-500">{medicoDetalhe.crm}</p>
                <p className="text-xs text-slate-400 mt-0.5">{medicoDetalhe.especialidade}</p>
              </div>
              {estadoDetalhe?.pacienteAtual && (
                <p className="text-xs text-green-700 mt-1.5">
                  Em atendimento: {estadoDetalhe.pacienteAtual}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
