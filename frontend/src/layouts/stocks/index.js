
// @mui material components
import Card from "@mui/material/Card";

// PIP INSTALL Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// PIP INSTALL Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";

import { db } from "layouts/authentication/firebase";
import { onValue, ref } from "firebase/database";

import { useState, useEffect } from "react";
import axios from 'axios';

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 1000,
    margin: "0 auto",
  },
  chatMessages: {
    minHeight: 200,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    overflowY: "auto",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  inputField: {
    flex: 1,
    marginRight: theme.spacing(2),
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
  sendButton: {
    cursor: "pointer",
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    border: 0,
    "&:hover": {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    },
  },
  voiceButton: {
    cursor: "pointer",
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.dark} 90%)`,
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    border: 0,
    marginLeft: theme.spacing(2),
    "&:hover": {
      background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 30%, ${theme.palette.secondary.main} 90%)`,
    },
  },
}));

const ChatPage = () => {
  const classes = useStyles();
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const recognition = new window.webkitSpeechRecognition();
  const [listening, setListening] = useState(false);

  useEffect(() => {
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setInputMessage(result);
      recognition.stop();
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: inputMessage },
      ]);

      try {
        const response = await axios.post('http://localhost:4000/get_bot_response', {
          userMessage: inputMessage,
        });

        const botResponse = response.data.botResponse;
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: botResponse },
        ]);
      } catch (error) {
        console.error('Error fetching bot response:', error);
      }

      setInputMessage('');
    }
  };

  const handleVoiceButtonClick = () => {
    if (!listening) {
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    synth.speak(utterance);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3} className={classes.chatContainer}>
        <Card>
          <VuiBox display="flex" justifyContent="space-between" alignItems="center" padding={2}>
            <VuiTypography variant="lg" color="white">
              Chat with the Stylish ChatBot
            </VuiTypography>
          </VuiBox>
          <VuiBox className={classes.chatMessages}>
            {chatMessages.map((message, index) => (
              <div key={index} style={{ marginBottom: 10, color: message.type === 'user' ? '#2196F3' : '#4CAF50' }}>
                {message.type === 'user' ? 'You: ' : 'Bot: '}
                {message.text}
              </div>
            ))}
          </VuiBox>
          <VuiBox className={classes.inputContainer} padding={2}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className={classes.inputField}
            />
            <button className={classes.sendButton} onClick={handleSendMessage}>
              Send
            </button>
            <button className={classes.voiceButton} onClick={handleVoiceButtonClick}>
              {listening ? 'Stop Listening' : 'Start Listening'}
            </button>
          </VuiBox>
        </Card>
      </VuiBox>
    </DashboardLayout>
  );
};


export default ChatPage;