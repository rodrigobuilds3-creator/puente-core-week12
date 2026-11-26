'use client';

import {DefenseDeck} from './defense-deck';
import {calculateSponsorship} from '../../lib/sponsorship';
import {SponsorHeader,SponsorFooter,useSavedSponsorScenario,mxn,qty} from '../sponsor-shared';

export default function About() {
  const s=useSavedSponsorScenario();
  const r=calculateSponsorship(s.input);
  const hasRequestedScenario=typeof window!=='undefined'&&new URLSearchParams(window.location.search).has('scenario');
  return <div className="sponsor-shell"><SponsorHeader current="about"/><main><div className="memo-wrap">
    <DefenseDeck/>
    <div className="memo-toolbar" id="memo"><a href={s.selectedId?`/pricing?scenario=${encodeURIComponent(s.selectedId)}`:'/pricing'}>← Editar los supuestos</a><button onClick={()=>window.print()} disabled={!s.loaded||!r.ok||Boolean(s.storageError&&hasRequestedScenario)}>Imprimir memo / guardar PDF</button></div>
    {!s.loaded?<p role="status">Abriendo el escenario de este navegador…</p>:s.storageError&&hasRequestedScenario?<div role="alert" className="sponsor-warning"><h2>No podemos abrir ese memo.</h2><p>{s.storageError} No sustituimos el escenario solicitado por otro.</p><a href="/about">Ver el ejemplo ficticio del método</a></div>:!r.ok?<p role="alert">Este escenario contiene datos no válidos. Vuelve al simulador para corregirlos.</p>:<>
    <article className="memo-sheet" aria-label="Memo 10 a 1"><span className="sponsor-kicker">PUENTE / MEMO 10:1 / ACCESO PATROCINADO</span><h2 className="memo-title">Gratis para la persona.<br/>El costo sigue existiendo.</h2>
    <p><strong>Escenario:</strong> {s.selectedId?s.name:'Ejemplo ficticio de referencia, no guardado'}. {s.input.participants} personas, {s.input.months} {s.input.months===1?'mes':'meses'}. Todos los montos son supuestos editables, no mediciones ni una oferta aceptada.</p>
    <h3>01 / Usuario, pagador y tarea equivalente</h3><p>El trabajador revisa una transición sin pagar por el cálculo. Una organización podría financiar acceso, orientación y apoyo para este grupo. Comparamos la misma revisión de transición —captura, explicación, incertidumbre y correcciones— con una hoja de cálculo y apoyo humano, para el mismo grupo y período. No hay patrocinador comprometido.</p>
    <h3>02 / Cotización y costo completo</h3>
    <dl className="sponsor-totals"><div><dt>Costo de entrega: {qty(r.staffHours)} h de equipo + infraestructura</dt><dd>{mxn(r.deliveryCost)}</dd></div><div><dt>Cotización por costos / precio alternativo si lo introdujiste</dt><dd>{mxn(r.quote)}</dd></div><div><dt>Trabajo adicional del patrocinador</dt><dd>{mxn(r.residualBuyerCost)}</dd></div><div><dt>Tiempo total de participantes</dt><dd>{mxn(r.participantTimeCost)}</dd></div><div><dt>Recursos completos con PUENTE</dt><dd data-testid="memo-full-cost">{mxn(r.fullResourceCost)}</dd></div><div><dt>Proceso actual equivalente, sin medir todavía</dt><dd>{mxn(s.input.baselineCost)}</dd></div></dl>
    <p>No sumamos la cotización otra vez a los recursos que ya financia. La cotización sale de costo ÷ (1 − margen objetivo del {qty(s.input.marginPct)}%); un precio alternativo no modifica los costos. La contribución no es utilidad neta. Importes base en MXN, sin cálculo fiscal; el alcance y pago requieren revisión humana.</p>
    <h3>03 / ¿Dónde está el 10:1?</h3><div className="memo-verdict"><strong data-testid="memo-ratio">{r.ratio===null?'Sin razón calculable':`${qty(r.ratio)}:1`}</strong><p>{mxn(s.input.baselineCost)} ÷ {mxn(r.fullResourceCost)}. {r.passesTen?'La aritmética alcanza el umbral, pero los supuestos no prueban una ventaja real.':'Este escenario no demuestra la ventaja 10:1.'} Financiar acceso no elimina el costo ni demuestra ahorro. No monetizamos riesgo sin evidencia; salarios futuros y promesas de empleo no entran al numerador.</p></div>
    <h3>04 / Evidencia y decisión pendiente</h3><p>Antes de afirmar valor: observar el proceso actual y el de PUENTE, cronometrar entrada, explicación y corrección, medir comprensión y costo completo, y pedir a un responsable de presupuesto una respuesta a la oferta concreta. Registrar aceptación, rechazo o aplazamiento y su motivo. Una proyección o un elogio no son ingreso. Una coordinadora describió condiciones para operar el piloto. Falta una comparación económica medida y una decisión de quien tiene presupuesto.</p>
    <h3>05 / La condición que protege a la persona</h3><p>El patrocinador no modifica cálculos, advertencias o decisiones, ni obtiene registros individuales por financiar acceso. La persona puede rechazar cualquier opción. El cálculo de transición conserva su límite de 14 días y no verifica empleadores ni pagos. Usar cifras ficticias en esta demo; el reporte agregado y la operación con datos reales requieren trabajo adicional antes de ofrecerse.</p>
    <p className="sponsor-fine">Mismo escenario y motor que /pricing. {s.selectedId?'Este enlace depende del escenario guardado en este navegador; no comparte datos con otros dispositivos.':'Para un memo con tus cambios, guarda un escenario en /pricing y abre su enlace.'}</p></article>
    <aside className="memo-sources">Referencias del método: <a href="https://support.everfi.com/everfi-cost" target="_blank" rel="noreferrer">EVERFI: acceso financiado por terceros</a> · <a href="https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/" target="_blank" rel="noreferrer">CFPB: herramientas de flujo de efectivo</a>. Son referencias de diseño, no avales ni prueba de demanda para PUENTE.</aside>
    </>}
    </div></main><SponsorFooter/></div>;
}
