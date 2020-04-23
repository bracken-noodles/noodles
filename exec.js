const noodles = require("./index");
const redises = require("@decobim/noodles-redis");
const sockets = require("@decobim/noodles-sockets");
const path = require("path");

const app = noodles({
  port: 9020,
  static: path.resolve(__dirname, "./public"),
  redis: {
    localhost: "redis://:@localhost/0"
  },
  proxy: {
    ops: {
      from: "/ops/v1",
      to: "http://dev.api.ops.decobim.com/v1/",
      hooks: {
        before: {
          async ["*"](req, res) {
            const token = req.headers.authorization;

            if (token) {
              const data = JSON.parse(await redises.localhost.get(token));

              req.headers.authorization = data.token;
              req.headers["x-member-id"] = data.memberId;
            }
          }
        },
        after: {
          async ["/identity/auth"](req, res, data) {
            if (!data) return;

            const signature = noodles.jwtSign({ signature: data.data.token });

            await redises.localhost.set(
              signature,
              JSON.stringify({
                token: data.data.token,
                memberId: data.data.xmemberId
              })
            );

            data.data.token = signature;

            return data;
          },
          async ["*"](req, res, data) {
            if (req.path === "/file-url") {
              return data;
            }

            return {
              ok: true,
              message: null,
              data
            };
          }
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
      "/admin/auth",
      "/enterprise"
    ]
  },
  middlewares: [],
  swagger: path.resolve(__dirname, "./docs.yml")
});

app.get("/static", (req, res) => {
  res.send({
    ok: true
  });
  res.end();
});

noodles.clients.ops.router.post("/login", function(req, res) {
  noodles.clients.ops.fetch
    .post("/identity/auth", {
      body: JSON.stringify(req.body)
    })
    .then(data => {
      redises.localhost.set(data.token, data.xmemberId);
      res.send(data);
      res.end();
    })
    .catch(err => {
      res.send({ error: err });
      res.end();
    });
});

const ops = noodles.clients.ops;

ops.router.post("/logout", function(req, res) {
  const token = req.headers.authoration;
  if (token) {
    redises.localhost.set(token);
  }

  res.send({ ok: true, message: "已登出", data: null });
  res.end();
});

ops.router.get("/users/683479624413185/projects", function(req, res) {
  const hub = {};
  ops.fetch
    .get("/current-user", {
      headers: req.headers
    })
    .then(data => {
      hub.userId = data.userId;
      return ops.fetch.get(`/users/${data.userId}/enterprises`, {
        headers: req.headers
      });
    })
    .then(data => {
      return fetch.get(
        `/enterprise/${data.enterpriseId}/users/${hub.userId}/projects`,
        {
          headers: req.headers
        }
      );
    })
    .then(data => {
      res.send(data);
      res.end();
    });
});

ops.router.get("/account/:username", function(req, res) {
  res.send({ name: "o" });
  res.end();
});

ops.router.get(
  "/enterprise/:enterpriseId/projects/:projectId/something",
  function(req, res) {
    res.send({
      name: "/enterprise/:enterpriseId/projects/:projectId/something"
    });
    res.end();
  }
);

ops.router.get("/enterprise/:enterpriseId/projects/:projectId", function(
  req,
  res
) {
  res.send({ name: "/enterprise/:enterpriseId/projects/:projectId" });
  res.end();
});
