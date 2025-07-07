const request = require('supertest');
const app = require('../index.js');
const axios = require('axios');

// Mock de axios
jest.mock('axios');

const {mockMarketsFull, mockMarketsMissingETH} = require('./mocks/markets');
const {mockQuotations} = require('./mocks/quotations');

// 4 tests: 

// 1. should return error if no body is provided
// 2. should calculate portfolio value correctly
// 3. should return 404 if market not found
// 4. should return balance changes equal to the sum of each portfolio value

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
    axios.get.mockResolvedValueOnce(mockMarketsFull);

    // Mock de las respuestas de las cotizaciones
    axios.post.mockImplementation(mockQuotations);

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
    axios.get.mockResolvedValueOnce(mockMarketsMissingETH);

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
  });

  // 4. 
  test("should return balance changes equal to the sum of each portfolio value", async() => {
    // Mock del response de markets
    axios.get.mockResolvedValueOnce(mockMarketsFull);

    // Mock de las respuestas de las cotizaciones
    axios.post.mockImplementation(mockQuotations);

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
    expect(response.body.portfolioValue).toBe(response.body.detalle.reduce((sum, changeObj) => sum + parseFloat(changeObj.fiatValue), 0));
  })
});
