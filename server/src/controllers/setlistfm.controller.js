var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'GET',
  'hostname': 'api.setlist.fm',
  'path': '/rest/1.0/setlist/4bb7d3c2',
  'headers': {
    'accept': 'application/json',
    'x-api-key': 'NAfOueu-etj29FHm3uehzhq5_Ipr3pD68Ii5'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();