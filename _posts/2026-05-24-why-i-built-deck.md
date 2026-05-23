---
title: "Why I built a queue control plane on top of Laravel Horizon"
date: "2026-05-24"
categories: laravel queues
---
If you've run Laravel in production long enough, you've had this moment.

A customer reports something didn't happen. You check Horizon. The job ran, or maybe it didn't, but the history is already gone. Redis has moved on. You're left piecing together what happened from logs, guesswork, and a sinking feeling that you're missing something obvious.

That moment is why I built Deck.

## Horizon is great. But it's not built for this.

I want to be clear. This isn't a criticism of Horizon. It's excellent at what it does. Worker supervision, queue balancing, throughput metrics, failed job retries. Horizon handles all of that well and I still run it on every project.

But Horizon is a runtime tool. It tells you what's happening right now, and what happened recently. Redis retention is short by design. That's not a bug, it's just not what Horizon is for.

What Horizon doesn't give you is a memory.

There's no durable per-job history that survives past Redis retention. No way to search across job classes and see when something last ran successfully. No way to cleanly stop a runaway job without a forced kill. No alert when a job class that should run every hour hasn't run in three.

For small apps with simple queues, that's fine. For production systems with real complexity, it starts to hurt.

## What I actually needed

I'm an engineering manager running Laravel applications in production. Our queues process hundreds of thousands of jobs per month. Emails, events, syncs, webhooks. When something goes wrong, I need to know what happened, when it happened, and why.

I needed something that kept a durable, searchable log of every job execution in my database, let me cancel a runaway job cleanly without SIGTERM or forced kills, alerted me when a job class stopped running, let me temporarily block a noisy job class without a redeploy, and worked alongside Horizon, not instead of it.

Nothing existed that did all of this. So I built it.

## Introducing Deck

Deck is a Laravel package that adds job-class observability on top of Horizon. Every dispatch lands in your database with start time, finish time, status, attempt count, and tags. That history outlasts Redis retention by months.

Getting started takes one command:

    composer require deck/deck

From there you get a full dashboard at `/deck` with searchable job history, per-class metrics, and the tools to actually manage your queue operations rather than just observe them.

The cooperative cancellation feature is the one I'm most proud of. Add the `Cancellable` middleware to any job, drop a checkpoint between steps, and you can stop it cleanly from the dashboard. No forced kills, no orphaned writes, no "did that retry?" guessing.

## Using it in production

I've been running Deck on our production systems for the past few weeks. It has already caught things I wouldn't have noticed otherwise. A job class that quietly stopped processing, a webhook dispatcher timing out intermittently, a sync job taking three times longer than it should.

Having that history changes how you debug. Instead of piecing things together after the fact, you just look it up.

## What's next

The package is MIT licensed and free forever. I'm also building Deck Cloud, a hosted dashboard that gives your whole team one pane of glass across all your projects and environments, with Slack alerts, team roles, and 30-day execution retention.

Deck Cloud is in early access. If you're interested, join the waitlist at [deckapp.cloud](https://deckapp.cloud).

And if you try the package and something doesn't work, open an issue. I read everything.
