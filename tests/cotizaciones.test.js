const request = require('supertest');
const app = require('../index');
const axios = require('axios');

// Mock de axios
jest.mock('axios');

// 3 tests: 

// 1. should return error if no body is provided
// 2. should calculate portfolio value correctly
// 3. should return 404 if market not found

describe('GET /cotizaciones', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1.
  test('should return error if no body is provided', async () => {
    const response = await request(app).get('/cotizaciones');
    expect(response.statusCode).not.toBe(200);
  });

  // 2. 
  test('should calculate portfolio value correctly', async () => {
    // Mock del response de markets
    axios.get.mockResolvedValueOnce({
      data: {
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
    });

    // Mock de las respuestas de las cotizaciones
    axios.post.mockImplementation((url) => {
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
    });

    const requestBody = {
      portfolio: {
        BTC: 0.5,
        ETH: 2.0,
        USDT: 1000
      },
      fiat_currency: 'CLP'
    };

    const response = await request(app)
      .get('/cotizaciones')
      .send(requestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('portfolioValue', 3);
  });

  // 3. 
  test('should return 404 if market not found', async () => {
    // Mock the markets response with missing market
    axios.get.mockResolvedValueOnce({
      data: {
        markets: [
          {
            id: 'BTC-CLP',
            name: 'btc-clp',
            base_currency: 'BTC',
            quote_currency: 'CLP',
          }
          // ETH-CLP is missing
        ]
      }
    });

    const requestBody = {
      portfolio: {
        BTC: 0.5,
        ETH: 2.0 // This will cause a 404 since ETH-CLP market is not available
      },
      fiat_currency: 'CLP'
    };

    const response = await request(app)
      .get('/cotizaciones')
      .send(requestBody);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Market not found for ETH - CLP');
  });
});
