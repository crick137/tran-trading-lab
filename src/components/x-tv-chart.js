// src/components/x-tv-chart.js
(function(){
  const TV_SRC = "https://s3.tradingview.com/tv.js";
  let tvLoadingPromise = null;
  const loadTV = ()=> {
    if (window.TradingView) return Promise.resolve();
    if (tvLoadingPromise) return tvLoadingPromise;
    tvLoadingPromise = new Promise((resolve, reject)=>{
      const s = document.createElement("script");
      s.src = TV_SRC; s.async = true;
      s.onload = resolve; s.onerror = ()=> reject(new Error("Failed to load tv.js"));
      document.head.appendChild(s);
    });
    return tvLoadingPromise;
  };

  class XTvChart extends HTMLElement{
    static get observedAttributes(){ 
      return ["symbol","interval","theme","autosize","studies","timezone","locale","hide_top_toolbar","hide_side_toolbar","ratio","min_height"];
    }
    constructor(){
      super();
      this._container = document.createElement("div");
      Object.assign(this._container.style,{width:"100%", borderRadius:"12px", overflow:"hidden"});
      this._container.id = `tv_${Math.random().toString(36).slice(2)}`;
      this.appendChild(this._container);
      this._widget = null;
      this._ro = null;
    }

    connectedCallback(){
      this._setSize();
      this._mountWidget();
      if ("ResizeObserver" in window){
        this._ro = new ResizeObserver(()=> this._setSize());
        this._ro.observe(this);
      } else {
        window.addEventListener("resize", this._setSize.bind(this));
      }
    }

    disconnectedCallback(){
      if (this._ro){ this._ro.disconnect(); this._ro=null; }
      this.innerHTML = "";
      this._widget = null;
    }

    attributeChangedCallback(){
      if (this.isConnected){
        this.disconnectedCallback();
        this._container = document.createElement("div");
        Object.assign(this._container.style,{width:"100%", borderRadius:"12px", overflow:"hidden"});
        this._container.id = `tv_${Math.random().toString(36).slice(2)}`;
        this.appendChild(this._container);
        this.connectedCallback();
      }
    }

    _getNumAttr(name, def){
      const v = this.getAttribute(name);
      return v==null ? def : Number(v);
    }

    _setSize(){
      const ratioStr = this.getAttribute("ratio") || "16:9";
      const [wRatio, hRatio] = ratioStr.split(":").map(n=>Number(n)||1);
      const minH = this._getNumAttr("min_height", 420);
      const w = this.clientWidth || this.parentElement?.clientWidth || 800;
      const h = Math.max(minH, Math.round(w * (hRatio / wRatio)));
      this._container.style.height = h + "px";
    }

    async _mountWidget(){
      await loadTV();
      if (!window.TradingView || !this._container || this._widget) return;

      const attr=(n,d)=> this.getAttribute(n) ?? d;
      const studies = (attr("studies","")).split(",").filter(Boolean);

      this._widget = new window.TradingView.widget({
        container_id: this._container.id,
        symbol: attr("symbol","FX:XAUUSD"),
        interval: attr("interval","60"),
        theme: attr("theme","dark"),
        autosize: true,
        timezone: attr("timezone","Asia/Shanghai"),
        locale: attr("locale","en"),
        hide_top_toolbar: attr("hide_top_toolbar","false")==="true",
        hide_side_toolbar: attr("hide_side_toolbar","false")==="true",
        withdateranges: true,
        allow_symbol_change: true,
        save_image: false,
        studies
      });
    }
  }
  customElements.define("x-tv-chart", XTvChart);
})();
