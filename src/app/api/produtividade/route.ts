import { NextResponse } from 'next/server';
import { gerarAlocacoes, gerarDadosHistoricos, gerarProdutividadePorEspecialidade } from '@/lib/simulacao';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date();
  const alocacoes = gerarAlocacoes(now);
  const historico = gerarDadosHistoricos(30);
  const porEspecialidade = gerarProdutividadePorEspecialidade(alocacoes);

  return NextResponse.json({
    timestamp: now.toISOString(),
    historico,
    porEspecialidade,
  });
}
