const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { models } = require("mongoose");

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

    const prompt = `Generate a personalized fitness plan with visuals based on:  
    - **Age:** ${age} years  
    - **Height:** ${height} cm  
    - **Weight:** ${weight} kg  
    - **Goal:** ${goal} (e.g., fat loss, muscle gain)  
    - **Activity Level:** ${activityLevel}  
    
    **Workout Routine:**  
    - **Strength 💪** – Key upper & lower body exercises  
    - **Cardio 🏃‍♂️** – Goal-specific cardio recommendations  
    - **Flexibility 🧘‍♂️** – Essential stretching & recovery tips  
    
    Keep the response **short, structured, and visually engaging** with high-quality images.`;  

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

const prompt = `Generate a personalized diet plan with high-quality images based on:  
- **Age:** ${age} years  
- **Weight:** ${weight} kg  
- **Goal:** ${goal} (e.g., weight loss, muscle gain)  
- **Diet Type:** ${diettype} (${diettype === "Vegetarian" ? "Plant-based 🌱" : "Non-vegetarian 🍗"})  
Provide a **compact meal plan** with balanced macros:  
- **Breakfast ☀️** – Nutritious and energy-boosting  
- **Lunch 🍱** – Well-balanced with proteins, carbs, and healthy fats  
- **Dinner 🌙** – Light yet filling for recovery  
- **Snacks 🍎** – Healthy, quick, and easy options  

Use **${diettype === "Vegetarian" ? "plant-based proteins (tofu, quinoa, lentils)" : "lean meats, eggs, and fish)"}**.  
Keep the response **short, professional, visually appealing and readable with relevant images**.`;


    const result = await model.generateContent(prompt);
    const dietPlan = await result.response.text();

    res.json({ dietPlan });
  } catch (err) {
    console.error("Error fetching diet plan", err);
    res.status(500).json({ error: "Error fetching diet plan" });
  }
};
