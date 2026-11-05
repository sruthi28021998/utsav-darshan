# PRD - Utsav Darshan

## 1. Overview
Utsav Darshan is a web-based, crowdsourced calendar of city-level festivals, fairs, yatras, melas, temple events and cultural programs in India.

## 2. Problem
- No centralized calendar for local festivals
- Information is scattered across posters, WhatsApp and social media
- Tourists miss authentic local events
- Small community events lack visibility
- No verification of listed events

## 3. Goals
Primary: central cultural calendar per city, easy discovery, community contribution, digital preservation of heritage.
Secondary: support local tourism, increase participation, digitize informal knowledge, spread awareness of regional traditions.

## 4. Users
- Visitor: browses and searches events, views details, saves and shares
- Contributor: registers, submits, edits and cancels events
- Admin: moderates submissions, manages categories, handles reports

## 5. Scope
In scope: responsive web app, city-wise listings, crowdsourced submissions, calendar and list views, admin moderation.
Out of scope (phase 1): native apps, ticketing and payments, live streaming, AI recommendations, sponsorship management.

## 6. Functional requirements
- Public: city selection, list, month and week calendar, search by name or city, category filter, event detail with map, save, share, report
- Contributor: register and login, submit event with poster and map location, track status, edit, cancel
- Admin: login, review queue, approve or reject, edit or delete, manage categories, resolve reports, usage stats and activity log

## 7. Non-functional requirements
- Usability: simple navigation for all ages
- Performance: pagination, lazy-loaded images, debounced search
- Security: JWT auth, hashed passwords, role checks, validation, rate limiting, moderation before publishing
- Scalability: multi-city and multi-state data model with indexed city field
- Accessibility: mobile-first responsive layout, low-data friendly
- Reliability: admin-verified listings, cancelled events clearly marked

## 8. Data model
- User: name, email, password hash, contact, role
- Event: name, city, state, location, lat, lng, category, start and end date, description, cultural significance, poster, status, contributor, views, saves
- Category: name
- Report: event, reason, resolved
- Activity: action, user, event, meta

## 9. User flow
Visit platform, select city, browse calendar, open event details. A contributor submits an event, the admin verifies and publishes it, and users see the updated listings.

## 10. KPIs
Events per city, monthly active users, event submission rate, calendar views per user, saves and shares.

## 11. Risks and constraints
- Verifying crowdsourced data: handled by admin moderation and reports
- Language and regional diversity: multi-language support planned
- Date changes and cancellations: edit and cancel flow, cancelled badge

## 12. Future enhancements
Mobile app, multi-language support, reminders and notifications, reviews and photos, tourism department integration, AI suggestions, printable city calendars.