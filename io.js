/**
 * @brief [brief description]
 * @details [long description]
 *
 * @param  [description]
 * @return [description]
 */
module.exports = function(server, db) {
    "use strict";
    var SELECT = 'select screen_name, text, location, profile_image, user_id from tweets join users on tweets.user_id = users.id limit 2500;';
    var io = require('socket.io')(server);
    io.sockets.on('connection', function(socket) {
        socket.on('ready', function(){
          db.serialize(function(){
              db.all(SELECT, function(err, rows){
                if(err) throw err;
                io.sockets.emit('data', rows);
              });
            });
        });
        socket.on('load_tweets', function(query){
          db.serialize(function(){
              let q = 'select screen_name, text, location, profile_image, user_id from ' +
                      'tweets join users where tweets.user_id = users.id limit 50 offset ?;'

              db.all(q, query.offset, function(err, rows){
                if(err) throw err;
                io.sockets.emit('tweet_list', rows);
              });
            });
        });
    });
}
