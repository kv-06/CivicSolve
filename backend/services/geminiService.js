const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async classifyComplaint(description, title, category) {
    try {
      // For now, always return Electricity for all complaints
      console.log('Classifying complaint - always assigning to Electricity department');
      return 'Electricity';
      
      // Uncomment below if you want to use Gemini AI for classification later
      /*
      const prompt = `
You are a complaint classification system for a civic problem reporting app. 
Your task is to classify complaints into one of two departments based on the description and title.

DEPARTMENTS:
1. "PWD" - Public Works Department (for road, infrastructure, water, sanitation, garbage, public facilities, parks, etc.)
2. "Electricity" - Electricity Department (for power, electrical issues, street lights, electrical infrastructure, etc.)

COMPLAINT DETAILS:
Title: ${title}
Description: ${description}
Category: ${category}

Please analyze the complaint and respond with ONLY one of these options:
- "Electricity" if it should be handled by Electricity Department
- "PWD" if it should be handled by Public Works Department

Consider the primary issue being reported. If it's primarily about electrical problems, choose "Electricity". 
If it's about roads, water, sanitation, garbage, public facilities, or other infrastructure, choose "PWD".

Response (only the department name):`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const classification = response.text().trim();

      console.log('Gemini classification result:', classification);

      // Validate and clean the response
      if (classification.toLowerCase().includes('electricity')) {
        return 'Electricity';
      } else if (classification.toLowerCase().includes('pwd')) {
        return 'PWD';
      } else {
        // Default to Electricity if unclear
        console.log('Unclear classification, defaulting to Electricity');
        return 'Electricity';
      }
      */
    } catch (error) {
      console.error('Error in Gemini classification:', error);
      // Default to Electricity if there's an error
      return 'Electricity';
    }
  }

  getDepartmentId(department) {
    const departmentMap = {
      'Electricity': '68d2313575e54d73f0440030',
      'PWD': '68d2313575e54d73f0440035'
    };
    
    return departmentMap[department] || '68d2313575e54d73f0440030'; // Default to Electricity
  }
}

module.exports = new GeminiService();
