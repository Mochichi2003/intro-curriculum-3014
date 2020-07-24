'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      const fs = require('fs');
      const rs = fs.createReadStream('./form.html');
      rs.pipe(res);
      break;
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {

        const qs = require('querystring');
        body = Buffer.concat(body).toString();
        const decoded = decodeURIComponent(body);
        const answer = qs.parse(decoded)
        console.log(answer.name + answer.yaki_shabu);
        console.info('[' + now + '] 投稿: ' + decoded);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>名前：' + answer.name + '</h1><h1>' + answer.yaki_shabu + 'が投稿されました</h1></body></html>');
        // res.write()
        res.end();
      });
      break;
    default:
      break;
  }

}).on('error', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  console.error('[' + new Date() + '] Client Error', e);
});
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
