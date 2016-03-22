/**
 * @brief [brief description]
 * @details [long description]
 *
 * @param  [description]
 * @return [description]
 */
module.exports = function(server, db) {
    "use strict";
    var SELECT = 'select screen_name, text, location, profile_image, user_id from tweets join users on tweets.user_id = users.id limit 1250;';
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
        socket.on('load_tweets', function(query){
          console.log(query.filter);
          db.serialize(function(){
              let q = 'select screen_name, text, location, profile_image, user_id from ' +
                      'tweets join users where tweets.user_id = users.id limit 50 offset ?;'

              db.each(q, query.offset, function(err, row){
                if(err) throw err;
                io.sockets.emit('tweet_list', row);
              });
            });
        });
    });
}
