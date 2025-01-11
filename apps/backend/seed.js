const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

// Define the schema
const modelSchema = new mongoose.Schema(
  {
    System: String,
    Domain: String,
    Organization: String,
    'Country (from Organization)': String,
    'Publication date': String,
    Reference: String,
    Parameters: Number,
    'Parameters notes': String,
    'Training compute (FLOP)': String,
    'Training compute notes': String,
  },
  {
    collection: 'Models', // Explicitly use the existing "Models" collection
  }
);

// Define the model
const Model = mongoose.model('Model', modelSchema);

module.exports = Model;


const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const existingDataCount = await Model.countDocuments();
    console.log(`📊 Existing data count: ${existingDataCount}`);

    if (existingDataCount === 0) {
      console.log('🚀 Seeding database...');
      const data = JSON.parse(fs.readFileSync('./models.json', 'utf8'));
      await Model.insertMany(data);
      console.log('✅ Database seeded successfully');
    } else {
      console.log('📊 Data already exists. Skipping seeding.');
    }
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error while seeding database:', err);
  }
};

seedDatabase();
