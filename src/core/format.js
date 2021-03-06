import { timeFormat } from "d3-time-format";

const locales = ["en-US"];

export const currencyFormatter = new Intl.NumberFormat(locales, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const decimalFormatter = new Intl.NumberFormat(locales, {
  style: "decimal",
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 4,
});

export const fuseFormatter = new Intl.NumberFormat(locales, {
  style: "decimal",
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 8,
});

export const formatDate = timeFormat("%b %d, '%y");

export function formatCurrency(value) {
  return new Intl.NumberFormat(locales, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 0.001 ? 4 : 2,
  }).format(value)
}

export function formatDecimal(value) {
  return decimalFormatter.format(value);
}

export function formatAddress(value) {
  return value;
}
