---
title: "Actions and filters in Laravel"
date: "2017-02-17"
categories: laravel wordpress
---
I really like the way events work in WordPress. It’s just really simple how you can hook into difference points in your code.

Yes, Laravel has it’s own event system. But I found this to be both confusing and hard to use. While classes are all fine and dandy, I do feel there are such things as too many of them. I also like the idea of events being triggered on hook names.

So that’s why I made Eventy (yes, stupid name, but that’s what I got).

Eventy is the WordPress action & filters in Laravel. You add actions/filters in your code, and add listeners to them later.

[Check out Eventy on Github!](https://github.com/tormjens/eventy)