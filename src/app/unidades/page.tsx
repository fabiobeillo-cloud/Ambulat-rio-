'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Building2, Phone, User, Map, ExternalLink } from 'lucide-react';
import { UNIDADES, TODAS_SALAS, MEDICOS } from '@/data/dados-mestres';
import { RelogioAtualizacao } from '@/components/RelogioAtualizacao';
import type { ResumoUnidade } from '@/types';

interface APIData { resumoUnidades: ResumoUnidade[] }

export default function UnidadesPage() {
  const [dados, setDados] = useState<APIData | null>(null);

  const buscarDados = useCallback(async () => {
    try {
      const r = await fetch('/api/estado-atual');
      setDados(await r.json());
    } catch(e) { console.error(e); }
  }, []);

  useEffect(() => { buscarDados(); }, [buscarDados]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 size={20} className="text-slate-600" /> Unidades
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">13 ambulatórios gerenciados</p>
        </div>
        <RelogioAtualizacao intervaloSeg={60} onAtualizar={buscarDados} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {UNIDADES.map((u) => {
          const resumo = dados?.resumoUnidades?.find((r) => r.unidadeId === u.id);
          const salasTotal = TODAS_SALAS.filter((s) => s.unidadeId === u.id).length;
          const medicosVinculados = MEDICOS.filter((m) => m.unidadesAtendimento.includes(u.id)).length;
          const taxaOcup = resumo && resumo.salasTotais > 0
            ? Math.round((resumo.salasOcupadas / resumo.salasTotais) * 100) : 0;

          return (
            <div key={u.id} className="card card-hover overflow-hidden">
              {/* Barra colorida no topo */}
              <div className="h-1 -mx-5 -mt-5 mb-5 rounded-t-xl" style={{ background: u.cor }} />

              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: u.cor }}>
                  {u.sigla}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{u.nome}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{u.endereco}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500">Médicos hoje</p>
                  <p className="text-lg font-bold text-slate-800">
                    {resumo?.medicosPresentes ?? '—'}<span className="text-xs font-normal text-slate-400">/{resumo?.medicosTotaisHoje ?? '—'}</span>
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500">Salas ocupadas</p>
                  <p className="text-lg font-bold text-slate-800">
                    {resumo?.salasOcupadas ?? '—'}<span className="text-xs font-normal text-slate-400">/{resumo?.salasTotais ?? '—'}</span>
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500">Consultas</p>
                  <p className="text-lg font-bold text-slate-800">
                    {resumo?.consultasRealizadas ?? '—'}<span className="text-xs font-normal text-slate-400">/{resumo?.consultasAgendadas ?? '—'}</span>
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500">Ocupação</p>
                  <p className={`text-lg font-bold ${taxaOcup >= 80 ? 'text-green-600' : taxaOcup >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {taxaOcup}%
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1.5 mb-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <User size={12} className="flex-shrink-0" />
                  <span className="truncate">{u.coordenador}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="flex-shrink-0" />
                  <span>{u.telefone}</span>
                </div>
              </div>

              {/* Especialidades */}
              <div className="flex flex-wrap gap-1 mb-4">
                {u.especialidades.slice(0, 5).map((e) => (
                  <span key={e} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{e}</span>
                ))}
                {u.especialidades.length > 5 && (
                  <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">+{u.especialidades.length - 5}</span>
                )}
              </div>

              {/* Stats rápidos */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span>{salasTotal} salas total</span>
                <span>{medicosVinculados} médicos vinculados</span>
              </div>

              {/* Alertas */}
              {(resumo?.alertas?.length ?? 0) > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-3">
                  <p className="text-xs font-semibold text-orange-700">{resumo?.alertas?.length} alerta(s)</p>
                  <p className="text-xs text-orange-600 mt-0.5 truncate">{resumo?.alertas?.[0]?.mensagem}</p>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <Link href={`/mapa/${u.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg py-1.5 transition-colors">
                  <Map size={12} /> Mapa de Salas
                </Link>
                <Link href={`/locacao?unidade=${u.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg py-1.5 transition-colors">
                  <ExternalLink size={12} /> Locações
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
