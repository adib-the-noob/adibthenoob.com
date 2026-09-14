---
title: Adaptive Video Transcoder
description: >-
  A scalable, event-driven video transcoding pipeline enabling Adaptive
  Bitrate Streaming for video platforms.
period: "2025"
tools:
  - AWS Lambda
  - SQS
  - S3
  - ECS
  - ECR
  - FFmpeg
  - HLS
status: live
sortOrder: 1
---

A video platform is only as good as its worst network condition. This project
is a transcoding pipeline that takes a single uploaded master video and turns
it into a ladder of renditions — so every viewer gets a smooth stream whether
they are on fibre or a patchy mobile connection.

## How it works

Uploads land in **S3**, which emits an event that enqueues a transcoding job on
**SQS**. Serverless workers on **AWS Lambda** pick jobs off the queue, run
**FFmpeg** to transcode the master into multiple bitrates, and segment the
output into **HLS** playlists. Containerized services deployed on **ECS**
(pulled from **ECR**) handle the longer, heavier jobs that outlive Lambda's
execution window.

## Design decisions

- **Event-driven over cron-driven** — SQS decouples ingestion from processing,
  so spikes in uploads queue up instead of toppling the system.
- **Serverless for the bursty part** — Lambda scales to zero when idle and
  fans out under load without capacity planning.
- **Adaptive Bitrate Streaming** — FFmpeg produces a rendition ladder and HLS
  manifests, letting players switch quality mid-stream as network conditions
  change.
- **Containers for the long tail** — ECS absorbs transcoding jobs too heavy
  for Lambda's limits, keeping the architecture heterogeneous but simple.

## What I learned

Designing for failure at queue level changes everything: retries, dead-letter
queues, and idempotent workers turned out to matter more than raw transcoding
performance.
