'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UNIDADES } from '@/data/dados-mestres';
import { Map } from 'lucide-react';

export default function MapaIndex() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Map size={20} className="text-teal-600" /> Mapa de Salas
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Selecione uma unidade para visualizar o mapa de salas</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {UNIDADES.map((u) => (
          <Link key={u.id} href={`/mapa/${u.id}`}
            onMouseEnter={() => setHover(u.id)} onMouseLeave={() => setHover(null)}
            className={`card card-hover cursor-pointer transition-all ${hover === u.id ? 'ring-2 ring-blue-400' : ''}`}>
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
            <p className="text-xs text-slate-500 truncate">{u.coordenador}</p>
            <p className="text-xs text-slate-400 mt-1">{u.especialidades.length} especialidades</p>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-blue-600 font-medium">Ver mapa de salas →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
