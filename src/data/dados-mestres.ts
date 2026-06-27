import type { Unidade, Medico, Sala, TurnoMedico } from '@/types';

export const UNIDADES: Unidade[] = [
  {
    id: 'u01', nome: 'Central – Consolação', sigla: 'CTR',
    cidade: 'São Paulo', endereco: 'Av. Paulista, 1842 – Bela Vista',
    telefone: '(11) 3001-0001', coordenador: 'Dra. Helena Vasconcelos',
    cor: '#1e40af',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia',
      'Pediatria','Dermatologia','Neurologia','Oftalmologia','Urologia',
      'Endocrinologia','Gastroenterologia','Pneumologia','Reumatologia','Psiquiatria'],
  },
  {
    id: 'u02', nome: 'Leste – Tatuapé', sigla: 'LST',
    cidade: 'São Paulo', endereco: 'R. Tuiuti, 3200 – Tatuapé',
    telefone: '(11) 3001-0002', coordenador: 'Dr. Marcelo Fontes',
    cor: '#0f766e',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia',
      'Pediatria','Dermatologia','Neurologia','Urologia'],
  },
  {
    id: 'u03', nome: 'Norte – Santana', sigla: 'NRT',
    cidade: 'São Paulo', endereco: 'Av. Braz Leme, 1410 – Santana',
    telefone: '(11) 3001-0003', coordenador: 'Dra. Sandra Meireles',
    cor: '#7c3aed',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia',
      'Pediatria','Dermatologia','Neurologia'],
  },
  {
    id: 'u04', nome: 'Sul – Ipiranga', sigla: 'SUL',
    cidade: 'São Paulo', endereco: 'R. Silva Bueno, 2088 – Ipiranga',
    telefone: '(11) 3001-0004', coordenador: 'Dr. Antônio Gomes',
    cor: '#b45309',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia','Pediatria','Dermatologia'],
  },
  {
    id: 'u05', nome: 'Oeste – Pinheiros', sigla: 'OST',
    cidade: 'São Paulo', endereco: 'R. dos Pinheiros, 870 – Pinheiros',
    telefone: '(11) 3001-0005', coordenador: 'Dra. Luciana Braga',
    cor: '#0369a1',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia',
      'Pediatria','Dermatologia','Neurologia','Oftalmologia'],
  },
  {
    id: 'u06', nome: 'ABC – Santo André', sigla: 'ABC',
    cidade: 'Santo André', endereco: 'Av. Industrial, 600 – Sto. André',
    telefone: '(11) 4432-0006', coordenador: 'Dr. Cláudio Rezende',
    cor: '#be185d',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia','Pediatria'],
  },
  {
    id: 'u07', nome: 'Guarulhos', sigla: 'GRU',
    cidade: 'Guarulhos', endereco: 'R. Sete de Setembro, 1120 – Guarulhos',
    telefone: '(11) 2402-0007', coordenador: 'Dra. Rosane Paiva',
    cor: '#065f46',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia','Pediatria'],
  },
  {
    id: 'u08', nome: 'Osasco', sigla: 'OSC',
    cidade: 'Osasco', endereco: 'Av. dos Autonomistas, 500 – Osasco',
    telefone: '(11) 3682-0008', coordenador: 'Dr. Wagner Matos',
    cor: '#92400e',
    especialidades: ['Clínica Médica','Cardiologia','Ginecologia','Pediatria'],
  },
  {
    id: 'u09', nome: 'Campinas', sigla: 'CPN',
    cidade: 'Campinas', endereco: 'Av. Norte-Sul, 3300 – Campinas',
    telefone: '(19) 3201-0009', coordenador: 'Dra. Elaine Duarte',
    cor: '#1d4ed8',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia',
      'Pediatria','Dermatologia','Neurologia'],
  },
  {
    id: 'u10', nome: 'Santos', sigla: 'STS',
    cidade: 'Santos', endereco: 'Av. Ana Costa, 555 – Santos',
    telefone: '(13) 3201-0010', coordenador: 'Dr. Sérgio Mendonça',
    cor: '#0c4a6e',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia','Pediatria'],
  },
  {
    id: 'u11', nome: 'Ribeirão Preto', sigla: 'RBP',
    cidade: 'Ribeirão Preto', endereco: 'R. General Osório, 850 – Ribeirão Preto',
    telefone: '(16) 3201-0011', coordenador: 'Dra. Cristiane Luz',
    cor: '#4c1d95',
    especialidades: ['Clínica Médica','Cardiologia','Ortopedia','Ginecologia',
      'Pediatria','Dermatologia'],
  },
  {
    id: 'u12', nome: 'São José dos Campos', sigla: 'SJC',
    cidade: 'São José dos Campos', endereco: 'Av. Adhemar de Barros, 900 – SJC',
    telefone: '(12) 3201-0012', coordenador: 'Dr. Fábio Trevisan',
    cor: '#134e4a',
    especialidades: ['Clínica Médica','Cardiologia','Ginecologia','Pediatria'],
  },
  {
    id: 'u13', nome: 'Sorocaba', sigla: 'SRC',
    cidade: 'Sorocaba', endereco: 'R. 15 de Novembro, 200 – Sorocaba',
    telefone: '(15) 3201-0013', coordenador: 'Dra. Mônica Assunção',
    cor: '#7f1d1d',
    especialidades: ['Clínica Médica','Cardiologia','Ginecologia','Pediatria'],
  },
];

