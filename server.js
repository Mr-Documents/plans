import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import env from "dotenv";


const app = express();
const port = 4000;

const db = new pg.Client({
  user: process.env.POST_1,
  host: process.env.HOST_1,
  database: process.env.DATABASE_1,
  password: process.env.PASSWORD_1,
  port: process.env.PORT_1,
});
db.connect();
env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM todo ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      lsTitle: "Todo",
      lsItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({title: item});
  try {
    await db.query("INSERT INTO todo (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE todo SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM todo WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
