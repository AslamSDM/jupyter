export function formatNumber(number:string) {
    const num = Number(number);
    if (num >= 1e11) {
        return (num / 1e11).toFixed(2).replace(/\.0+$/, '') + 'B';
      }
      if (num >= 1e8) {
        return (num / 1e8).toFixed(2).replace(/\.0+$/, '') + 'M';
      }
      if (num >= 1e5) {
        return (num / 1e5).toFixed(2).replace(/\.0+$/, '') + 'K';
      }
    return num.toFixed(2).toString();
  }
export function decodeMantissa(
    mantissa: string,
    vdecimals: number,
    udecimals: number
  ): number {
    const value = Number(mantissa);

    const decimals = 18 + vdecimals - udecimals;
    const f = value / Math.pow(10, decimals);
    return Number(f);
  }