// ver: https://api.buda.com/?python#rest-api-llamadas-publicas-cotizaciones

const axios = require('axios');
const buildUrl = require('../helpers/buildUrl');
const marquetsUrl = buildUrl("/markets");

const getCotizaciones = async (req, res) => {

    // body de la forma: 
    // {
    //     "portfolio": {
    //         "BTC": 0.5,
    //         "ETH": 2.0,
    //         "USDT": 1000
    //     },
    //     "fiat_currency": "CLP"
    // }

    const { portfolio, fiat_currency } = req.body

    // 1.  primero obtener los markets
    const marketsResponse = await axios.get(marquetsUrl)
    const markets = marketsResponse.data.markets

    // 2. buscar los markets_id que nos sirvan 

    // cada market es de la forma:
    // {
    //     id: 'BTC-CLP',
    //     name: 'btc-clp',
    //     base_currency: 'BTC',       
    //     quote_currency: 'CLP',
    //     ...
    //     
    // }

    const marketKeys = {} // diccionario marketKey -> amount
    Object.keys(portfolio).forEach(key => {
        const market = markets.find(market => market.base_currency === key && market.quote_currency === fiat_currency)
        if (!market) {
            return res.status(404).json({
                message: `Market not found for ${key} - ${fiat_currency}`
            })
        }
        marketKeys[market.id] = portfolio[key]
    })

    // 3. ahora teniendo (todos) los market keys, realizamos simulaciones para obtener las cotizaciones
    // POST '/markets/<market_id>/quotations
    // y el 'type' es: ask_given_size ... Simula una orden de venta donde amount representa 
    // la cantidad de base_currency a gastar. (ej: ¿Cuánto btc recibiría si ejecuto una orden de venta por amount eth?)

    try {
        let portfolioValue = 0

        // no hay async en forEach, entonces metemos las operaciones a un map
        const quotationPromises = Object.entries(marketKeys).map(async ([marketKey, amount]) => {
            console.log(`simulando para ${marketKey} con ${amount}`)
            const url = buildUrl(`/markets/${marketKey}/quotations`)
            const response = await axios.post(url, {
                type: 'ask_given_size',
                amount: amount
            })
            console.log("response de simulacion: ", response.data)
            return response.data.quotation.quote_balance_change[0] 
        })

        // Se espera a que resuelvan en un objeto balanceChanges
        const balanceChanges = await Promise.all(quotationPromises)
        
        // Al final se hace una reduccion para el balance (parece hpc)
        portfolioValue = balanceChanges.reduce((sum, change) => sum + parseFloat(change), 0)

        res.status(200).json({
            message: 'Cotizaciones obtenidas',
            portfolioValue,
            fiat_currency
        })

    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener cotizaciones',
            error: error.message
        })
    }
}

module.exports = getCotizaciones