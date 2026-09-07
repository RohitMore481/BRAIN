# NASA Li-ion Battery Dataset

Place NASA Li-ion Battery Dataset files in this directory.

## Source & Download
Download the dataset from the NASA Prognostics Center of Excellence (PCoE) Data Repository.

## Required Datasets & Battery Files

Ensure the following MAT-files are placed in this folder:

- `B0005.mat`
- `B0006.mat`
- `B0007.mat`
- `B0018.mat`

## Usage
The dataset calibration and loader modules (`prediction_engine/feature_processing/dataset_loader.py`) will automatically parse these files for battery aging, capacity degradation, and impedance extraction.

> **Note**: MAT and CSV data files are ignored by version control to keep the repository lightweight.
