'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ManualSalaEstado } from '@/types';

const STORAGE_KEY = 'ambulatorio:mapa-manual:v1';
const EVENTO_ATUALIZADO = 'mapa-manual:atualizado';

function lerEstados(): Record<string, ManualSalaEstado> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function gravarEstados(estados: Record<string, ManualSalaEstado>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estados));
  window.dispatchEvent(new Event(EVENTO_ATUALIZADO));
}

export function useMapaManualEstados() {
  const [estados, setEstados] = useState<Record<string, ManualSalaEstado>>({});

  useEffect(() => {
    setEstados(lerEstados());
    const sincronizar = () => setEstados(lerEstados());
    window.addEventListener(EVENTO_ATUALIZADO, sincronizar);
    window.addEventListener('storage', sincronizar);
    return () => {
      window.removeEventListener(EVENTO_ATUALIZADO, sincronizar);
      window.removeEventListener('storage', sincronizar);
    };
  }, []);

  const atualizarSala = useCallback((salaId: string, patch: Partial<Omit<ManualSalaEstado, 'atualizadoEm'>>) => {
    const atual = lerEstados();
    const base: ManualSalaEstado = atual[salaId] ?? { status: 'livre', medicoId: null, observacao: '', atualizadoEm: '' };
    const novo: ManualSalaEstado = {
      ...base,
      ...patch,
      atualizadoEm: new Date().toISOString(),
    };
    const proximos = { ...atual, [salaId]: novo };
    gravarEstados(proximos);
    setEstados(proximos);
  }, []);

  const limparSala = useCallback((salaId: string) => {
    const atual = lerEstados();
    if (!(salaId in atual)) return;
    const proximos = { ...atual };
    delete proximos[salaId];
    gravarEstados(proximos);
    setEstados(proximos);
  }, []);

  const limparUnidade = useCallback((salaIds: string[]) => {
    const atual = lerEstados();
    const proximos = { ...atual };
    salaIds.forEach((id) => delete proximos[id]);
    gravarEstados(proximos);
    setEstados(proximos);
  }, []);

  return { estados, atualizarSala, limparSala, limparUnidade };
}
