export const formatAED = (amount: number | string | undefined | null) => {
    if (amount === undefined || amount === null) return '';
    const num = Number(amount);
    if (isNaN(num)) return '';
    const formatted = num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return 'AED ' + formatted;
};
