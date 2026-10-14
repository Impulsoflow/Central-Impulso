(() => {
  "use strict";
  const items = [
    {id:"disc",image:"./media/disc.png",name:"Perfil Comportamental DISC",category:"Comportamento",title:"Comportamento",desc:"Conheça os quatro perfis comportamentais e compreenda melhor sua comunicação e suas relações.",icon:"◈",tone:"blue",url:"https://impulsoflow.github.io/DISC/",first:"Consulte preço",repeat:"Reaplicação requer autorização",details:"O DISC permite consultar resultados anteriores com e-mail e PIN. Para repetir a avaliação, siga a verificação e a autorização previstas na própria pesquisa."},
    {id:"empatia",image:"./media/empatia.webp",name:"Impulso Empatia 360",category:"Emocional",title:"Inteligência emocional",desc:"36 questões para explorar escuta, empatia, compreensão emocional e inteligência relacional.",icon:"♡",tone:"pink",url:"https://impulsoflow.github.io/Empatia-Impulso/empatia-360.html",first:"Consulte preço",repeat:"Nova aplicação sob autorização",details:"A liberação e o valor da Empatia 360 são definidos exclusivamente no painel administrativo. Sem autorização, consulte o preço."},
    {id:"tempo",image:"./media/tempo.png",name:"Gestão do Tempo",category:"Desenvolvimento",title:"Produtividade",desc:"Descubra como você organiza prioridades e administra atividades importantes, urgentes e circunstanciais.",icon:"◷",tone:"cyan",url:"https://impulsoflow.github.io/GestaoRoger/",first:"Consulte preço",repeat:"Reaplicação sob condições",details:"A elegibilidade para realizar ou repetir a pesquisa será verificada no próprio sistema. Reaplicações podem depender de autorização administrativa."},
    {id:"forcas",image:"./media/forcas.png",name:"Forças de Caráter",category:"Desenvolvimento",title:"Psicologia positiva",desc:"Explore suas forças pessoais e reconheça recursos internos que podem apoiar sua evolução.",icon:"✦",tone:"violet",url:"https://impulsoflow.github.io/Forcas-de-Carater/",first:"Consulte preço",repeat:"Reaplicação sob condições",details:"A disponibilidade de aplicações e novas tentativas é verificada no ambiente da pesquisa, conforme as regras do Instituto Impulso."},
    {id:"bloqueios",image:"./media/bloqueios.webp",name:"Mapa de Bloqueios Emocionais",category:"Emocional",title:"Autoconhecimento",desc:"Identifique crenças limitantes e padrões emocionais que podem influenciar suas escolhas e atitudes.",icon:"✺",tone:"orange",url:"https://impulsoflow.github.io/Bloqueios40/",first:"Consulte preço",repeat:"Reaplicação sob condições",details:"O sistema da pesquisa informa as condições para uso e repetição. Não há liberação automática de novas aplicações sem validação."},
    {id:"enquete",image:"./media/enquete.svg",name:"Enquete Emocionais",category:"Emocional",title:"Autoanálise emocional",desc:"Quarenta perguntas para observar hábitos emocionais e padrões de resposta em diversas situações.",icon:"✺",tone:"cyan",url:"https://impulsoflow.github.io/Bloqueios40/enquete-emocionais/",first:"Consulte preço",repeat:"Reaplicação sob condições",details:"Consulte as condições atualizadas de participação no próprio sistema. O acesso pessoal será confirmado na origem da avaliação."},
    {id:"iga",image:"./media/iga.png",name:"Índice de Autoestima — IGA",category:"Emocional",title:"Autoestima",desc:"Reflita sobre autorrespeito, autoconfiança e a forma como você percebe seu próprio valor.",icon:"✿",tone:"green",url:"https://impulsoflow.github.io/IGA-Indice-AutoEstima/",first:"Consulte preço",repeat:"Reaplicação sob condições",details:"A pesquisa possui seu próprio fluxo de participação. Condições específicas são apresentadas no momento de iniciar uma aplicação."}
  ];
  const policyEndpoint = "https://impulso-portal-staging.impulsoflow-f91.workers.dev/api/public/pesquisas";
  const policyIds = {disc:"disc",empatia:"empatia-360",tempo:"gestao-tempo",forcas:"forcas-carater",bloqueios:"bloqueios-emocionais",enquete:"enquete-emocionais",iga:"iga-autoestima"};
  let policies = new Map(); // Sem confirmação, todas ficam bloqueadas.
  const asPrice = cents => Number.isInteger(cents)&&cents>0 ? new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(cents/100) : "Consulte preço";
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
  let scenario = "first";
  let category = "Todas";
  let query = "";
  const $ = (s) => document.querySelector(s);
  const grid = $("#research-grid");
  const modal = $("#modal");
  const descriptions = {
    account: {
      symbol: "♙",kicker:"MINHA CONTA • EM IMPLANTAÇÃO",
      title:"Uma conta para toda a sua jornada.",
      text:"Estamos integrando login único, histórico pessoal e relatórios de todas as avaliações. O portal definitivo exigirá uma senha própria e protegerá os resultados de cada participante.",
      details:"<strong>O que você já consegue fazer:</strong><ul><li>Realizar uma pesquisa pelo link oficial e conferir as condições.</li><li>Retornar ao DISC com e-mail e PIN já cadastrados.</li><li>Receber relatórios conforme a entrega de cada avaliação.</li></ul><strong>O que está em preparação:</strong> uma única senha, histórico reunido, downloads anteriores, convites 360° e status individual de autorização.",
      actions:[{label:"Acessar meu DISC",href:"https://impulsoflow.github.io/DISC/"},{label:"Ver as pesquisas",action:"close"}],
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
    const first = scenario === "first";
    const article = document.createElement("article");
    article.className = "research-card";
    article.dataset.research = item.id;
    const access = policyFor(item);
    const free = first && access.mode==="FREE";
    const status = free ? "Liberada gratuitamente" : asPrice(access.priceCents);
    article.innerHTML =
      '<div class="card-image"><img src="'+item.image+'" alt="Imagem ilustrativa da '+item.name+'" loading="lazy"/></div>'+
      '<div class="card-category">'+item.title+'</div>'+
      '<h3>'+item.name+'</h3><p>'+item.desc+'</p><div class="card-commercial '+(free?"available":"locked")+'">'+status+'</div>'+
      '<div class="card-bottom"><button type="button" class="card-link '+(free?"":"locked")+'" data-action="open">'+(free?"Acessar pesquisa →":"Consultar condições →")+'</button><button type="button" class="card-info" data-action="info" aria-label="Informações sobre '+item.name+'">ⓘ</button></div>';
    article.querySelector('[data-action="open"]').addEventListener("click",()=>{
      if (free) window.open(item.url,"_blank","noopener,noreferrer");
      else showConditions(item);
    });
    article.querySelector('[data-action="info"]').addEventListener("click",()=>showConditions(item));
    return article;
  }
  function showConditions(item){
    const policy=policyFor(item);
    const free=scenario==="first"&&policy.mode==="FREE";
    const contact="mailto:impulsoflow@gmail.com?subject="+encodeURIComponent("Condições de acesso — "+item.name);
    show({
      symbol:free?"✓":"🔒",
      kicker:free?"LIBERADA PELO ADMINISTRADOR":"CONSULTE PREÇO",
      title:item.name,
      text:free?"Esta pesquisa está liberada gratuitamente na política geral. A elegibilidade individual ainda poderá ser verificada.":"Esta pesquisa só estará disponível quando o Instituto Impulso autorizar a realização.",
      details:"<strong>Condição atual:</strong> "+(free?"Gratuita":asPrice(policy.priceCents))+"<p style='margin:8px 0 0'>O valor e a liberação são definidos pelo administrador. Não existe primeira aplicação gratuita automática.</p>",
      actions:[free?{label:"Abrir pesquisa oficial ↗",href:item.url}:{label:"Consultar condições",href:contact},{label:"Voltar ao catálogo",action:"close"}],
      note:"O catálogo consulta a política da Central de Liberações. Uma aplicação anterior não autoriza reaplicação gratuita."
    });
  }
  function render(){
    const normalized=query.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const visible=items.filter(item=>
      (category==="Todas"||item.category===category) &&
      (!normalized || (item.name+" "+item.desc+" "+item.title).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(normalized))
    );
    grid.replaceChildren(...visible.map(card));
    $("#empty").hidden=visible.length!==0;
    document.querySelectorAll(".scenario").forEach(button=>{
      const selected=button.dataset.scenario===scenario;
      button.classList.toggle("active",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
    document.querySelectorAll(".filter").forEach(button=>{
      const selected=button.dataset.category===category;
      button.classList.toggle("active",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
  }
  document.querySelectorAll("[data-dialog=account]").forEach(button=>button.addEventListener("click",()=>show(descriptions.account)));
  document.querySelectorAll(".scenario").forEach(button=>button.addEventListener("click",()=>{
    scenario=button.dataset.scenario==="again"?"again":"first";render();
  }));
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