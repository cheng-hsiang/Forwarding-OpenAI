const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let useApiCount = 0;
console.log("process.env", OPENAI_API_KEY);

// 添加中間件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 設置跨域訪問權限
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// 定義路由
app.post("/openai/v1/chat/completions", function (req, res) {
  if (req.headers.authorization === `Bearer ${OPENAI_API_KEY}`) {
    const requestOptions = {
      method: "POST",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    };

    request(requestOptions, function (error, response, body) {
      if (error) throw new Error(error);
      console.log("ask: ", req.body.messages);
      console.log("ans", body);
      useApiCount += 1;
      console.log("search count", useApiCount);

      res.send(body);
    });
  } else {
    res.status(401).send("Authorization header missing");
  }
});

// 启动服务
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
