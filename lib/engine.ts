/** Deterministic, 14-day cash bridge. This does not verify a route or predict income. */
export type SellingDay = {
  gross: number;
  restock: number;
  transport: number;
  other: number;
  hours: number;
};

export type RouteInput = {
  cash: number;
  weeklyFloor: number;
  days: SellingDay[];
  retainedHoursWeekly: number;
  transitionCosts: number;
  routeName: string;
  source: string;
  sourceDate: string;
  owner: string;
  confirmed: boolean;
};

export type RouteStatus =
  | 'DATOS_INCOMPLETOS'
  | 'NO_DISPONIBLE'
  | 'PROVISIONAL'
  | 'LISTA_PARA_REVISAR';

export type RouteResult = {
  status: RouteStatus;
  reason: string;
  nextAction: string;
  floor: number;
  reserve: number;
  protectedAmount: number;
  dailyNets: number[];
  net: number;
  totalHours: number;
  retainedIncome: number;
  opportunityCost: number;
  margin: number;
  inputValid: boolean;
  warnings: string[];
};

const nonNegative = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1_000_000_000;

const roundMoney = (amount: number) => {
  const result = Math.round((amount + Math.sign(amount) * Number.EPSILON) * 100) / 100;
  return Object.is(result, -0) ? 0 : result;
};

/** Parse calendar dates without accepting rollover dates or timestamps. */
function calendarDay(value: unknown): number | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null;
  return Math.floor(date.getTime() / 86_400_000);
}

function cleanText(value: unknown): string {
  return typeof value === 'string' && value.length <= 200 ? value.trim() : '';
}

function incomplete(reason: string, warnings: string[] = []): RouteResult {
  return {
    status: 'DATOS_INCOMPLETOS',
    reason,
    nextAction: 'Completa o corrige el registro. Conserva tu ingreso actual mientras reúnes los datos.',
    floor: 0,
    reserve: 0,
    protectedAmount: 0,
    dailyNets: [],
    net: 0,
    totalHours: 0,
    retainedIncome: 0,
    opportunityCost: 0,
    margin: 0,
    inputValid: false,
    warnings,
  };
}

/**
 * Evaluate a single option. The five-to-seven day log is treated as one
 * representative work week; no future formal wage is included in the bridge.
 */
export function evaluateRoute(input: RouteInput, today?: string): RouteResult {
  if (!input || typeof input !== 'object') return incomplete('Faltan los datos de la ruta.');
  const { cash, weeklyFloor, days, retainedHoursWeekly, transitionCosts } = input;
  if (![cash, weeklyFloor, retainedHoursWeekly, transitionCosts].every(nonNegative)) {
    return incomplete('Revisa que efectivo, mínimo semanal, horas y costos sean números válidos y no negativos.');
  }
  if (weeklyFloor <= 0) return incomplete('Indica un gasto esencial semanal mayor que cero para proteger tu base.');
  if (!Array.isArray(days) || days.length < 5 || days.length > 7) {
    return incomplete('Registra entre cinco y siete días completos de ventas.');
  }
  if (days.some((day) => !day || ![day.gross, day.restock, day.transport, day.other, day.hours].every(nonNegative) || day.gross <= 0 || day.hours <= 0 || day.hours > 24)) {
    return incomplete('Cada día necesita ventas y horas mayores que cero, hasta 24 horas, y costos válidos no negativos.');
  }
  const dailyNets = days.map((day) => roundMoney(day.gross - day.restock - day.transport - day.other));
  if (dailyNets.some((net) => net < 0)) {
    return incomplete('Hay un día con pérdida. Revísalo antes de estimar la reserva.', ['Un neto diario negativo impide completar el cálculo.']);
  }
  const positiveNets = dailyNets.filter((net) => net > 0);
  if (!positiveNets.length) return incomplete('Necesitas al menos un día con neto positivo para calcular la reserva.');

  const net = roundMoney(dailyNets.reduce((sum, value) => sum + value, 0));
  const totalHours = days.reduce((sum, day) => sum + day.hours, 0);
  if (retainedHoursWeekly > totalHours) {
    return incomplete('Las horas que planeas conservar no pueden superar las horas de venta registradas.');
  }
  const currentDay = calendarDay(today ?? new Date().toISOString().slice(0, 10));
  if (currentDay === null) return incomplete('No fue posible determinar una fecha válida para la revisión.');

  const reserve = Math.min(...positiveNets);
  const floor = roundMoney(weeklyFloor * 2);
  const protectedAmount = roundMoney(floor + reserve);
  const retainedIncome = roundMoney((net / totalHours) * retainedHoursWeekly * 2);
  const opportunityCost = roundMoney((net / totalHours) * (totalHours - retainedHoursWeekly) * 2);
  const margin = roundMoney(cash + retainedIncome - transitionCosts - protectedAmount);
  const common = {
    floor, reserve, protectedAmount, dailyNets, net, totalHours,
    retainedIncome, opportunityCost, margin, inputValid: true,
  };
  const warnings = [
    'La estimación supone que los días registrados representan una semana de trabajo.',
    'El ingreso informal conservado es una proyección; el salario futuro no financia el puente.',
  ];

  if (margin < 0) {
    return {
      ...common,
      status: 'NO_DISPONIBLE',
      reason: 'La caja estimada no alcanza para cubrir el mínimo de 14 días, la reserva y los costos de transición.',
      nextAction: 'Revisa los costos y la fecha del primer pago sin costo; conserva el ingreso actual como alternativa.',
      warnings,
    };
  }

  const evidenceDay = calendarDay(input.sourceDate);
  const evidenceMissing = !cleanText(input.routeName) || !cleanText(input.source) || !cleanText(input.owner)
    || evidenceDay === null || evidenceDay > currentDay || currentDay - evidenceDay > 30
    || input.confirmed !== true;
  if (evidenceMissing) {
    return {
      ...common,
      status: 'PROVISIONAL',
      reason: 'El margen estimado no es negativo, pero faltan datos actuales o confirmación humana de la ruta.',
      nextAction: 'Pide por escrito la información faltante y confirma la fuente y su fecha; conserva tu alternativa actual.',
      warnings: [...warnings, 'Ninguna ruta se verifica automáticamente por tener margen suficiente.'],
    };
  }

  return {
    ...common,
    status: 'LISTA_PARA_REVISAR',
    reason: 'El margen estimado cubre el monto protegido y registraste una fuente reciente con responsable.',
    nextAction: 'Revisa las condiciones y elige si deseas continuar; puedes corregir los datos o mantener tu alternativa.',
    warnings: [...warnings, 'Una fuente introducida por la persona no demuestra una verificación independiente ni garantiza la ruta.'],
  };
}
