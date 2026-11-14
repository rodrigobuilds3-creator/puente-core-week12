export const SPONSOR_STORAGE_KEY = 'puente-sponsored-scenarios-v1';
export const MAX_SCENARIOS = 8;
export type SponsorInput = {
  participants: number; months: number; setupHours: number; onboardingHours: number;
  supportHoursMonthly: number; evaluationHours: number; acquisitionHours: number;
  hourlyCost: number; infrastructureMonthly: number; marginPct: number; offeredQuote: number;
  prospects: number; conversionPct: number; signedAgreements: number; cashReceived: number;
  capacity: number; baselineCost: number; buyerHours: number; workerHours: number; workerHourlyCost: number;
};
export type SponsorField = keyof SponsorInput;
export type FieldSpec = { key: SponsorField; label: string; unit: string; min: number; max: number; integer?: boolean; hint?: string };
export const SPONSOR_FIELDS: FieldSpec[] = [
  {key:'participants', label:'Personas por grupo', unit:'personas', min:1,max:10000,integer:true},
  {key:'months', label:'Duración del contrato', unit:'meses', min:1,max:36,integer:true},
  {key:'setupHours', label:'Preparación inicial', unit:'horas',min:0,max:10000},
  {key:'onboardingHours', label:'Orientación por persona',unit:'horas/persona',min:0,max:100},
  {key:'supportHoursMonthly',label:'Apoyo por grupo al mes',unit:'horas/mes',min:0,max:10000},
  {key:'evaluationHours',label:'Evaluación y reporte',unit:'horas/contrato',min:0,max:10000},
  {key:'acquisitionHours',label:'Conseguir al patrocinador',unit:'horas/contrato',min:0,max:10000},
  {key:'hourlyCost',label:'Costo de una hora del equipo',unit:'MXN/hora',min:0,max:100000},
  {key:'infrastructureMonthly',label:'Operación e infraestructura',unit:'MXN/mes',min:0,max:1000000},
  {key:'marginPct',label:'Margen objetivo sobre el precio',unit:'%',min:0,max:95,hint:'Es una hipótesis de margen; no es utilidad neta ni incremento sobre costo.'},
  {key:'offeredQuote',label:'Precio alternativo a probar',unit:'MXN/contrato',min:0,max:100000000,hint:'0 usa la cotización por costos. Otro monto prueba una oferta distinta, sin cambiar los costos.'},
  {key:'prospects',label:'Posibles patrocinadores',unit:'organizaciones',min:0,max:100000,integer:true},
  {key:'conversionPct',label:'Conversión supuesta a acuerdos',unit:'%',min:0,max:100},
  {key:'signedAgreements',label:'Acuerdos firmados del ejemplo',unit:'acuerdos',min:0,max:100000,integer:true,hint:'Ingreso manual ficticio. PUENTE no verifica contratos.'},
  {key:'cashReceived',label:'Dinero recibido del ejemplo',unit:'MXN, total',min:0,max:100000000000,hint:'Un acuerdo no equivale a dinero recibido. Este campo también es ficticio.'},
  {key:'capacity',label:'Capacidad total para este período',unit:'personas',min:0,max:1000000,integer:true},
  {key:'baselineCost',label:'Costo completo del proceso actual',unit:'MXN/grupo/período',min:0,max:100000000,hint:'Misma tarea, grupo, período y calidad; incluye tiempo y costos de todos. No medido todavía.'},
  {key:'buyerHours',label:'Trabajo adicional del patrocinador',unit:'horas/grupo/período',min:0,max:100000},
  {key:'workerHours',label:'Tiempo de cada participante',unit:'horas/persona/período',min:0,max:1000},
  {key:'workerHourlyCost',label:'Valor supuesto del tiempo del participante',unit:'MXN/hora',min:0,max:100000},
];
export const DEFAULT_SPONSOR_INPUT: SponsorInput = {
  participants:20,months:1,setupHours:4,onboardingHours:.25,supportHoursMonthly:2,
  evaluationHours:2,acquisitionHours:4,hourlyCost:120,infrastructureMonthly:200,
  marginPct:20,offeredQuote:0,prospects:10,conversionPct:10,signedAgreements:0,cashReceived:0,
  capacity:100,baselineCost:5000,buyerHours:2,workerHours:.5,workerHourlyCost:50,
};
export const SPONSOR_PLANS = [
  {id:'pilot',name:'Piloto patrocinado',participants:20,months:1,supportHoursMonthly:2,
    description:'Un grupo y un período acotados para probar acceso, comprensión y carga de apoyo.'},
  {id:'program',name:'Programa patrocinado',participants:60,months:3,supportHoursMonthly:6,
    description:'Mayor alcance y duración, con apoyo y evaluación presupuestados antes de ofrecerlo.'},
] as const;
export function planInput(id: string): SponsorInput {
  const p = SPONSOR_PLANS.find(p=>p.id===id) ?? SPONSOR_PLANS[0];
  return {...DEFAULT_SPONSOR_INPUT,participants:p.participants,months:p.months,supportHoursMonthly:p.supportHoursMonthly};
}
export function validateSponsorInput(value: unknown): Partial<Record<SponsorField,string>> {
  const errors: Partial<Record<SponsorField,string>> = {};
  const input = value && typeof value==='object' ? value as Record<string,unknown> : {};
  for (const field of SPONSOR_FIELDS) {
    const v = input[field.key];
    if (typeof v !== 'number' || !Number.isFinite(v) || v < field.min || v > field.max || (field.integer && !Number.isInteger(v))) {
      errors[field.key] = `Escribe ${field.integer?'un entero':'un número'} entre ${field.min} y ${field.max}.`;
    }
  }
  if (!errors.signedAgreements && !errors.prospects && (input.signedAgreements as number) > (input.prospects as number)) {
    errors.signedAgreements = 'Los acuerdos no pueden superar a las organizaciones de este escenario.';
  }
  return errors;
}
export function calculateSponsorship(input: SponsorInput) {
  const errors = validateSponsorInput(input);
  if (Object.keys(errors).length) return {ok:false as const,errors};
  const onboardingHours = input.participants * input.onboardingHours;
  const staffHours = input.setupHours + onboardingHours + input.supportHoursMonthly*input.months + input.evaluationHours + input.acquisitionHours;
  const laborCost = staffHours*input.hourlyCost;
  const infrastructureCost = input.infrastructureMonthly*input.months;
  const deliveryCost = laborCost + infrastructureCost;
  const costDerivedQuote = deliveryCost/(1-input.marginPct/100);
  const quote = input.offeredQuote || costDerivedQuote;
  const expectedAgreements = input.prospects*input.conversionPct/100;
  const expectedContractValue = expectedAgreements*quote;
  const signedContractValue = input.signedAgreements*quote;
  if (input.cashReceived > signedContractValue + .005) return {ok:false as const,errors:{cashReceived:'El dinero recibido supera el valor de los acuerdos del ejemplo.'}};
  const requestedParticipants = expectedAgreements*input.participants;
  const signedParticipants = input.signedAgreements*input.participants;
  const residualBuyerCost = input.buyerHours*input.hourlyCost;
  const participantTimeCost = input.participants*input.workerHours*input.workerHourlyCost;
  const fullResourceCost = deliveryCost+residualBuyerCost+participantTimeCost;
  const ratio = fullResourceCost>0 ? input.baselineCost/fullResourceCost : null;
  return {ok:true as const,errors:{},onboardingHours,staffHours,laborCost,infrastructureCost,deliveryCost,
    costDerivedQuote,quote,contribution:quote-deliveryCost,
    actualMarginPct:quote>0?(quote-deliveryCost)/quote*100:null,
    expectedAgreements,expectedContractValue,signedContractValue,
    monthlyEquivalent:expectedContractValue/input.months,
    annualEquivalent:expectedContractValue/input.months*12,
    requestedParticipants,signedParticipants,
    expectedCapacityShortfall:Math.max(0,requestedParticipants-input.capacity),
    signedCapacityShortfall:Math.max(0,signedParticipants-input.capacity),
    deliverableSignedParticipants:Math.min(signedParticipants,input.capacity),
    unfundedDeliveryCost:Math.max(0,input.signedAgreements*deliveryCost-input.cashReceived),
    residualBuyerCost,participantTimeCost,fullResourceCost,ratio,
    passesTen:ratio!==null&&ratio>=10,
  };
}
export type SponsorScenario = {id:string;name:string;savedAt:string;input:SponsorInput};
export function cleanScenario(value: unknown): SponsorScenario | null {
  if (!value || typeof value!=='object') return null;
  const row = value as Record<string,unknown>;
  if (Object.keys(row).some(k=>!['id','name','savedAt','input'].includes(k))) return null;
  if (typeof row.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(row.id)||typeof row.name!=='string'||!row.name.trim()||row.name.length>40||typeof row.savedAt!=='string'||!Number.isFinite(Date.parse(row.savedAt))) return null;
  if (!row.input || typeof row.input!=='object' || Object.keys(row.input).length!==SPONSOR_FIELDS.length) return null;
  const raw = row.input as Record<string,unknown>;
  const input = Object.fromEntries(SPONSOR_FIELDS.map(f=>[f.key,raw[f.key]])) as SponsorInput;
  if (!calculateSponsorship(input).ok) return null;
  return {id:row.id,name:row.name.trim(),savedAt:row.savedAt,input};
}
export function readSponsorScenarios(raw: string | null): SponsorScenario[] {
  if (!raw) return [];
  if (raw.length>100000) throw new Error('El archivo local es demasiado grande.');
  const parsed = JSON.parse(raw);
  if (parsed?.version!==1||!Array.isArray(parsed.scenarios)||parsed.scenarios.length>MAX_SCENARIOS) throw new Error('Formato local no compatible.');
  const rows = parsed.scenarios.map(cleanScenario);
  if (rows.some((r:SponsorScenario|null)=>!r) || new Set(rows.map((r:SponsorScenario)=>r.id)).size!==rows.length) throw new Error('Hay escenarios locales no válidos.');
  return rows;
}
export function writeSponsorScenarios(rows: SponsorScenario[]): string {
  if (rows.length>MAX_SCENARIOS || rows.some(r=>!cleanScenario(r))) throw new Error('No se puede guardar este escenario.');
  return JSON.stringify({version:1,scenarios:rows});
}
export function sponsorshipExport(input: SponsorInput) {
  const result=calculateSponsorship(input);
  return {title:'PUENTE - escenario ficticio de patrocinio',status:'SUPUESTOS, SIN COBRO NI PATROCINIO VERIFICADO',
    input,result,terms:['Participante: acceso gratuito.','El patrocinador no controla el resultado ni recibe datos individuales.',
    'Importes base en MXN; no incluyen cálculo fiscal. Cotización y plazos requieren revisión humana.',
    'Sin promesas de empleo, seguridad o ventaja 10:1 demostrada.']};
}
