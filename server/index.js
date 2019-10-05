/**
 * 
 * 
 * https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
 * 
 * https://github.com/hendrikswan/socket-io-realtime
 */

const io = require('socket.io')();

const express = require('express')
const app = express()
var cors = require('cors');

//app.use(cors());

function getr(low, high){
  return (Math.random() * (high - low) + low)
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Access-Control-Allow-Credentials
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

io.on('connection', (client) => {
  
  
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });

  client.on('update', (data) => {
    console.log('updating the socket setver ', data);
  });

});

var cron = require('cron');
var cronJob = cron.job("*/5 * * * * *", function(){
    // perform operation e.g. GET request http.get() etc.
    console.info('cron job called');

    io.sockets.emit('event', {message : 'Cron job'+getr(1, 100)});
}); 
cronJob.start();

const port = 3002;
io.listen(port);
console.log('listening on port ', port);