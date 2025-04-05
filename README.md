# ML Model Information

This directory will contain the saved machine learning model for career prediction.

## Planned Files

When the ML model is ready, this directory will contain:
- `career_predictor_model.pkl` - Pickled model file
- `model_metadata.json` - Information about model features and training

## Integration

To integrate the real model with the web app, modify the `app.js` file to:
1. Send form data to a backend API that loads this model
2. Replace the simplified prediction logic with actual API calls