/**
 * @brief [brief description]
 * @details [long description]
 *
 * @param  [description]
 * @return [description]
 */
module.exports = function(server, db) {
    "use strict";
    var SELECT = 'select screen_name, text, location, profile_image, user_id, personality from tweets join users on tweets.user_id = users.id limit 2500;';
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
          console.log(query);
          db.serialize(function(){

              var q = 'select screen_name, text, location, profile_image, user_id from ' +
                      'tweets join users where tweets.user_id = users.id and (screen_name like $filter or text like $filter) order by personality ASC limit $limit offset $offset;'

              db.all(q, {
                $filter : "%" + query.filter + "%",
                $offset : query.offset,
                $limit  : query.limit
              }, function(err, rows){
                if(err) throw err;
                io.sockets.emit('tweet_list', rows);
              });
            });
        });
    });
}
