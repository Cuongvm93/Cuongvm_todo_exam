const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const morgan = require("morgan");
const querystring = require("querystring");
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(express.static("public"));
app.use(morgan("combined"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/api/v1/todos", (req, res) => {
  const query = req.query;
  console.log(111, query);
  fs.readFile("./dev-data/todos.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({
        err,
        status: "fail",
        Message: err.message,
      });
    } else {
      data = JSON.parse(data);
      res.status(200).json({
        data: data,
        per_page: query.per_page,
        page_index: query.page_index,
      });
    }
  });
});
app.post("/api/v1/todos", (req, res) => {
  fs.readFile("./dev-data/todos.json", "utf8", (err, data) => {
    data = JSON.parse(data);
    data.unshift(req.body);
    console.log(data[0]);
    fs.writeFileSync("./dev-data/todos.json", JSON.stringify(data));
    res.send({ Message: "Update success!" });
  });
});
app.put("/api/v1/todos", (req, res) => {
  console.log(req.body);
  fs.writeFileSync("./dev-data/todos.json", JSON.stringify(req.body));
  res.send({ Message: "Update success!" });
});
app.delete("/api/v1/todos/:id", (req, res) => {
  console.log(req)
  fs.readFile("./dev-data/todos.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({
        stasus: "fail",
        message: err.message,
      });
    }else{
      data=JSON.parse(data)
      data.splice(req.params.id,1)
      fs.writeFile("./dev-data/todos.json",JSON.stringify(data),(err,data)=>{
        if (err) {
          res.status(500).json({
            Message:err.message
          })
        }else{
          res.status(200).json({
            Mess:"up thành công"
          })
        }
      })
    }
  });
  
  
});
app.delete("/api/v1/todos",(req,res)=>{
  console.log("hellowordl");
  let data=[]
  fs.writeFile("./dev-data/todos.json",JSON.stringify(data),(err,data)=>{
    if(err){
      res.status(500).json({
        stasus:"fail",
        message:err.message
      })
    }else{
      res.status(200).json({
        stasus:"success",
        message:"Delete all success"
      })
    }
  })
})
//   app.get("/api/v1/todos/:id",(req,res)=>{
//     const {id}=req.params
//     fs.readFile("./dev-data/todos.json","utf8",(err,data)=>{
//         if (err) {
//             throw err
//         }else{
//             data=JSON.parse(data)
//             let index=data.findIndex((item)=>{
//                 return item.id==id
//             })
//             if(index!=-1){
//                 res.status(200).json(data[index])
//             }

//         }
//     })
//   })
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
