# UserCtrl

## [GET /users/whoami]
*accepted request*

```json
{
  "body": {},
  "search_params": {},
  "middlewares": [
    null
  ]
}
```

*example response*

```json
{
  "status_code": 200,
  "content": {
    "content_type": "application/json"
  }
}
```

## [POST /users/login]
*accepted request*

```json
{
  "body": {
    "content_type": "application/json",
    "schema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "passwd": {
          "type": "string"
        }
      }
    }
  },
  "search_params": {},
  "middlewares": []
}
```

*example response*

```json
{
  "status_code": 200,
  "content": {
    "content_type": "application/json"
  }
}
```

# DebugCtrl

## [GET /debug]
*accepted request*

```json
{
  "body": {},
  "search_params": {},
  "middlewares": [
    null
  ]
}
```

*example response*

```json
{
  "status_code": 200,
  "content": {
    "content_type": "application/json"
  }
}
```

## [GET /debug/ping]
*accepted request*

```json
{
  "body": {},
  "search_params": {
    "msg": {
      "content_type": "application/json",
      "schema": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string"
          }
        }
      }
    }
  },
  "middlewares": [
    null
  ]
}
```

*example response*

```json
{
  "status_code": 200,
  "content": {
    "content_type": "application/json"
  }
}
```

# NetworkCtrl

