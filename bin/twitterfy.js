#!/usr/bin/env node
/**
 * [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
(function(Twitter, sqlite3) {
  'use strict';
  var db = new sqlite3.Database('data/twitterfy.db');
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  });
  db.serialize(function(){
    [
      {
        name: 'tweets',
        params: [
          'id INTEGER PRIMARY KEY',
          'text TEXT',
          'user_id TEXT'
        ]
      },
      {
        name: 'users',
        params: [
          'id INTEGER PRIMARY KEY',
          'screen_name TEXT',
          'profile_image TEXT',
          'location TEXT'
        ]
      }
    ].forEach(function(e){
      db.run('create table if not exists ' + e.name + '( ' + e.params.join(', ') + ');')
    });

    client.stream('statuses/filter', {
      lang: 'en',
      track: process.argv[2] || "hello"
    }, function(stream) {
      stream.on('data', function(tweet) {
        db.run('insert into tweets values(?, ?, ?)',
          tweet.id, tweet.text, tweet.user.id);
        db.run('insert into users values(?, ?, ?, ?)',
          tweet.user.id, tweet.user.screen_name, tweet.user.profile_image_url, tweet.user.time_zone);
      });
      stream.on('error', function(error) {
        console.log(error);
      });
    });
  });
})(require('twitter'), require('sqlite3'));
