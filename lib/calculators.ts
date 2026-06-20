/** Shared finance formulas for Indian calculators. */

export interface AmortRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export function computeEmi(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) {
    return {
      emi: 0,
      totalPayment: 0,
      totalInterest: 0,
      schedule: [] as AmortRow[],
    };
  }
  const r = annualRate / 12 / 100;
  let emi: number;
  if (r === 0) {
    emi = principal / months;
  } else {
    const factor = Math.pow(1 + r, months);
    emi = (principal * r * factor) / (factor - 1);
  }

  const schedule: AmortRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let m = 1; m <= months; m++) {
    const interest = r === 0 ? 0 : balance * r;
    const principalPart = emi - interest;
    balance = Math.max(balance - principalPart, 0);
    totalInterest += interest;
    schedule.push({
      month: m,
      emi,
      principal: principalPart,
      interest,
      balance,
    });
  }

  return {
    emi,
    totalPayment: emi * months,
    totalInterest,
    schedule,
  };
}

export type CompoundingFrequency = "annually" | "quarterly" | "monthly";

export function computeFd(
  principal: number,
  annualRate: number,
  years: number,
  frequency: CompoundingFrequency,
) {
  if (principal <= 0 || years <= 0) {
    return { maturity: 0, interest: 0, effectiveYield: 0 };
  }
  const n =
    frequency === "annually" ? 1 : frequency === "quarterly" ? 4 : 12;
  const ratePerPeriod = annualRate / 100 / n;
  const periods = n * years;
  const maturity =
    ratePerPeriod === 0
      ? principal
      : principal * Math.pow(1 + ratePerPeriod, periods);
  const interest = maturity - principal;
  const effectiveYield =
    years > 0 ? (Math.pow(maturity / principal, 1 / years) - 1) * 100 : 0;
  return { maturity, interest, effectiveYield };
}

export function computeRd(
  monthlyDeposit: number,
  annualRate: number,
  months: number,
) {
  if (monthlyDeposit <= 0 || months <= 0) {
    return { maturity: 0, totalDeposited: 0, interest: 0 };
  }
  const i = annualRate / 12 / 100;
  const totalDeposited = monthlyDeposit * months;
  if (i === 0) {
    return { maturity: totalDeposited, totalDeposited, interest: 0 };
  }
  const maturity =
    monthlyDeposit *
    ((Math.pow(1 + i, months) - 1) / i) *
    (1 + i);
  const interest = maturity - totalDeposited;
  return { maturity, totalDeposited, interest };
}

export interface PpfYearRow {
  year: number;
  deposit: number;
  interest: number;
  balance: number;
}

export function computePpf(
  annualDeposit: number,
  annualRate: number,
  years: number,
) {
  const schedule: PpfYearRow[] = [];
  let balance = 0;
  let totalInterest = 0;
  const deposit = Math.min(Math.max(annualDeposit, 0), 150000);

  for (let y = 1; y <= years; y++) {
    balance += deposit;
    const interest = balance * (annualRate / 100);
    balance += interest;
    totalInterest += interest;
    schedule.push({ year: y, deposit, interest, balance });
  }

  return { maturity: balance, totalDeposited: deposit * years, totalInterest, schedule };
}

export function computeHraExemption(
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean,
) {
  const tenPercentBasic = basicSalary * 0.1;
  const rentMinusTen = Math.max(rentPaid - tenPercentBasic, 0);
  const salaryPercent = basicSalary * (isMetro ? 0.5 : 0.4);
  const exempt = Math.min(hraReceived, rentMinusTen, salaryPercent);
  const taxable = Math.max(hraReceived - exempt, 0);

  let limitingFactor: string;
  if (exempt === hraReceived) {
    limitingFactor = "Actual HRA received";
  } else if (exempt === rentMinusTen) {
    limitingFactor = "Rent paid − 10% of basic";
  } else {
    limitingFactor = isMetro
      ? "50% of basic salary (metro)"
      : "40% of basic salary (non-metro)";
  }

  return { exempt, taxable, limitingFactor };
}
