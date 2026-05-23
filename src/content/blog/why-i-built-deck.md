---
title: 'Why I built a queue control plane on top of Laravel Horizon'
date: '2026-05-24'
categories: laravel queues
---

If you've run Laravel in production long enough, you've had this moment.

A customer reports something didn't happen. You check Horizon. The job ran, or maybe it didn't, but the history is already gone. Redis has moved on. You're left piecing together what happened from logs, guesswork, and a sinking feeling that you're missing something obvious.

That moment is why I built Deck.

## Horizon is great. But it's not built for this.

I want to be clear. This isn't a criticism of Horizon. It's excellent at what it does. Worker supervision, auto-balancing, throughput metrics, failed job retries. Horizon handles all of that well and I still run it on every project.

But Horizon is a runtime tool. It tells you what's happening right now, and what happened recently. Redis retention is short by design. That's not a bug, it's just not what Horizon is for.

What Horizon doesn't give you is a memory.

There's no durable per-job history that survives past Redis retention. No way to answer "when did ProcessInvoice last succeed?" No safe way to stop or block a job class from a dashboard. No alert when a job class that should run every hour hasn't run in three.

For small apps with simple queues, that's fine. For production systems with real complexity, it starts to hurt.

## What I actually needed

I'm an engineering manager running Laravel applications in production. Our queues process hundreds of thousands of jobs per month. Emails, events, syncs, webhooks. When something goes wrong, I need to know what happened, when it happened, and why.

I needed something that kept a durable, searchable log of every job execution, let me answer "when did this job class last run successfully?", let me cancel a runaway job cleanly without forced kills, alerted me when a job class stopped running, and let me temporarily block a noisy job class without a redeploy. All working alongside Horizon, not instead of it.

Nothing existed that did all of this. So I built it.

## Introducing Deck

Deck is a Laravel package that adds a job-class control plane on top of your existing queue setup. After installation, Deck listens to queue events and records every start, completion, and failure automatically. No code changes required for basic history.

Getting started takes three commands:

```bash
composer require deck/deck
php artisan deck:install
php artisan migrate
```

From there you get a full dashboard at `/deck` with searchable job history at `/deck/activity`, per-class stats and last run status at `/deck/classes`, and worker health at `/deck/workers`.

Deck does not run workers. Keep `php artisan horizon` running as normal. Installing Deck only adds observability and controls on top of what you already have.

Execution history is kept for 90 days by default. Deck does not store serialized job payloads, so there are no privacy concerns around sensitive data passing through your queues.

## Cooperative cancellation

For jobs you want to make cancellable, add the `Cancellable` middleware and drop a checkpoint between steps:

```php
use Deck\Deck\Middleware\Cancellable;
use Deck\Deck\Cancellation\JobCancellation;

class GenerateReport implements ShouldQueue
{
    public function middleware(): array
    {
        return [new Cancellable];
    }

    public function handle(): void
    {
        foreach ($this->steps() as $step) {
            JobCancellation::throwIfCancelled($this->job);
            $step->run();
        }
    }
}
```

Deck does not force-kill workers. The job notices the cancel flag on its next checkpoint and stops cleanly. No orphaned writes, no "did that retry?" guessing.

## Blocking job classes during incidents

One of the most useful features in production is being able to block a job class at dispatch without a redeploy:

```php
Deck::blockClass(\App\Jobs\SyncInventory::class, until: now()->addHour(), reason: 'Upstream API outage');
```

Blocked jobs are intercepted at dispatch and recorded with a `blocked` status. When the incident is resolved, unblock from the dashboard or in code.

The incident response flow is: block first, cancel any long-running in-flight work, fix the underlying issue, then retry from the activity log.

## Using it in production

I've been running Deck on our production systems for the past few weeks. It has already caught things I wouldn't have noticed otherwise. A job class that quietly stopped processing, a webhook dispatcher timing out intermittently, a sync job taking three times longer than it should.

For busy apps, Deck recommends a dedicated database connection since it appends a row on every job start, completion, and failure. On high-volume queues that adds up fast and you don't want it competing with your primary application database.

Having that history changes how you debug. Instead of piecing things together after the fact, you just look it up.

## What's next

The package is MIT licensed and free forever. I'm also building Deck Cloud, a hosted dashboard that gives your whole team one pane of glass across all your projects and environments, with Slack alerts, team roles, and 30-day execution retention.

Deck Cloud is in early access. If you're interested, join the waitlist at [deckapp.cloud](https://deckapp.cloud).

And if you try the package and something doesn't work, open an issue. I read everything.