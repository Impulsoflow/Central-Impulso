(() => {
  "use strict";
  const items = [
    {id:"disc",name:"Perfil Comportamental DISC",category:"Comportamento",title:"Comportamento",desc:"Conheça os quatro perfis comportamentais e compreenda melhor sua comunicação e suas relações.",icon:"◈",tone:"blue",url:"https://impulsoflow.github.io/DISC/",first:"Primeira aplicação disponível",repeat:"Reaplicação requer autorização",details:"O DISC permite consultar resultados anteriores com e-mail e PIN. Para repetir a avaliação, siga a verificação e a autorização previstas na própria pesquisa."},
    {id:"empatia",name:"Impulso Empatia 360",category:"Emocional",title:"Inteligência emocional",desc:"36 questões para explorar escuta, empatia, compreensão emocional e inteligência relacional.",icon:"♡",tone:"pink",url:"https://impulsoflow.github.io/Empatia-Impulso/empatia-360.html",first:"Primeira aplicação gratuita*",repeat:"Nova aplicação sob autorização",details:"A primeira aplicação elegível é gratuita. Para repetir a Empatia 360, a Central pode solicitar uma autorização ou confirmação de Pix no valor informado pela pesquisa (atualmente R$ 35)."},
    {id:"tempo",name:"Gestão do Tempo",category:"Desenvolvimento",title:"Produtividade",desc:"Descubra como você organiza prioridades e administra atividades importantes, urgentes e circunstanciais.",icon:"◷",tone:"cyan",url:"https://impulsoflow.github.io/GestaoRoger/",first:"Consultar primeira aplicação",repeat:"Reaplicação sob condições",details:"A elegibilidade para realizar ou repetir a pesquisa será verificada no próprio sistema. Reaplicações podem depender de autorização administrativa."},
    {id:"forcas",name:"Forças de Caráter",category:"Desenvolvimento",title:"Psicologia positiva",desc:"Explore suas forças pessoais e reconheça recursos internos que podem apoiar sua evolução.",icon:"✦",tone:"violet",url:"https://impulsoflow.github.io/Forcas-de-Carater/",first:"Consultar primeira aplicação",repeat:"Reaplicação sob condições",details:"A disponibilidade de aplicações e novas tentativas é verificada no ambiente da pesquisa, conforme as regras do Instituto Impulso."},
    {id:"bloqueios",name:"Mapa de Bloqueios Emocionais",category:"Emocional",title:"Autoconhecimento",desc:"Identifique crenças limitantes e padrões emocionais que podem influenciar suas escolhas e atitudes.",icon:"✺",tone:"orange",url:"https://impulsoflow.github.io/Bloqueios40/",first:"Consultar primeira aplicação",repeat:"Reaplicação sob condições",details:"O sistema da pesquisa informa as condições para uso e repetição. Não há liberação automática de novas aplicações sem validação."},
    {id:"iga",name:"Índice de Autoestima — IGA",category:"Emocional",title:"Autoestima",desc:"Reflita sobre autorrespeito, autoconfiança e a forma como você percebe seu próprio valor.",icon:"✿",tone:"green",url:"https://impulsoflow.github.io/IGA-Indice-AutoEstima/",first:"Consultar primeira aplicação",repeat:"Reaplicação sob condições",details:"A pesquisa possui seu próprio fluxo de participação. Condições específicas são apresentadas no momento de iniciar uma aplicação."}
  ];
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
    const status = first ? item.first : item.repeat;
    article.innerHTML =
      '<div class="card-top"><span class="card-icon '+item.tone+'">'+item.icon+'</span><span class="card-status '+(first?"available":"locked")+'"><i></i>'+status+'</span></div>'+
      '<div class="card-category">'+item.title+'</div>'+
      '<h3>'+item.name+'</h3><p>'+item.desc+'</p>'+
      '<div class="card-bottom"><button type="button" class="card-link '+(first?"":"locked")+'" data-action="open">'+(first?"Acessar pesquisa →":"Ver condições de acesso →")+'</button><button type="button" class="card-info" data-action="info" aria-label="Informações sobre '+item.name+'">ⓘ</button></div>';
    article.querySelector('[data-action="open"]').addEventListener("click",()=>{
      if (first) window.open(item.url,"_blank","noopener,noreferrer");
      else showConditions(item);
    });
    article.querySelector('[data-action="info"]').addEventListener("click",()=>showConditions(item));
    return article;
  }
  function showConditions(item){
    const first=scenario==="first";
    show({
      symbol:first?"✓":"🔒",
      kicker:first?"VERIFICAÇÃO DE ELEGIBILIDADE":"ACESSO A NOVA APLICAÇÃO",
      title:item.name,
      text:first ? "Você pode consultar o acesso à primeira aplicação. Sua elegibilidade será validada no próprio sistema da pesquisa." :
       "Novas aplicações não são liberadas somente por conhecer o link. A pesquisa poderá exigir autorização do Instituto Impulso ou pagamento confirmado.",
      details:"<strong>Condições desta pesquisa:</strong><p style='margin:8px 0 0'>"+item.details+"</p>",
      actions:[{label:first?"Abrir pesquisa oficial ↗":"Verificar acesso na pesquisa ↗",href:item.url},{label:"Voltar ao catálogo",action:"close"}],
      note:"O sinal verde identifica uma opção de primeiro acesso, não uma garantia individual de liberação. Preços e condições definitivos são informados no fluxo oficial de cada pesquisa."
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
})();