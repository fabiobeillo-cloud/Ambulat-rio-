'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { RelogioAtualizacao } from '@/components/RelogioAtualizacao';
import { KPICard } from '@/components/KPICard';
import { MEDICOS, UNIDADES } from '@/data/dados-mestres';
import type { AlocacaoAtual } from '@/types';

interface ProdEsp {
  especialidade: string;
  realizadas: number;
  agendadas: number;
  taxaOcupacao: number;
  medicosProgramados: number;
}

interface HistDia {
  data: string;
  agendadas: number;
  realizadas: number;
  canceladas: number;
  faltas: number;
  taxaOcupacao: number;
}

interface APIData {
  historico: HistDia[];
  porEspecialidade: ProdEsp[];
  timestamp: string;
}

interface EstadoData {
  alocacoes: AlocacaoAtual[];
}

const CORES_ESP = ['#2563eb','#0891b2','#7c3aed','#059669','#d97706','#dc2626','#db2777','#65a30d','#0369a1','#9333ea'];

export default function ProdutividadePage() {
  const [dados, setDados] = useState<APIData | null>(null);
  const [estado, setEstado] = useState<EstadoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodoHist, setPeriodoHist] = useState<7 | 14 | 30>(14);
  const [vistaEsp, setVistaEsp] = useState<'barras' | 'pizza'>('barras');
  const [filtroUnidade, setFiltroUnidade] = useState('');

  const buscarDados = useCallback(async () => {
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/produtividade'),
        fetch('/api/estado-atual'),
      ]);
      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
      setDados(d1);
      setEstado(d2);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { buscarDados(); }, [buscarDados]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-slate-400 text-sm">Carregando produtividade...</p>
    </div>
  );

  const historico = (dados?.historico ?? []).slice(-periodoHist);

  // Ranking de médicos
  const rankMedicos = (estado?.alocacoes ?? [])
    .filter((a) => !filtroUnidade || a.unidadeId === filtroUnidade)
    .map((a) => {
      const medico = MEDICOS.find((m) => m.id === a.medicoId);
      const unidade = UNIDADES.find((u) => u.id === a.unidadeId);
      return {
        nome: medico?.nome ?? '',
        esp: medico?.especialidade ?? '',
        unidade: unidade?.sigla ?? '',
        realizadas: a.consultasRealizadas,
        agendadas: a.consultasAgendadas,
        pct: a.consultasAgendadas > 0 ? Math.round((a.consultasRealizadas / a.consultasAgendadas) * 100) : 0,
        tempoMedio: a.tempoMedioMin,
        status: a.status,
      };
    })
    .filter((m) => m.nome)
    .sort((a, b) => b.realizadas - a.realizadas)
    .slice(0, 20);

  // Totais do dia
  const totalRealizadas = estado?.alocacoes.reduce((s, a) => s + a.consultasRealizadas, 0) ?? 0;
  const totalAgendadas  = estado?.alocacoes.reduce((s, a) => s + a.consultasAgendadas, 0) ?? 0;
  const taxaGeral = totalAgendadas > 0 ? Math.round((totalRealizadas / totalAgendadas) * 100) : 0;
  const tempoMedioGeral = estado?.alocacoes.length
    ? Math.round(estado.alocacoes.reduce((s, a) => s + a.tempoMedioMin, 0) / estado.alocacoes.length)
    : 0;

  // Últimos 7 dias
  const ult7 = historico.slice(-7);
  const mediaRealiz = ult7.length ? Math.round(ult7.reduce((s, d) => s + d.realizadas, 0) / ult7.length) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-600" /> Produtividade Médica
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Métricas consolidadas de todas as unidades</p>
        </div>
        <RelogioAtualizacao intervaloSeg={60} onAtualizar={buscarDados} />
      </div>

      {/* KPIs do dia */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard titulo="Consultas Hoje" valor={totalRealizadas.toLocaleString('pt-BR')}
          subtitulo={`de ${totalAgendadas.toLocaleString('pt-BR')} agendadas`}
          icon={BarChart3} corIcon="text-purple-600" />
        <KPICard titulo="Taxa de Ocupação" valor={`${taxaGeral}%`}
          subtitulo="meta: ≥ 85%" icon={TrendingUp}
          corIcon={taxaGeral >= 85 ? 'text-green-600' : taxaGeral >= 70 ? 'text-yellow-600' : 'text-red-600'}
          tendencia={taxaGeral >= 85 ? 'up' : 'down'}
          tendenciaValor={taxaGeral >= 85 ? 'Meta atingida' : 'Abaixo da meta'} />
        <KPICard titulo="Tempo Médio" valor={`${tempoMedioGeral} min`}
          subtitulo="por consulta — meta: ≤ 20 min"
          icon={BarChart3} corIcon="text-blue-600" />
        <KPICard titulo="Média Últimos 7 Dias" valor={mediaRealiz.toLocaleString('pt-BR')}
          subtitulo="consultas/dia" icon={TrendingUp} corIcon="text-teal-600" />
      </div>

      {/* Histórico + Pizza */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Histórico de produção */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Histórico de Produção</h2>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
              {([7, 14, 30] as const).map((p) => (
                <button key={p} onClick={() => setPeriodoHist(p)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all ${periodoHist === p ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {p}d
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={historico} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="data" tick={{ fontSize: 10 }}
                tickFormatter={(v) => new Date(v).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(val, name) => [val, name === 'realizadas' ? 'Realizadas' : 'Agendadas']}
                labelFormatter={(l) => new Date(l).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })} />
              <Legend formatter={(v) => v === 'realizadas' ? 'Realizadas' : 'Agendadas'} />
              <Line type="monotone" dataKey="agendadas" stroke="#cbd5e1" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="realizadas" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Taxa por unidade */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Ocupação por Unidade (hoje)</h2>
          <div className="space-y-2.5">
            {(estado?.alocacoes ?? []).reduce((acc, a) => {
              const u = acc.find((x) => x.unidadeId === a.unidadeId);
              if (u) { u.realizadas += a.consultasRealizadas; u.agendadas += a.consultasAgendadas; }
              else acc.push({ unidadeId: a.unidadeId, realizadas: a.consultasRealizadas, agendadas: a.consultasAgendadas });
              return acc;
            }, [] as { unidadeId: string; realizadas: number; agendadas: number }[])
              .map((u) => {
                const unidade = UNIDADES.find((un) => un.id === u.unidadeId);
                const pct = u.agendadas > 0 ? Math.round((u.realizadas / u.agendadas) * 100) : 0;
                return (
                  <div key={u.unidadeId}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-slate-600 font-medium">{unidade?.sigla}</span>
                      <span className="text-slate-700 font-semibold">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: unidade?.cor ?? '#64748b' }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Por Especialidade */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Produção por Especialidade</h2>
          <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
            {(['barras', 'pizza'] as const).map((v) => (
              <button key={v} onClick={() => setVistaEsp(v)}
                className={`text-xs px-3 py-1 rounded-md transition-all ${vistaEsp === v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                {v === 'barras' ? 'Barras' : 'Pizza'}
              </button>
            ))}
          </div>
        </div>
        {vistaEsp === 'barras' ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dados?.porEspecialidade ?? []} margin={{ top: 0, right: 10, left: -10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="especialidade" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="agendadas" name="Agendadas" fill="#e2e8f0" radius={[3,3,0,0]} />
              <Bar dataKey="realizadas" name="Realizadas" fill="#7c3aed" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ResponsiveContainer width={260} height={240}>
              <PieChart>
                <Pie data={dados?.porEspecialidade ?? []} dataKey="realizadas"
                  nameKey="especialidade" cx="50%" cy="50%" outerRadius={100}
                  label={({ percent }) => `${Math.round(percent * 100)}%`} labelLine={false}>
                  {(dados?.porEspecialidade ?? []).map((_, i) => (
                    <Cell key={i} fill={CORES_ESP[i % CORES_ESP.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} consultas`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {(dados?.porEspecialidade ?? []).map((e, i) => (
                <div key={e.especialidade} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: CORES_ESP[i % CORES_ESP.length] }} />
                  <span className="flex-1 text-slate-700">{e.especialidade}</span>
                  <span className="font-semibold text-slate-800">{e.realizadas}</span>
                  <span className={`font-medium ${e.taxaOcupacao >= 80 ? 'text-green-600' : 'text-orange-500'}`}>{e.taxaOcupacao}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ranking de Médicos */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Ranking de Médicos — Hoje</h2>
          <select value={filtroUnidade} onChange={(e) => setFiltroUnidade(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-white focus:outline-none">
            <option value="">Todas as unidades</option>
            {UNIDADES.map((u) => <option key={u.id} value={u.id}>{u.sigla} – {u.nome}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <th className="px-4 py-2.5 text-left font-medium w-8">#</th>
                <th className="px-4 py-2.5 text-left font-medium">Médico</th>
                <th className="px-4 py-2.5 text-left font-medium">Especialidade</th>
                <th className="px-4 py-2.5 text-center font-medium">Unid.</th>
                <th className="px-4 py-2.5 text-center font-medium">Realizadas</th>
                <th className="px-4 py-2.5 text-center font-medium">Agendadas</th>
                <th className="px-4 py-2.5 text-center font-medium">Tempo Médio</th>
                <th className="px-4 py-2.5 text-left font-medium">Produção</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rankMedicos.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-bold text-slate-400">{i + 1}</td>
                  <td className="px-4 py-2.5 text-xs font-medium text-slate-800">{m.nome}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{m.esp}</td>
                  <td className="px-4 py-2.5 text-center text-xs font-medium text-slate-600">{m.unidade}</td>
                  <td className="px-4 py-2.5 text-center text-xs font-semibold text-slate-700">{m.realizadas}</td>
                  <td className="px-4 py-2.5 text-center text-xs text-slate-500">{m.agendadas}</td>
                  <td className="px-4 py-2.5 text-center text-xs text-slate-500">{m.tempoMedio} min</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m.pct >= 80 ? 'bg-green-500' : m.pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${m.pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{m.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
