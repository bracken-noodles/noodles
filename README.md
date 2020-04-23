> #### For Gitlab viewers :
> Before your following steps to add this package as a npm depedency,you should set local npm registry first.
> 
> ```bash
> npm set registry http://npm.decobim.com
> npm adduser --registry http://npm.decobim.com
> ```

## Noodles

![CocoaPods](https://img.shields.io/cocoapods/metrics/doc-percent/AFNetworking.svg?style=flat-square)
![Hackage-Deps](https://img.shields.io/hackage-deps/v/lens.svg?style=flat-square)

A node middle layer for proxy, websocket, api polymerization and request side effects.

Demo usage in [`./exec`](./exec.js)

## Get Started

### install as depedency with [yarn](http://yarnpkg.org/)
```
$ yarn add @decobim/noodles
```

### Bootstrap noodles host server
```js
const noodles = require("@decobim/noodles")

// noodles-sockets & noodles-redis are depedencies of noodles,
// you can require them directly
const sockets = require("@decobim/noodles-sockets");
const redises = require("@decobim/noodles-redis");

noodles(
  port: 9020,

  static: path.resolve(__dirname, "./public"),

  redis: {
    localhost: "redis://:@localhost/0"
  },

  proxy: {
    ops: {
      from: "/operation/v1",
      to: "http://dev.api.ops.decobim.com/v1/",
      hooks: {
        before: {
          "/identity/auth": function(req, res) {}
        },
        after: {
          "/identity/auth": function(req, res) {}
        }
      }
    },
    license: {
      from: "/license/v1",
      to: "http://dev.api.license.decobim.com/v1/"
    }
  },
  sockets: {
    channels: ["first", "second", "third"]
  },
  jwt: {
    authlessApi: [
      "/identity/auth",
      "/identity/project-quest-auth",
      "/identity/wechat-auth",
      "/admin/auth"
    ]
  }
})
```


## Docs

### configs.port

### configs.static

![optional](https://img.shields.io/badge/%EF%BC%9A-OPTIONAL-blue.svg)

### configs.redis

![optional](https://img.shields.io/badge/%EF%BC%9A-OPTIONAL-blue.svg)

redis config, each record will create a redis connection instance

**format:**

```js
redis:{
  [name]:[redis address]
}
```

All instances can be accessed with redises[name]

```js
const redises = require("noodles-redis")

redises[name].set("key","value")
```

redis instance properties:

Property | Description | Demo
------|----|----
set | set redis value | `instance.set(key:string,value:any)`
get | get value | `instance.get(key:string)`
del | delele redis record | `instance.del(key:string)`
on | attach redis sub listener | `instance.on(channel:string,callback:func)`


### configs.proxy
![optional](https://img.shields.io/badge/%EF%BC%9A-OPTIONAL-blue.svg)

server proxy config, each record will create a `a to b` proxy mapping,and attach origin request method to `noodles.clients`.

**format**

```js
proxy:{
 [name]:{
    from:[from path],
    to:[target url],
    hooks:{
      before:{
        [path]:callback
      },
      after:{
        [path]:callback
      }
    }
  }
}
```

proxy client properties


### configs.sockets
![optional](https://img.shields.io/badge/%EF%BC%9A-OPTIONAL-blue.svg)
#### configs.sockets.channels

### configs.jwt 
![optional](https://img.shields.io/badge/%EF%BC%9A-OPTIONAL-blue.svg)
#### configs.jwt.authlessApi