'use client';

import {useState} from 'react';
import {SPONSOR_FIELDS,SPONSOR_PLANS,SPONSOR_STORAGE_KEY,MAX_SCENARIOS,calculateSponsorship,planInput,readSponsorScenarios,writeSponsorScenarios,sponsorshipExport,type SponsorField,type SponsorInput,type SponsorScenario} from '../../lib/sponsorship';
import {SponsorHeader,SponsorFooter,useSavedSponsorScenario,mxn,qty} from '../sponsor-shared';

const groups:{title:string;intro:string;fields:SponsorField[]}[]=[
  {title:'01 / Grupo y duración',intro:'Un contrato financia este grupo durante este período. La cuenta del trabajador sigue siendo de 14 días.',fields:['participants','months']},
  {title:'02 / Lo que cuesta prestarlo',intro:'Todos son supuestos editables. Incluye el trabajo humano, aunque hoy lo realice el fundador.',fields:['setupHours','onboardingHours','supportHoursMonthly','evaluationHours','acquisitionHours','hourlyCost','infrastructureMonthly','marginPct','offeredQuote']},
  {title:'03 / Patrocinadores y capacidad',intro:'Una expectativa no es un acuerdo firmado. Un acuerdo tampoco es dinero recibido.',fields:['prospects','conversionPct','signedAgreements','cashReceived','capacity']},
  {title:'04 / Comparación con el proceso actual',intro:'Misma tarea, grupo, período y calidad. La hoja de cálculo con apoyo sigue siendo una alternativa.',fields:['baselineCost','buyerHours','workerHours','workerHourlyCost']},
];

