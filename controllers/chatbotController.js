const axios = require("axios");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { models } = require("mongoose");

const genAI = new GoogleGenerativeAI(process.env.BEARER_TOKEN);

exports.getfitnessplan = async (req, res) => {
  const { name, age, height, weight, goal, activityLevel, diettype } = req.body;

  try {
    let user = await User.findOne({ name });
    if (!user) {
      user = new User({
        name,
        age,
        height,
        weight,
        goal,
        activityLevel,
        diettype,
      });
      await user.save();
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate a customized fitness plan based on:  
    Age: ${age} years  
    Height: ${height} cm  
    Weight: ${weight} kg  
    Goal: ${goal} (e.g., fat loss, muscle gain)  
    Activity Level: ${activityLevel}   
    
    Workout Routine:  
    Strength Training 💪 - Recommend exercises for upper and lower body  
    Cardio 🏃‍♂️ - Provide goal-based cardio suggestions  
    Flexibility & Recovery 🧘‍♂️ - Include stretching and recovery tips  
    
    Ensure the plan is structured, engaging, and easy to follow. and small`;

    const result = await model.generateContent(prompt);
    const fitnessPlan = await result.response.text();

    res.json({ fitnessPlan });
  } catch (err) {
    console.error("Error fetching fitness plan", err);
    res.status(500).json({ error: "Error fetching fitness plan" });
  }
};

exports.getDietplan = async (req, res) => {
  const { age, weight, goal, diettype } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Create a personalized real-time diet plan based on:  
Age: ${age} years  
Weight: ${weight} kg  
Goal: ${goal} (e.g., weight loss, muscle gain)  
Diet Type: ${diettype} (${
      diettype === "Vegetarian" ? "Plant-based 🌱" : "Non-vegetarian 🍗"
    })  

Meal Plan:  
Breakfast ☀️ - Suggest a nutritious option  
Lunch 🍱 - Provide a balanced meal recommendation  
Dinner 🌙 - Include a healthy and filling dinner  
Snacks 🍎 - Recommend light and healthy snack choices  

Ensure meals have balanced proteins, carbs, and fats using ${
      diettype === "Vegetarian"
        ? "plant-based sources like tofu, quinoa, and lentils"
        : "lean meats, eggs, and fish"
    } for optimal nutrition. Keep the recommendations simple, practical, and easy to follow. and small`;

    const result = await model.generateContent(prompt);
    const dietPlan = await result.response.text();

    res.json({ dietPlan });
  } catch (err) {
    console.error("Error fetching diet plan", err);
    res.status(500).json({ error: "Error fetching diet plan" });
  }
};
