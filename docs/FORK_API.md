# Fork API Documentation

## Endpoint
`POST /api/presentations/:id/fork`

## Headers Required
- `x-user-id`: string (Clerk user ID)
- `x-role`: string (one of: 'ambassador', 'manager', 'admin')
- `Authorization`: Bearer token

## Example cURL Request

```bash
# Fork presentation with ID 1
curl -X POST \
  https://beneficial-nurturing-production.up.railway.app/api/presentations/1/fork \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STRAPI_TOKEN" \
  -H "x-user-id: user_2abc123" \
  -H "x-role: ambassador"
```

## Success Response
```json
{
  "data": {
    "id": 42,
    "slug": "masterclass-a3f2c1",
    "title": "Vexl Masterclass (Fork)",
    "status": "draft",
    "ownerId": "user_2abc123",
    "forkOf": 1
  },
  "meta": {
    "message": "Presentation forked successfully"
  }
}
```

## Error Responses

### 403 Forbidden
```json
{
  "error": "Can only fork published or master presentations"
}
```

### 404 Not Found
```json
{
  "error": "Presentation not found"
}
```

## Fork Rules
1. Source must be `status: 'published'` OR `isMaster: true`
2. User must have role of ambassador or higher
3. Fork creates a draft copy with unique slug
4. All sections and blocks are deep-copied
5. New presentation is owned by the forking user

## Slug Generation
- Format: `{original-slug}-{6-char-hex}`
- Example: `masterclass-a3f2c1`
- Guaranteed unique via random suffix