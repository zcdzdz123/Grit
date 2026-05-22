/* Grit i18n 엔진 — 모든 페이지가 공유. 빌드 없음, ES5 호환.
 * 사용법:
 *   GritI18n.register({ ko:{key:"값"}, en:{...}, ja:{...}, zh:{...} });
 *   GritI18n.init({ mount: document.getElementById("langMount"), onChange: fn });
 * 마크업:
 *   <span data-i18n="key">기본값</span>        textContent 교체
 *   <p data-i18n-html="key">…</p>               innerHTML 교체 (<b>,<br>,<code>,<kbd>)
 *   <label data-i18n-title="key">                title 속성 교체
 *   <input data-i18n-ph="key">                   placeholder 속성 교체
 *   문서 제목은 register에 docTitle 키가 있으면 자동 반영
 *   JS 안의 동적 문자열은 GritI18n.t("key") 로 가져옴
 */
(function(){
  "use strict";
  var STORE="gritLang";
  var LANGS=[
    {code:"ko",label:"한국어",short:"KO"},
    {code:"en",label:"English",short:"EN"},
    {code:"ja",label:"日本語",short:"JA"},
    {code:"zh",label:"中文",short:"ZH"},
    {code:"es",label:"Español",short:"ES"},
    {code:"fr",label:"Français",short:"FR"},
    {code:"de",label:"Deutsch",short:"DE"},
    {code:"pt",label:"Português",short:"PT"},
    {code:"ru",label:"Русский",short:"RU"}
  ];
  var dict={}, current="en", changeCb=null, menuEl=null, btnEl=null;
  var inlineMode=false, inlineWrap=null;

  function each(sel,fn){ var n=document.querySelectorAll(sel); for(var i=0;i<n.length;i++) fn(n[i]); }
  function supported(c){ for(var i=0;i<LANGS.length;i++) if(LANGS[i].code===c) return true; return false; }

  function register(d){
    for(var i=0;i<LANGS.length;i++){
      var c=LANGS[i].code; if(!d[c]) continue;
      if(!dict[c]) dict[c]={};
      for(var k in d[c]) if(d[c].hasOwnProperty(k)) dict[c][k]=d[c][k];
    }
  }
  function t(key){
    var c=dict[current]||{}; if(c[key]!=null) return c[key];
    var e=dict.en||{}; if(e[key]!=null) return e[key];
    var k=dict.ko||{}; return k[key]!=null?k[key]:key;
  }
  function dictHas(key){
    for(var i=0;i<LANGS.length;i++){ var c=dict[LANGS[i].code]; if(c&&c[key]!=null) return true; }
    return false;
  }
  function detect(){
    /* 저장된 사용자 선택만 따른다. 선택이 없으면(첫 방문·검색봇 등) 한국어로 고정 —
     * 정적 HTML/canonical/og:locale(ko_KR)과 렌더링 언어를 일치시켜 색인 신호를 일관되게 한다.
     * 단일 URL이라 navigator 언어로 자동 전환하면 봇이 보는 언어가 ko와 어긋난다. */
    var s=null; try{ s=localStorage.getItem(STORE); }catch(e){}
    if(s&&supported(s)) return s;
    return "ko";
  }

  function apply(){
    document.documentElement.lang=current;
    each("[data-i18n]",      function(el){ el.textContent=t(el.getAttribute("data-i18n")); });
    each("[data-i18n-html]", function(el){ el.innerHTML  =t(el.getAttribute("data-i18n-html")); });
    each("[data-i18n-title]",function(el){ el.setAttribute("title",      t(el.getAttribute("data-i18n-title"))); });
    each("[data-i18n-ph]",   function(el){ el.setAttribute("placeholder",t(el.getAttribute("data-i18n-ph"))); });
    if(dictHas("docTitle")) document.title=t("docTitle");
    syncSwitcher();
    if(changeCb) changeCb(current);
  }
  function setLang(c){ if(!supported(c)) return; current=c; try{ localStorage.setItem(STORE,c); }catch(e){} apply(); }

  /* ---- 언어 선택기 ---- */
  function injectCSS(){
    if(document.getElementById("grit-lang-css")) return;
    var s=document.createElement("style"); s.id="grit-lang-css";
    /* 색상은 CSS 변수로 — 페이지가 --lang-* 를 정의하면 테마에 맞춰짐. 기본값은 다크 테마. */
    s.textContent=
      ".lang-switch{position:relative;font-family:'IBM Plex Mono',monospace;}"+
      ".lang-btn{display:flex;align-items:center;gap:6px;background:transparent;border:1px solid var(--lang-border,#383838);color:var(--lang-fg,#999);font:inherit;font-size:11px;line-height:1;padding:5px 9px;border-radius:3px;cursor:pointer;transition:border-color .2s,color .2s;}"+
      ".lang-btn:hover{border-color:var(--lang-accent,#e8a020);color:var(--lang-accent,#e8a020);}"+
      ".lang-btn .caret{font-size:9px;opacity:.7;}"+
      ".lang-menu{position:absolute;top:calc(100% + 6px);right:0;min-width:124px;background:var(--lang-menu-bg,#181819);border:1px solid var(--lang-border,#383838);border-radius:4px;padding:4px;display:none;flex-direction:column;z-index:300;box-shadow:0 6px 20px rgba(0,0,0,.4);}"+
      ".lang-menu.open{display:flex;}"+
      ".lang-opt{text-align:left;background:transparent;border:none;color:var(--lang-opt-fg,#bbb);font:inherit;font-size:12px;padding:6px 10px;border-radius:3px;cursor:pointer;}"+
      ".lang-opt:hover{background:var(--lang-opt-hover,#2a2a2c);color:var(--lang-opt-hover-fg,#fff);}"+
      ".lang-opt.active{color:var(--lang-accent,#e8a020);}"+
      /* 인라인(버튼 나열) 변형 — 메인 허브용 */
      ".lang-inline{display:flex;flex-wrap:wrap;gap:6px;}"+
      ".lang-ib{background:transparent;border:1px solid var(--lang-border,#383838);color:var(--lang-fg,#999);font:inherit;font-size:11px;line-height:1;padding:6px 12px;border-radius:9999px;cursor:pointer;transition:border-color .2s,color .2s;}"+
      ".lang-ib:hover{border-color:var(--lang-accent,#e8a020);color:var(--lang-accent,#e8a020);}"+
      ".lang-ib.active{border-color:var(--lang-accent,#e8a020);color:var(--lang-accent,#e8a020);}";
    document.head.appendChild(s);
  }
  function mount(container){
    if(!container) return;
    injectCSS();
    if(inlineMode){
      var iwrap=document.createElement("div"); iwrap.className="lang-switch lang-inline";
      for(var n=0;n<LANGS.length;n++){ (function(L){
        var o=document.createElement("button"); o.type="button"; o.className="lang-ib";
        o.setAttribute("data-code",L.code); o.textContent=L.label;
        o.addEventListener("click",function(){ setLang(L.code); });
        iwrap.appendChild(o);
      })(LANGS[n]); }
      inlineWrap=iwrap; container.appendChild(iwrap);
      syncSwitcher();
      return;
    }
    var wrap=document.createElement("div"); wrap.className="lang-switch";
    btnEl=document.createElement("button"); btnEl.type="button"; btnEl.className="lang-btn";
    btnEl.innerHTML="<span>🌐</span><span class='lang-cur'></span><span class='caret'>▾</span>";
    menuEl=document.createElement("div"); menuEl.className="lang-menu";
    for(var i=0;i<LANGS.length;i++){ (function(L){
      var o=document.createElement("button"); o.type="button"; o.className="lang-opt";
      o.setAttribute("data-code",L.code); o.textContent=L.label;
      o.addEventListener("click",function(e){ e.stopPropagation(); setLang(L.code); closeMenu(); });
      menuEl.appendChild(o);
    })(LANGS[i]); }
    btnEl.addEventListener("click",function(e){ e.stopPropagation(); menuEl.classList.toggle("open"); });
    document.addEventListener("click",closeMenu);
    wrap.appendChild(btnEl); wrap.appendChild(menuEl); container.appendChild(wrap);
    syncSwitcher();
  }
  function closeMenu(){ if(menuEl) menuEl.classList.remove("open"); }
  function syncSwitcher(){
    if(btnEl){
      var cur=btnEl.querySelector(".lang-cur");
      for(var i=0;i<LANGS.length;i++) if(LANGS[i].code===current&&cur) cur.textContent=LANGS[i].short;
    }
    if(menuEl){
      var opts=menuEl.querySelectorAll(".lang-opt");
      for(var j=0;j<opts.length;j++){
        if(opts[j].getAttribute("data-code")===current) opts[j].classList.add("active");
        else opts[j].classList.remove("active");
      }
    }
    if(inlineWrap){
      var ibs=inlineWrap.querySelectorAll(".lang-ib");
      for(var k=0;k<ibs.length;k++){
        if(ibs[k].getAttribute("data-code")===current) ibs[k].classList.add("active");
        else ibs[k].classList.remove("active");
      }
    }
  }

  function init(opts){
    opts=opts||{};
    if(opts.onChange) changeCb=opts.onChange;
    if(opts.inline) inlineMode=true;
    current=detect();
    if(opts.mount) mount(opts.mount);
    apply();
  }

  window.GritI18n={ register:register, t:t, init:init, setLang:setLang, langs:LANGS, current:function(){ return current; } };
})();
