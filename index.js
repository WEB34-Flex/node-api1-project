const express = require("express");

const server = express();

const shortid = require("shortid");

server.use(express.json());

let users = [
  {
    id: shortid.generate(),
    name: "Bilbo Baggins",
    bio: "Hobbit from Hobbiton",
  },
  {
    id: shortid.generate(),
    name: "Gandalf The White",
    bio: "Wizard who enjoys a good firework show",
  },
];

let nextId = 3;

server.get("/api/users", (req, res) => {
  if (req.body) {
    res.status(200).json({ data: users });
  } else {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved" });
  }
});

server.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  let found = users.find((user) => user.id === id);

  if (found) {
    res.status(200).json(found);
  } else if (!found) {
    res
      .status(404)
      .json({ errorMessage: "The user with the specified id does not exist" });
  } else {
    res
      .status(500)
      .json({ message: "The user information could not be retrieved" });
  }
});

server.post("/api/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user" });
  } else if (req.body.name || req.body.bio) {
    const user = req.body;

    users.push({ id: nextId++, ...user });

    res.status(201).json({ data: users });
  } else {
    res.status(500).json({
      message: "There was an error while saving the user to the database",
    });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  let found = users.find((user) => user.id === id);

  if (found) {
    users = users.filter((user) => user.id !== id);

    res.status(200).json({ message: "The user has been destroyed" });
  } else if (!found) {
    res
      .status(404)
      .json({ message: "The user with the specified id does not exist" });
  } else {
    res.status(500).json({ message: "The user could not be removed" });
  }
});

server.put("/api/users/:id", (req, res) => {
  const changes = req.body;
  const id = Number(req.params.id);
  let found = users.find((user) => user.id === id);

  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
  } else if (found) {
    Object.assign(found, changes);

    res.status(200).json(found);
  } else {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist" });
  }
});

const port = 8000;
server.listen(port, () => console.log("**server running on port:8000**"));
