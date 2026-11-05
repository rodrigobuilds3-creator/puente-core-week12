'use client';

import { useEffect, useState } from 'react';
import { FeedbackPanel, useFeedback } from './feedback-panel';
import { parseNumericInput, displayNumericInput, resultHeading, savedDateLabel } from '../lib/presentation';
import { evaluateRoute, type RouteInput, type RouteResult, type SellingDay } from '../lib/engine';

const emptyDay = (): SellingDay => ({ gross: 0, restock: 0, transport: 0, other: 0, hours: 0 });
const initialInput = (): RouteInput => ({
  cash: 0, weeklyFloor: 0, days: Array.from({ length: 5 }, emptyDay),
  retainedHoursWeekly: 0, transitionCosts: 0, routeName: '', source: '', sourceDate: '', owner: '', confirmed: false,
});

const exampleInput = (): RouteInput => ({
  cash: 1800, weeklyFloor: 1200, retainedHoursWeekly: 0, transitionCosts: 450,
  days: [
    { gross: 480, restock: 200, transport: 30, other: 10, hours: 6 },
    { gross: 460, restock: 190, transport: 30, other: 10, hours: 6 },
    { gross: 500, restock: 220, transport: 30, other: 10, hours: 6 },
    { gross: 430, restock: 180, transport: 30, other: 10, hours: 6 },
    { gross: 470, restock: 190, transport: 30, other: 10, hours: 6 },
  ],
  routeName: 'Opción de trabajo de ejemplo', source: '', sourceDate: '', owner: '', confirmed: false,
});

const money = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
const numberValue = parseNumericInput;
const labels: Record<RouteResult['status'], string> = {
  DATOS_INCOMPLETOS: 'Faltan datos', NO_DISPONIBLE: 'No alcanza por ahora',
  PROVISIONAL: 'Hay datos por confirmar', LISTA_PARA_REVISAR: 'Lista para que la revises',
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>;
}

