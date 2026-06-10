export const INITIAL_WORKOUTS = [
  {
    id: 'treino-a',
    name: 'Treino A - Peito & Tríceps',
    description: 'Foco em hipertrofia do peitoral superior, médio e tríceps cabo.',
    exercises: [
      {
        id: 'supino-reto',
        name: 'Supino Reto com Barra',
        category: 'Peito',
        series: '3 séries de 8 a 12, aumentando a carga de 8KG a 12KG',
        youtubeId: 'UHa9U-O09_U',
        description: 'Deite-se no banco, apoie os pés firmemente no chão. Segure a barra um pouco além da largura dos ombros. Desça a barra de forma controlada até o peito e empurre-a para cima estendendo os braços, mantendo a contração constante no peitoral.'
      },
      {
        id: 'supino-inclinado',
        name: 'Supino Inclinado com Halteres',
        category: 'Peito',
        series: '3 séries de 8 a 12, aumentando a carga de 8KG a 10KG',
        youtubeId: 'AnyCTOxFHzA',
        description: 'Ajuste o banco em uma inclinação aproximada de 30º-45º. Apoie as costas no banco e levante os halteres até a linha superior dos ombros. Desça devagar abrindo os cotovelos de forma controlada e empurre para cima.'
      },
      {
        id: 'tricep-corda',
        name: 'Tríceps Pulley na Corda',
        category: 'Tríceps',
        series: '4 séries de 15 repetições',
        youtubeId: '-WiccHMnq44',
        description: 'Fixe o cotovelo bem rente à lateral do tronco. Puxe a corda do pulley para baixo estendendo totalmente os cotovelos e afaste as pontas da corda na parte inferior para ativar as cabeças laterais do tríceps.'
      }
    ]
  },
  {
    id: 'treino-b',
    name: 'Treino B - Costas & Bíceps',
    description: 'Foco na amplitude das costas, trapézio e isoladores de bíceps.',
    exercises: [
      {
        id: 'puxada-frente',
        name: 'Puxada Pulley Frente',
        category: 'Costas',
        series: '4 séries de 12 repetições',
        youtubeId: 'H08cojZscgw',
        description: 'Ajuste o apoio do joelho, segure a barra aberta em pronação. Incline levemente o tronco para trás e puxe a barra direcionando seus cotovelos para baixo, encostando a barra no peito superior.'
      },
      {
        id: 'remada-baixa',
        name: 'Remada Sentada com Triângulo',
        category: 'Costas',
        series: '3 séries de 12 repetições',
        youtubeId: 'GZbfZ03SgSg',
        description: 'Sente-se de forma ereta, apoie os pés e segure o triângulo. Puxe em direção ao seu abdômen inferior espremendo as escápulas no final. Retorne de forma lenta estendendo totalmente os braços.'
      },
      {
        id: 'rosca-direta',
        name: 'Rosca Inclinada com Halteres',
        category: 'Bíceps',
        series: '4 séries de 10 repetições',
        youtubeId: 'jZf67K2Ym0A',
        description: 'Sente-se em um banco inclinado a 45º segurando halteres em direção ao chão. Mantenha os cotovelos parados e rotacione os punhos para cima ao flexionar os braços, esticando o bíceps por completo.'
      }
    ]
  },
  {
    id: 'treino-c',
    name: 'Treino C - Pernas Completo',
    description: 'Desenvolvimento balanceado de quadríceps, isquiotibiais e glúteos.',
    exercises: [
      {
        id: 'agachamento-livre',
        name: 'Agachamento Livre',
        category: 'Pernas',
        series: '4 séries de 8-10 repetições',
        youtubeId: 'F4qR9_H0H7I',
        description: 'Posicione a barra sobre a musculatura do trapézio (não no pescoço). Afaste os pés na largura dos ombros, empurre o quadril para trás e agache mantendo a coluna neutra até que as coxas passem do paralelo.'
      },
      {
        id: 'cadeira-extensora',
        name: 'Cadeira Extensora',
        category: 'Pernas',
        series: '4 séries de 15 repetições',
        youtubeId: 'mGf_9fL69aQ',
        description: 'Ajuste o rolo de espuma sobre o tornozelo e encoste completamente a coluna no banco. Faça a extensão completa dos joelhos de forma explosiva, segure por 1 segundo e desça resistindo ao peso.'
      },
      {
        id: 'mesa-flexora',
        name: 'Mesa Flexora',
        category: 'Pernas',
        series: '3 séries de 12 repetições',
        youtubeId: 'V6A9O_vL3c0',
        description: 'Deite-se de bruços na mesa flexora, alinhando a articulação do joelho com o eixo da máquina. Flexione as pernas trazendo o rolo até encostar próximo às nádegas e desça controlando.'
      }
    ]
  }
];
