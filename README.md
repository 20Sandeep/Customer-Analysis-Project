Customer Feedback Emotion Analyzer

A full-stack application that analyzes customer feedback and classifies emotions using a fine-tuned DistilBERT-based Emotion Classifier.
Built with a React frontend, Python backend, and a custom-trained PyTorch model, this system provides real-time emotion predictions for any customer input.

 Overview

Businesses receive large volumes of text feedback every day.
This project automatically analyzes that feedback and detects emotions such as:

joy

anger

sadness

fear

optimism

love

surprise

and more (28 total categories)

The system combines modern NLP transformers with a lightweight web interface to deliver fast and accurate emotion detection.

 Features

Real-time emotion prediction from user text

Pretrained DistilBERT backbone with custom classifier layers

Backend API built using Python + PyTorch

Interactive React UI with clean components

End-to-end system: Frontend → Backend → Model

Supports 28 distinct emotion labels

Easy to extend with new datasets or features

         

Model Architecture

The model uses a custom classifier built on top of DistilBERT:

DistilBERT embeddings

6 Transformer layers

Additional dropout (0.2)

Final linear layer → 28 output classes

This gives a good balance of accuracy vs. speed.

⚙️ Backend Setup
Install dependencies:
pip install -r requirements.txt

Run backend:
python backend/app.py

Frontend Setup
Install:
npm install

Start the development server:
npm start


The app runs on:

http://localhost:3000


Make sure the backend is running to allow predictions.
Future Enhancements

Multi-language emotion detection

Audio/speech emotion extraction

Dashboard to visualize emotion trends

Support for charts/graphs

Real-time API deployment (Render / VPS / AWS)
License

This project is open for educational and development use.