export default function Home() {
  const feedback = useFeedback();
  const [input, setInput] = useState<RouteInput>(initialInput);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [notice, setNotice] = useState('');
  const [exampleNotice, setExampleNotice] = useState('');
  const [loadingExample, setLoadingExample] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem('puente-week12-example'); if (raw) { const saved = JSON.parse(raw); if (evaluateRoute(saved.input).inputValid) setSavedAt(savedDateLabel(saved.savedAt) ?? 'Fecha no disponible'); } } catch { /* Storage is optional. */ }
  }, []);

  function update<K extends keyof RouteInput>(key: K, value: RouteInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setResult(null); setNotice(''); setDirty(true); setExampleNotice(''); setConfirmClear(false);
  }
  function updateDay(index: number, key: keyof SellingDay, value: number) {
    setInput((current) => ({ ...current, days: current.days.map((day, i) => i === index ? { ...day, [key]: value } : day) }));
    setResult(null); setNotice(''); setDirty(true); setExampleNotice(''); setConfirmClear(false);
  }
  function calculate() {
    feedback.record('calculation_attempted');
    setResult(evaluateRoute(input));
    setNotice(''); setDirty(false); setConfirmClear(false);
  }
  async function loadExample() {
    setLoadingExample(true); setDirty(true); setConfirmClear(false);
    setExampleNotice(''); setNotice('');
    try {
      const response = await fetch('/api/ejemplo', { cache: 'no-store', signal: AbortSignal.timeout(6000) });
      if (!response.ok) throw new Error('example unavailable');
      const data = await response.json() as { input: RouteInput };
      if (!evaluateRoute(data.input).inputValid) throw new Error('invalid example');
      setInput(data.input); setResult(null); setExampleNotice('Datos de prueba cargados. Revisa los valores y pulsa Ver mi panorama.');
    } catch {
      setInput(exampleInput()); setResult(null); setExampleNotice('Datos de prueba cargados. Revisa los valores y pulsa Ver mi panorama.');
    } finally {
      setLoadingExample(false); feedback.record('example_loaded');
    }
  }
  function save() {
    if (!result || !result.inputValid) return;
    try {
      const timestamp = new Date().toISOString();
      localStorage.setItem('puente-week12-example', JSON.stringify({ input, savedAt: timestamp }));
      feedback.record('record_saved'); setSavedAt(savedDateLabel(timestamp)); setConfirmClear(false);
      setNotice('Guardado solo en este navegador y dispositivo. No hay cuenta ni sincronización.');
    } catch { setNotice('No pudimos guardar en este navegador. Puedes descargar el resultado.'); }
  }
  function restore() {
    setExampleNotice(''); setConfirmClear(false);
    try {
      const raw = localStorage.getItem('puente-week12-example');
      if (!raw) { setNotice('Todavía no hay un ejemplo guardado en este navegador.'); return; }
      const saved = JSON.parse(raw) as { input: RouteInput };
      const next = evaluateRoute(saved.input);
      if (!next.inputValid) throw new Error('invalid stored example');
      feedback.record('record_restored'); setInput(saved.input); setResult(next); setDirty(false); setSavedAt(savedDateLabel((saved as {savedAt?:string}).savedAt) ?? 'Fecha no disponible'); setNotice('Abrimos lo que guardaste en este navegador. No está disponible en otros dispositivos.');
    } catch { setNotice('No pudimos recuperar ese ejemplo. Puedes empezar de nuevo.'); }
  }
  function clear() {
    try { localStorage.removeItem('puente-week12-example'); } catch { setNotice('No pudimos borrar el registro de este navegador.'); setConfirmClear(false); return; }
    feedback.record('record_cleared'); setSavedAt(null); setConfirmClear(false); setDirty(false);
    setInput(initialInput()); setResult(null); setExampleNotice(''); setNotice('Se borró el registro guardado en este navegador.');
  }
  function download() {
    if (!result || !result.inputValid) return;
    const data = JSON.stringify({ tipo: 'ejemplo simulado', datos: input, resultado: result }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'puente-ejemplo.json'; a.click(); URL.revokeObjectURL(url);
    feedback.record('record_exported'); setNotice('Descargaste el ejemplo como archivo JSON.');
  }

  return <>
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="PUENTE, inicio"><span className="brand-symbol" aria-hidden="true"><i/><i/><i/></span><span>puente<span className="brand-dot">.</span></span></a>
      <nav aria-label="Principal"><a href="#como-funciona">Cómo funciona</a><a href="#calculadora">Tu cálculo</a></nav>
      <a className="nav-cta" href="#calculadora">Empezar <Arrow diagonal /></a>
    </header>

    <main id="inicio">
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow"><span className="mini-spark">✳</span> TU SIGUIENTE PASO CUENTA</span>
          <h1>Da el salto.<br/><span>Cuida tu piso.</span></h1>
          <p className="hero-lead">Una nueva oportunidad se ve diferente cuando sabes con cuánto cuentas. Haz las cuentas para tus próximos 14 días.</p>
          <div className="hero-actions"><a className="button primary" href="#calculadora">Explorar mi ruta <Arrow diagonal /></a><a className="text-link" href="#como-funciona">Así funciona <span>↓</span></a></div>
          <p className="hero-note"><span className="tiny-mark">●</span> Tus números, tu decisión.</p>
        </div>
        <div className="hero-visual" aria-label="Ilustración sobre dar un siguiente paso">
          <img src="/puente-hero.png" alt="Ilustración de personas cruzando un puente hacia nuevas oportunidades" />
          <div className="visual-tag"><span className="tag-star">✦</span><span>UNA RUTA<br/><strong>A TU MANERA</strong></span></div>
        </div>
        <div className="hero-index" aria-hidden="true">01 / TU CAMINO</div>
      </section>

      <section className="how-section" id="como-funciona">
        <div className="wrap how-inner">
          <div className="how-heading"><span className="eyebrow light">¿CÓMO FUNCIONA?</span><h2>Las buenas decisiones<br/><em>empiezan aquí.</em></h2></div>
          <div className="steps">
            <article><span className="step-num">01</span><h3>Pon tus números</h3><p>Registra tus ventas y gastos de cinco a siete días.</p></article>
            <article><span className="step-num">02</span><h3>Mira el panorama</h3><p>Compara tus costos con lo que necesitas proteger.</p></article>
            <article><span className="step-num">03</span><h3>Decide tú</h3><p>Revisa qué falta y conserva una alternativa.</p></article>
          </div>
        </div>
      </section>

      <section className="tool-section" id="calculadora">
        <div className="wrap tool-intro"><div><span className="eyebrow"><span className="mini-spark">✳</span> TU PUNTO DE PARTIDA</span><h2>Hagamos espacio<br/><span>para tu próximo paso.</span></h2></div><p>Vamos por partes. Necesitas entre cinco y siete días de ventas para estimar tu ingreso y una reserva.</p></div>
        <div className="wrap demo-banner"><span className="demo-label">MODO DEMO</span><p>Esta versión es un ejercicio con datos ficticios. No ingreses nombres, documentos ni información financiera real.</p><button type="button" onClick={loadExample} disabled={loadingExample}>{loadingExample ? 'Cargando ejemplo…' : 'Llenar con datos de prueba'} <Arrow /></button><p className="demo-feedback" role="status" aria-live="polite">{exampleNotice}</p></div>

        <div className="wrap workspace">
          <div className="workspace-main">
            <section className="form-section" aria-labelledby="cash-heading"><div className="section-heading"><span className="section-number">01</span><div><span className="section-kicker">EMPECEMOS POR LO BÁSICO</span><h3 id="cash-heading">Lo que necesitas cuidar</h3><p>Tu punto de partida para las próximas dos semanas.</p></div></div>
              <div className="field-grid two"><label>Efectivo disponible hoy <span>MXN</span><input type="number" min="0" max="1000000000" inputMode="decimal" value={displayNumericInput(input.cash)} onChange={(e) => update('cash', numberValue(e.target.value))} placeholder="0" /></label><label>Gasto esencial por semana <span>MXN</span><input type="number" min="0" max="1000000000" inputMode="decimal" value={displayNumericInput(input.weeklyFloor)} onChange={(e) => update('weeklyFloor', numberValue(e.target.value))} placeholder="0" /></label></div>
            </section>

            <section className="form-section" aria-labelledby="days-heading"><div className="section-heading"><span className="section-number">02</span><div><span className="section-kicker">TUS DÍAS DE TRABAJO</span><h3 id="days-heading">Lo que entra y lo que sale</h3><p>Anota entre 5 y 7 días de ventas. Incluye cada gasto para calcular el neto.</p></div></div>
              <div className="day-list">{input.days.map((day, i) => <fieldset className="day-row" key={i}><legend>Día {String(i + 1).padStart(2,'0')}</legend><div className="day-fields">{([['gross','Venta'],['restock','Reposición'],['transport','Traslado'],['other','Otros'],['hours','Horas']] as const).map(([key,label]) => <label key={key}>{label}<input aria-label={`Día ${i+1}: ${label}`} type="number" min="0" max="1000000000" inputMode="decimal" value={displayNumericInput(day[key])} onChange={(e) => updateDay(i,key,numberValue(e.target.value))} placeholder="0" /></label>)}</div></fieldset>)}</div>
              <div className="day-actions"><button className="line-button" type="button" disabled={input.days.length >= 7} onClick={() => update('days',[...input.days,emptyDay()])}>+ Agregar un día</button><button className="subtle-button" type="button" disabled={input.days.length <= 5} onClick={() => update('days',input.days.slice(0,-1))}>Quitar último día</button><span>{input.days.length} de 7 días</span></div>
            </section>

            <section className="form-section" aria-labelledby="route-heading"><div className="section-heading"><span className="section-number">03</span><div><span className="section-kicker">UNA OPCIÓN A LA VEZ</span><h3 id="route-heading">Cuéntanos de tu ruta</h3><p>Los datos de una oportunidad necesitan una fuente y una fecha. PUENTE no la verifica por ti.</p></div></div>
              <div className="field-grid two"><label>Nombre de la opción<input maxLength={200} value={input.routeName} onChange={(e) => update('routeName',e.target.value)} placeholder="Ej. Capacitación" /></label><label>Horas de venta que conservarías por semana<input type="number" min="0" max="1000000000" inputMode="decimal" value={displayNumericInput(input.retainedHoursWeekly)} onChange={(e) => update('retainedHoursWeekly',numberValue(e.target.value))} placeholder="0" /><small className="field-hint">Registraste {input.days.reduce((sum, day) => sum + (Number.isFinite(day.hours) ? day.hours : 0), 0)} horas en total.</small></label><label>Costos de transición en 14 días <span>MXN</span><input type="number" min="0" max="1000000000" inputMode="decimal" value={displayNumericInput(input.transitionCosts)} onChange={(e) => update('transitionCosts',numberValue(e.target.value))} placeholder="0" /><small className="field-hint">Incluye traslado, documentos, comidas o equipo.</small></label><label>Fecha de la información<input type="date" value={input.sourceDate} onChange={(e) => update('sourceDate',e.target.value)} /></label><label>Fuente o lugar de consulta<input maxLength={200} value={input.source} onChange={(e) => update('source',e.target.value)} placeholder="Ej. descripción de ejemplo" /></label><label>Persona u organización responsable<input maxLength={200} value={input.owner} onChange={(e) => update('owner',e.target.value)} placeholder="Ej. organización de ejemplo" /></label></div>
              <label className="check-label"><input type="checkbox" checked={input.confirmed} onChange={(e) => update('confirmed',e.target.checked)} /><span>Ya revisé las condiciones y la fecha con la fuente indicada.</span></label>
              <p className="field-note">El salario futuro no se suma durante los 14 días. Revisar información no garantiza que una opción esté disponible.</p>
              <button className="button primary calculate-button" type="button" onClick={calculate}>Ver mi panorama <Arrow /></button>
            </section>
          </div>

          <aside className={`summary ${result?.status === 'PROVISIONAL' ? 'provisional-summary' : ''}`} aria-live="polite"><div className="summary-head"><span className="section-kicker">TU PANORAMA</span><span className="summary-icon">✳</span></div>{!result ? <><h3>{dirty ? 'Tus cambios siguen aquí.' : 'Un paso a la vez.'}</h3><p>{dirty ? 'Los datos del formulario no se borraron. Pulsa Ver mi panorama para actualizar el resultado. El registro guardado se conserva hasta que lo reemplaces o lo borres.' : 'Completa los datos y revisa qué necesitas proteger antes de decidir.'}</p><div className="summary-empty"><span>14</span><div>DÍAS PARA<br/>PONER EN CLARO</div></div></> : <><span className={`status ${result.status === 'NO_DISPONIBLE' ? 'danger' : result.status === 'LISTA_PARA_REVISAR' ? 'good' : ''}`}>{labels[result.status]}</span><h3>{resultHeading[result.status]}</h3><p>{result.reason}</p>{result.inputValid && <p className="verification-boundary">PUENTE no ha comprobado que la oportunidad exista ni que pague a tiempo. Este cálculo no autoriza ni garantiza una contratación.</p>}{result.inputValid && result.margin < 0 && <p className="shortfall">En esta estimación te faltan <strong>{money(-result.margin)}</strong> para cubrir lo que necesitas proteger y los costos de transición.</p>}{result.inputValid && <dl className="result-list"><div><dt>Piso de 14 días</dt><dd>{money(result.floor)}</dd></div><div><dt>Reserva del cálculo</dt><dd>{money(result.reserve)}</dd></div><div><dt>Ingreso que conservarías en 14 días</dt><dd>{money(result.retainedIncome)}</dd></div><div className={result.status === 'PROVISIONAL' ? 'result-provisional' : 'result-total'}><dt>Margen estimado</dt><dd>{money(result.margin)}</dd></div></dl>}{result.inputValid && <p className="income-context">Neto de los días registrados: <strong>{money(result.net)}</strong>. Horas de venta que conservarías por semana: <strong>{input.retainedHoursWeekly}</strong>. {input.retainedHoursWeekly === 0 ? 'El ingreso conservado es $0 porque elegiste conservar cero horas; no significa que tu trabajo no genere ingreso.' : 'El ingreso conservado es una proyección, no dinero confirmado.'}</p>}<div className="next-step"><span>SIGUIENTE PASO</span><p>{result.nextAction}</p></div>{result.inputValid && <><details><summary>Ver cómo se calcula</summary><p>La reserva es el menor neto positivo entre los días registrados: {money(result.reserve)}. Es una regla del prototipo para este ejercicio, no una garantía de seguridad financiera.</p><p>Neto de los días registrados: {money(result.net)} en {result.totalHours} horas. {result.dailyNets.map((net, index) => `Día ${index + 1}: ${money(net)}.`).join(' ')}</p><p>Efectivo + ingreso que conservarías − costos − piso de 14 días − reserva. Las horas y ventas se usan como una semana representativa. El ingreso perdido estimado ({money(result.opportunityCost)}) ya se refleja en las horas conservadas; no se resta dos veces.</p>{result.warnings.map((warning)=><p key={warning}>{warning}</p>)}</details><div className="save-actions"><button type="button" onClick={save}>Guardar en este navegador</button><button type="button" onClick={download}>Descargar JSON</button></div></>}</>}
            <div className="restore-actions"><button type="button" onClick={restore}>Abrir lo que guardé</button><p className="storage-context">{savedAt ? `Guardado: ${savedAt}. Solo en este navegador y dispositivo.` : 'Sin registro guardado detectado. No hay cuenta ni sincronización.'}</p><button type="button" onClick={() => setConfirmClear(true)}>Borrar y empezar de nuevo</button>{confirmClear && <div className="clear-confirm" role="group" aria-label="Confirmar borrado"><p>¿Borrar el formulario y lo guardado en este navegador? No podrás recuperarlo.</p><button type="button" onClick={clear}>Sí, borrar</button><button type="button" onClick={() => setConfirmClear(false)}>Cancelar</button></div>}</div>
            {notice && <p className="notice" role="status">{notice}</p>}
          </aside>
        </div>
      </section>

      <FeedbackPanel feedback={feedback} />
      <section className="closing"><div className="wrap closing-inner"><div><span className="eyebrow light">TU CAMINO, TUS REGLAS</span><h2>No tienes que decidir<br/><em>a ciegas.</em></h2></div><a className="button yellow" href="#calculadora">Revisar mi ruta <Arrow diagonal /></a></div></section>
    </main>
    <footer className="wrap site-footer"><a className="brand" href="#inicio"><span>puente<span className="brand-dot">.</span></span></a><p>Una idea para dar el siguiente paso con claridad.</p><span>PROTOTIPO · DATOS FICTICIOS</span></footer>
  </>;
}
