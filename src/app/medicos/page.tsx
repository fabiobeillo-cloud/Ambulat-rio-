'use client';

import { useState, useMemo } from 'react';
import { Search, Stethoscope } from 'lucide-react';
import { MEDICOS, UNIDADES } from '@/data/dados-mestres';
import { iniciais } from '@/lib/utils';

const ESPECIALIDADES = [...new Set(MEDICOS.map((m) => m.especialidade))].sort();

const TURNO_LABEL = { manha: 'Manhã', tarde: 'Tarde', integral: 'Integral' };

export default function MedicosPage() {
  const [busca, setBusca] = useState('');
  const [filtroEsp, setFiltroEsp] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('');

  const medicos = useMemo(() => MEDICOS.filter((m) => {
    if (busca && !m.nome.toLowerCase().includes(busca.toLowerCase()) &&
        !m.crm.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroEsp && m.especialidade !== filtroEsp) return false;
    if (filtroTurno && m.turno !== filtroTurno) return false;
    return true;
  }), [busca, filtroEsp, filtroTurno]);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope size={20} className="text-slate-600" /> Médicos
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">{MEDICOS.length} médicos cadastrados em {UNIDADES.length} unidades</p>
      </div>

      {/* Filtros */}
      <div className="card py-3 px-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={busca} onChange={(e) => setBusca(e.target.value)}
            placeholder="Nome ou CRM..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filtroEsp} onChange={(e) => setFiltroEsp(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todas especialidades</option>
          {ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}
        </select>
        <select value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none">
          <option value="">Todos os turnos</option>
          <option value="manha">Manhã</option>
          <option value="tarde">Tarde</option>
          <option value="integral">Integral</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {medicos.map((m) => (
          <div key={m.id} className="card card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                {iniciais(m.nome)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{m.nome}</p>
                <p className="text-xs text-slate-400 font-mono">{m.crm}</p>
              </div>
            </div>
            <p className="text-xs font-medium text-blue-700 bg-blue-50 rounded-md px-2 py-1 truncate">{m.especialidade}</p>
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Turno</span>
                <span className="font-medium text-slate-700">{TURNO_LABEL[m.turno]}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Telefone</span>
                <span className="font-medium text-slate-700 font-mono">{m.telefone}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Unidades</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {m.unidadesAtendimento.map((uid) => {
                    const u = UNIDADES.find((un) => un.id === uid);
                    return (
                      <span key={uid} className="text-white text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{ background: u?.cor ?? '#64748b', fontSize: '10px' }}>
                        {u?.sigla ?? uid}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {medicos.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">Nenhum médico encontrado.</div>
      )}
    </div>
  );
}
