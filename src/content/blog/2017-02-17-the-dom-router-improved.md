---
title: "The DOM Router improved"
date: "2017-02-17"
categories: javascript
---
I’ve previously written about my port of the DOM router which is bundled with the Sage starter theme.

This handy little mofo has been used on all my client projects for the past 2 years, and I couldn’t be happier.

Something that has annoyed me, however, is that it requires jQuery. There’s not reason jQuery was needed in the first place, but back then I jQueried all the things.

Last week I spent a couple hours one night to port the port to a more usable module. It was also a neat project to write Vanilla-ish javascript.

The result is DumDum.

![DumDum]({{ "/assets/img/blog/pZT27f3.gif" | prepend: site.baseurl }})

DumDum is a ES2015 class and has all the same properties as the old jQuery DOM Router.

You can import/require it to your project. Or simply load up the distribution file to use the browser global.

[Read more on Github](https://github.com/tormjens/dumdum-js)