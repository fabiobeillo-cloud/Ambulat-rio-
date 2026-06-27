export type StatusMedico =
  | 'em_atendimento'
  | 'disponivel'
  | 'pausa'
  | 'ausente'
  | 'aguardando';

export type StatusSala =
  | 'ocupada'
  | 'livre'
  | 'manutencao'
  | 'reservada';

export type TipoSala =
  | 'consultorio'
  | 'procedimento'
  | 'exame'
  | 'triagem'
  | 'emergencia';

export type TurnoMedico = 'manha' | 'tarde' | 'integral';

export interface Unidade {
  id: string;
  nome: string;
  sigla: string;
  cidade: string;
  endereco: string;
  telefone: string;
  coordenador: string;
  cor: string;
  especialidades: string[];
}

export interface Medico {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  turno: TurnoMedico;
  unidadesAtendimento: string[];
}

export interface Sala {
  id: string;
  unidadeId: string;
  numero: string;
  nome: string;
  tipo: TipoSala;
  especialidade: string;
  andar: number;
}

export interface AlocacaoAtual {
  medicoId: string;
  salaId: string;
  unidadeId: string;
  status: StatusMedico;
  inicioTurno: string;
  consultasRealizadas: number;
  consultasAgendadas: number;
  proximoPaciente: string | null;
  tempoMedioMin: number;
}

export interface EstadoSala {
  salaId: string;
  status: StatusSala;
  medicoId: string | null;
  pacienteAtual: string | null;
  inicioAtendimento: string | null;
}

export interface MetricaProdutividade {
  medicoId: string;
  unidadeId: string;
  data: string;
  consultasRealizadas: number;
  consultasAgendadas: number;
  faltasPaciente: number;
  cancelamentos: number;
  tempoMedioMin: number;
  taxaOcupacao: number;
  taxaAbsenteismo: number;
}

export interface ResumoUnidade {
  unidadeId: string;
  medicosPresentes: number;
  medicosTotaisHoje: number;
  salasOcupadas: number;
  salasTotais: number;
  consultasRealizadas: number;
  consultasAgendadas: number;
  alertas: Alerta[];
}

export interface Alerta {
  id: string;
  tipo: 'ausencia' | 'atraso' | 'capacidade' | 'info';
  mensagem: string;
  unidadeId: string;
  timestamp: string;
}

export interface DashboardKPIs {
  totalMedicosAtivos: number;
  totalMedicosProgramados: number;
  totalSalasOcupadas: number;
  totalSalas: number;
  consultasRealizadasHoje: number;
  consultasProgramadasHoje: number;
  taxaOcupacaoGeral: number;
  taxaAbsenteismoMedico: number;
  unidadesComAlerta: number;
}
