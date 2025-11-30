module.exports = {
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    addPage: jest.fn(),
    addImage: jest.fn(),
    text: jest.fn(),
    line: jest.fn(),
    rect: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    setTextColor: jest.fn(),
    setDrawColor: jest.fn(),
    setFillColor: jest.fn(),
    save: jest.fn(),
    output: jest.fn(() => 'mock-pdf-data'),
    internal: {
      pageSize: {
        getWidth: jest.fn(() => 210),
        getHeight: jest.fn(() => 297)
      }
    }
  }))
};