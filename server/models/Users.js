const { Sequelize } = require(".");
const Roles = require("./Roles");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    edad: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    DNI: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipoRol: {
      type: DataTypes.ENUM("administrador", "jefe", "empleado"),
    },

    
    createdAt: {
      allowNull: false,
      
     type: DataTypes.FLOAT,
      defaultValue: Date.now()-3600000,
    },


  

  });

  Users.associate = (models) => {
    Users.hasMany(models.Tareas, {
      onDelete: "cascade",
    });
  };

  //Users.belongsToMany(Roles, { through: Roles })

  sequelize
    .sync({ alter: true })
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });

  return Users;
};
