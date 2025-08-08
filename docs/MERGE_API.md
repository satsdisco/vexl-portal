# Merge API Documentation

## Overview
The merge system allows forked presentations to pull updates from their master presentations. It includes conflict detection, selective application of changes, and automatic backup creation.

## Endpoints

### 1. Merge Preview
`GET /api/presentations/:id/merge-preview`

Generates a preview of changes that can be pulled from the master to the fork.

#### Headers Required
- `x-user-id`: string (Clerk user ID)
- `x-role`: string (one of: 'ambassador', 'manager', 'admin')
- `Authorization`: Bearer token

#### Example cURL Request
```bash
# Get merge preview for fork with ID 42
curl -X GET \
  https://beneficial-nurturing-production.up.railway.app/api/presentations/42/merge-preview \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STRAPI_TOKEN" \
  -H "x-user-id: user_2abc123" \
  -H "x-role: ambassador"
```

#### Success Response
```json
{
  "data": {
    "forkId": 42,
    "masterId": 1,
    "forkSlug": "masterclass-a3f2c1",
    "masterSlug": "masterclass",
    "forkTitle": "Vexl Masterclass (Fork)",
    "masterTitle": "Vexl Masterclass",
    "baseMasterUpdatedAt": "2024-01-15T10:00:00.000Z",
    "currentMasterUpdatedAt": "2024-01-20T15:30:00.000Z",
    "summary": {
      "sectionsAdded": 2,
      "sectionsRemoved": 1,
      "sectionsModified": 3,
      "conflicts": 1
    },
    "plan": [
      {
        "forkSectionId": 101,
        "masterSectionId": 201,
        "forkIndex": 0,
        "masterIndex": 0,
        "action": "modify",
        "fields": [
          {
            "key": "title",
            "masterValue": "Updated Introduction",
            "forkValue": "Introduction",
            "status": "apply"
          },
          {
            "key": "subtitle",
            "masterValue": "New subtitle",
            "forkValue": "Old subtitle",
            "status": "conflict"
          }
        ],
        "blocks": [
          {
            "forkBlockIndex": 0,
            "masterBlockIndex": 0,
            "action": "modify",
            "fields": [
              {
                "key": "content",
                "masterValue": "Updated content...",
                "forkValue": "Original content...",
                "status": "apply"
              }
            ]
          },
          {
            "masterBlockIndex": 1,
            "action": "add",
            "masterBlock": {
              "type": "Quote",
              "text": "New quote",
              "author": "Satoshi"
            },
            "fields": []
          }
        ]
      },
      {
        "masterSectionId": 202,
        "masterIndex": 5,
        "action": "add",
        "masterSection": {
          "title": "New Section",
          "subtitle": "Added in master",
          "order": 5,
          "content": { "blocks": [] }
        },
        "fields": [],
        "blocks": []
      }
    ]
  }
}
```

### 2. Merge Apply
`POST /api/presentations/:id/merge-apply`

Applies selected changes from the master to the fork, creating a backup first.

#### Headers Required
- `x-user-id`: string (Clerk user ID)
- `x-role`: string (one of: 'ambassador', 'manager', 'admin')
- `Authorization`: Bearer token
- `Content-Type`: application/json

#### Request Body
```json
{
  "selections": [
    {
      "forkSectionId": 101,
      "masterSectionId": 201,
      "action": "modify",
      "fieldAccept": {
        "title": true,
        "subtitle": false
      },
      "blocks": [
        {
          "forkBlockIndex": 0,
          "masterBlockIndex": 0,
          "action": "modify",
          "fieldAccept": {
            "content": true
          }
        },
        {
          "masterBlockIndex": 1,
          "action": "add",
          "acceptBlock": true,
          "masterBlock": {
            "type": "Quote",
            "text": "New quote",
            "author": "Satoshi"
          }
        }
      ]
    },
    {
      "masterSectionId": 202,
      "action": "add",
      "acceptSection": true,
      "masterSection": {
        "title": "New Section",
        "subtitle": "Added in master",
        "order": 5,
        "content": { "blocks": [] }
      }
    }
  ]
}
```

