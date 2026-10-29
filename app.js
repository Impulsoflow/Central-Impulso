(() => {
  "use strict";
  const clientPortal = 'https://impulso-portal-staging.impulsoflow-f91.workers.dev/minha-conta';
  const rodaLink = clientPortal + '/roda-da-vida';
  const items = [
    {id:'roda-vida',image:'./media/roda-vida.svg',name:'Roda da Vida',category:'Desenvolvimento',title:'Autoconhecimento',desc:'Uma avaliação de entrada com 12 dimensões da vida, gráfico e relatório personalizado em PDF.',icon:'✦',tone:'green',url:rodaLink},
    {id:"disc",image:"./media/disc.png",name:"Perfil Comportamental DISC",category:"Comportamento",title:"Comportamento",desc:"Conheça os quatro perfis comportamentais e compreenda melhor sua comunicação e suas relações.",icon:"◈",tone:"blue",url:"https://impulsoflow.github.io/DISC/"},
    {id:"empatia",image:"./media/empatia.webp",name:"Impulso Empatia 360",category:"Emocional",title:"Inteligência emocional",desc:"36 questões para explorar escuta, empatia, compreensão emocional e inteligência relacional.",icon:"♡",tone:"pink",url:"https://impulsoflow.github.io/Empatia-Impulso/empatia-360.html"},
    {id:"tempo",image:"./media/tempo.png",name:"Gestão no Tempo",category:"Desenvolvimento",title:"Produtividade",desc:"Descubra como você organiza prioridades e administra atividades importantes, urgentes e circunstanciais.",icon:"◷",tone:"cyan",url:"https://impulsoflow.github.io/GestaoNoTempo/"},
    {id:"forcas",image:"./media/forcas.png",name:"Forças de Caráter",category:"Desenvolvimento",title:"Psicologia positiva",desc:"Explore suas forças pessoais e reconheça recursos internos que podem apoiar sua evolução.",icon:"✦",tone:"violet",url:"https://impulsoflow.github.io/Forcas-de-Carater/"},
    {id:"missao",image:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=82",name:"MISSÃO — Significado e Propósito",category:"Desenvolvimento",title:"Propósito de vida · PERMA-V",desc:"Dez reflexões autorais para observar sua clareza de significado, a exploração do propósito e próximos passos para viver com direção.",icon:"✧",tone:"blue",url:"https://impulsoflow.github.io/Missao/"},
    {id:"bloqueios",image:"./media/bloqueios.webp",name:"Mapa de Bloqueios Emocionais",category:"Emocional",title:"Autoconhecimento",desc:"Identifique crenças limitantes e padrões emocionais que podem influenciar suas escolhas e atitudes.",icon:"✺",tone:"orange",url:"https://impulsoflow.github.io/Bloqueios40/"},
    {id:"enquete",image:"./media/enquete.svg",name:"Enquete Emocionais",category:"Emocional",title:"Autoanálise emocional",desc:"Quarenta perguntas para observar hábitos emocionais e padrões de resposta em diversas situações.",icon:"✺",tone:"cyan",url:"https://impulsoflow.github.io/Bloqueios40/enquete-emocionais/"},
    {id:"iga",image:"./media/iga.png",name:"Índice de Autoestima — IGA",category:"Emocional",title:"Autoestima",desc:"Reflita sobre autorrespeito, autoconfiança e a forma como você percebe seu próprio valor.",icon:"✿",tone:"green",url:"https://impulsoflow.github.io/IGA-Indice-AutoEstima/"}
  ];
  const policyEndpoint = "https://impulso-portal-staging.impulsoflow-f91.workers.dev/api/public/pesquisas";
  const policyIds = {"roda-vida":"roda-vida",disc:"disc",empatia:"empatia-360",tempo:"gestao-tempo",forcas:"forcas-carater",missao:"missao-proposito",bloqueios:"bloqueios-emocionais",enquete:"enquete-emocionais",iga:"iga-autoestima"};
  let policies = new Map(); // Sem confirmação, todas ficam bloqueadas.
  const policyFor = item => policies.get(policyIds[item.id]) || {mode:"BLOCKED",priceCents:null};
  async function refreshPolicies(){
    try{
      const response=await fetch(policyEndpoint,{cache:"no-store"});
      if(!response.ok)throw Error("Consulta indisponível");
      const data=await response.json();
      if(!data.ok||!Array.isArray(data.items))throw Error("Dados inválidos");
      policies=new Map(data.items.map(item=>[item.researchId,item]));
    }catch{policies=new Map();}
    render();
  }
  let category = "Todas";
  let query = "";
  const $ = (s) => document.querySelector(s);
  const grid = $("#research-grid");
  const modal = $("#modal");
  const descriptions = {
    account: {
      symbol: "♙",kicker:"MINHA CONTA IMPULSO",
      title:"Uma conta para toda a sua jornada.",
      text:"Acesse sua conta com e-mail confirmado para realizar a Roda da Vida e consultar relatórios disponíveis.",
      details:"<strong>Na sua área pessoal:</strong><ul><li>Entrar ou ativar sua conta protegida.</li><li>Fazer gratuitamente a Roda da Vida quando liberada.</li><li>Visualizar e baixar relatórios disponíveis.</li><li>Acompanhar avaliações e solicitar outras pesquisas.</li></ul>",
      actions:[{label:"Entrar na minha conta",href:clientPortal},{label:"Ver as pesquisas",action:"close"}],
      note:"Seu histórico não é público. Não informe sua senha ou PIN em mensagens ou formulários fora da pesquisa oficial."
    }
  };
  function close() { if(modal.open) modal.close(); }
  function show(info) {
    $("#modal-symbol").textContent = info.symbol || "✦";
    $("#modal-kicker").textContent = info.kicker || "INSTITUTO IMPULSO";
    $("#modal-title").textContent = info.title;
    $("#modal-text").textContent = info.text;
    $("#modal-details").innerHTML = info.details || "";
    $("#modal-note").textContent = info.note || "";
    const bar = $("#modal-actions");
    bar.replaceChildren();
    for(const action of info.actions || []){
      const el = action.href ? document.createElement("a") : document.createElement("button");
      el.textContent = action.label;
      if(action.href) {
        el.href = action.href;
        el.target = "_blank";
        el.rel = "noopener noreferrer";
        el.addEventListener("click",()=>close());
      }else{ el.type = "button";el.addEventListener("click",close); }
      bar.appendChild(el);
    }
    modal.showModal();
  }
  function card(item){
    const article=document.createElement("article");
    article.className="research-card"+(item.id==="roda-vida"?" featured-research-card":"")+(item.id==="missao"?" mission-highlight":"");
    article.dataset.research=item.id;
    const free=item.id==="roda-vida" && policyFor(item).mode==="FREE";
    const missionDemo=item.id==="missao";
    article.innerHTML='<div class="card-image"><img src="'+item.image+'" alt="Imagem ilustrativa da '+item.name+'" loading="lazy"/></div>'+
      '<div class="card-category">'+item.title+'</div>'+
      '<h3>'+item.name+'</h3><p>'+item.desc+'</p>'+
      (free?'<div class="public-free-label">Gratuita com cadastro</div>':missionDemo?'<div class="mission-demo-label">MISSÃO EM DESTAQUE · DEMONSTRAÇÃO PÚBLICA</div>':'')+
      '<div class="card-bottom"><button type="button" class="card-link" data-action="open">'+(free?'Começar avaliação gratuita':missionDemo?'Experimentar MISSÃO agora':item.id==='roda-vida'?'Consultar disponibilidade':'Consultar acesso e planos')+' <span aria-hidden="true">→</span></button></div>';
    article.querySelector('[data-action="open"]').addEventListener("click",()=>{if(free)window.location.assign(rodaLink);else if(missionDemo)window.open(item.url,"_blank","noopener,noreferrer");else showConditions(item);});
    return article;
  }
  function showConditions(item){
    const contact=clientPortal+"/ajuda?categoria=ACESSO_PESQUISA&pesquisa="+encodeURIComponent(policyIds[item.id]||item.id);
    if(item.id==='roda-vida'){
      show({symbol:'◷',kicker:'DISPONIBILIDADE',title:'Roda da Vida',text:'Estamos consultando a disponibilidade desta avaliação. Tente novamente daqui a pouco.',details:'',actions:[{label:'Entrar na minha conta',href:clientPortal},{label:'Voltar',action:'close'}],note:'Acesso mediante conta Impulso verificada.'});return;
    }
    show({
      symbol:"✦",kicker:"SUA PRÓXIMA DESCOBERTA",title:item.name,
      text:"Interessou-se por esta avaliação? Nossa equipe ajudará você a dar o próximo passo.",
      details:"<strong>Sobre a avaliação</strong><p style='margin:8px 0 0'>"+item.desc+"</p>",
      actions:[{label:"Solicitar acesso na Central de Ajuda ↗",href:contact},{label:"Voltar às pesquisas",action:"close"}],
      note:"Uma avaliação só poderá ser iniciada após autenticação e autorização de acesso."
    });
  }
  function render(){
    const normalized=query.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const visible=items.filter(item=>
      (category==="Todas"||item.category===category) &&
      (!normalized || (item.name+" "+item.desc+" "+item.title).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(normalized))
    );
    visible.sort((a,b)=>Number(b.id==="missao")-Number(a.id==="missao"));
    grid.replaceChildren(...visible.map(card));
    $("#empty").hidden=visible.length!==0;
    document.querySelectorAll(".filter").forEach(button=>{
      const selected=button.dataset.category===category;
      button.classList.toggle("active",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
  }
  document.querySelectorAll("[data-dialog=account]").forEach(button=>button.addEventListener("click",()=>show(descriptions.account)));
  document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
    category=button.dataset.category || "Todas";render();
  }));
  $("#search").addEventListener("input",(e)=>{query=e.currentTarget.value;render()});
  modal.addEventListener("click",(e)=>{if(e.target===modal)close()});
  render();
  void refreshPolicies();
  window.addEventListener("focus",()=>void refreshPolicies());
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")void refreshPolicies();});
})();