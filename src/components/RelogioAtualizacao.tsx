'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export function RelogioAtualizacao({ intervaloSeg = 30, onAtualizar }: { intervaloSeg?: number; onAtualizar?: () => void }) {
  const [hora, setHora] = useState('');
  const [proxAtual, setProxAtual] = useState(intervaloSeg);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setHora(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let contador = intervaloSeg;
    const t = setInterval(() => {
      contador--;
      setProxAtual(contador);
      if (contador <= 0) {
        contador = intervaloSeg;
        setProxAtual(intervaloSeg);
        setAtualizando(true);
        onAtualizar?.();
        setTimeout(() => setAtualizando(false), 800);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [intervaloSeg, onAtualizar]);

  return (
    <div className="flex items-center gap-3 text-sm text-slate-500">
      <span className="font-mono font-medium text-slate-700">{hora}</span>
      <div className="flex items-center gap-1.5">
        <RefreshCw size={13} className={atualizando ? 'animate-spin text-blue-500' : 'text-slate-400'} />
        <span className="text-xs">Atualiza em {proxAtual}s</span>
      </div>
    </div>
  );
}
