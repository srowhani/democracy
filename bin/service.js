#!/usr/bin/env node
/**
 * @author Seena Rowhani
 * service.js
 * Runs job to scrape twitter activity and
 * insert values into sqlite3 db file.
 * @param  {[type]} Twitter, sqlite3, chalk
 * @return void
 */
(function(Twitter, sqlite3, chalk) {
  'use strict';
  var db = new sqlite3.Database('data/twitterfy.db');
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  });
  db.serialize(function() {
    [{
      name: 'tweets',
      params: ['id INTEGER PRIMARY KEY', 'text TEXT', 'user_id INTEGER']
    }, {
      name: 'users',
      params: ['id INTEGER PRIMARY KEY', 'screen_name TEXT', 'profile_image TEXT', 'location TEXT']
    }].forEach(function(e) {
      db.run('create table if not exists ' + e.name + '( ' + e.params.join(', ') + ');')
    });

    client.stream('statuses/filter', {
      lang: 'en',
      track: process.argv[2] || "hello"
    }, function(stream) {
      console.log(chalk.green('Running job...\nPress CTRL + C to exit.'));
      stream.on('data', function(tweet) {
        if (tweet.user.location) {
          db.run('insert into tweets values(?, ?, ?)',
            tweet.id,
            tweet.text,
            tweet.user.id,
            function(e, r) {
              if(e) console.log(chalk.red(e));
            }
          );
          db.run('insert into users values(?, ?, ?, ?)',
            tweet.user.id,
            tweet.user.screen_name,
            tweet.user.profile_image_url,
            tweet.user.location,
            function(e, r) {
              if(e)
                if(e !== 'Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: users.id')
                  console.log(chalk.red(e));
            }
          );
        }
      });
      stream.on('error', function(e) {
        if(e) console.log(chalk.bold.red(e));
      });
    });
  });
})(require('twitter'),
   require('sqlite3'),
   require('chalk'));
require('process').on('SIGINT', function(){
  console.log('\nGoodbye!');
  process.exit();
});
