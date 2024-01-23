
var currencyFormatter = require('currency-formatter');
export const currencyFormatterConfig = (money: any) => currencyFormatter.format(money, { code: 'VND' })