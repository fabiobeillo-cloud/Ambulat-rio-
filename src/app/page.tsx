'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users, Stethoscope, DoorOpen, ClipboardList, AlertTriangle,
  TrendingUp, Building2, Activity
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { RelogioAtualizacao } from '@/components/RelogioAtualizacao';
import { UNIDADES } from '@/data/dados-mestres';
import type { DashboardKPIs, ResumoUnidade, Alerta } from '@/types';
import { dataFormatada } from '@/lib/utils';
import Link from 'next/link';

interface EstadoAPI {
  kpis: DashboardKPIs;
  resumoUnidades: ResumoUnidade[];
  timestamp: string;
}

function BarraProgresso({ valor, max, cor = 'bg-blue-500' }: { valor: number; max: number; cor?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((valor / max) * 100)) : 0;
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${cor}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Dashboard() {
  const [estado, setEstado] = useState<EstadoAPI | null>(null);
  const [loading, setLoading] = useState(true);

  const buscarEstado = useCallback(async () => {
    try {
      const r = await fetch('/api/estado-atual');
      const data = await r.json();
      setEstado(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { buscarEstado(); }, [buscarEstado]);

  const todosAlertas: Alerta[] = estado?.resumoUnidades?.flatMap((r) => r.alertas) ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Activity className="w-10 h-10 text-blue-600 animate-pulse mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Carregando painel...</p>
        </div>
      </div>
    );
  }

  const kpis = estado?.kpis;
  const resumos = estado?.resumoUnidades ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Painel de Gestão Ambulatorial</h1>
          <p className="text-sm text-slate-500 mt-0.5 capitalize">{dataFormatada()}</p>
        </div>
        <RelogioAtualizacao intervaloSeg={30} onAtualizar={buscarEstado} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          titulo="Médicos Ativos Agora"
          valor={kpis?.totalMedicosAtivos ?? 0}
          subtitulo={`de ${kpis?.totalMedicosProgramados ?? 0} programados`}
          icon={Stethoscope}
          corIcon="text-green-600"
          tendencia={kpis && kpis.taxaAbsenteismoMedico > 10 ? 'down' : 'up'}
          tendenciaValor={`${kpis?.taxaAbsenteismoMedico ?? 0}% absenteísmo`}
        />
        <KPICard
          titulo="Salas Ocupadas"
          valor={`${kpis?.totalSalasOcupadas ?? 0} / ${kpis?.totalSalas ?? 0}`}
          subtitulo={`${kpis?.taxaOcupacaoGeral ?? 0}% de ocupação`}
          icon={DoorOpen}
          corIcon="text-blue-600"
        />
        <KPICard
          titulo="Consultas Realizadas"
          valor={kpis?.consultasRealizadasHoje?.toLocaleString('pt-BR') ?? 0}
          subtitulo={`de ${kpis?.consultasProgramadasHoje?.toLocaleString('pt-BR') ?? 0} agendadas`}
          icon={ClipboardList}
          corIcon="text-purple-600"
          tendencia="up"
          tendenciaValor={`${kpis && kpis.consultasProgramadasHoje > 0 ? Math.round((kpis.consultasRealizadasHoje / kpis.consultasProgramadasHoje) * 100) : 0}% realizado`}
        />
        <KPICard
          titulo="Unidades com Alerta"
          valor={kpis?.unidadesComAlerta ?? 0}
          subtitulo="de 13 unidades"
          icon={AlertTriangle}
          corIcon={kpis && kpis.unidadesComAlerta > 0 ? 'text-red-600' : 'text-slate-400'}
        />
      </div>

      {/* Grid: Unidades + Alertas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Tabela de unidades */}
        <div className="xl:col-span-2 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Building2 size={15} className="text-slate-400" /> Status das 13 Unidades
            </h2>
            <Link href="/unidades" className="text-xs text-blue-600 hover:underline">Ver todas</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-2.5 text-left font-medium">Unidade</th>
                  <th className="px-4 py-2.5 text-center font-medium">Médicos</th>
                  <th className="px-4 py-2.5 text-center font-medium">Salas</th>
                  <th className="px-4 py-2.5 text-center font-medium">Consultas</th>
                  <th className="px-4 py-2.5 text-left font-medium">Ocupação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {UNIDADES.map((unidade) => {
                  const res = resumos.find((r) => r.unidadeId === unidade.id);
                  const taxaOcup = res && res.salasTotais > 0
                    ? Math.round((res.salasOcupadas / res.salasTotais) * 100) : 0;
                  const corBarra = taxaOcup > 85 ? 'bg-orange-500' : taxaOcup > 60 ? 'bg-blue-500' : 'bg-green-500';
                  const temAlerta = (res?.alertas?.length ?? 0) > 0;
                  return (
                    <tr key={unidade.id} className={`hover:bg-slate-50 transition-colors ${temAlerta ? 'border-l-2 border-l-orange-400' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded text-white text-xs flex items-center justify-center font-bold flex-shrink-0"
                            style={{ background: unidade.cor }}>{unidade.sigla.slice(0,2)}</span>
                          <div>
                            <p className="font-medium text-slate-800 text-xs leading-tight">{unidade.nome}</p>
                            <p className="text-xs text-slate-400">{unidade.cidade}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-semibold text-slate-700">{res?.medicosPresentes ?? 0}</span>
                        <span className="text-xs text-slate-400">/{res?.medicosTotaisHoje ?? 0}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-semibold text-slate-700">{res?.salasOcupadas ?? 0}</span>
                        <span className="text-xs text-slate-400">/{res?.salasTotais ?? 0}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-semibold text-slate-700">{res?.consultasRealizadas ?? 0}</span>
                        <span className="text-xs text-slate-400">/{res?.consultasAgendadas ?? 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <BarraProgresso valor={res?.salasOcupadas ?? 0} max={res?.salasTotais ?? 1} cor={corBarra} />
                          </div>
                          <span className="text-xs font-medium text-slate-600 w-8 text-right">{taxaOcup}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Painel de Alertas */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={15} className="text-orange-500" /> Alertas Ativos
            </h2>
            <span className="text-xs bg-orange-100 text-orange-700 font-medium px-2 py-0.5 rounded-full">
              {todosAlertas.length}
            </span>
          </div>
          <div className="divide-y divide-slate-50 overflow-y-auto max-h-80">
            {todosAlertas.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Nenhum alerta no momento</p>
              </div>
            ) : (
              todosAlertas.map((alerta) => {
                const unidade = UNIDADES.find((u) => u.id === alerta.unidadeId);
                const cores = {
                  ausencia:   'border-red-400 bg-red-50',
                  atraso:     'border-yellow-400 bg-yellow-50',
                  capacidade: 'border-orange-400 bg-orange-50',
                  info:       'border-blue-400 bg-blue-50',
                };
                return (
                  <div key={alerta.id} className={`px-4 py-3 border-l-3 ${cores[alerta.tipo]} border-l-4`}>
                    <p className="text-xs font-semibold text-slate-700">{unidade?.sigla} · {unidade?.cidade}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{alerta.mensagem}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(alerta.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Links rápidos */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { href: '/locacao',       label: 'Locação em Tempo Real', desc: 'Onde está cada médico agora', icon: Users, cor: 'from-blue-500 to-blue-700' },
          { href: '/mapa',          label: 'Mapa de Salas',         desc: 'Ocupação por unidade',        icon: DoorOpen, cor: 'from-teal-500 to-teal-700' },
          { href: '/produtividade', label: 'Produtividade Médica',  desc: 'Métricas e tendências',       icon: TrendingUp, cor: 'from-purple-500 to-purple-700' },
        ].map(({ href, label, desc, icon: Icon, cor }) => (
          <Link key={href} href={href}
            className={`bg-gradient-to-br ${cor} text-white rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all hover:-translate-y-0.5`}>
            <Icon className="w-8 h-8 opacity-80 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs opacity-80 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
