select screen_name, max(count) as num_tweets from (select screen_name, count(*) as count from tweets join users where user_id = users.id group by user_id);
