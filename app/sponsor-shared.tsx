'use client';

import {useEffect,useState} from 'react';
import {DEFAULT_SPONSOR_INPUT,SPONSOR_STORAGE_KEY,readSponsorScenarios,type SponsorInput,type SponsorScenario} from '../lib/sponsorship';

export const mxn=(v:number)=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:2}).format(v);
export const qty=(v:number)=>new Intl.NumberFormat('es-MX',{maximumFractionDigits:2}).format(v);

export function SponsorHeader({current}:{current:'pricing'|'about'}) {
  return <header className="sponsor-nav"><a className="brand" href="/">puente<span className="brand-dot">.</span></a><nav aria-label="Principal"><a href="/#calculadora">Tu cálculo gratuito</a><a href="/pricing" aria-current={current==='pricing'?'page':undefined}>Patrocinar acceso</a><a href="/about" aria-current={current==='about'?'page':undefined}>Nuestro método</a></nav></header>;
}
export function SponsorFooter() {
  return <footer className="sponsor-footer"><span>PUENTE · Prototipo con datos ficticios</span><a href="/#calculadora">El patrocinio no cambia tu resultado. Ir al cálculo gratuito →</a></footer>;
}
export function useSavedSponsorScenario() {
  const [input,setInput]=useState<SponsorInput>({...DEFAULT_SPONSOR_INPUT});
  const [scenarios,setScenarios]=useState<SponsorScenario[]>([]);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [name,setName]=useState('Piloto ficticio A');
  const [loaded,setLoaded]=useState(false);
  const [storageError,setStorageError]=useState('');
  useEffect(()=>{
    try {
      const rows=readSponsorScenarios(localStorage.getItem(SPONSOR_STORAGE_KEY));
      setScenarios(rows);
      const id=new URLSearchParams(window.location.search).get('scenario');
      if(id){
        const row=rows.find(s=>s.id===id);
        if(!row) throw new Error('Ese escenario no está en este navegador. Abre la página sin el enlace guardado para usar el ejemplo.');
        setInput(row.input);setSelectedId(row.id);setName(row.name);
      }
    } catch(e) {setStorageError(e instanceof Error?e.message:'No pudimos abrir el almacenamiento local.');}
    setLoaded(true);
  },[]);
  return {input,setInput,scenarios,setScenarios,selectedId,setSelectedId,name,setName,loaded,storageError,setStorageError};
}
