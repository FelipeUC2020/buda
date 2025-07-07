const mockMarketsFull = {
    data:{
        markets: [
            {
                id: 'BTC-CLP',
                name: 'btc-clp',
                base_currency: 'BTC',
                quote_currency: 'CLP',
            },
            {
                id: 'ETH-CLP',
                name: 'eth-clp',
                base_currency: 'ETH',
                quote_currency: 'CLP',
            },
            {
                id: 'USDT-CLP',
                name: 'usdt-clp',
                base_currency: 'USDT',
                quote_currency: 'CLP',
            }
        ]
    }
}

const mockMarketsMissingETH = {
    data:{
        markets: [
            {
                id: 'BTC-CLP',
                name: 'btc-clp',
                base_currency: 'BTC',
                quote_currency: 'CLP',
            }, 
            {
                id: 'USDT-CLP',
                name: 'usdt-clp',
                base_currency: 'USDT',
                quote_currency: 'CLP',
            }
        ]
    }
}

module.exports = {mockMarketsFull, mockMarketsMissingETH};