export const MEDICOS: Medico[] = [
  // Clínica Médica
  { id: 'm01', nome: 'Dr. Carlos Eduardo Mendes', crm: 'CRM/SP 87412', especialidade: 'Clínica Médica', turno: 'manha', unidadesAtendimento: ['u01','u02'] },
  { id: 'm02', nome: 'Dra. Ana Paula Rodrigues', crm: 'CRM/SP 91033', especialidade: 'Clínica Médica', turno: 'tarde', unidadesAtendimento: ['u01','u03'] },
  { id: 'm03', nome: 'Dr. Paulo Roberto Silva', crm: 'CRM/SP 74218', especialidade: 'Clínica Médica', turno: 'integral', unidadesAtendimento: ['u02'] },
  { id: 'm04', nome: 'Dra. Maria José Santos', crm: 'CRM/SP 103447', especialidade: 'Clínica Médica', turno: 'manha', unidadesAtendimento: ['u03','u04'] },
  { id: 'm05', nome: 'Dr. João Batista Costa', crm: 'CRM/SP 56891', especialidade: 'Clínica Médica', turno: 'tarde', unidadesAtendimento: ['u05','u06'] },
  { id: 'm06', nome: 'Dra. Fernanda Lima Cruz', crm: 'CRM/SP 118204', especialidade: 'Clínica Médica', turno: 'manha', unidadesAtendimento: ['u06','u07'] },
  { id: 'm07', nome: 'Dr. Roberto Alves Neto', crm: 'CRM/SP 68730', especialidade: 'Clínica Médica', turno: 'tarde', unidadesAtendimento: ['u07','u08'] },
  { id: 'm08', nome: 'Dra. Patrícia Ferreira', crm: 'CRM/SP 95116', especialidade: 'Clínica Médica', turno: 'integral', unidadesAtendimento: ['u09'] },
  { id: 'm09', nome: 'Dr. Marcos Oliveira', crm: 'CRM/SP 44382', especialidade: 'Clínica Médica', turno: 'manha', unidadesAtendimento: ['u10','u11'] },
  { id: 'm10', nome: 'Dra. Cristina Pereira', crm: 'CRM/SP 122567', especialidade: 'Clínica Médica', turno: 'tarde', unidadesAtendimento: ['u12','u13'] },
  // Cardiologia
  { id: 'm11', nome: 'Dr. André Cardoso', crm: 'CRM/SP 77091', especialidade: 'Cardiologia', turno: 'integral', unidadesAtendimento: ['u01'] },
  { id: 'm12', nome: 'Dra. Juliana Ramos', crm: 'CRM/SP 109345', especialidade: 'Cardiologia', turno: 'manha', unidadesAtendimento: ['u01','u02'] },
  { id: 'm13', nome: 'Dr. Henrique Martins', crm: 'CRM/SP 83210', especialidade: 'Cardiologia', turno: 'tarde', unidadesAtendimento: ['u03','u04'] },
  { id: 'm14', nome: 'Dra. Letícia Souza', crm: 'CRM/SP 98874', especialidade: 'Cardiologia', turno: 'manha', unidadesAtendimento: ['u05','u06'] },
  { id: 'm15', nome: 'Dr. Fábio Nascimento', crm: 'CRM/SP 61203', especialidade: 'Cardiologia', turno: 'tarde', unidadesAtendimento: ['u07','u08'] },
  { id: 'm16', nome: 'Dra. Renata Carvalho', crm: 'CRM/SP 114482', especialidade: 'Cardiologia', turno: 'manha', unidadesAtendimento: ['u09','u10'] },
  { id: 'm17', nome: 'Dr. Eduardo Ribeiro', crm: 'CRM/SP 72659', especialidade: 'Cardiologia', turno: 'tarde', unidadesAtendimento: ['u11','u12'] },
  { id: 'm18', nome: 'Dra. Camila Azevedo', crm: 'CRM/SP 134001', especialidade: 'Cardiologia', turno: 'integral', unidadesAtendimento: ['u13'] },
  // Ortopedia
  { id: 'm19', nome: 'Dr. Ricardo Moura', crm: 'CRM/SP 55017', especialidade: 'Ortopedia e Traumatologia', turno: 'integral', unidadesAtendimento: ['u01'] },
  { id: 'm20', nome: 'Dra. Daniela Castro', crm: 'CRM/SP 107620', especialidade: 'Ortopedia e Traumatologia', turno: 'manha', unidadesAtendimento: ['u02','u03'] },
  { id: 'm21', nome: 'Dr. Bruno Teixeira', crm: 'CRM/SP 80945', especialidade: 'Ortopedia e Traumatologia', turno: 'tarde', unidadesAtendimento: ['u04','u05'] },
  { id: 'm22', nome: 'Dr. Leonardo Barbosa', crm: 'CRM/SP 91284', especialidade: 'Ortopedia e Traumatologia', turno: 'manha', unidadesAtendimento: ['u06','u07'] },
  { id: 'm23', nome: 'Dra. Priscila Gomes', crm: 'CRM/SP 119038', especialidade: 'Ortopedia e Traumatologia', turno: 'tarde', unidadesAtendimento: ['u09','u10'] },
  { id: 'm24', nome: 'Dr. Gustavo Mota', crm: 'CRM/SP 66312', especialidade: 'Ortopedia e Traumatologia', turno: 'integral', unidadesAtendimento: ['u11'] },
  // Ginecologia
  { id: 'm25', nome: 'Dra. Beatriz Correia', crm: 'CRM/SP 88753', especialidade: 'Ginecologia e Obstetrícia', turno: 'integral', unidadesAtendimento: ['u01'] },
  { id: 'm26', nome: 'Dr. Thiago Campos', crm: 'CRM/SP 97401', especialidade: 'Ginecologia e Obstetrícia', turno: 'manha', unidadesAtendimento: ['u02','u03'] },
  { id: 'm27', nome: 'Dra. Isabela Freitas', crm: 'CRM/SP 113867', especialidade: 'Ginecologia e Obstetrícia', turno: 'tarde', unidadesAtendimento: ['u04','u05'] },
  { id: 'm28', nome: 'Dr. Rodrigo Lopes', crm: 'CRM/SP 74933', especialidade: 'Ginecologia e Obstetrícia', turno: 'manha', unidadesAtendimento: ['u06','u07'] },
  { id: 'm29', nome: 'Dra. Amanda Neves', crm: 'CRM/SP 129445', especialidade: 'Ginecologia e Obstetrícia', turno: 'tarde', unidadesAtendimento: ['u08','u09'] },
  { id: 'm30', nome: 'Dr. Felipe Cunha', crm: 'CRM/SP 58620', especialidade: 'Ginecologia e Obstetrícia', turno: 'manha', unidadesAtendimento: ['u10','u11','u12','u13'] },
  // Pediatria
  { id: 'm31', nome: 'Dra. Sofia Monteiro', crm: 'CRM/SP 102891', especialidade: 'Pediatria', turno: 'integral', unidadesAtendimento: ['u01'] },
  { id: 'm32', nome: 'Dr. Lucas Pinto', crm: 'CRM/SP 87334', especialidade: 'Pediatria', turno: 'manha', unidadesAtendimento: ['u02','u03'] },
  { id: 'm33', nome: 'Dra. Gabriela Vieira', crm: 'CRM/SP 115099', especialidade: 'Pediatria', turno: 'tarde', unidadesAtendimento: ['u04','u05'] },
  { id: 'm34', nome: 'Dr. Mateus Araújo', crm: 'CRM/SP 79562', especialidade: 'Pediatria', turno: 'manha', unidadesAtendimento: ['u06','u07'] },
  { id: 'm35', nome: 'Dra. Caroline Brito', crm: 'CRM/SP 121730', especialidade: 'Pediatria', turno: 'tarde', unidadesAtendimento: ['u08','u09'] },
  { id: 'm36', nome: 'Dr. Vinícius Dias', crm: 'CRM/SP 65178', especialidade: 'Pediatria', turno: 'integral', unidadesAtendimento: ['u10','u11','u12','u13'] },
  // Dermatologia
  { id: 'm37', nome: 'Dra. Larissa Fonseca', crm: 'CRM/SP 108249', especialidade: 'Dermatologia', turno: 'manha', unidadesAtendimento: ['u01','u02'] },
  { id: 'm38', nome: 'Dr. Alexandre Santos', crm: 'CRM/SP 83671', especialidade: 'Dermatologia', turno: 'tarde', unidadesAtendimento: ['u03','u04'] },
  { id: 'm39', nome: 'Dra. Aline Machado', crm: 'CRM/SP 117532', especialidade: 'Dermatologia', turno: 'manha', unidadesAtendimento: ['u05','u09'] },
  { id: 'm40', nome: 'Dr. Samuel Duarte', crm: 'CRM/SP 92118', especialidade: 'Dermatologia', turno: 'tarde', unidadesAtendimento: ['u11'] },
  // Neurologia
  { id: 'm41', nome: 'Dr. Rafael Lima', crm: 'CRM/SP 71449', especialidade: 'Neurologia', turno: 'integral', unidadesAtendimento: ['u01'] },
  { id: 'm42', nome: 'Dra. Marina Cavalcanti', crm: 'CRM/SP 106783', especialidade: 'Neurologia', turno: 'manha', unidadesAtendimento: ['u02','u03'] },
  { id: 'm43', nome: 'Dr. Pedro Nogueira', crm: 'CRM/SP 89024', especialidade: 'Neurologia', turno: 'tarde', unidadesAtendimento: ['u05','u09'] },
  // Oftalmologia
  { id: 'm44', nome: 'Dr. Diego Resende', crm: 'CRM/SP 101356', especialidade: 'Oftalmologia', turno: 'integral', unidadesAtendimento: ['u01'] },
  { id: 'm45', nome: 'Dra. Tatiana Paiva', crm: 'CRM/SP 116892', especialidade: 'Oftalmologia', turno: 'manha', unidadesAtendimento: ['u05'] },
  // Urologia
  { id: 'm46', nome: 'Dr. Flávio Silveira', crm: 'CRM/SP 78210', especialidade: 'Urologia', turno: 'manha', unidadesAtendimento: ['u01','u02'] },
  { id: 'm47', nome: 'Dr. Renato Medeiros', crm: 'CRM/SP 94567', especialidade: 'Urologia', turno: 'tarde', unidadesAtendimento: ['u01'] },
  // Endocrinologia
  { id: 'm48', nome: 'Dra. Roberta Vidal', crm: 'CRM/SP 112034', especialidade: 'Endocrinologia', turno: 'integral', unidadesAtendimento: ['u01'] },
  { id: 'm49', nome: 'Dr. Wellington Pires', crm: 'CRM/SP 86441', especialidade: 'Endocrinologia', turno: 'tarde', unidadesAtendimento: ['u01'] },
  // Gastroenterologia
  { id: 'm50', nome: 'Dr. Adriano Morais', crm: 'CRM/SP 69823', especialidade: 'Gastroenterologia', turno: 'manha', unidadesAtendimento: ['u01'] },
  { id: 'm51', nome: 'Dra. Fabiana Lago', crm: 'CRM/SP 103218', especialidade: 'Gastroenterologia', turno: 'tarde', unidadesAtendimento: ['u01'] },
  // Pneumologia
  { id: 'm52', nome: 'Dr. Cleber Magalhães', crm: 'CRM/SP 80099', especialidade: 'Pneumologia', turno: 'manha', unidadesAtendimento: ['u01'] },
  { id: 'm53', nome: 'Dra. Simone Barros', crm: 'CRM/SP 118774', especialidade: 'Pneumologia', turno: 'tarde', unidadesAtendimento: ['u01'] },
  // Reumatologia
  { id: 'm54', nome: 'Dr. Nelson Fontes', crm: 'CRM/SP 73390', especialidade: 'Reumatologia', turno: 'manha', unidadesAtendimento: ['u01'] },
  { id: 'm55', nome: 'Dra. Luciana Nunes', crm: 'CRM/SP 109881', especialidade: 'Reumatologia', turno: 'tarde', unidadesAtendimento: ['u01'] },
  // Psiquiatria
  { id: 'm56', nome: 'Dr. Edson Xavier', crm: 'CRM/SP 65904', especialidade: 'Psiquiatria', turno: 'manha', unidadesAtendimento: ['u01'] },
  { id: 'm57', nome: 'Dra. Miriam Salles', crm: 'CRM/SP 121009', especialidade: 'Psiquiatria', turno: 'tarde', unidadesAtendimento: ['u01'] },
  // Extra – para cobrir unidades menores
  { id: 'm58', nome: 'Dr. Tiago Ferraz', crm: 'CRM/SP 99231', especialidade: 'Clínica Médica', turno: 'integral', unidadesAtendimento: ['u04'] },
  { id: 'm59', nome: 'Dra. Karina Moreira', crm: 'CRM/SP 84765', especialidade: 'Cardiologia', turno: 'integral', unidadesAtendimento: ['u09'] },
  { id: 'm60', nome: 'Dr. Álvaro Leal', crm: 'CRM/SP 77432', especialidade: 'Ortopedia e Traumatologia', turno: 'tarde', unidadesAtendimento: ['u12','u13'] },
];

