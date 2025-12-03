# Changelog
## Unreleased
### Backend
- Set up the dashboard app (OP-3561)

### Deploy notes
`drc up -d report-generation frontend-dashboard dashboard-login identifier; drc restart dispatcher resource db`

## 1.2.10 (2025-10-15)
### Frontend
- Bump frontend
### Deploy Notes
```
drc pull frontend; drc up -d frontend
```
## 1.2.9 (2025-06-26)
### Frontend
- Bump to [v1.2.4](https://github.com/lblod/frontend-worship-organizations/blob/v1.2.4/CHANGELOG.md#124-2025-06-26)
### Deploy Notes
```
drc pull frontend; drc up -d frontend
```

## 1.2.8 (2025-06-13)
- Bump frontend to v1.2.3 [DL-5635]

### Deploy Notes
```
drc up -d frontend
```

## 1.2.7 (2025-04-15)
  - Update regular database config (`virtuoso.ini`)
  - Add missing compose keys. [DL-6490]
  - Reorganize delta consumers config to harmonize with the ecosystem
  - Fix bug in positions-dispatcher
### Deploy Notes
The production instance already has the updated production config. This is intented for local, DEV and QA instances that may be using the regular configuration:
```
drc restart triplestore && drc logs -ft --tail=200 triplestore
```
```
drc up -d triplestore error-report-service privacy worship-services-sensitive-consumer worship-posts-consumer
```
and for the positions dispatcher fix, to ensure the app will be starting from a clean state and as it's a readonly application, we'll remove the db and start from scratch:
```
# Create the backup
/data/useful-scripts/virtuoso-backup.sh `docker ps --filter "label=com.docker.compose.project=app-worship-organizations" --filter "label=com.docker.compose.service=triplestore" --format "{{.Names}}"`
# Store it on a different server
/data/useful-scripts/remote-backup.sh u425986-sub2@u425986-sub2.your-storagebox.de 23 /root/.ssh/backups_rsa
```

Then, we proceed
```
drc down
rm -rf data
```
Update `docker-compose.override.yml` to remove the config of `worship-services-sensitive-consumer` and replace it by:
```
  worship-services-sensitive-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://loket.lokaalbestuur.vlaanderen.be" # The endpoint of your choice
      DCR_SYNC_LOGIN_ENDPOINT: "https://loket.lokaalbestuur.vlaanderen.be/sync/worship-services-sensitive/login"
      DCR_SECRET_KEY: "the-key-of-interest"
      DCR_LANDING_ZONE_DATABASE: "triplestore"
      DCR_REMAPPING_DATABASE: "triplestore"
      DCR_DISABLE_DELTA_INGEST: "true"
      DCR_DISABLE_INITIAL_SYNC: "false"
  worship-posts-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://organisaties.abb.vlaanderen.be"
      DCR_LANDING_ZONE_DATABASE: "triplestore"
      DCR_REMAPPING_DATABASE: "triplestore"
      DCR_DISABLE_DELTA_INGEST: "true"
      DCR_DISABLE_INITIAL_SYNC: "false"
```
Then:
```
drc up -d triplestore migrations
drc up -d worship-services-sensitive-consumer worship-posts-consumer positions-dispatcher
# Wait until success of the previous step
```
Then, update `docker-compose.override.yml` to:
```
  worship-services-sensitive-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://loket.lokaalbestuur.vlaanderen.be" # The endpoint of your choice
      DCR_SYNC_LOGIN_ENDPOINT: "https://loket.lokaalbestuur.vlaanderen.be/sync/worship-services-sensitive/login"
      DCR_SECRET_KEY: "key-of-the-producer"
      DCR_LANDING_ZONE_DATABASE: "db"
      DCR_REMAPPING_DATABASE: "db"
      DCR_DISABLE_DELTA_INGEST: "false"
      DCR_DISABLE_INITIAL_SYNC: "false"
  worship-posts-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://organisaties.abb.vlaanderen.be"
      DCR_LANDING_ZONE_DATABASE: "db"
      DCR_REMAPPING_DATABASE: "db"
      DCR_DISABLE_DELTA_INGEST: "false"
      DCR_DISABLE_INITIAL_SYNC: "false"
```
And to finish:
```
drc up -d
```
## 1.2.6 (2025-02-26)
### Backend
  - Bump `triplestore` to `v1.3.0-rc.1`. [DL-6398]
### Deploy Notes
#### Database Upgrade
Follow the Virtuoso upgrade instructions listed [here](https://github.com/Riadabd/upgrade-virtuoso).
#### Changes to Worship Services Sensitive Consumer
```shell
drc up -d worship-services-sensitive-consumer
```
## 1.2.5 (2025-02-18)
### Backend
  - Upgraded `worship-posts-consumer` and `worship-services-sensitive-consumer` [DL-6424]
  - Bump core services for maintenance [DL-6247]

### Deploy notes

#### Consumer bumps

We are going to get rid of the database so first, make sure you create and store a backup
```
# Create the backup
/data/useful-scripts/virtuoso-backup.sh `docker ps --filter "label=com.docker.compose.project=app-worship-organizations" --filter "label=com.docker.compose.service=triplestore" --format "{{.Names}}"`
# Store it on a different server
/data/useful-scripts/remote-backup.sh u425986-sub2@u425986-sub2.your-storagebox.de 23 /root/.ssh/backups_rsa
```

Then, we proceed
```
drc down
rm -rf data
```
Update `docker-compose.override.yml` to remove the config of `worship-services-sensitive-consumer` and replace it by:
```
  worship-services-sensitive-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://loket.lokaalbestuur.vlaanderen.be" # The endpoint of your choice
      DCR_SYNC_LOGIN_ENDPOINT: "https://loket.lokaalbestuur.vlaanderen.be/sync/worship-services-sensitive/login"
      DCR_SECRET_KEY: "the-key-of-interest"
      DCR_LANDING_ZONE_DATABASE: "triplestore"
      DCR_REMAPPING_DATABASE: "triplestore"
      DCR_DISABLE_DELTA_INGEST: "true"
      DCR_DISABLE_INITIAL_SYNC: "false"
  worship-posts-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://organisaties.abb.vlaanderen.be"
      DCR_LANDING_ZONE_DATABASE: "triplestore"
      DCR_REMAPPING_DATABASE: "triplestore"
      DCR_DISABLE_DELTA_INGEST: "true"
      DCR_DISABLE_INITIAL_SYNC: "false"
```
Then:
```
drc up -d triplestore migrations
drc up -d worship-services-sensitive-consumer worship-posts-consumer positions-dispatcher
# Wait until success of the previous step
```
Then, update `docker-compose.override.yml` to:
```
  worship-services-sensitive-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://loket.lokaalbestuur.vlaanderen.be" # The endpoint of your choice
      DCR_SYNC_LOGIN_ENDPOINT: "https://loket.lokaalbestuur.vlaanderen.be/sync/worship-services-sensitive/login"
      DCR_SECRET_KEY: "key-of-the-producer"
      DCR_LANDING_ZONE_DATABASE: "db"
      DCR_REMAPPING_DATABASE: "db"
      DCR_DISABLE_DELTA_INGEST: "false"
      DCR_DISABLE_INITIAL_SYNC: "false"
  worship-posts-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://organisaties.abb.vlaanderen.be"
      DCR_LANDING_ZONE_DATABASE: "db"
      DCR_REMAPPING_DATABASE: "db"
      DCR_DISABLE_DELTA_INGEST: "false"
      DCR_DISABLE_INITIAL_SYNC: "false"
```
And to finish:
```
drc up -d
```

#### Other core services bump

Should have been taken care of during the consumer bumps. But if ran separately, don't forget to run:
```
drc up -d
```
