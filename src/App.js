import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  CssBaseline,
  Alert,
  Fade,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

import "./App.css"; 
const dummyUser = {
  username: "sandeep",
  password: "lmao",
};


const productCatalog = {
  battery: ["Phone A (5000mAh)", "Phone B (6000mAh)", "Phone C (5500mAh)"],
  camera: ["Lens Kit", "Tripod", "Phone Z (AI Camera)"],
  delivery: ["Next-day Delivery", "Premium Courier"],
  screen: ["Screen Guard", "Phone S (OLED)"],
  service: ["Chat Support", "Call Support"],
  general: ["Gift Card", "Loyalty Points"],
};


const topics = {
  battery: ["battery", "charge", "power"],
  camera: ["camera", "photo", "picture"],
  delivery: ["delivery", "ship", "shipping", "courier"],
  screen: ["screen", "display"],
  service: ["service", "support", "help"],
};


const emojiEmotionMap = {
  "😍": "joy",
  "😡": "anger",
  "😭": "sadness",
  "👍": "confidence",
};
const emojiIntensityMap = {
  "😡": 1.0,
  "😍": 0.9,
  "👍": 0.7,
  "😭": 1.0,
};


const extractEmojis = (text) => {
  const regex = /\p{Emoji_Presentation}/gu;
  return text.match(regex) || [];
};

const detectEmotion = (text, emojis) => {
  if (emojis.length > 0) {
    return {
      label: emojiEmotionMap[emojis[0]] || "neutral",
      intensity: emojiIntensityMap[emojis[0]] || 0.5,
    };
  }
  if (text.toLowerCase().includes("love"))
    return { label: "joy", intensity: 0.8 };
  if (
    text.toLowerCase().includes("die") ||
    text.toLowerCase().includes("hate")
  )
    return { label: "anger", intensity: 0.9 };
  return { label: "neutral", intensity: 0.5 };
};

const extractTopic = (text) => {
  const lower = text.toLowerCase();
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some((k) => lower.includes(k))) return topic;
  }
  return "general";
};

const recommendProducts = (emotion, intensity, topic) => {
  let recs = [];
  if (intensity >= 0.8 && ["anger", "sadness"].includes(emotion)) {
    recs.push("Contact Customer Support");
    recs = recs.concat(productCatalog[topic].slice(0, 2));
  } else if (intensity >= 0.8 && ["joy", "confidence"].includes(emotion)) {
    recs = recs.concat(productCatalog[topic].slice(0, 3));
    recs.push("Premium Upgrade");
  } else if (intensity >= 0.5) {
    recs = recs.concat(productCatalog[topic].slice(0, 2));
  } else {
    recs.push("General Offer");
  }
  return recs;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [review, setReview] = useState("Battery dies all the time 😡😡😡");
  const [emotion, setEmotion] = useState({ label: "", intensity: 0 });
  const [topic, setTopic] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === dummyUser.username && password === dummyUser.password) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleAnalyze = () => {
    const emojis = extractEmojis(review);
    const detectedEmotion = detectEmotion(review, emojis);
    const detectedTopic = extractTopic(review);
    const recs = recommendProducts(
      detectedEmotion.label,
      detectedEmotion.intensity,
      detectedTopic
    );

    setEmotion(detectedEmotion);
    setTopic(detectedTopic);
    setRecommendations(recs);
    setShowResults(false);
    setTimeout(() => setShowResults(true), 10);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setEmotion({ label: "", intensity: 0 });
    setRecommendations([]);
    setTopic("");
    setReview("");
    setLoginError("");
    setShowResults(false);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static" sx={{ mb: 4, backgroundColor: "rgba(50, 50, 80, 0.85)" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Emotion-Product Recommendation
          </Typography>
          {isLoggedIn && (
            <IconButton
              color="inherit"
              onClick={handleLogout}
              title="Logout"
              size="large"
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        {!isLoggedIn ? (
          <Paper className="fade-in" elevation={6}>
            <Typography
              variant="h5"
              mb={3}
              fontWeight="bold"
              textAlign="center"
              color="#764ba2"
            >
              Login
            </Typography>
            <Box component="form" onSubmit={handleLogin} noValidate>
              <TextField
                label="Username"
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
              />
              {loginError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {loginError}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, fontWeight: "bold" }}
              >
                Login
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper className="fade-in" elevation={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Enter Customer Review
            </Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Type or paste review text with emojis..."
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleAnalyze}
              endIcon={<EmojiEmotionsIcon />}
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Analyze Emotion & Recommend Products
            </Button>

            <Fade in={showResults}>
              <Box>
                {emotion.label && (
                  <>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Analysis Result
                    </Typography>
                    <Typography>
                      <strong>Emotion Detected:</strong>{" "}
                      {emotion.label} ({emotion.intensity.toFixed(2)})
                    </Typography>
                    <Typography>
                      <strong>Topic Detected:</strong> {topic}
                    </Typography>

                    <Typography variant="h6" mt={3} gutterBottom fontWeight="bold">
                      Recommended Products / Actions
                    </Typography>
                    <List>
                      {recommendations.map((item, idx) => (
                        <ListItem key={idx} disablePadding>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Box>
            </Fade>
          </Paper>
        )}
      </Container>
    </>
  );
}
