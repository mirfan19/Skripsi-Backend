const db = require('./models'); // Adjust the path as necessary

// Example: Sync the database
db.sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('There was an error creating the database:', err);
  });
