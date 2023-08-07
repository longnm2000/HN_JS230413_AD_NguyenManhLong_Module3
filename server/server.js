const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8000;
const morgan = require("morgan");
const cors = require("cors");
const db = require("./utils/database");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/api/v1/users", async (req, res) => {
  try {
    let data = await db.execute("SELECT * FROM users");
    res.json(data[0]);
  } catch (error) {
    res.json({
      error,
    });
  }
});

app.post("/api/v1/users", async (req, res) => {
  let { name, description } = req.body;
  console.log(name, description);

  try {
    await db.execute(`INSERT INTO users(name,description) VALUES(?,?)`, [
      name,
      description,
    ]);
    res.json({ message: "Add a user success" });
  } catch (error) {
    res.json({ error });
  }
});

app.delete("/api/v1/users/:id", async (req, res) => {
  let { id } = req.params;
  try {
    await db.execute(`DELETE FROM users WHERE user_id = ?`, [id]);
    res.json({ message: "Delete user success" });
  } catch (error) {
    res.json({ error });
  }
});

app.put("/api/v1/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    let data = await db.execute("SELECT * FROM users WHERE user_id = ?", [id]);
    if (data[0].length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await db.execute(
      "UPDATE users SET name = ?, description = ? WHERE user_id = ?",
      [name, description, id]
    );

    res.json({ message: "Update user success" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
