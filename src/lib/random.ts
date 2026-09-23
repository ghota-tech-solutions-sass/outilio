// Tirage cryptographique uniforme dans [0, max) : crypto.getRandomValues avec
// rejet des valeurs hautes pour éviter le biais de modulo.
export function secureRandomInt(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}
