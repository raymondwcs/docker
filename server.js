const express = require('express');
const app = express();

app.get('/',function(req,res) {
  res.send('Node version: ' + process.version);
});

app.listen(process.env.PORT || 8099);