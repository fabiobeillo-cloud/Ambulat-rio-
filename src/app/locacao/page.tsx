'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { MEDICOS, UNIDADES } from '@/data/dados-mestres';
import { BadgeMedico } from '@/components/StatusBadge';
import { RelogioAtualizacao } from '@/components/RelogioAtualizacao';
import { iniciais } from '@/lib/utils';
import type { AlocacaoAtual, StatusMedico } from '@/types';

interface APIData { alocacoes: AlocacaoAtual[]; timestamp: string; }

const TODAS_ESPECIALIDADES = [...new Set(MEDICOS.map((m) => m.especialidade))].sort();

export default function LocacaoPage() {
  const [dados, setDados] = useState<APIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusMedico | ''>('');
  const [filtroUnidade, setFiltroUnidade] = useState('');
  const [filtroEsp, setFiltroEsp] = useState('');
  const [abaTipo, setAbaTipo] = useState<'todos'|'ativos'|'ausentes'>('todos');

  const buscarDados = useCallback(async () => {
    try {
      const r = await fetch('/api/estado-atual');
      const d = await r.json();
      setDados(d);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { buscarDados(); }, [buscarDados]);

  const linhas = useMemo(() => {
    if (!dados) return [];
    return dados.alocacoes
      .map((aloc) => {
        const medico = MEDICOS.find((m) => m.id === aloc.medicoId);
        const unidade = UNIDADES.find((u) => u.id === aloc.unidadeId);
        return { ...aloc, medico, unidade };
      })
      .filter((l) => {
        if (!l.medico || !l.unidade) return false;
        if (busca && !l.medico.nome.toLowerCase().includes(busca.toLowerCase()) &&
            !l.medico.crm.toLowerCase().includes(busca.toLowerCase())) return false;
        if (filtroStatus && l.status !== filtroStatus) return false;
        if (filtroUnidade && l.unidadeId !== filtroUnidade) return false;
        if (filtroEsp && l.medico.especialidade !== filtroEsp) return false;
        if (abaTipo === 'ativos' && (l.status === 'ausente' || l.status === 'disponivel')) return false;
        if (abaTipo === 'ausentes' && l.status !== 'ausente') return false;
        return true;
      })
      .sort((a, b) => {
        const ordem: Record<StatusMedico, number> = {
          em_atendimento: 0, aguardando: 1, pausa: 2, disponivel: 3, ausente: 4
        };
        return ordem[a.status] - ordem[b.status];
      });
  }, [dados, busca, filtroStatus, filtroUnidade, filtroEsp, abaTipo]);

  const contadores = useMemo(() => {
    if (!dados) return { todos: 0, ativos: 0, ausentes: 0 };
    const all = dados.alocacoes;
    return {
      todos: all.length,
      ativos: all.filter((a) => a.status !== 'ausente' && a.status !== 'disponivel').length,
      ausentes: all.filter((a) => a.status === 'ausente').length,
    };
  }, [dados]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-slate-400 text-sm">Carregando locações...</div>
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-blue-600" /> Locação de Médicos
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Situação em tempo real — todas as 13 unidades</p>
        </div>
        <RelogioAtualizacao intervaloSeg={30} onAtualizar={buscarDados} />
      </div>

      {/* Abas */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {([
          { key: 'todos', label: `Todos (${contadores.todos})` },
          { key: 'ativos', label: `Em atendimento (${contadores.ativos})` },
          { key: 'ausentes', label: `Ausentes (${contadores.ausentes})` },
        ] as const).map(({ key, label }) => (
          <button key={key} onClick={() => setAbaTipo(key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${abaTipo === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="card py-3 px-4 flex flex-wrap gap-3 items-center">
        <Filter size={15} className="text-slate-400 flex-shrink-0" />
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={busca} onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou CRM..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value as StatusMedico | '')}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Todos os status</option>
          <option value="em_atendimento">Em Atendimento</option>
          <option value="aguardando">Aguardando Paciente</option>
          <option value="pausa">Pausa</option>
          <option value="disponivel">Disponível</option>
          <option value="ausente">Ausente</option>
        </select>
        <select value={filtroUnidade} onChange={(e) => setFiltroUnidade(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Todas as unidades</option>
          {UNIDADES.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
        <select value={filtroEsp} onChange={(e) => setFiltroEsp(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Todas as especialidades</option>
          {TODAS_ESPECIALIDADES.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        {(busca || filtroStatus || filtroUnidade || filtroEsp) && (
          <button onClick={() => { setBusca(''); setFiltroStatus(''); setFiltroUnidade(''); setFiltroEsp(''); }}
            className="text-xs text-slate-500 hover:text-red-500 transition-colors">
            Limpar filtros
          </button>
        )}
      </div>

      {/* Tabela */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <th className="px-4 py-3 text-left font-medium">Médico</th>
                <th className="px-4 py-3 text-left font-medium">CRM</th>
                <th className="px-4 py-3 text-left font-medium">Especialidade</th>
                <th className="px-4 py-3 text-left font-medium">Unidade</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Consultas</th>
                <th className="px-4 py-3 text-center font-medium">Produção %</th>
                <th className="px-4 py-3 text-left font-medium">Próx. Paciente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {linhas.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">
                  Nenhum médico encontrado com os filtros aplicados.
                </td></tr>
              ) : (
                linhas.map((linha) => {
                  const inis = iniciais(linha.medico?.nome ?? '');
                  const pct = linha.consultasAgendadas > 0
                    ? Math.round((linha.consultasRealizadas / linha.consultasAgendadas) * 100) : 0;
                  return (
                    <tr key={`${linha.medicoId}-${linha.unidadeId}`}
                      className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                            {inis}
                          </div>
                          <span className="font-medium text-slate-800 text-xs">{linha.medico?.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-mono">{linha.medico?.crm}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{linha.medico?.especialidade}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded text-white text-xs flex items-center justify-center font-bold flex-shrink-0"
                            style={{ background: linha.unidade?.cor ?? '#64748b', fontSize: '9px' }}>
                            {linha.unidade?.sigla?.slice(0,2)}
                          </span>
                          <span className="text-xs text-slate-600 truncate max-w-[100px]">{linha.unidade?.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <BadgeMedico status={linha.status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-slate-700">{linha.consultasRealizadas}</span>
                        <span className="text-slate-400">/{linha.consultasAgendadas}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-16">
                            <div className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-medium text-slate-600 w-8">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {linha.proximoPaciente ?? <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          Exibindo {linhas.length} de {dados?.alocacoes?.length ?? 0} registros
        </div>
      </div>
    </div>
  );
}
