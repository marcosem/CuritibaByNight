const territoriesSeed = [
  {
    name: 'Piraí do Sul',
    population: 25463,
    sect: 'Sabbat',
  },
  {
    name: 'Jaguariaíva',
    population: 34857,
    sect: 'Sabbat',
  },
  {
    name: 'Quatro Barras',
    population: 23465,
    sect: 'Followers of Set',
  },
  {
    name: 'Araucária',
    population: 143843,
    sect: 'Wyrm',
  },
  {
    name: 'Guaraqueçaba',
    population: 7636,
    sect: 'Garou',
  },
  {
    name: 'Colombo',
    population: 243726,
    sect: 'Camarilla',
  },
  {
    name: 'Rio Negro',
    population: 34170,
    sect: 'Sabbat',
  },
  {
    name: 'Guapirama',
    population: 3802,
    sect: 'Camarilla',
  },
  {
    name: 'Rio Branco do Sul',
    population: 32564,
    sect: 'Camarilla',
  },
  {
    name: 'Rio Azul',
    population: 15120,
    sect: 'Sabbat',
  },
  {
    name: 'Pinhais',
    population: 132157,
    sect: 'Camarilla',
  },
  {
    name: 'Matinhos',
    population: 34400,
    sect: 'Sabbat',
  },
  {
    name: 'Curitiba',
    population: 1933105,
    sect: 'Camarilla',
  },
  {
    name: 'Porto Vitória',
    population: 4044,
    sect: 'Sabbat',
  },
  {
    name: 'Fazenda Rio Grande',
    population: 100209,
    sect: 'Camarilla',
  },
  {
    name: 'Telêmaco Borba',
    population: 78974,
    sect: 'Sabbat',
  },
  {
    name: 'Bocaiúva do Sul',
    population: 12914,
    sect: 'Camarilla',
  },
  {
    name: 'Jundiaí do Sul',
    population: 3272,
    sect: 'Sabbat',
  },
  {
    name: 'Japira',
    population: 4992,
    sect: 'Camarilla',
  },
  {
    name: 'Ortigueira',
    population: 22141,
    sect: 'Sabbat',
  },
  {
    name: 'Carlópolis',
    population: 14202,
    sect: 'Sabbat',
  },
  {
    name: 'Paula Freitas',
    population: 5806,
    sect: 'Sabbat',
  },
  {
    name: 'Almirante Tamandaré',
    population: 118623,
    sect: 'Camarilla',
  },
  {
    name: 'Contenda',
    population: 18584,
    sect: 'Anarch',
  },
  {
    name: 'Rebouças',
    population: 14899,
    sect: 'Sabbat',
  },
  {
    name: 'São Sebastião da Amoreira',
    population: 8836,
    sect: 'Sabbat',
  },
  {
    name: 'Siqueira Campos',
    population: 20734,
    sect: 'Camarilla',
  },
  {
    name: 'Itaperuçu',
    population: 28634,
    sect: 'Camarilla',
  },
  {
    name: 'Agudos do Sul',
    population: 9371,
    sect: 'Anarch',
  },
  {
    name: 'Reserva',
    population: 26869,
    sect: 'Sabbat',
  },
  {
    name: 'Tunas do Paraná',
    population: 8521,
    sect: 'Camarilla',
  },
  {
    name: 'Quitandinha',
    population: 18980,
    sect: 'Anarch-Sabbat',
  },
  {
    name: 'São José da Boa Vista',
    population: 6257,
    sect: 'Camarilla',
  },
  {
    name: 'Mandirituba',
    population: 26715,
    sect: 'Anarch',
  },
  {
    name: 'Ipiranga',
    population: 15119,
    sect: 'Sabbat',
  },
  {
    name: 'Imbaú',
    population: 12944,
    sect: 'Sabbat',
  },
  {
    name: 'General Carneiro',
    population: 13830,
    sect: 'Sabbat',
  },
  {
    name: 'Tomazina',
    population: 8010,
    sect: 'Inquisition',
  },
  {
    name: 'Lapa',
    population: 48163,
    sect: 'Sabbat',
  },
  {
    name: 'Imbituva',
    population: 32391,
    sect: 'Sabbat',
  },
  {
    name: 'Antonina',
    population: 19124,
    sect: 'Anarch',
  },
  {
    name: 'Santo Antônio do Paraíso',
    population: 1942,
    sect: 'Sabbat',
  },
  {
    name: 'Conselheiro Mairinck',
    population: 3833,
    sect: 'Camarilla',
  },
  {
    name: 'Piraquara',
    population: 113036,
    sect: 'Camarilla',
  },
  {
    name: 'Tijucas do Sul',
    population: 16559,
    sect: 'Camarilla',
  },
  {
    name: 'Guaratuba',
    population: 37067,
    sect: 'Sabbat',
  },
  {
    name: 'Porto Amazonas',
    population: 4787,
    sect: 'Sabbat',
  },
  {
    name: 'Wenceslau Braz',
    population: 19414,
    sect: 'Camarilla',
  },
  {
    name: 'Balsa Nova',
    population: 12941,
    sect: 'Sabbat',
  },
  {
    name: 'Adrianópolis',
    population: 5979,
    sect: 'Sabbat',
  },
  {
    name: 'Jaboti',
    population: 5245,
    sect: 'Camarilla',
  },
  {
    name: 'Palmeira',
    population: 33877,
    sect: 'Sabbat',
  },
  {
    name: 'Campo do Tenente',
    population: 7904,
    sect: 'Sabbat',
  },
  {
    name: 'Fernandes Pinheiro',
    population: 5618,
    sect: 'Sabbat',
  },
  {
    name: 'Pinhalão',
    population: 6326,
    sect: 'Camarilla',
  },
  {
    name: 'Tibagi',
    population: 20522,
    sect: 'Sabbat',
  },
  {
    name: 'Carambeí',
    population: 23415,
    sect: 'Sabbat',
  },
  {
    name: 'Salto do Itararé',
    population: 4935,
    sect: 'Camarilla',
  },
  {
    name: 'Ponta Grossa',
    population: 351736,
    sect: 'Sabbat',
  },
  {
    name: 'São João do Triunfo',
    population: 15018,
    sect: 'Sabbat',
  },
  {
    name: 'Ivaí',
    population: 13879,
    sect: 'Sabbat',
  },
  {
    name: 'Santo Antônio da Platina',
    population: 45993,
    sect: 'Camarilla',
  },
  {
    name: 'Congonhinhas',
    population: 8818,
    sect: 'Sabbat',
  },
  {
    name: 'Ventania',
    population: 11568,
    sect: 'Sabbat',
  },
  {
    name: 'Prudentópolis',
    population: 52241,
    sect: 'Sabbat',
  },
  {
    name: 'Guamiranga',
    population: 8769,
    sect: 'Sabbat',
  },
  {
    name: 'Ribeirão do Pinhal',
    population: 13111,
    sect: 'Sabbat',
  },
  {
    name: 'Bituruna',
    population: 16406,
    sect: 'Sabbat',
  },
  {
    name: 'Cerro Azul',
    population: 17779,
    sect: 'Sabbat',
  },
  {
    name: 'Sengés',
    population: 19254,
    sect: 'Sabbat',
  },
  {
    name: 'Irati',
    population: 60727,
    sect: 'Wyrm',
  },
  {
    name: 'Campo Largo',
    population: 132002,
    sect: 'Anarch-Sabbat',
  },
  {
    name: 'Santana do Itararé',
    population: 4935,
    sect: 'Camarilla',
  },
  {
    name: 'Cruz Machado',
    population: 18708,
    sect: 'Sabbat',
  },
  {
    name: 'Paulo Frontin',
    population: 7262,
    sect: 'Sabbat',
  },
  {
    name: 'Doutor Ulysses',
    population: 5603,
    sect: 'Sabbat',
  },
  {
    name: 'Curiúva',
    population: 15101,
    sect: 'Sabbat',
  },
  {
    name: 'Santa Cecília do Pavão',
    population: 3310,
    sect: 'Sabbat',
  },
  {
    name: 'Paranaguá',
    population: 154936,
    sect: 'Assamites',
  },
  {
    name: 'Figueira',
    population: 7800,
    sect: 'Sabbat',
  },
  {
    name: 'Arapotí',
    population: 28115,
    sect: 'Camarilla',
  },
  {
    name: 'Campo Magro',
    population: 28884,
    sect: 'Sabbat',
  },
  {
    name: 'Morretes',
    population: 16389,
    sect: 'Anarch',
  },
  {
    name: 'Teixeira Soares',
    population: 12121,
    sect: 'Sabbat',
  },
  {
    name: 'Mallet',
    population: 13630,
    sect: 'Sabbat',
  },
  {
    name: 'São Mateus do Sul',
    population: 46198,
    sect: 'Sabbat',
  },
  {
    name: 'Joaquim Távora',
    population: 11892,
    sect: 'Camarilla',
  },
  {
    name: 'Ibaiti',
    population: 31364,
    sect: 'Camarilla',
  },
  {
    name: 'Piên',
    population: 12652,
    sect: 'Anarch-Sabbat',
  },
  {
    name: 'Sapopema',
    population: 6774,
    sect: 'Sabbat',
  },
  {
    name: 'Castro',
    population: 71484,
    sect: 'Sabbat',
  },
  {
    name: 'Ribeirão Claro',
    population: 10668,
    sect: 'Sabbat',
  },
  {
    name: 'Nova Santa Bárbara',
    population: 4249,
    sect: 'Sabbat',
  },
  {
    name: 'União da Vitória',
    population: 57517,
    sect: 'Sabbat',
  },
  {
    name: 'Antonio Olinto',
    population: 7449,
    sect: 'Sabbat',
  },
  {
    name: 'Quatiguá',
    population: 7434,
    sect: 'Camarilla',
  },
  {
    name: 'São Jerônimo da Serra',
    population: 11234,
    sect: 'Sabbat',
  },
  {
    name: 'Pontal do Paraná',
    population: 27284,
    sect: 'Anarch-Sabbat',
  },
  {
    name: 'São José dos Pinhais',
    population: 323340,
    sect: 'Camarilla',
  },
  {
    name: 'Campina Grande do Sul',
    population: 43288,
    sect: 'Camarilla',
  },
];

export default territoriesSeed;
