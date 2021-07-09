const server = require('./server');

if (require.main === module) {
  server.listen(3000, '0.0.0.0', () => {
    console.log('API Running on port 3000');
  });
}
