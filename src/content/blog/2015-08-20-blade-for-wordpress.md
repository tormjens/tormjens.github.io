---
title: "Blade for WordPress"
date: "2015-08-20"
categories: wordpress laravel
---
Lately I’ve been working on an internal project that we’ve chosen to build on Laravel. Laravel is packed with amazing things like the Eloquent ORM and the general “easyness” of the API. The most amazing thing, however, is the Blade templating engine. I love this thing!

You can easily extend templates and include them with a breeze. It really helps you with your rapid front-end development.

So, I’m in love with Blade, but I’m primarily a WordPress developer. Sucks to be me right?

Well, no, not really. There are some existing options on how to use Blade in your WordPress theme.

Like the [Blade for WordPress plugin](https://wordpress.org/plugins/blade/), or even the [CutlassWP WordPress theme](http://cutlasswp.com/) (which uses the functionality from the said plugin and is Roots-based). These are great, but the thing is.. They use a really old version of Blade. In fact. It is the Blade that was bundled with Laravel 3. There’s been two iterations of Laravel since then, and in that also Blade.

The other thing is that I’ve gotten used to my own starter theme, so I’m not really feeling like switching to a new theme and start an all new workflow. I should be able to use the latest version of Blade, and I should be able to implement it in my own theme.

> So, why not create my own Blade for WordPress?

I really like using Composer for handling my dependencies, so I decided to make it a class one can include in projects.

It kind of works the same way those other alternatives work, but does not require you to install another plugin or switch out your starter theme.

Have a look! It’s [over at Github](https://github.com/tormjens/wp-blade).