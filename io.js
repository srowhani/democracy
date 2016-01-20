/**
 * @brief [brief description]
 * @details [long description]
 *
 * @param  [description]
 * @return [description]
 */
module.exports = function(server, db) {
    "use strict";
    var SELECT = 'select screen_name, text, location, user_id from tweets join users on tweets.user_id = users.id;';
    var io = require('socket.io')(server);
    var write = function(){
      db.serialize(function(){
          db.each(SELECT, function(err, row){
            if(err) throw err;
            io.sockets.emit('data', row);
          });
        });
    };
    io.sockets.on('connection', function(socket) {
        console.log(socket.id + " has connected...");
        socket.on('ready', write);
        socket.on('push', write);
    });
}
