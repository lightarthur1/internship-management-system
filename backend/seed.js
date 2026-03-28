const mongoose = require('mongoose');
const Opportunity = require('./models/Opportunity'); 
const User = require('./models/User'); // 1. ADD THIS: Import your User model
require('dotenv').config();

const opportunities = [

  {

    companyName: "Hubtel Ghana",

    role: "Full-Stack Developer Intern",

    location: "Accra, East Legon",

    description: "Assist the engineering team in building React components and optimizing Node.js API endpoints for payment processing.",

    duration: "3 Months",

    requirements: ["React", "Node.js", "MongoDB"],

    category: "Software"

  },

  {

    companyName: "Cal Bank",

    role: "IT Support & Networking",

    location: "Kumasi, Adum",

    description: "Hands-on experience with server maintenance, network troubleshooting, and hardware support within a banking environment.",

    duration: "2 Months",

    requirements: ["Networking Basics", "Hardware Troubleshooting"],

    category: "IT Support"

  },

  {

    companyName: "Amalitech",

    role: "Software Engineering Trainee",

    location: "Takoradi",

    description: "Join an intensive training program focused on professional software delivery for international clients.",

    duration: "6 Months",

    requirements: ["JavaScript", "Problem Solving", "Teamwork"],

    category: "Software"

  },

  {

    companyName: "MTN Ghana",

    role: "Digital Banking Intern",

    location: "Kumasi, Ridge",

    description: "Work with the MoMo team to analyze user data and improve digital financial service delivery.",

    duration: "4 Months",

    requirements: ["Data Analysis", "SQL", "Excel"],

    category: "Finance"

  },

  {

    companyName: "KNUST IT Services",

    role: "Systems Administration Intern",

    location: "Kumasi, KNUST Campus",

    description: "Assist in managing the university's internal network infrastructure and student portals.",

    duration: "3 Months",

    requirements: ["Linux", "Server Management"],

    category: "Systems"

  }

];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // 2. FIND AN ADMIN: Look for any user with the role 'admin'
    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.error("❌ ERROR: No admin user found in the database.");
      console.log("Please create an admin account through your app first, then run this script.");
      process.exit(1);
    }

    console.log(`Found Admin: ${admin.name} (ID: ${admin._id})`);

    // 3. ATTACH THE ID: Map through your array and add the missing 'addedBy' field
    const opportunitiesWithAdmin = opportunities.map(opp => ({
      ...opp,
      addedBy: admin._id // This satisfies the 'required' validation
    }));

    await Opportunity.deleteMany({});
    console.log("Cleared existing opportunities.");

    // 4. INSERT: Use the new array with the IDs attached
    await Opportunity.insertMany(opportunitiesWithAdmin);
    console.log(`${opportunitiesWithAdmin.length} Opportunities seeded successfully!`);

    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();