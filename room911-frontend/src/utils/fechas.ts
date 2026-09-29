/** Fecha de HOY en la zona horaria LOCAL del navegador, como yyyy-mm-dd.
 *  No usar toISOString() (UTC): el backend razona en America/Bogota y cerca
 *  de medianoche el día se desfasa ±1. */
export const fechaLocalISO = (d: Date = new Date()): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
