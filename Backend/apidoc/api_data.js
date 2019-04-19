define({ "api": [
  {
    "group": "comment",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/comments/get/issueId/:issueId",
    "title": "api to get all comments on issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issue id. (params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>auth token for the current user. (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"comments fetched\",\n    \"status\": 200,\n    \"data\": [\n        {\n            \"_id\": \"5cba328f1b0b7e2e10afe32b\",\n            \"createdOn\": \"2019-04-19T20:41:51.000Z\",\n            \"issueId\": \"7UpsUYimN\",\n            \"description\": \"hi this is the first comment\",\n            \"createdBy\": {\n                \"_id\": \"5cb34fcfbc8d0c2ca0b3206b\",\n                \"userId\": \"vhJOvZDRBV\",\n                \"name\": \"Himanshu B\"\n            },\n            \"__v\": 0\n        }\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/comment.js",
    "groupTitle": "comment",
    "name": "GetApiV1CommentsGetIssueidIssueid"
  },
  {
    "group": "comment",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/comments",
    "title": "api for comment on issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issue id. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>comment. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "createdBy",
            "description": "<p>created by. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>auth token of the current user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Comment added successfully\",\n    \"status\": 200,\n    \"data\": {\n        \"createdOn\": \"2019-04-19T20:41:51.000Z\",\n        \"_id\": \"5cba328f1b0b7e2e10afe32b\",\n        \"issueId\": \"7UpsUYimN\",\n        \"description\": \"hi this is the first comment\",\n        \"createdBy\": \"5cb34fcfbc8d0c2ca0b3206b\",\n        \"__v\": 0\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/comment.js",
    "groupTitle": "comment",
    "name": "PostApiV1Comments"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/users/get",
    "title": "api to get all the users.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken. (body/query or params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Users data found successfully\",\n    \"status\": 200,\n    \"data\": [\n        {\n            \"_id\": \"5ca63cb524d6040bf06b62a8\",\n            \"userId\": \"1m-ieawrN\",\n            \"name\": \"himanshu bhandari\"\n        },\n        {\n            \"_id\": \"5ca7333f10b7af23348eb1df\",\n            \"userId\": \"1m-ieawrO\",\n            \"name\": \"vineej kumar singh\"\n        },\n        {\n            \"_id\": \"5ca736cff334764b48a23d43\",\n            \"userId\": \"dbfxQORx0\",\n            \"name\": \"vineej chauhan\"\n        },\n        {\n            \"_id\": \"5ca74c4d20b2101f90d25bf9\",\n            \"userId\": \"ck-qsTLBg\",\n            \"name\": \"Himanshu Bhandari\"\n        },\n        {\n            \"_id\": \"5cb34fcfbc8d0c2ca0b3206b\",\n            \"userId\": \"vhJOvZDRBV\",\n            \"name\": \"Himanshu B\"\n        },\n        {\n            \"_id\": \"5cb41f0a0f6f55282028f4d9\",\n            \"userId\": \"FyHwPHDQLN\",\n            \"name\": \"Varun D\"\n        },\n        {\n            \"_id\": \"5cb41f570f6f55282028f4db\",\n            \"userId\": \"sVammxSXN-\",\n            \"name\": \"Himanshu Bhandari\"\n        },\n        {\n            \"_id\": \"5cb446b262a7d22fecc4f715\",\n            \"userId\": \"1qG-4vffWR\",\n            \"name\": \"Final Test User Local\"\n        },\n        {\n            \"_id\": \"5cb864b8302a0b4390009ba3\",\n            \"userId\": \"W62AK9vka\",\n            \"name\": \"Himanshu Bhandari\"\n        },\n        {\n            \"_id\": \"5cb99ef9eb6ae918c0cd2a1a\",\n            \"userId\": \"ERr0ICpt-\",\n            \"name\": \"Nikhil\"\n        },\n        {\n            \"_id\": \"5cba06e8a0ab9d3dbcc5721b\",\n            \"userId\": \"WYwqnShN-\",\n            \"name\": \"Test Signup\"\n        }\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/user.js",
    "groupTitle": "users",
    "name": "GetApiV1UsersGet"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/login",
    "title": "api for user login.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>email of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Login Successful\",\n    \"status\": 200,\n    \"data\": {\n        \"authToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InlrV1g0eFJfQyIsImlhdCI6MTU1NTcwNDg1NzU5MCwiZXhwIjoxNTU1NzkxMjU3LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJpc3N1ZVRyYWNraW5nQXBwIiwiZGF0YSI6eyJ1c2VySWQiOiJwVzBOajhrVklDIiwibmFtZSI6IkhpbWFuc2h1IEJoYW5kYXJpIiwicHJvdmlkZXIiOiJsb2NhbCIsInByb3ZpZGVySWQiOiIiLCJwaG90b1VybCI6IjE1NTUzMTU1NzE3MTMtbXkuanBnIiwiX2lkIjoiNWNiNDNiNzM4MzY2ZmMwZWQ4OTI1NTliIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSJ9fQ.KedVVFLQcfQUG3ex0YT07CDpz1V9lUUsNDv5GWyu0PA\",\n        \"userDetails\": {\n            \"userId\": \"pW0Nj8kVIC\",\n            \"name\": \"Himanshu Bhandari\",\n            \"provider\": \"local\",\n            \"providerId\": \"\",\n            \"photoUrl\": \"1555315571713-my.jpg\",\n            \"_id\": \"5cb43b738366fc0ed892559b\",\n            \"email\": \"test@gmail.com\"\n        }\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersLogin"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/register",
    "title": "api for user registration.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>full name of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email/username of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "photo",
            "description": "<p>photo of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"You are successfully registerd\",\n    \"status\": 200,\n    \"data\": {\n        \"createdOn\": \"2019-04-19T17:35:36.000Z\",\n        \"email\": \"sign@gmail.com\",\n        \"name\": \"Test Signup\",\n        \"password\": \"$2a$10$9yx2mKJjmiccaQlabnCdIeFdbFhF7.Z4reDIZSZ1CyZV1lizB2pmy\",\n        \"photoUrl\": \"1555695336111-NT1284.jpg\",\n        \"provider\": \"local\",\n        \"providerId\": \"\",\n        \"userId\": \"WYwqnShN-\",\n        \"__v\": 0,\n        \"_id\": \"5cba06e8a0ab9d3dbcc5721b\"\n    }\n\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersRegister"
  },
  {
    "group": "watcher",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/watch/get/issueId/:issueId",
    "title": "api to get watcher list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issue id. (params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>auth token for the current user. (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"watchers fetched\",\n    \"status\": 200,\n    \"data\": [\n        {\n            \"_id\": \"5cba3678ab92f420c01496f7\",\n            \"createdOn\": \"2019-04-19T20:58:32.000Z\",\n            \"issueId\": \"7UpsUYimN\",\n            \"watcherId\": {\n                \"_id\": \"5cb34fcfbc8d0c2ca0b3206b\",\n                \"userId\": \"vhJOvZDRBV\",\n                \"name\": \"Himanshu B\"\n            },\n            \"__v\": 0\n        }\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/watcher.js",
    "groupTitle": "watcher",
    "name": "GetApiV1WatchGetIssueidIssueid"
  },
  {
    "group": "watcher",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/watch/",
    "title": "api to add watcher.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issue id. (params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userID",
            "description": "<p>watcher user id. (params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>auth token for the current user. (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"You've successfully added as watcher for the issue\",\n    \"status\": 200,\n    \"data\": {\n        \"createdOn\": \"2019-04-19T20:58:32.000Z\",\n        \"_id\": \"5cba3678ab92f420c01496f7\",\n        \"issueId\": \"7UpsUYimN\",\n        \"watcherId\": \"5cb34fcfbc8d0c2ca0b3206b\",\n        \"__v\": 0\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/watcher.js",
    "groupTitle": "watcher",
    "name": "PostApiV1Watch"
  }
] });
