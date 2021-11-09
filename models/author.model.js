/* const sequelize = new Sequelize('sitepoint', 'user', 'password', {
    host: 'localhost',
    dialect: 'mysql'
  });
  
  const Author = sequelize.define('author', {
    name: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING
    },
  }, 
  {
    timestamps: false
  });
  
  Author.findAll().then(authors => {
    console.log("All authors:", JSON.stringify(authors, null, 4));
  }); 
  
  this.name = profile.name;
    this.gender= req.body.gender;
    this.lat= req.body.lat;
    this.lng= req.body.lng;
    this.birthDate = profile.birthDate;
    this.pitch = profile.pitch;
    this.description = profile.description;
    this.email = profile.email;
    this.phone = profile.phone;
    this.createdAt= req.body.createdAt;
    this.updatedAt= req.body.updatedAt;
  
  */

  module.exports = (sequelize, Sequelize) => {
    const Author = sequelize.define("authors", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        lat: {
            type: Sequelize.INTEGER
        },
        lng: {
            type: Sequelize.STRING
        }
    });

    return Author;
};