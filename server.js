require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const User = require("./models/User");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false
}));
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log(err);
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/register", async (req, res) => {

  const hashedPassword =
    await bcrypt.hash(
      req.body.password,
      10
    );

  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  res.redirect("/login");

});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {

  const user =
    await User.findOne({
      email: req.body.email
    });

  if (!user) {
    return res.send(
      "User Not Found"
    );
  }

  const isMatch =
    await bcrypt.compare(
      req.body.password,
      user.password
    );

  if (!isMatch) {
    return res.send(
      "Invalid Password"
    );
  }

  req.session.userId =
    user._id;

  res.redirect("/dashboard");

});

app.get(
"/dashboard",
async (req, res) => {

if (!req.session.userId) {
  return res.redirect("/login");
}

const user =
await User.findById(
req.session.userId
);

res.render(
"dashboard",
{ user }
);

});
app.get(
"/logout",
(req, res) => {

req.session.destroy();

res.redirect("/login");

});

app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

mongoose.connect(
  process.env.MONGO_URI
)
.then(() => {
  console.log(
    "MongoDB Connected"
  );
})
.catch((err) => {
  console.log(err);
});

app.post(
"/students",
async (req, res) => {

try {

const student =
await Student.create({

name: req.body.name,
email: req.body.email,
age: req.body.age

});

res.json({
message:
"Student Added",
student
});

}
catch(error){

res.status(500).json(
error
);

}

});

// CREATE
app.post("/students", (req, res) => {

  const student = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    age: req.body.age
  };

  students.push(student);

  res.json({
    message: "Student Added",
    student
  });

});
app.get(
"/students",
async (req, res) => {

const students =
await Student.find();

res.json(students);

});
app.put(
"/students/:id",
async (req, res) => {

const student =
await Student.findByIdAndUpdate(

req.params.id,

req.body,

{
new:true
}

);

res.json(student);

});

app.delete(
"/students/:id",
async (req, res) => {

await Student.findByIdAndDelete(
req.params.id
);

res.json({
message:
"Student Deleted"
});

});
// READ ALL
app.get("/students", (req, res) => {
  res.json(students);
});

// READ ONE
app.get("/students/:id", (req, res) => {

  const id = Number(req.params.id);

  const student =
    students.find(
      s => s.id === id
    );

  if (!student) {
    return res.json({
      message: "Student Not Found"
    });
  }

  res.json(student);

});

// UPDATE
app.put("/students/:id", (req, res) => {

  const id = Number(req.params.id);

  const student =
    students.find(
      s => s.id === id
    );

  if (!student) {
    return res.json({
      message: "Student Not Found"
    });
  }

  student.name =
    req.body.name || student.name;

  student.email =
    req.body.email || student.email;

  student.age =
    req.body.age || student.age;

  res.json({
    message: "Student Updated",
    student
  });

});

// DELETE
app.delete("/students/:id", (req, res) => {

  const id = Number(req.params.id);

  students =
    students.filter(
      s => s.id !== id
    );

  res.json({
    message: "Student Deleted"
  });

});

app.listen(3000, () => {
  console.log(
    "Server Running on Port 3000"
  );
});