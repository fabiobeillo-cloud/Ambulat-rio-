/**
 * Motor de simulação tempo-real.
 * Gera estado consistente baseado no horário atual — sem banco de dados.
 * A cada polling (30s), o estado evolui de forma realista.
 */

import { MEDICOS, UNIDADES, TODAS_SALAS } from '@/data/dados-mestres';
import type {
  AlocacaoAtual, EstadoSala, ResumoUnidade, DashboardKPIs, Alerta, StatusMedico, StatusSala
} from '@/types';

function seed(n: number) {
  // LCG determinístico para não usar Math.random() puro
  return ((1664525 * n + 1013904223) & 0x7fffffff) / 0x7fffffff;
}

function minutosDoDia(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function hojeString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** Retorna médicos programados para hoje em uma unidade */
function medicosDaUnidadeHoje(unidadeId: string): typeof MEDICOS {
  const dow = new Date().getDay(); // 0=dom, 6=sab
  if (dow === 0 || dow === 6) return [];
  return MEDICOS.filter((m) => m.unidadesAtendimento.includes(unidadeId));
}

export function gerarAlocacoes(now: Date): AlocacaoAtual[] {
  const min = minutosDoDia(now);
  const INICIO_MANHA = 7 * 60;   // 07:00
  const FIM_MANHA   = 12 * 60;   // 12:00
  const INICIO_TARDE = 13 * 60;  // 13:00
  const FIM_TARDE   = 18 * 60;   // 18:00
  const DURACAO_CONSULTA = 20;   // minutos

  const alocacoes: AlocacaoAtual[] = [];

  UNIDADES.forEach((unidade, ui) => {
    const medicos = medicosDaUnidadeHoje(unidade.id);
    const salasConsultorio = TODAS_SALAS.filter(
      (s) => s.unidadeId === unidade.id && s.tipo === 'consultorio'
    );

    medicos.forEach((medico, mi) => {
      const ativo =
        (medico.turno === 'manha'   && min >= INICIO_MANHA && min < FIM_MANHA) ||
        (medico.turno === 'tarde'   && min >= INICIO_TARDE && min < FIM_TARDE) ||
        (medico.turno === 'integral' && min >= INICIO_MANHA && min < FIM_TARDE);

      // ~5% ausência
      const ausente = seed(ui * 100 + mi + now.getDate()) < 0.05;

      const sala = salasConsultorio.find(
        (s) => s.especialidade === medico.especialidade
      ) ?? salasConsultorio[mi % salasConsultorio.length];

      if (!ativo || ausente) {
        alocacoes.push({
          medicoId: medico.id,
          salaId: sala?.id ?? '',
          unidadeId: unidade.id,
          status: ausente ? 'ausente' : 'disponivel',
          inicioTurno: medico.turno === 'tarde' ? '13:00' : '07:00',
          consultasRealizadas: ausente ? 0 : 0,
          consultasAgendadas: 16,
          proximoPaciente: null,
          tempoMedioMin: 18,
        });
        return;
      }

      // Consultas realizadas no turno até agora
      const inicioTurnoMin = medico.turno === 'tarde' ? INICIO_TARDE : INICIO_MANHA;
      const minutosDecorridos = Math.max(0, min - inicioTurnoMin);
      const consultasBase = Math.floor(minutosDecorridos / DURACAO_CONSULTA);
      // Pequena variação ±2 por médico
      const variacao = Math.round((seed(ui * 200 + mi) - 0.5) * 4);
      const consultasRealizadas = Math.max(0, consultasBase + variacao);

      // Status atual na janela de 20 min
      const slotMin = minutosDecorridos % DURACAO_CONSULTA;
      let status: StatusMedico;
      if (slotMin < 15) {
        status = 'em_atendimento';
      } else if (slotMin < 18) {
        // ~20% pausa aleatória
        status = seed(ui * 300 + mi + now.getMinutes()) > 0.8 ? 'pausa' : 'aguardando';
      } else {
        status = 'aguardando';
      }

      const agendaTotal = 16;
      const hh = String(Math.floor(inicioTurnoMin / 60)).padStart(2, '0');
      const mm = String(inicioTurnoMin % 60).padStart(2, '0');

      alocacoes.push({
        medicoId: medico.id,
        salaId: sala?.id ?? '',
        unidadeId: unidade.id,
        status,
        inicioTurno: `${hh}:${mm}`,
        consultasRealizadas,
        consultasAgendadas: agendaTotal,
        proximoPaciente: status === 'aguardando' ? `Paciente ${consultasRealizadas + 1}` : null,
        tempoMedioMin: 18 + Math.round((seed(ui * 400 + mi) - 0.5) * 6),
      });
    });
  });

  return alocacoes;
}

export function gerarEstadoSalas(alocacoes: AlocacaoAtual[]): EstadoSala[] {
  return TODAS_SALAS.map((sala) => {
    const aloc = alocacoes.find((a) => a.salaId === sala.id);
    if (!aloc || aloc.status === 'ausente' || aloc.status === 'disponivel') {
      const emManutencao = seed(sala.id.charCodeAt(sala.id.length - 1) * 17) < 0.04;
      const status: StatusSala = emManutencao ? 'manutencao' : 'livre';
      return { salaId: sala.id, status, medicoId: null, pacienteAtual: null, inicioAtendimento: null };
    }
    const status: StatusSala = aloc.status === 'em_atendimento' ? 'ocupada' : 'reservada';
    return {
      salaId: sala.id, status,
      medicoId: aloc.medicoId,
      pacienteAtual: aloc.status === 'em_atendimento' ? `Pac. ${aloc.consultasRealizadas}` : null,
      inicioAtendimento: aloc.status === 'em_atendimento' ? new Date().toISOString() : null,
    };
  });
}

export function gerarResumoUnidades(alocacoes: AlocacaoAtual[], estadoSalas: EstadoSala[]): ResumoUnidade[] {
  return UNIDADES.map((unidade) => {
    const alocsUnidade = alocacoes.filter((a) => a.unidadeId === unidade.id);
    const salasUnidade = estadoSalas.filter(
      (s) => TODAS_SALAS.find((ts) => ts.id === s.salaId)?.unidadeId === unidade.id
    );
    const medicosPresentes = alocsUnidade.filter(
      (a) => a.status !== 'ausente' && a.status !== 'disponivel'
    ).length;
    const salasOcupadas = salasUnidade.filter((s) => s.status === 'ocupada').length;
    const consultasRealizadas = alocsUnidade.reduce((acc, a) => acc + a.consultasRealizadas, 0);
    const consultasAgendadas = alocsUnidade.reduce((acc, a) => acc + a.consultasAgendadas, 0);

    const alertas: Alerta[] = [];
    const ausentes = alocsUnidade.filter((a) => a.status === 'ausente');
    ausentes.forEach((a) => {
      const medico = MEDICOS.find((m) => m.id === a.medicoId);
      alertas.push({
        id: `alerta-${a.medicoId}`,
        tipo: 'ausencia',
        mensagem: `${medico?.nome ?? 'Médico'} não se apresentou hoje`,
        unidadeId: unidade.id,
        timestamp: new Date().toISOString(),
      });
    });
    if (salasOcupadas / Math.max(salasUnidade.length, 1) > 0.9) {
      alertas.push({
        id: `cap-${unidade.id}`,
        tipo: 'capacidade',
        mensagem: 'Ocupação acima de 90% — avaliar fila',
        unidadeId: unidade.id,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      unidadeId: unidade.id,
      medicosPresentes,
      medicosTotaisHoje: alocsUnidade.length,
      salasOcupadas,
      salasTotais: salasUnidade.filter((s) => TODAS_SALAS.find(ts => ts.id === s.salaId)?.tipo === 'consultorio').length,
      consultasRealizadas,
      consultasAgendadas,
      alertas,
    };
  });
}

export function gerarKPIs(resumos: ResumoUnidade[], alocacoes: AlocacaoAtual[]): DashboardKPIs {
  const totalMedicosAtivos = resumos.reduce((a, r) => a + r.medicosPresentes, 0);
  const totalMedicosProgramados = alocacoes.length;
  const totalSalasOcupadas = resumos.reduce((a, r) => a + r.salasOcupadas, 0);
  const totalSalas = resumos.reduce((a, r) => a + r.salasTotais, 0);
  const consultasRealizadas = resumos.reduce((a, r) => a + r.consultasRealizadas, 0);
  const consultasProgramadas = resumos.reduce((a, r) => a + r.consultasAgendadas, 0);
  const ausentes = alocacoes.filter((a) => a.status === 'ausente').length;
  const unidadesComAlerta = resumos.filter((r) => r.alertas.length > 0).length;

  return {
    totalMedicosAtivos,
    totalMedicosProgramados,
    totalSalasOcupadas,
    totalSalas,
    consultasRealizadasHoje: consultasRealizadas,
    consultasProgramadasHoje: consultasProgramadas,
    taxaOcupacaoGeral: totalSalas > 0 ? Math.round((totalSalasOcupadas / totalSalas) * 100) : 0,
    taxaAbsenteismoMedico: totalMedicosProgramados > 0
      ? Math.round((ausentes / totalMedicosProgramados) * 100)
      : 0,
    unidadesComAlerta,
  };
}

export function gerarDadosHistoricos(diasAtras: number = 30) {
  const hoje = new Date();
  const dados = [];
  for (let d = diasAtras; d >= 0; d--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - d);
    const dow = data.getDay();
    if (dow === 0 || dow === 6) continue;
    const base = 1200 + Math.round((seed(d * 13) - 0.5) * 200);
    const realizadas = Math.round(base * (0.82 + seed(d * 7) * 0.12));
    dados.push({
      data: hojeString(data),
      agendadas: base,
      realizadas,
      canceladas: Math.round(base * 0.05),
      faltas: base - realizadas - Math.round(base * 0.05),
      taxaOcupacao: Math.round((realizadas / base) * 100),
    });
  }
  return dados;
}

export function gerarProdutividadePorEspecialidade(alocacoes: AlocacaoAtual[]) {
  const mapa: Record<string, { realizadas: number; agendadas: number; medicos: number }> = {};
  alocacoes.forEach((aloc) => {
    const medico = MEDICOS.find((m) => m.id === aloc.medicoId);
    if (!medico) return;
    const esp = medico.especialidade;
    if (!mapa[esp]) mapa[esp] = { realizadas: 0, agendadas: 0, medicos: 0 };
    mapa[esp].realizadas += aloc.consultasRealizadas;
    mapa[esp].agendadas += aloc.consultasAgendadas;
    mapa[esp].medicos += 1;
  });
  return Object.entries(mapa).map(([especialidade, v]) => ({
    especialidade,
    realizadas: v.realizadas,
    agendadas: v.agendadas,
    taxaOcupacao: v.agendadas > 0 ? Math.round((v.realizadas / v.agendadas) * 100) : 0,
    medicosProgramados: v.medicos,
  }));
}
