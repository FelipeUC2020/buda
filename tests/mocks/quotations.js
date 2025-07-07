// Mock de las respuestas de las cotizaciones
const mockQuotations = (url) => {
    if (url.includes('BTC-CLP')) {
        return Promise.resolve({
            data: {
            quotation: {
                quote_balance_change: ['1', 'CLP']
            }
            }
        });
    } else if (url.includes('ETH-CLP')) {
        return Promise.resolve({
            data: {
            quotation: {
                quote_balance_change: ['1', 'CLP']
            }
            }
        });
    } else if (url.includes('USDT-CLP')) {
        return Promise.resolve({
            data: {
            quotation: {
                quote_balance_change: ['1', 'CLP']
            }
            }
        });
    }
}

module.exports = {mockQuotations};
