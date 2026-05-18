# UniVoice Backend

Java Spring Boot REST API for the UniVoice complaint system.

## Run

```powershell
cd backend
mvn spring-boot:run
```

The API runs on `http://localhost:8080`.

## Main Endpoints

- `GET /api/complaints?q=&status=&priority=` - list and filter complaints
- `POST /api/complaints` - create a complaint
- `GET /api/complaints/{id}` - get one complaint
- `PUT /api/complaints/{id}` - update complaint details
- `PATCH /api/complaints/{id}/status` - body: `{ "status": "Resolved" }`
- `PATCH /api/complaints/{id}/assignment` - body: `{ "assignedTo": "Staff Name" }`
- `PATCH /api/complaints/{id}/due-date` - body: `{ "dueDate": "2026-05-31T15:59:59Z" }`
- `POST /api/complaints/{id}/comments` - body: `{ "text": "Comment text" }`
- `DELETE /api/complaints/{complaintId}/comments/{commentId}`
- `PATCH /api/complaints/bulk` - body: `{ "ids": ["c-..."], "status": "Resolved" }`
- `DELETE /api/complaints/bulk` - body: `{ "ids": ["c-..."] }`
- `DELETE /api/complaints/{id}`

Data is stored in an H2 database at `backend/data/univoice-db`.