function gerarSalas(unidadeId: string, especialidades: string[]): Sala[] {
  const salas: Sala[] = [];
  let seq = 1;
  const toStr = (n: number) => String(n).padStart(2, '0');

  // Triagem – sempre 1 por andar (1)
  salas.push({
    id: `${unidadeId}-s${toStr(seq++)}`,
    unidadeId, numero: `T01`, nome: 'Triagem / Acolhimento',
    tipo: 'triagem', especialidade: 'Triagem', andar: 1,
  });

  // Consultórios por especialidade
  const consultoriosPorEsp: Record<string, number> = {
    'Clínica Médica': 3, 'Cardiologia': 2, 'Ortopedia e Traumatologia': 2,
    'Ginecologia e Obstetrícia': 2, 'Pediatria': 2, 'Dermatologia': 1,
    'Neurologia': 1, 'Oftalmologia': 1, 'Urologia': 1,
    'Endocrinologia': 1, 'Gastroenterologia': 1, 'Pneumologia': 1,
    'Reumatologia': 1, 'Psiquiatria': 1,
  };

  let andar = 1;
  let contNaAndar = 0;
  especialidades.forEach((esp) => {
    const qtd = consultoriosPorEsp[esp] ?? 1;
    for (let i = 1; i <= qtd; i++) {
      if (contNaAndar >= 6) { andar++; contNaAndar = 0; }
      salas.push({
        id: `${unidadeId}-s${toStr(seq++)}`,
        unidadeId,
        numero: `C${toStr(seq - 2)}`,
        nome: `${esp} ${i}`,
        tipo: 'consultorio',
        especialidade: esp,
        andar,
      });
      contNaAndar++;
    }
  });

  // Sala de procedimentos
  salas.push({
    id: `${unidadeId}-s${toStr(seq++)}`, unidadeId,
    numero: `P01`, nome: 'Sala de Procedimentos',
    tipo: 'procedimento', especialidade: 'Procedimentos', andar: 2,
  });
  if (especialidades.length >= 8) {
    salas.push({
      id: `${unidadeId}-s${toStr(seq++)}`, unidadeId,
      numero: `P02`, nome: 'Sala de Exames / ECG',
      tipo: 'exame', especialidade: 'Exames', andar: 2,
    });
  }

  return salas;
}

export const TODAS_SALAS: Sala[] = UNIDADES.flatMap((u) =>
  gerarSalas(u.id, u.especialidades)
);
