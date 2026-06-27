import { NextResponse } from 'next/server';
import {
  gerarAlocacoes, gerarEstadoSalas, gerarResumoUnidades, gerarKPIs
} from '@/lib/simulacao';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date();
  const alocacoes = gerarAlocacoes(now);
  const estadoSalas = gerarEstadoSalas(alocacoes);
  const resumoUnidades = gerarResumoUnidades(alocacoes, estadoSalas);
  const kpis = gerarKPIs(resumoUnidades, alocacoes);

  return NextResponse.json({
    timestamp: now.toISOString(),
    kpis,
    alocacoes,
    estadoSalas,
    resumoUnidades,
  });
}
