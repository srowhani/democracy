#!/usr/bin/env node

/**
 * @author Seena Rowhani
 * bluemix_insights.js
 * Iterate through users, (100 to be exact for trial purposes.)
 * Assign personality to their user row.
 * @param  {[type]} Twitter, sqlite3
 * @return void
 */
;
(function(watson, sqlite3, Twitter) {
  'use strict';
  var db = new sqlite3.Database('data/democracy.db');
  var personality_insights = watson.personality_insights({
    username: process.env.BLUEMIX_USER,
    password: process.env.BLUEMIX_PASS,
    version: 'v2'
  });
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  });
  db.serialize(function(){
    db.each('select id from users join insights where users.id = insights.user_id and insights.personality is NULL limit 10',
      function(err, row){
        var id = row.id;
        var query = [];
        db.all('select text from tweets where tweets.user_id = ' + id + ';', function(e, r){
          var a = r.reduce()
        });
      });
  });


})(
  require('watson-developer-cloud'),
  require('sqlite3'),
  require('twitter')
);
