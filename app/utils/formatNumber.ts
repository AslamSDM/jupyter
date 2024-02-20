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
export function getRate(rate: string, vdecimals: number) {
    const value = Number(rate);
    const decimals =  vdecimals;
    const blocksPerDay = 20 * 60 * 24;

    // const daysPerYear = 365;
    // const apy = ((Math.pow(1,value/(Math.pow(10,decimals)* blocksPerDay)) + 1))
    const apy = (Math.pow(value/Math.pow(10,decimals)* blocksPerDay+1,365)-1)*100;
    // console.log(value/(decimals* blocksPerDay));
    return apy;

  }
  export function getDailyRate(rate: string, vdecimals: number) {
    const value = Number(rate);
    const decimals = vdecimals;
    const blocksPerDay = 20 * 60 * 24;
  
    // Calculate daily interest rate
    const dailyRate = (Math.pow(value / Math.pow(10, decimals) * blocksPerDay + 1, 1 / 365) - 1) * 100;
  
    return dailyRate;
  }

export function getExchangeRate(rate: string, vdecimals: number, udecimals: number) {
    const value = Number(rate);
    const decimals = 18 - vdecimals + udecimals;
    const f = value / Math.pow(10, decimals);
    return (1/f).toFixed(6);
  }