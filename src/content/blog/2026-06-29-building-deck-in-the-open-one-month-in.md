---
title: 'Building Deck in the open: one month in'
date: '2026-06-29'
categories: laravel indie-hacking
---

A month ago I shipped Deck — an open source Laravel package that adds a durable execution log and incident controls on top of Horizon. I wrote about why I built it. This is the part nobody writes about: what actually happens after you hit publish.

Short version: not much, and then a little.

## The numbers, honestly

Package public on GitHub for about three weeks. 450,000+ executions processed through Deck Cloud so far, zero issues. Submitted to Laravel News, which got picked up in their links section and later posted to their LinkedIn (143k followers). One X thread. One blog post that got shared a bit further than I expected on Twitter and LinkedIn.

Result so far: a handful of teams signed up for Deck Cloud early access. Zero have subscribed. One GitHub star from someone I don't know. One real bug report.

That's it. That's the whole scoreboard a month in.

If you're expecting a hockey-stick story, this isn't it. If you're wondering what realistic early traction actually looks like for a niche developer tool with zero marketing budget, maybe it's useful.

## The bug report was the best thing that happened

A few days after the Laravel News post, someone opened an issue. They'd configured Laravel to use `CarbonImmutable` globally, and Deck's dashboard threw a fatal type error — one of my methods was type-hinted to the mutable `Carbon` class specifically.

They didn't just report it. They diagnosed it, found the exact line, and suggested the fix (use `CarbonInterface` instead). I shipped the patch the same day.

That mattered more to me than the GitHub star count. A stranger installed Deck, configured their app properly, hit an edge case, and cared enough to write it up well. That's the first real signal that something I built is being used the way I imagined it being used — not by me, by someone else, in their own production app.

## What's converting and what isn't

Traffic is real but thin. A spike from the Laravel News links page, a bigger spike when they posted it to LinkedIn, a steady trickle from the blog post itself. Visitors read the docs in real depth — getting started, usage, the Horizon comparison page — which tells me the people who do show up are seriously evaluating, not just browsing.

What isn't converting yet is the actual subscription. A few teams are sitting behind the early access gate, signed up but not yet paying. That's the honest bottleneck right now, and the most useful thing I can do this month isn't more marketing — it's following up with the people already in the funnel and finding out what's stopping them.

## What I'd tell someone about to launch something like this

Don't expect a bug report or a newsletter spike to feel like momentum in the moment. Each one felt small on its own. It's only writing it down a month later that it looks like something is actually happening.

The package itself costs me about €3 a month to run. Whatever happens next, that's a cheap enough bet that there's no reason to stop.

If you're running Laravel queues in production and have ever lost a job's history right when you needed it, I'd genuinely like to hear what you'd want from something like Deck. Open an issue, reply on X, or just try it: `composer require deck/deck`.
