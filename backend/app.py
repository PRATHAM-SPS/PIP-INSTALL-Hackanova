from flask import Flask, request, jsonify
import requests
import re
from flask_cors import CORS
from dabas import ocr_space_file
import pickle
import numpy as np
import pandas as pd
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import google.generativeai as genai
import speech_recognition as sr

app = Flask(__name__)
CORS(app)

chat_sum = " "


@app.route('/send_mail', methods=['POST'])
def send_mail(name = "Rishabh"):
    category = request.json["category"]
# Email account credentials
    body = "\nDear "+name+",\n\nYour expenditure in "+category+" has exceeded the budget limit set for this category. We urge you to take immediate action to address this situation and bring your spending in line with the budget limit. Failure to do so may have a negative impact on your overall financial position and hinder your ability to achieve your financial goals.\n\nAs a budget monitoring company, we understand the importance of financial prudence and effective resource management. We offer budget monitoring and management solutions that can assist you in managing your finances effectively. Please contact us if you require any assistance.\n\nBest regards,\n\nTaher Barwaniwala\nTerraFinances"
    sender_email = 'barwaniwalataher6@outlook.com'
    sender_password = '_Taher@2002'
    receiver_email = 'tripathirishi80@gmail.com'

    # Create message object instance
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = 'Alert! You have spend over your spending limit'

    # Email body
    body = body
    message.attach(MIMEText(body, 'plain'))

    # Create SMTP session
    session = smtplib.SMTP('smtp.office365.com', 587)
    session.starttls()
    session.login(sender_email, sender_password)

    # Send email
    text = message.as_string()
    session.sendmail(sender_email, receiver_email, text)
    session.quit()
    print('Mail Sent')

    return json.dumps({"success":"200"})


@app.route('/ocr', methods=['POST'])
def space_file():
    file = request.files['image']
    print('Uploaded file:', file.filename)
    # overlay = False
    # api_key = 'K89580507588957'
    # language = 'eng'
    # payload = {'isOverlayRequired': overlay,
    #            'apikey': api_key,
    #            'language': language}
    # response = requests.post('https://api.ocr.space/parse/image',
    #                          data=payload,
    #                          files={'image': file.read()})
    # money_pattern = r'(?:USD\s*)?\$\d+(?:\.\d{2})?'
    # matches = re.findall(money_pattern, response.content.decode())
    # print(matches)
    matches = ocr_space_file(file.filename)

    return {'matches': matches}

@app.route('/forecast-spending', methods = ['POST'])
def forecast_spending():
    df = pd.read_csv('ccpay.csv')
    data = df.head(10)

    df2 = pd.read_csv('homeimp.csv')
    data2 = df2.head(10)

    # category = request.json["category"]
    model = models['Credit Card Payment']
    model2 = models['Home Improvement']
    prediction1 = model.predict(start = len(data),end = len(data)+5,typ = 'levels')
    prediction2 = model2.predict(start = len(data2),end = len(data2)+5,typ = 'levels')
    print(prediction1)
    print(prediction2)
    return ({{"name":"Credit Card Payment", "data":prediction1.tolist()}, {"name": "Home Improvement", "data":prediction2.tolist()}})

geminikey="AIzaSyD17qzyJMl5wjkj79jvpiUSfjA_dv9-dPw"
genai.configure(api_key = geminikey)

@app.route('/product', methods=['POST'])
def get_product_info():
    # Get product_name from the JSON payload
    product_name = request.json.get('product_name')

    # Check if product_name is provided 
    if not product_name:
        return jsonify({'error': 'Product name not provided.'})

    pf = f"""
    Is {product_name} renewable or sustainable? Answer in only yes or no.
    """

    model = genai.GenerativeModel('gemini-pro')
    instructions = model.generate_content(pf)
    # print(response.candidates)    
 

    # Get generated text
    generated_text = instructions.text

    # Check if the answer is "No"
    if "No" in generated_text:
        # Generate alternative
        pf=f'''Suggest renewable or sustainable alternatives to {product_name} '''
        alternative = model.generate_content(pf)
        # Get alternative text
        alt_text = alternative.text
        # print(alt_text)

        # Return response as JSON
        return { "key" : '0'}
    
    # Return response as JSON
    return {"key" : '1'}