export default function Pricing() {
  const s=useSavedSponsorScenario();
  const [notice,setNotice]=useState('');
  const [dirty,setDirty]=useState(false);
  const [confirmDelete,setConfirmDelete]=useState<string|null>(null);
  const r=calculateSponsorship(s.input);
  const errors=r.errors;
  function update(key:SponsorField,raw:string){s.setInput(i=>({...i,[key]:raw.trim()===''?NaN:Number(raw)}));setDirty(true);setNotice('');}
  function choosePlan(id:string){s.setInput(planInput(id));s.setSelectedId(null);s.setName(id==='program'?'Programa ficticio':'Piloto ficticio');setDirty(true);setNotice('Ejemplo cargado. Los costos no están medidos y no hay patrocinio confirmado.');}
  function save(asCopy=false){
    if(!r.ok){setNotice('Corrige los campos marcados antes de guardar.');return;}
    if(!s.name.trim()||s.name.trim().length>40){setNotice('Escribe un nombre ficticio de 1 a 40 caracteres.');return;}
    try {
      const rows=readSponsorScenarios(localStorage.getItem(SPONSOR_STORAGE_KEY));
      const id=!asCopy&&s.selectedId?s.selectedId:crypto.randomUUID();
      if(!rows.some(row=>row.id===id)&&rows.length>=MAX_SCENARIOS){setNotice('Hay 8 escenarios guardados. Elimina uno o actualiza uno existente.');return;}
      const row:SponsorScenario={id,name:s.name.trim(),savedAt:new Date().toISOString(),input:s.input};
      const next=rows.some(v=>v.id===id)?rows.map(v=>v.id===id?row:v):[...rows,row];
      localStorage.setItem(SPONSOR_STORAGE_KEY,writeSponsorScenarios(next));
      s.setScenarios(next);s.setSelectedId(id);s.setStorageError('');setDirty(false);
      setNotice('Escenario guardado solo en este navegador, dispositivo y dirección. Sin cuenta ni sincronización.');
    }catch {setNotice('No pudimos guardar. Conserva tus cambios descargando el escenario; no se confirmó ningún guardado.');}
  }
  function open(row:SponsorScenario){s.setInput({...row.input});s.setName(row.name);s.setSelectedId(row.id);setDirty(false);setConfirmDelete(null);setNotice(`Abrimos ${row.name}. Puedes editar y recalcular.`);}
  function remove(id:string){
    try {
      const next=readSponsorScenarios(localStorage.getItem(SPONSOR_STORAGE_KEY)).filter(v=>v.id!==id);
      localStorage.setItem(SPONSOR_STORAGE_KEY,writeSponsorScenarios(next));s.setScenarios(next);setConfirmDelete(null);
      if(s.selectedId===id){s.setSelectedId(null);setDirty(true);}
      setNotice('Se eliminó únicamente ese escenario ficticio de este navegador.');
    }catch {setNotice('No pudimos eliminar ese escenario. No confirmamos cambios.');}
  }
  function download(){
    if(!r.ok)return;
    const blob=new Blob([JSON.stringify(sponsorshipExport(s.input),null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='PUENTE_escenario_patrocinado_ficticio.json';a.click();URL.revokeObjectURL(url);
  }
  const memo=s.selectedId&&!dirty?`/about?scenario=${encodeURIComponent(s.selectedId)}`:null;
  return <div className="sponsor-shell"><SponsorHeader current="pricing"/><main>
    <section className="sponsor-hero"><span className="sponsor-kicker">ACCESO PATROCINADO / DECISIONES INDEPENDIENTES</span><h1>El apoyo se financia.<br/><span>Tu decisión es tuya.</span></h1><p>El trabajador usa PUENTE gratis. Una organización puede financiar un grupo, un período y un apoyo definidos. El patrocinio nunca compra un resultado favorable.</p><a className="button primary" href="#simulador">Explorar un presupuesto <span aria-hidden="true">↘</span></a></section>
    <section className="sponsor-offers" aria-label="Opciones de acceso">
      <article className="sponsor-offer"><span className="sponsor-kicker">PARA TRABAJADORES</span><h2>Tu cálculo, gratuito.</h2><p>Explora la cuenta, las advertencias y tu siguiente paso. Puedes rechazar cualquier opción.</p><strong className="offer-price">$0 <small>MXN para la persona</small></strong><a href="/#calculadora">Ir al cálculo gratuito →</a></article>
      {SPONSOR_PLANS.map(p=><article className={`sponsor-offer ${p.id==='pilot'?'featured':''}`} key={p.id}><span className="sponsor-kicker">PARA PATROCINADORES</span><h2>{p.name}</h2><p>{p.description}</p><strong className="offer-price">Según alcance</strong><span className="offer-scope">Ejemplo: {p.participants} personas · {p.months} {p.months===1?'mes':'meses'}</span><button onClick={()=>{choosePlan(p.id);document.getElementById('simulador')?.scrollIntoView({behavior:'smooth'});}}>Cotizar este ejemplo →</button></article>)}
    </section>
    <div className="sponsor-boundary"><strong>Prototipo · datos ficticios · sin cobros</strong><p>Los paquetes y costos son hipótesis. No hay patrocinador comprometido ni resultados de empleo demostrados. No introduzcas nombres ni cifras financieras reales.</p></div>
    <section id="simulador" className="sponsor-calculator"><div className="sponsor-section-title"><span className="sponsor-kicker">DEL ALCANCE AL PRECIO</span><h2>Una cotización que<br/>puedes desarmar.</h2><p>Edita los supuestos. El precio se calcula desde los costos completos y un margen visible, sin una tarifa arbitraria por persona.</p></div>
    <div className="sponsor-workspace"><div className="sponsor-inputs">
      {groups.map((g,i)=><details key={g.title} open={i<2} className="sponsor-group"><summary>{g.title}</summary><p>{g.intro}</p><div className="sponsor-fields">{g.fields.map(key=>{const f=SPONSOR_FIELDS.find(f=>f.key===key)!;return <label key={key} htmlFor={`sponsor-${key}`}><span className="field-name">{f.label}</span><span className="field-unit">{f.unit}</span><input id={`sponsor-${key}`} type="number" min={f.min} max={f.max} step={f.integer?1:'any'} value={Number.isFinite(s.input[key])?s.input[key]:''} onChange={e=>update(key,e.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={`${key}-help${errors[key]?` ${key}-error`:''}`}/><small id={`${key}-help`}>{f.hint??`Entre ${f.min} y ${f.max} ${f.unit}.`}</small>{errors[key]&&<small id={`${key}-error`} className="sponsor-error">{errors[key]}</small>}</label>;})}</div></details>)}
    </div>
    <aside className="sponsor-result" aria-label="Resultado del escenario">
      <span className="sponsor-kicker">ESTIMACIÓN / NO ES UN ACUERDO</span><h2>Cotización por contrato</h2>
      {!r.ok?<div role="alert" className="sponsor-warning"><strong>Faltan datos válidos.</strong><p>Corrige los campos marcados. No mostramos un precio ni una comparación aparentemente válidos.</p></div>:<>
      <strong className="quote-total" data-testid="quote-total">{mxn(r.quote)}</strong><p className="quote-period">Por {s.input.participants} personas durante {s.input.months} {s.input.months===1?'mes':'meses'}. El trabajador paga $0.</p>
      <dl className="sponsor-totals"><div><dt>Trabajo del equipo ({qty(r.staffHours)} h)</dt><dd>{mxn(r.laborCost)}</dd></div><div><dt>Infraestructura del período</dt><dd>{mxn(r.infrastructureCost)}</dd></div><div><dt>Costo completo de entrega</dt><dd>{mxn(r.deliveryCost)}</dd></div><div><dt>Cotización por margen objetivo</dt><dd>{mxn(r.costDerivedQuote)}</dd></div><div><dt>Contribución antes de otros gastos e impuestos</dt><dd>{mxn(r.contribution)}</dd></div></dl>
      <p className="sponsor-formula">Precio por costos = {mxn(r.deliveryCost)} ÷ (1 − {qty(s.input.marginPct)}%). {s.input.offeredQuote>0?'Usas un precio alternativo; compara su contribución.':'No es un incremento porcentual sobre el costo.'}</p>
      {r.contribution<0&&<p className="sponsor-warning">La oferta no cubre los costos de entrega del ejemplo.</p>}
      <details className="sponsor-result-details" open><summary>Expectativa, acuerdos y dinero</summary><dl className="sponsor-totals"><div><dt>Acuerdos esperados (pueden ser fraccionarios)</dt><dd>{qty(r.expectedAgreements)}</dd></div><div><dt>Valor de contratos esperado</dt><dd>{mxn(r.expectedContractValue)}</dd></div><div><dt>Equivalente mensual supuesto</dt><dd>{mxn(r.monthlyEquivalent)}</dd></div><div><dt>Ritmo anual supuesto</dt><dd>{mxn(r.annualEquivalent)}</dd></div><div><dt>Acuerdos firmados del ejemplo</dt><dd>{s.input.signedAgreements}</dd></div><div><dt>Valor de esos acuerdos</dt><dd>{mxn(r.signedContractValue)}</dd></div><div><dt>Dinero recibido del ejemplo</dt><dd>{mxn(s.input.cashReceived)}</dd></div><div><dt>Personas con acuerdos, dentro de capacidad</dt><dd>{qty(r.deliverableSignedParticipants)}</dd></div></dl><p>Equivalentes si se repiten contratos al mismo ritmo. No son ingreso contable, caja ni renovación garantizada. Todos los acuerdos y cobros introducidos aquí son ficticios.</p></details>
      {(r.expectedCapacityShortfall>0||r.signedCapacityShortfall>0)&&<p role="status" className="sponsor-warning">Capacidad insuficiente: faltarían {qty(r.expectedCapacityShortfall)} plazas en la expectativa y {qty(r.signedCapacityShortfall)} en los acuerdos del ejemplo. No prometas ese alcance.</p>}
      <div className="sponsor-ratio"><strong>{r.ratio===null?'Sin razón calculable':`${qty(r.ratio)}:1`}</strong><p>{r.passesTen?'El escenario alcanza 10:1 en aritmética, con supuestos aún sin medir.':'El escenario no demuestra 10:1.'} El acceso gratuito no elimina el costo del servicio.</p></div>
      <p className="sponsor-fine">Importes base en MXN, sin cálculo fiscal. Cotización, impuestos aplicables y plazos de pago requieren revisión humana. No se cobra desde esta página.</p>
      </>}
    </aside></div></section>
    <section className="sponsor-storage" aria-labelledby="scenarios-title"><span className="sponsor-kicker">COMPARA SIN PERDER TUS SUPUESTOS</span><h2 id="scenarios-title">Tus escenarios ficticios.</h2><p>Solo se guardan en este navegador, dispositivo y dirección. Sin cuenta, sincronización ni datos de participantes. Puedes guardar hasta 8.</p>
      {s.storageError&&<p role="alert" className="sponsor-warning">No pudimos recuperar los escenarios: {s.storageError} No sobrescribimos el contenido local. Puedes descargar el ejemplo que estás viendo.</p>}
      <label className="scenario-name" htmlFor="scenario-name">Nombre del escenario ficticio<input id="scenario-name" maxLength={40} value={s.name} onChange={e=>{s.setName(e.target.value);setDirty(true);}} placeholder="Ejemplo: Piloto ficticio A"/></label>
      <div className="sponsor-actions"><button disabled={!s.loaded||!r.ok} className="button primary" onClick={()=>save()}>{s.selectedId?'Actualizar escenario':'Guardar escenario'}</button><button disabled={!s.loaded||!r.ok} onClick={()=>save(true)}>Guardar copia</button><button disabled={!r.ok} onClick={download}>Descargar supuestos</button>{memo?<a className="memo-link" href={memo}>Ver memo de este escenario →</a>:<span className="sponsor-fine">Guarda los cambios para abrir su memo exacto.</span>}</div>
      <p role="status" aria-live="polite" className="sponsor-notice">{notice}{dirty&&' Hay cambios sin guardar.'}</p>
      <div className="scenario-list">{s.scenarios.map(row=><article key={row.id}><div><h3>{row.name}</h3><p>{row.input.participants} personas · {row.input.months} meses · {new Date(row.savedAt).toLocaleString('es-MX')}</p></div><button onClick={()=>open(row)}>Abrir {row.name}</button>{confirmDelete===row.id?<><button onClick={()=>remove(row.id)}>Confirmar eliminación</button><button onClick={()=>setConfirmDelete(null)}>Cancelar</button></>:<button onClick={()=>setConfirmDelete(row.id)}>Eliminar</button>}</article>)}</div>
    </section>
    <section className="sponsor-independence"><span className="sponsor-kicker">LA CONDICIÓN DEL PATROCINIO</span><h2>Financiar acceso<br/>no compra una decisión.</h2><p>El patrocinador puede recibir una evaluación agregada del programa. No puede cambiar el cálculo, esconder advertencias ni obtener automáticamente registros individuales. No prometemos empleo ni seguridad garantizada.</p><a href="/about">Leer el método y el memo 10:1 →</a></section>
    </main><SponsorFooter/></div>;
}
