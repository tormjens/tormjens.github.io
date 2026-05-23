---
title: "Bringing the queue to WordPress"
date: "2017-08-02"
categories: wordpress laravel
---
In Laravel you have the concept of queues, where you push a job in to the queue and a queue worker executes jobs asynchronously one by one. This is a great feature of Laravel.

At OSM Aviation we send a great amount of emails from our website. Sometimes we might need to send thousands of emails at the same time. This is an operation that would get real slow real fast; an ideal job for a queue.

Sadly, WordPress does not have such feature. The wp_mail function is a fire and forget kind of feature. Luckily there are many smart people out there, and there is a solution for features.

##### Finding the perfect solution

During my search for WordPress Queues I first found a solution which runs through wp-cron. This however ended up as a bottle-neck when sending many emails and ended up bringing our whole site down for a couple of hours. Not optimal for a mission-critical website.

A promising solution was a neat plugin created by A5hleyRich. This took care of the queue problem, but it had some shortcomings. There was no CLI, so it was not ready for production. Based on this great plugin I found a hidden gem in MailChimp for WooCommerce plugin. They had created a command for WP-CLI that ran a queue worker. They had also implemented a “failed_jobs” feature which could prove handy if something went wrong. None of these solutions took care of mail problem though. So I would have to wire something up myself.

##### Putting it together

I found this to be a fun little exercise in using WordPress’ pluggable functions. Since wp_mail can not be short-circuited, I figured I could just create my own wp_mail function that would be used in favor of the one in WP core. I took the original wp_mail function from core, and created it as a new function called wp_real_mail. This would send e-mail directly via the credentials provided in the application.

The wp_mail function’s only task would be to push anything thats sent through it to the new Queue system. Using the great work from the MailChimp-plugin this function boils down to two lines.

E-mails sent via the website is now served up using a queue, allowing us to send as many e-mails as we need in one go without having to worry about it taking several minutes to execute. Actually, since June we’ve sent over 15000 emails using this new queue feature and haven’t had a single mail that hasn’t been sent.

The queue worker is run on the server by Supervisor, so it is restarted when it crashes.

##### Check it out now

It has all been bundled up in a plugin that is availiable on Github, along with its documentation. Since it replaces the wp_mail function I recommend you put in your `mu-plugins` directory.

[Check it out on Github now!](https://github.com/tormjens/wp-queue-mail)