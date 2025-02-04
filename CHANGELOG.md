# Changelog
## Unreleased
### Backend
  - Upgraded `worship-posts-consumer` and `worship-services-sensitive-consumer` [DL-6424]

### Deploy notes
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
      DCR_SYNC_BASE_URL: 'https://loket.lblod.info/' # The endpoint of your choice
      DCR_SYNC_LOGIN_ENDPOINT: 'https://loket.lblod.info/sync/worship-services-sensitive-deltas/login'
      DCR_SECRET_KEY: "the-key-of-interest"
      DCR_LANDING_ZONE_DATABASE: "triplestore"
      DCR_REMAPPING_DATABASE: "triplestore"
      DCR_DISABLE_DELTA_INGEST: "true"
      DCR_DISABLE_INITIAL_SYNC: "false"
  worship-posts-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://organisaties.abb.lblod.info/"
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
      DCR_SYNC_BASE_URL: "https://loket.lblod.info" # or another endpoint
      DCR_SYNC_LOGIN_ENDPOINT: "https://loket.lblod.info/sync/worship-services-sensitive/login" # or another endpoint
      DCR_SECRET_KEY: "key-of-the-producer"
      DCR_LANDING_ZONE_DATABASE: "db"
      DCR_REMAPPING_DATABASE: "db"
      DCR_DISABLE_DELTA_INGEST: "false"
      DCR_DISABLE_INITIAL_SYNC: "false"
  worship-posts-consumer:
    environment:
      DCR_SYNC_BASE_URL: "https://organisaties.abb.lblod.info/"
      DCR_LANDING_ZONE_DATABASE: "db"
      DCR_REMAPPING_DATABASE: "db"
      DCR_DISABLE_DELTA_INGEST: "false"
      DCR_DISABLE_INITIAL_SYNC: "false"
```
And to finish:
```
drc up -d
```
