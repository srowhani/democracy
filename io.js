/**
 * @brief [brief description]
 * @details [long description]
 *
 * @param  [description]
 * @return [description]
 */
module.exports = function(server, db) {
    "use strict";
    var SELECT = 'select screen_name, text, location, user_id from tweets join users on tweets.user_id = users.id limit 1250;';
    var io = require('socket.io')(server);
    io.sockets.on('connection', function(socket) {
        socket.on('ready', function(){
          db.serialize(function(){
              db.each(SELECT, function(err, row){
                if(err) throw err;
                io.sockets.emit('data', row);
              });
            });
        });
        socket.on('push', function(d){
          io.sockets.emit('data', d);
          io.sockets.emit('tweet', d);
        });
    });
}