@app.route('/voice_input', methods=['POST'])
def process_voice_input():
    try:
        voice_file = request.files['voice']
        recognizer = sr.Recognizer()

        with sr.AudioFile(voice_file) as source:
            audio_data = recognizer.record(source)

        user_input = recognizer.recognize_google(audio_data)
        # Now, you can use the user_input as needed in your application logic

        return jsonify({"user_input": user_input})
    except Exception as e:
        return jsonify({"error": str(e)})

geminikey = "AIzaSyDeIMfblCzN3zfBl9CBt8n12HvjQYhRANQ"
genai.configure(api_key=geminikey)
chat_sum = " "

@app.route('/get_bot_response', methods=['POST'])
def get_bot_response():
    user_message = request.json.get('userMessage', '')
    global chat_sum 
    print(chat_sum)
    
    # Perform any backend logic based on the user's message here
    # For example, you can call your Gem AI API or any other processing
    
    # Use Gem AI to generate a response
    pf = f'''You are a finance chatbot and your task is to give appropriate outputs to the user's inputs. Make your answers short and to the point
            Chat Summary: {chat_sum}
            User{user_message}'''
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(pf)
    generated_text = response.text

    chat_sum +=  " User message: "+ user_message + " Bot Answer: " + response.text
    
    # Return the generated response from Gem AI
    return jsonify({'botResponse': generated_text})


@app.route("/splitbillemail", methods = ['POST'])
def splitbillemail():
    print(request.json['email'])
    email = request.json['email']
    amt = request.json["amt"]
    l = email.count(',')
    finalamt = int(amt/(l+1))

    geminikey="AIzaSyD17qzyJMl5wjkj79jvpiUSfjA_dv9-dPw"
    genai.configure(api_key = geminikey)
# Email account credentials
    body = """
    Dear friend, <br>
    <br>
    We have some incomplete transactions. You have to pay {} for the bill.<br>
    You can easily send it on my UPI: taherbarwani@okbuddy

    <br>
    <br>

    <a href="https://freeimage.host/"><img src="https://iili.io/JE1qDdP.jpg" alt="JE1qDdP.jpg" border="0" /></a> <br>
    <br>

    Regards,<br>
    Taher Barwaniwala,<br>
    Your Friend
    """.format(finalamt)
    sender_email = 'barwaniwalataher6@outlook.com'
    sender_password = '_Taher@2002'

    if l > 0:
        emails = email.split(',')
    else:
        emails = [email]
    for i in range(l+1):
        receiver_email = emails[i]

        # Create message object instance
        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = receiver_email
        message['Subject'] = 'Bill Split Check!'

        # Email body
        body = body
        message.attach(MIMEText(body, 'html'))

        # Create SMTP session
        session = smtplib.SMTP('smtp.office365.com', 587)
        session.starttls()
        session.login(sender_email, sender_password)

        # Send email
        text = message.as_string()
        session.sendmail(sender_email, receiver_email, text)   
        session.quit()
   
    print('Mail Sent')

    return json.dumps({"success":"200"})



@app.route("/send_point_mail",methods = ["POST"])
def send_point_mail(receiver_email='barwaniwalataher6@gmail.com'):
    product = request.json["product"]
    type = request.json["type"]

# Email account credentials
    body = expense_vinci(name='Rishabh', type=type,product = product)
    sender_email = 'barwaniwalataher6@outlook.com'
    sender_password = '_Taher@2002'
    receiver_email = 'tripathirishi80@gmail.com'

    # Create message object instance
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = 'Terra Wallet Update!'

    # Email body
    body = body
    message.attach(MIMEText(body, 'plain'))

    # Create SMTP session
    session = smtplib.SMTP('smtp.office365.com', 587)
    session.starttls()
    session.login(sender_email, sender_password)

    # Send email
    text = message.as_string()
    session.sendmail(sender_email, receiver_email, text)
    session.quit()
    print('Mail Sent')

    return json.dumps({"success":"200"})




def expense_vinci(name, type, product): 
    
    pf = f"Write a Mail body to {name} stating you got {type} points and suggest renewable and sustainable alternative of {product} to them."

    model = genai.GenerativeModel('gemini-pro')
    instructions = model.generate_content(pf)
    print(instructions)
    return instructions.text


@app.route('/create_budget', methods=['POST'])
def create_budget():
    data = request.json["income"]
    
    pf=f"I have {data} dollars, help me create a budget for this month for my education, medical, investment, groceries, misc and bills for a month.Dont give bold output, keep it plain font"
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(pf)
    generated_text = response.text

    print(generated_text)
    return {'generated_text': generated_text}

if __name__ == '__main__':
    # send_point_mail()
    app.run(port=4000)