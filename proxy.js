const proxy = new require('redbird')({
  port: 8080,
  resolvers: [
    function (host, url, req) {
      if (url.startsWith('/api')) {
        return 'http://localhost:3333';
      }
      if (url.startsWith('/docs')) {
        return 'http://localhost:3333';
      }
      return 'http://localhost:4200';
    },
  ],
});

console.log('Started reverse proxy at http://localhost:8080');
