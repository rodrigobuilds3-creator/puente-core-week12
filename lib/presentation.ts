import type { RouteStatus } from './engine.ts';

export const parseNumericInput = (raw: string): number => raw.trim() === '' ? Number.NaN : Number(raw);
export const displayNumericInput = (value: number): number | '' => Number.isFinite(value) ? value : '';
export const resultHeading: Record<RouteStatus, string> = {
  DATOS_INCOMPLETOS: 'Completa los datos antes de calcular.',
  NO_DISPONIBLE: 'Tu caja no cubre esta transición.',
  PROVISIONAL: 'La oportunidad sigue sin confirmar.',
  LISTA_PARA_REVISAR: 'Revisa la fuente antes de decidir.',
};

export function savedDateLabel(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toLocaleString('es-MX');
}
