#!/usr/bin/env node
/**
 * [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
(function(Twitter) {
  'use strict';
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  });
  console.log(process.argv);
  client.stream('statuses/filter', {
    lang: 'en',
    track: process.argv[2]
  }, function(stream) {
    stream.on('data', function(tweet) {
      console.log(tweet.text);
    });
    stream.on('error', function(error) {
      console.log(error);
    });
  });

})(require('twitter'));