#### Example cURL Request
```bash
# Apply merge selections to fork with ID 42
curl -X POST \
  https://beneficial-nurturing-production.up.railway.app/api/presentations/42/merge-apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STRAPI_TOKEN" \
  -H "x-user-id: user_2abc123" \
  -H "x-role: ambassador" \
  -d '{
    "selections": [
      {
        "forkSectionId": 101,
        "masterSectionId": 201,
        "action": "modify",
        "fieldAccept": {
          "title": true
        }
      }
    ]
  }'
```

#### Success Response
```json
{
  "data": {
    "ok": true,
    "forkId": 42,
    "backupId": 150,
    "appliedCounts": {
      "sectionsAdded": 1,
      "sectionsRemoved": 0,
      "sectionsModified": 2,
      "blocksAdded": 3,
      "blocksRemoved": 1,
      "blocksModified": 4
    },
    "message": "Merge applied successfully"
  }
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "error": "Invalid selections format"
}
```

##### 403 Forbidden
```json
{
  "error": "You do not have permission to apply merge"
}
```

##### 404 Not Found
```json
{
  "error": "Fork presentation not found"
}
```

## Merge Rules

### Conflict Detection
A conflict occurs when both the fork and master have modified the same field since `baseMasterUpdatedAt`:
- Fork modifications are detected by comparing fork's updatedAt with baseMasterUpdatedAt
- Master modifications are detected by comparing master's updatedAt with baseMasterUpdatedAt
- When both have changed the same field, it's marked as a conflict

### Safe Changes
"Safe" changes that can be auto-accepted:
1. **Additions**: New sections or blocks added in master
2. **Removals**: Sections or blocks removed in master
3. **Non-conflicting modifications**: Fields changed only in master, not in fork

### Backup Creation
Before applying any merge:
1. A complete backup of the fork is created
2. Backup slug format: `{fork-slug}-backup-{6-char-hex}`
3. Backup includes all sections and blocks
4. Backup ID is returned in the response

### Field Status Values
- `apply`: Safe to apply from master
- `conflict`: Both fork and master modified
- `noop`: No action needed (values are same)

### Action Types
- `add`: Item exists in master but not in fork
- `remove`: Item exists in fork but not in master
- `modify`: Item exists in both with differences
- `conflict`: Item has conflicting changes
- `noop`: No changes needed

## Performance Considerations

### Limits
- Maximum 100 sections per presentation
- Maximum 50 blocks per section
- Merge preview response may be large for complex presentations

### Optimization
- Sections are matched by index (order) for performance
- Blocks are matched by index within sections
- Deep equality checks are performed only when necessary

## UI Integration

### Workflow
1. User views diff between fork and master
2. User clicks "Pull Updates from Master" button
3. Merge preview UI shows all available changes
4. User selects which changes to apply
5. System creates backup and applies changes
6. User is redirected to builder with success message

### Conflict Resolution
For conflicts, users can choose:
- **Keep Fork**: Retain the fork's version
- **Take Master**: Accept the master's version
- **Skip**: Don't apply this change

### Batch Operations
- "Accept All Safe Changes": Applies all non-conflicting changes
- Individual selection: Fine-grained control over each change

## Testing

### Test Scenarios
1. **Simple merge**: Master has new sections, fork unchanged
2. **Conflict merge**: Both modified same section title
3. **Complex merge**: Mix of adds, removes, modifies, and conflicts
4. **Empty merge**: No changes between fork and master

### Test Commands
```bash
# Create a fork
curl -X POST https://your-strapi.com/api/presentations/1/fork \
  -H "x-user-id: test_user" \
  -H "x-role: ambassador"

# Modify master (via Strapi admin)

# Preview merge
curl -X GET https://your-strapi.com/api/presentations/42/merge-preview \
  -H "x-user-id: test_user" \
  -H "x-role: ambassador"

# Apply merge
curl -X POST https://your-strapi.com/api/presentations/42/merge-apply \
  -H "x-user-id: test_user" \
  -H "x-role: ambassador" \
  -d '{"selections": [...]}'
```

## Follow-up Improvements

1. **Publish/Approval Flow**:
   - Managers review and approve ambassador merges
   - Staging environment for testing merged presentations

2. **Advanced Conflict Resolution**:
   - Three-way merge view
   - Line-by-line content diff for text blocks

3. **Merge History**:
   - Track all merges with timestamps
   - Ability to revert to previous versions

4. **Notifications**:
   - Alert fork owners when master updates
   - Email summaries of available changes