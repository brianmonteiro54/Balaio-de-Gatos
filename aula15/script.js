/* ===== bloco 1 ===== */

// ====== BIAS vs VARIANCE INTERACTIVE ======
  const bvData = {
    ideal: {
      title: '😻 Cenário ideal: baixo viés, baixa variância',
      text: 'Todas as previsões pertinho do centro e pertinho umas das outras. O modelo é <strong>certeiro</strong> e <strong>consistente</strong>. É pra esse cenário que a gente vai. Modelo bem treinado, com dados bons, no nível certo de complexidade.',
      meow: '🐈 No abrigo: o modelo de tempo de adoção acerta a maioria dos gatos com pouco erro. Conseguimos planejar a operação.'
    },
    vies: {
      title: '😾 Só viés (alto): erra sempre pro mesmo lado',
      text: 'Os tiros são <strong>consistentes</strong> (todos juntinhos), mas <strong>longe do alvo</strong>. O modelo é simples demais (<em>underfitting</em>): não capturou a complexidade do problema. Solução: modelo mais expressivo, mais features, menos regularização.',
      meow: '🐈 No abrigo: o modelo sempre prevê que gatos demoram 2 semanas pra adotar. Na vida real, alguns demoram 2 dias, outros 4 meses. Erra sempre pra perto da média.'
    },
    variancia: {
      title: '🙀 Só variância (alta): tiros espalhados',
      text: 'Na <strong>média</strong>, o modelo acerta perto do alvo. Mas cada previsão individual sai muito instável. É um modelo complexo demais (<em>overfitting</em>): decorou o treino e não generaliza. Solução: mais dados, regularização, modelo mais simples.',
      meow: '🐈 No abrigo: pra o mesmo perfil de gato, o modelo prevê 3 dias num teste e 45 dias no outro. Você não consegue confiar na previsão individual.'
    },
    ambos: {
      title: '💀 O pior dos mundos: alto viés + alta variância',
      text: 'Os tiros estão <strong>espalhados</strong> E <strong>longe do alvo</strong>. O modelo é ruim em todos os sentidos. Provavelmente foi mal escolhido, mal treinado, com dado ruim. Volte 3 casas, recomece o projeto.',
      meow: '🐈 No abrigo: você lança esse modelo e ele recomenda gato siamês pra alguém que quer um gato calmo, e diz que o gato vai ser adotado em 1 dia (e ele fica 3 meses). Recall pra trás.'
    }
  };

  document.querySelectorAll('.target-item').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.target-item').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const k = t.dataset.bv;
      const d = bvData[k];
      document.getElementById('bv-title').textContent = d.title;
      document.getElementById('bv-text').innerHTML = d.text;
      document.getElementById('bv-meow').innerHTML = d.meow;
    });
  });

  // ====== Highlight pillars on scroll (optional micro-interaction) ======
  const pillars = document.querySelectorAll('.pillar');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
      }
    });
  }, { threshold: 0.3 });
  pillars.forEach(p => observer.observe(p));