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
(function(sentiment, sqlite3, Twitter) {
  'use strict';
  var db = new sqlite3.Database('data/democracy.db');
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  });
  db.serialize(function() {
    db.all('SELECT * FROM users JOIN tweets ON users.id = tweets.user_id WHERE personality = NULL ORDER BY users.id ',
      function(err, rows) {
        if (err) throw err;
        var co = {};
        rows.forEach(function(e) {
          var s = sentiment(e.text).score;
          co[e.user_id] = co[e.user_id] === undefined ? co[e.user_id] + s : s;
        });
        Object.keys(co).forEach(function(el) {
          db.serialize(function(err) {
            db.run('UPDATE users set personality = ? where id = ?', co[el], el);
          });
        });
      });
  });
})(
  require('sentiment'),
  require('sqlite3'),
  require('twitter')
);
