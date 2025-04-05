// Initialize dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}

// Feature importance chart
function initializeFeatureImportanceChart() {
    const featureImportanceCtx = document.getElementById('featureImportanceChart').getContext('2d');
    return new Chart(featureImportanceCtx, {
        type: 'bar',
        data: {
            labels: [
                'Risk-Taking', 'Leadership', 'Education', 'Tech Skills', 
                'Work Experience', 'Motivation', 'Academic Performance', 
                'Preferred Environment', 'Networking'
            ],
            datasets: [{
                label: 'Feature Importance',
                data: [0.18, 0.15, 0.12, 0.11, 0.10, 0.09, 0.09, 0.08, 0.08],
                backgroundColor: '#5D5CDE',
                borderColor: '#4b4abb',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 0.2,
                    title: {
                        display: true,
                        text: 'Importance Score'
                    }
                }
            }
        }
    });
}

// Create or update predictions chart
function createPredictionsChart(predictions) {
    if (window.predictionsChart) {
        window.predictionsChart.data.labels = Object.keys(predictions);
        window.predictionsChart.data.datasets[0].data = Object.values(predictions).map(v => v * 100);
        window.predictionsChart.update();
    } else {
        const predictionsCtx = document.getElementById('predictionsChart').getContext('2d');
        window.predictionsChart = new Chart(predictionsCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(predictions),
                datasets: [{
                    label: 'Probability (%)',
                    data: Object.values(predictions).map(v => v * 100),
                    backgroundColor: [
                        '#5D5CDE',
                        '#4b4abb',
                        '#3e3e99',
                        '#323277'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Probability (%)'
                        }
                    }
                }
            }
        });
    }
}

// Initialize feature importance chart when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeFeatureImportanceChart();
});