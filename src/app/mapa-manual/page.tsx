'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ClipboardEdit } from 'lucide-react';
import { UNIDADES, TODAS_SALAS } from '@/data/dados-mestres';
import { useMapaManualEstados } from '@/lib/mapaManualStore';

export default function MapaManualIndex() {
  const { estados } = useMapaManualEstados();

  const contagemPorUnidade = useMemo(() => {
    const mapa: Record<string, { ocupadas: number; total: number }> = {};
    UNIDADES.forEach((u) => { mapa[u.id] = { ocupadas: 0, total: 0 }; });
    TODAS_SALAS.forEach((s) => {
      const c = mapa[s.unidadeId];
      if (!c) return;
      c.total++;
      if (estados[s.id]?.status === 'ocupada') c.ocupadas++;
    });
    return mapa;
  }, [estados]);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardEdit size={20} className="text-violet-600" /> Mapa de Salas — Edição Manual
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Marque manualmente o status de cada sala. Os dados ficam salvos neste navegador (não há simulação automática nem banco de dados).
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {UNIDADES.map((u) => {
          const c = contagemPorUnidade[u.id] ?? { ocupadas: 0, total: 0 };
          return (
            <Link key={u.id} href={`/mapa-manual/${u.id}`}
              className="card card-hover cursor-pointer transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: u.cor }}>
                  {u.sigla.slice(0,2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm leading-tight">{u.nome}</p>
                  <p className="text-xs text-slate-400">{u.cidade}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">{c.ocupadas} de {c.total} salas marcadas como ocupadas</p>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-violet-600 font-medium">Editar mapa →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
