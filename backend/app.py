
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import torch
from transformers import AutoTokenizer, AutoModel
import torch.nn as nn
import torch.nn.functional as F

model_path = r"C:\Users\sandy\OneDrive\Desktop\customer analysis\emotion_model_final.pt"
model_name = "distilbert-base-uncased"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


label2id = {
    'joy': 0, 'sadness': 1, 'anger': 2, 'fear': 3, 'surprise': 4, 'disgust': 5,
    'trust': 6, 'anticipation': 7, 'love': 8, 'optimism': 9, 'pessimism': 10,
    'envy': 11, 'pride': 12, 'shame': 13, 'guilt': 14, 'contentment': 15,
    'boredom': 16, 'relief': 17, 'anxiety': 18, 'hope': 19, 'joyfulness': 20,
    'excitement': 21, 'loneliness': 22, 'confusion': 23, 'empathy': 24,
    'gratitude': 25, 'frustration': 26, 'disappointment': 27
}
id2label = {v: k for k, v in label2id.items()}
num_labels = len(label2id)

class EmotionClassifier(nn.Module):
    def __init__(self, backbone, num_labels):
        super().__init__()
        self.backbone = backbone
        self.dropout = nn.Dropout(0.2)
        self.classifier = nn.Linear(backbone.config.hidden_size, num_labels)

    def forward(self, input_ids, attention_mask):
        outputs = self.backbone(input_ids=input_ids, attention_mask=attention_mask)
        hidden_state = outputs.last_hidden_state[:, 0]  
        x = self.dropout(hidden_state)
        return self.classifier(x)


tokenizer = AutoTokenizer.from_pretrained(model_name)
backbone = AutoModel.from_pretrained(model_name)
model = EmotionClassifier(backbone, num_labels).to(device)
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],    
)


class Feedback(BaseModel):
    texts: List[str]
    top_k: int = 3            
    threshold: float = 0.05   

topics_keywords = {
    "Battery": ["battery", "charge", "power"],
    "Camera": ["camera", "photo", "picture"],
    "Delivery": ["delivery", "shipping", "late"],
    "Screen": ["screen", "display"],
}

product_recommendations = {
    "Battery": ["Phones with long battery life", "Fast charging accessories"],
    "Camera": ["Latest camera models", "Camera accessories"],
    "Delivery": ["Premium delivery options"],
    "Screen": ["Screen protectors", "High-res displays"]
}

@app.post("/predict")
def predict(feedback: Feedback):
    inputs = tokenizer(feedback.texts, padding=True, truncation=True, max_length=128, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        logits = model(**inputs)
        probs = torch.sigmoid(logits)

    results = []
    for text, prob in zip(feedback.texts, probs):
        prob_np = prob.cpu().numpy()
       
        top_indices = prob_np.argsort()[-feedback.top_k:][::-1]
        emotions = {id2label[i]: float(prob_np[i]) for i in top_indices if prob_np[i] >= feedback.threshold}

       
        topic = None
        for t, keywords in topics_keywords.items():
            if any(k.lower() in text.lower() for k in keywords):
                topic = t
                break

        recommendations = product_recommendations.get(topic, [])

        results.append({
            "text": text,
            "emotions": emotions,
            "topic": topic,
            "recommendations": recommendations
        })

    return {"results": results}
