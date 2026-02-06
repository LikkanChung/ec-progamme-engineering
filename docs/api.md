# API Documentation

Base URL: `http://localhost:3000`

## Endpoints

### Health Check

Check if the service is running.

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### Create Shortened URL

Create a new shortened URL.

```
POST /api/urls
```

**Request Body:**
```json
{
  "longUrl": "https://example.com/very/long/path/to/page"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "short_code": "abc12",
  "long_url": "https://example.com/very/long/path/to/page",
  "created_at": "2025-01-15T10:30:00.000Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "URL must be 256 characters or less"
}
```

---

### List All URLs

Get all shortened URLs.

```
GET /api/urls
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "short_code": "abc12",
    "long_url": "https://example.com",
    "created_at": "2025-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "short_code": "xyz99",
    "long_url": "https://another-site.com",
    "created_at": "2025-01-15T09:00:00.000Z"
  }
]
```

---

### Delete URL

Delete a shortened URL by ID.

```
DELETE /api/urls/:id
```

**Parameters:**
- `id` (path) - The ID of the URL to delete

**Response (204 No Content):**
Empty response body

**Error Response (404 Not Found):**
```json
{
  "error": "URL not found"
}
```

---

### Redirect

Redirect to the original long URL.

```
GET /:shortCode
```

**Parameters:**
- `shortCode` (path) - The 5-character short code

**Response (301 Redirect):**
Redirects to the original long URL.

**Error Response (404 Not Found):**
```json
{
  "error": "Short URL not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid short code format"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful deletion) |
| 301 | Redirect |
| 400 | Bad Request (invalid input) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Examples

### Create a Short URL with curl

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://github.com/example/repo"}'
```

### List All URLs with curl

```bash
curl http://localhost:3000/api/urls
```

### Delete a URL with curl

```bash
curl -X DELETE http://localhost:3000/api/urls/1
```
