// @mui material components
import Card from "@mui/material/Card";

// PIP INSTALL Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// PIP INSTALL Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

import { db } from "layouts/authentication/firebase";
import { onValue, ref } from "firebase/database";

import { useState, useEffect } from "react";
import axios from 'axios';
import annyang from 'annyang'

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 400,
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
}));

const ChatPage = () => {
  const classes = useStyles();
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: inputMessage },
        { type: 'bot', text: getBotResponse(inputMessage) },
      ]);
      setInputMessage('');
    }
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const userVoiceInput = event.results[0][0].transcript;

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: userVoiceInput },
        { type: 'bot', text: getBotResponse(userVoiceInput) },
      ]);
    };

    recognition.onend = () => {
      recognition.stop();
    };
  };

  const getBotResponse = (userInput) => {
    // Implement your chatbot logic here
    // For simplicity, use a predefined response
    const defaultResponse = "I'm a stylish chatbot. Ask me anything!";

    // Check for specific user inputs and provide corresponding responses
    switch (userInput.toLowerCase()) {
      case 'hello':
        return 'Hello! How can I assist you today?';
      case 'bye':
        return 'Goodbye! Have a great day.';
      default:
        return defaultResponse;
    }
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
            {/* Render chat messages */}
            {chatMessages.map((message, index) => (
              <div key={index} style={{ marginBottom: 10, color: message.type === 'user' ? '#2196F3' : '#4CAF50' }}>
                {message.type === 'user' ? 'You: ' : 'Bot: '}
                {message.text}
              </div>
            ))}
          </VuiBox>
          {/* Input area */}
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
            <button className={classes.sendButton} onClick={handleVoiceInput}>
              Voice
            </button>
          </VuiBox>
        </Card>
      </VuiBox>
    </DashboardLayout>
  );
};

export default ChatPage;