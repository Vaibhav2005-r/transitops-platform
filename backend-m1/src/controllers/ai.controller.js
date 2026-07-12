const { PrismaClient } = require('@prisma/client');
const { HfInference } = require('@huggingface/inference');

const prisma = new PrismaClient();

exports.copilotQuery = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required.' });
    }

    // 1. Fetch live fleet context to ground the AI
    const [
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      totalActiveFleet,
      activeTrips,
      pendingTrips,
      driversOnDuty
    ] = await Promise.all([
      prisma.vehicle.count({ where: { status: 'On Trip' } }),
      prisma.vehicle.count({ where: { status: 'Available' } }),
      prisma.vehicle.count({ where: { status: 'In Shop' } }),
      prisma.vehicle.count({ where: { status: { not: 'Retired' } } }),
      
      prisma.trip.count({ where: { status: 'Dispatched' } }),
      prisma.trip.count({ where: { status: 'Draft' } }),
      
      prisma.driver.count({ where: { status: { in: ['Available', 'On Trip'] } } })
    ]);

    let fleetUtilization = 0;
    if (totalActiveFleet > 0) {
      fleetUtilization = Number((((availableVehicles + activeVehicles) / totalActiveFleet) * 100).toFixed(1));
    }

    const contextData = {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization
    };

    // 2. Decide between Real AI and Mock Fallback
    if (process.env.HF_TOKEN) {
      // -- REAL AI MODE --
      const hf = new HfInference(process.env.HF_TOKEN);
      
      const systemMessage = `You are the TransitOps Copilot, an AI assistant for fleet managers. Answer the user's query based ONLY on the following live fleet data. If they ask something unrelated, politely steer them back to fleet management.
LIVE FLEET CONTEXT (JSON): ${JSON.stringify(contextData)}`;

      // Using Llama 3 8B Instruct model
      const response = await hf.chatCompletion({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.1
      });

      return res.status(200).json({
        success: true,
        data: {
          reply: response.choices[0].message.content,
          mode: 'huggingface (llama-3)'
        }
      });
    } else {
      // -- MOCK FALLBACK MODE (For Hackathon Judges) --
      const lowerPrompt = prompt.toLowerCase();
      let reply = "I am the TransitOps Mock Copilot. ";

      if (lowerPrompt.includes('utilization')) {
        reply += `Our current fleet utilization is at ${contextData.fleetUtilization}%. `;
      } else if (lowerPrompt.includes('maintenance') || lowerPrompt.includes('shop')) {
        reply += `We currently have ${contextData.vehiclesInMaintenance} vehicles in the shop for maintenance. `;
      } else if (lowerPrompt.includes('active') || lowerPrompt.includes('trip')) {
        reply += `There are ${contextData.activeTrips} active trips right now with ${contextData.driversOnDuty} drivers on duty. `;
      } else if (lowerPrompt.includes('available')) {
        reply += `We have ${contextData.availableVehicles} vehicles available for dispatch out of our ${contextData.activeVehicles} active fleet. `;
      } else {
        reply += `Based on live data: Fleet Utilization is ${contextData.fleetUtilization}%, with ${contextData.activeTrips} active trips and ${contextData.vehiclesInMaintenance} vehicles in maintenance.`;
      }

      reply += "\n\n*(Note: This is a simulated AI response using real database metrics. Add a HF_TOKEN to the .env file to enable the true LLM experience.)*";

      return res.status(200).json({
        success: true,
        data: {
          reply: reply,
          mode: 'mock'
        }
      });
    }

  } catch (error) {
    console.error('Error in Copilot query:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error processing AI request.' });
  }
};
