---
name: run-tests-in-sail-container
description: How/where to run the test suite for this project (Docker/Sail)
metadata:
  type: project
---

Tests must run **inside the `laravel.test` Sail container**, not on the host — the testing DB host `pgsql` only resolves on the compose network (host shell gets "could not translate host name pgsql").

Run with:
`docker compose exec -T laravel.test php artisan test --compact`

The container is normally already running (`docker compose ps`: laravel.test, pgsql, redis). Output is prefixed with harmless `WWWGROUP`/`WWWUSER` warnings — filter them out. The testing database is a separate `testing` DB, so `RefreshDatabase` is safe.
