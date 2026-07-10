---
title: 'How Deck avoids adding latency to your Laravel queues'
date: '2026-07-10'
categories: laravel queues performance
---

One question I get asked a lot, reasonably: doesn't logging every job execution slow down your queues?

The honest answer is it can, if you build it carelessly. Here's how Deck avoids it, because I think the pattern is useful beyond just this one package.

## The short version

The expensive part, an HTTP call to Deck Cloud, never happens in the hot path. It's either batched in memory or deferred until after the response or job is already done. Three deliberate mechanisms make that true.

## 1. Recording runs on the worker, not the dispatching request

The whole capture path hangs off `Queue::before`, `Queue::after`, `Queue::failing`, and `JobAttempted`. For a normal async queue, those fire inside the queue worker process, not in the web request that called `dispatch()`.

Dispatching a job just pushes a payload to Redis or the database. Deck adds nothing to that. For the common case, the user-facing HTTP request sees zero recorder overhead, because the recorder isn't even running yet.

## 2. The cloud sink is an in-memory append, not a network call

This is the important one. The HTTP recorder doesn't make an HTTP call when it "records" something. It calls a buffer's push method, which is just an array append:

```php
public function push(array $event): void
{
    $this->events[] = $event;                        // O(1), no I/O
    if (count($this->events) >= $this->batchSize()) { // default 25
        $this->flush();
        return;
    }
    $this->registerFlushOnTerminate();
}
```

The actual HTTP POST only happens when one of three things trigger it, and none of them is the job body executing:

- the batch fills up (25 events by default)
- `app()->terminating()`, which runs after the HTTP response has already been sent to the client
- after a job finishes, via a listener on `JobAttempted`

## 3. The flush is deferred past the response

The batch registers a callback on Laravel's terminate phase:

```php
app()->terminating(function (): void {
    app(self::class)->flush();
});
```

Terminating callbacks fire after the response is flushed to the browser, via `fastcgi_finish_request`. So even when a job runs synchronously inside a web request, the network round trip to Deck Cloud happens on the server's time, not the user's. The client already has their response before that HTTP call is even made.

## What this means end to end

| Path | What runs synchronously | Network in hot path? |
|---|---|---|
| Web request dispatching an async job | nothing, Deck runs on the worker | no |
| Job body executing on the worker | one local DB write plus array appends | no |
| Cloud delivery | batched POST, on terminate, batch-full, or after-job | yes, but off the hot path |

## Honest caveats

The local database write is still synchronous within the worker's per-job cycle, a single upsert plus a small stats rollup. It's small and wrapped in a resilience layer that fails silently rather than blocking the job, but it isn't free. It adds to the worker's per-job time, just not to the dispatching request or the job's own logic.

The Cloud HTTP client has a 5 second timeout with up to 3 retries and exponential backoff. During a Cloud outage that's real wall-clock time, but it's paid on terminate or between jobs, never inside job execution or before the HTTP response reaches the user.

And because the buffer is in-memory per process, batching only helps when a single request or worker cycle records multiple events, for instance a job's "running" and "completed" states together. A long-lived worker flushing per attempt mostly sends small batches, which is fine, just worth knowing.

## The actual trick

Buffer in memory. Defer the network. Keep the one synchronous write tiny and failure-isolated. Nothing exotic, just making sure the expensive part never runs in the path anyone is actually waiting on.
