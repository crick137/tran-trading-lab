// src/components/x-tv-chart.js
(function(){
  const TV_SRC = 'https://s3.tradingview.com/tv.js';
  let tvLoadingPromise = null;
  function loadTV(){
    if (window.TradingView) return Promise.resolve();
    if (tvLoadingPromise) return tvLoadingPromise;
    tvLoadingPromise = new Promise((resolve, reject)=>{
      const s = document.createElement('script');
      s.src = TV_SRC; s.async = true;
      s.onload = ()=> resolve();
      s.onerror = ()=> reject(new Error('Failed to load tv.js'));
      document.head.appendChild(s);
    });
    return tvLoadingPromise;
  }

  class XTvChart extends HTMLElement{
    static get observedAttributes(){ return ['symbol','interval','theme','autosize','studies','timezone','locale','hide_top_toolbar','hide_side_toolbar']; }
    constructor(){
      super();
      this._container = document.createElement('div');
      this._container.style.minHeight = '420px';
      this._container.style.width = '100%';
      this._container.style.borderRadius = '12px';
      this._container.style.overflow = 'hidden';
      this._container.id = `tv_${Math.random().toString(36).slice(2)}`;
      this.appendChild(this._container);
      this._widget = null; this._resizeObserver = null;
    }
    connectedCallback(){
      const tryInit = ()=> this._mountWidget().catch(()=> setTimeout(()=> this._mountWidget(), 300));
      tryInit();
      if ('ResizeObserver' in window){
        this._resizeObserver = new ResizeObserver(()=>{ /* iframe会自*_
