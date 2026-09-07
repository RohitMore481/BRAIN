# Trained Prediction Models Directory

This directory stores serialized Machine Learning model weights and pipeline artifacts used by the BRAIN inference engine.

## Model Placement

When training or downloading pre-trained models, save `.pkl`, `.joblib`, `.h5`, or `.pth` files in this directory:

- `soc_estimator.joblib`: State of Charge prediction model
- `soh_estimator.joblib`: State of Health prediction model
- `rul_estimator.joblib`: Remaining Useful Life regression model
- `anomaly_detector.pkl`: Battery anomaly detection model

## Version Control Notice

Trained binary model files (`*.pkl`, `*.joblib`, `*.h5`) are excluded from Git tracking via `.gitignore` to maintain repository size efficiency and prevent binary merge conflicts.

To train new model artifacts, execute the feature processing and training scripts in `prediction_engine/feature_processing/`.
