---
title: Btalk — A Social Media App
description: >-
  A social media platform with real-time messaging and post management,
  built with Django and served from AWS.
period: Apr 2023 – Sep 2023
tools:
  - Django REST Framework
  - Django Channels
  - WebSocket
  - PostgreSQL
  - AWS EC2
  - S3
  - CloudFront
status: live
sortOrder: 2
---

Btalk is a social media application where conversations happen live: posts,
feeds, and a chat layer where messages appear the instant they are sent.

## What I built

The entire backend with **Django REST Framework** — users, posts, feeds, and
the social graph — plus a real-time messaging layer on **Django Channels** and
**WebSockets**. Presence indicators and live chat state were persisted to
**PostgreSQL** so nothing was lost on reconnect.

## Infrastructure

- Deployed on an **AWS EC2** instance, with media assets stored in **S3**.
- **CloudFront** as the CDN in front of the app for fast asset delivery
  worldwide.
- **ASGI** serving both HTTP requests and WebSocket connections from a single
  deployment.

## What I learned

Real-time changes your data model. Designing for "what does the client see
when a message arrives mid-scroll" taught me more about API design than any
REST endpoint ever did.
