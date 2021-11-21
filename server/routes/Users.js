const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const { AreaTrabajos } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const Tareas = require("../models/Tareas");

//creacion usuario
router.post("/", async (req, res) => {
  const {
    email,
    password,
    nombre,
    apellido,
    edad,
    DNI,
    tipoRol,
    AreaTrabajoId,
  } = req.body;
  console.log(req.body);
  bcrypt.hash(password, 10).then((hash) => {
    try {
      Users.create({
        email: email,
        password: hash,
        nombre,
        apellido,
        edad,
        DNI,
        tipoRol,
        AreaTrabajoId,
      });
    } catch (err) {
      res.status(400).send("Datos erroneos");
    }
    res.json("SUCCESS");
  });
});

//login y validacion usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ where: { email: email } });

  if (!user) res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong email And Password Combination" });

    const accessToken = sign(
      { email: user.email, id: user.id },
      "importantsecret"
    );
    res.json({ token: accessToken, user: user  });
  });
});

//hacer get de todos los usuarios con su respectiva area
router.get("/all", async (req, res) => {
  const listOfUsers = await Users.findAll();
  const searchUser = await Promise.all(
    listOfUsers.map(async (user) => {
      const area = await AreaTrabajos.findOne({
        where: { id: user.AreaTrabajoId },
      });
      //console.log(area);
      const nombreArea = area.dataValues.nombre;
      //console.log(user);
      delete user.dataValues.AreaTrabajoId;
      return { ...user.dataValues, nombreArea };
    })
  );
  //console.log(searchUser);
  res.json(searchUser);
});

//baja usuario

router.delete("/delete", async (req, res) => {
  const idUser = req.body.id;

  await Users.destroy({
    where: {
      id: idUser,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

//modificacion usuario

router.put("/update", async (req, res) => {
  const usuario = req.body;
  Users.update(
    { ...usuario },
    {
      where: {
        id: usuario.id,
      },
    }
  );

  res.json("Actualizado con exito");
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
