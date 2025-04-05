// Global variables
let predictionsChart;

// Theme toggle functionality
document.getElementById('themeToggle').addEventListener('click', function() {
    document.documentElement.classList.toggle('dark');
});

// Range sliders value display
document.getElementById('financial').addEventListener('input', function() {
    document.getElementById('financialValue').textContent = this.value;
});

document.getElementById('riskTaking').addEventListener('input', function() {
    document.getElementById('riskValue').textContent = this.value;
});

// Predict button click handler
document.getElementById('predictBtn').addEventListener('click', function() {
    // Show loading state
    document.getElementById('initialContent').classList.add('hidden');
    document.getElementById('resultsContent').classList.add('hidden');
    document.getElementById('resultsLoading').classList.remove('hidden');
    
    // Gather all form data
    const formData = {
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        siblings: document.getElementById('siblings').value,
        financial: document.getElementById('financial').value,
        eduLevel: document.getElementById('eduLevel').value,
        subjects: document.getElementById('subjects').value,
        performance: document.getElementById('performance').value,
        performanceType: document.getElementById('performanceType').value,
        techSavvy: document.getElementById('techSavvy').value,
        extracurricular: document.getElementById('extracurricular').value,
        workExp: document.getElementById('workExp').value,
        preferredEnv: document.getElementById('preferredEnv').value,
        riskTaking: document.getElementById('riskTaking').value,
        leadership: document.getElementById('leadership').value,
        networking: document.getElementById('networking').value,
        motivation: document.getElementById('motivation').value
    };
    
    // In a real-world scenario, you would send this data to your API
    // For now, we'll simulate the API call with a timeout
    setTimeout(function() {
        // Process prediction (this would be replaced with actual API call)
        const predictions = predictCareerPath(formData);
        
        // Show results
        showPredictionResults(predictions, formData);
    }, 1500);
});

// Simplified prediction logic (to be replaced with ML model API call)
function predictCareerPath(formData) {
    const motivation = formData.motivation;
    const riskTaking = parseInt(formData.riskTaking);
    const leadership = formData.leadership;
    const preferredEnv = formData.preferredEnv;
    const techSavvy = formData.techSavvy;
    
    // Determine prediction based on inputs
    let predictions = {};
    
    if (motivation === 'Social Impact' && riskTaking < 6) {
        predictions = {
            'Government Officer': 0.65,
            'Corporate Professional': 0.15,
            'Entrepreneur': 0.12,
            'Research Scientist': 0.08
        };
    } else if (riskTaking > 7 && (preferredEnv === 'Startup' || motivation === 'Money')) {
        predictions = {
            'Entrepreneur': 0.78,
            'Corporate Professional': 0.12,
            'Government Officer': 0.05,
            'Research Scientist': 0.05
        };
    } else if (preferredEnv === 'Research' || techSavvy.includes('Advanced')) {
        predictions = {
            'Research Scientist': 0.56,
            'Corporate Professional': 0.24,
            'Entrepreneur': 0.12,
            'Government Officer': 0.08
        };
    } else if (preferredEnv === 'Corporate Job' || leadership.includes('Team Leader')) {
        predictions = {
            'Corporate Professional': 0.63,
            'Government Officer': 0.17,
            'Entrepreneur': 0.15,
            'Research Scientist': 0.05
        };
    } else {
        predictions = {
            'Government Officer': 0.45,
            'Corporate Professional': 0.30,
            'Entrepreneur': 0.15,
            'Research Scientist': 0.10
        };
    }
    
    return predictions;
}

// Display prediction results in the UI
function showPredictionResults(predictions, formData) {
    document.getElementById('resultsLoading').classList.add('hidden');
    document.getElementById('resultsContent').classList.remove('hidden');
    
    // Get top prediction
    const topCareer = Object.keys(predictions).reduce((a, b) => 
        predictions[a] > predictions[b] ? a : b);
    
    // Update top prediction display
    document.getElementById('careerTitle').textContent = topCareer;
    document.getElementById('confidenceScore').textContent = 
        `Confidence: ${Math.round(predictions[topCareer] * 100)}%`;
    
    // Generate career analysis based on inputs and prediction
    const analysis = generateCareerAnalysis(topCareer, formData);
    document.getElementById('careerAnalysis').innerHTML = `<p>${analysis}</p>`;
    
    // Create or update predictions chart
    createPredictionsChart(predictions);
    
    // If Poe API is available, get AI-generated insights
    if (window.Poe) {
        getAICareerInsights(topCareer, formData);
    }
}

// Generate analysis text based on predictions and user inputs
function generateCareerAnalysis(topCareer, formData) {
    const riskTaking = formData.riskTaking;
    const preferredEnv = formData.preferredEnv;
    const motivation = formData.motivation;
    const leadership = formData.leadership;
    
    let analysis = '';
    
    if (topCareer === 'Entrepreneur') {
        analysis = `Your high risk-taking score (${riskTaking}/10) and preference for a ${preferredEnv.toLowerCase()} environment indicate strong entrepreneurial tendencies. Your motivation for ${motivation.toLowerCase()} aligns well with this path.`;
    } else if (topCareer === 'Government Officer') {
        analysis = `Your preference for structure and ${motivation === 'Social Impact' ? 'interest in social impact' : 'job security'} make government roles particularly suitable. Your moderate risk-taking score (${riskTaking}/10) suggests you value stability.`;
    } else if (topCareer === 'Research Scientist') {
        analysis = `Your technical abilities and preference for a research environment indicate strong alignment with scientific careers. Your ${riskTaking < 6 ? 'cautious approach' : 'willingness to explore'} would be beneficial in research settings.`;
    } else {
        analysis = `Your ${leadership !== 'None' ? 'leadership experience' : 'networking skills'} and ${motivation.toLowerCase()} motivation suggest you would thrive in corporate environments. Your risk-taking score (${riskTaking}/10) balances ambition with pragmatism.`;
    }
    
    return analysis;
}

// Use Claude AI to get career insights (if Poe API is available)
function getAICareerInsights(career, formData) {
    const promptText = `@Claude-3.7-Sonnet Based on the following user profile, give me a 2-3 sentence analysis of why they might be suited for a career as a ${career}. Keep it concise and specific to this career path. Don't use phrases like "based on your profile".
    
    Profile:
    - Age: ${formData.age}
    - Gender: ${formData.gender}
    - Education: ${formData.eduLevel}
    - Academic Performance: ${formData.performance}
    - Tech Skills: ${formData.techSavvy}
    - Risk-Taking Ability: ${formData.riskTaking}/10
    - Preferred Environment: ${formData.preferredEnv}
    - Motivation: ${formData.motivation}
    - Leadership: ${formData.leadership}
    
    Provide ONLY the analysis with no introductory or concluding remarks.`;
    
    // Register handler for Claude's response
    window.Poe.registerHandler("careerAnalysisHandler", (result) => {
        const response = result.responses[0];
        if (response.status === "complete") {
            document.getElementById('careerAnalysis').innerHTML = `<p>${response.content}</p>`;
        }
    });
    
    // Send request to Claude
    window.Poe.sendUserMessage(promptText, {
        handler: "careerAnalysisHandler",
        openChat: false,
        stream: false
    }).catch(error => {
        console.error("Error getting AI analysis:", error);
    });
}