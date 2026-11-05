'use client';
import {useRef,useState} from 'react';
import {appendEvent, MAX_EVENTS, type EventName, type FeedbackEvent, type FeedbackReason} from '../lib/feedback';

export function useFeedback() {
  const [active,setActive]=useState(false);
  const [events,setEvents]=useState<FeedbackEvent[]>([]);
  const start=useRef(0);
  function record(event: EventName,reason?: FeedbackReason) {
    setEvents(current=>appendEvent(current,active,event,performance.now()-start.current,reason));
  }
  function begin(){start.current=performance.now();setActive(true);setEvents([{event:'session_started',elapsedMs:0}]);}
  function stop(){setActive(false);setEvents([]);}
  function download(){
    if(!active)return;
    const blob=new Blob([JSON.stringify({schema:'puente.feedback.v1',events},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='puente-registro-prueba.json';a.click();URL.revokeObjectURL(url);
  }
  return {active,events,record,begin,stop,download};
}

export function FeedbackPanel({feedback}:{feedback:ReturnType<typeof useFeedback>}) {
  const [open,setOpen]=useState(false);
  const [message,setMessage]=useState('');
  const reasons: [FeedbackReason,string][]=[['result_unclear','No entiendo el resultado'],['missing_data','Me faltan datos'],['next_step_unclear','No encuentro el siguiente paso'],['save_restore_unclear','Me cuesta guardar o recuperar']];
  return <section className="wrap feedback-section" aria-labelledby="feedback-heading">
    <span className="eyebrow">PRUEBA VOLUNTARIA</span><h2 id="feedback-heading">Cuéntanos dónde te detuviste.</h2>
    <p>Si lo activas, este navegador mantiene un registro de acciones y tiempos relativos solo durante esta sesión. No incluye tus montos, datos de la ruta, nombres ni identificadores. No se envía a un servidor. Al recargar se pierde; puedes descargarlo para compartirlo tú.</p>
    {!feedback.active ? <button type="button" className="button primary" onClick={()=>{feedback.begin();setMessage('Registro local activado. Puedes detenerlo y borrar los eventos cuando quieras.');}}>Activar registro local</button> : <div className="feedback-actions"><span>{feedback.events.length} de {MAX_EVENTS} eventos</span><button type="button" onClick={feedback.download}>Descargar registro de prueba</button><button type="button" onClick={()=>{feedback.stop();setOpen(false);setMessage('Registro detenido y eventos borrados de esta sesión.');}}>Detener y borrar eventos</button></div>}
    <p className="feedback-note">Puedes usar PUENTE sin activar el registro. Esta opción no cambia los cálculos.</p>
    <button type="button" className="help-button" aria-expanded={open} aria-controls="help-reasons" onClick={()=>{setOpen(!open);if(!open)feedback.record('help_requested');}}>Necesito ayuda para continuar</button>
    {open && <div id="help-reasons"><p>Esto no contacta a un asesor en vivo. Elige qué te detuvo; puedes revisar tus datos o conservar tu ingreso actual mientras confirmas la información.</p><div className="feedback-reasons">{reasons.map(([reason,label])=><button type="button" key={reason} onClick={()=>{feedback.record('reason_selected',reason);setMessage(feedback.active?'Respuesta registrada solo en esta sesión. Descarga el registro si quieres conservarla.':'El registro está desactivado; esta respuesta no se guardó.');}}>{label}</button>)}</div></div>}
    {feedback.events.length===MAX_EVENTS && <p role="status">El registro alcanzó su límite. Puedes descargarlo; el resto de PUENTE sigue funcionando.</p>}
    <p role="status" className="notice">{message}</p>
  </section>;
}
