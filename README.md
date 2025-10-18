# Whatsapp-Replay-Assistant
This mini project helps to receive and reply to your messages in whatsapp.

What are all the features that this assistant can do ?
  When someone sends a message while you’re offline, the bot checks:
    If it’s a greeting, it replies politely.
    If they ask what you’re doing, it checks your time schedule and replies accordingly.
    If they ask when you’ll be available, it gives an estimated time.
    If they say “tell him to call”, it promises to remind you.
    If it’s media (image/video/document), it replies with 👍.

Tools used:
  Node.js – JavaScript runtime.
  whatsapp-web.js – WhatsApp automation library.
  compromise – lightweight NLP processing.
  qrcode-terminal – to generate QR code for WhatsApp login.
   
Steps to follow :
  Create a seperate folder for this project.
  Download necessary libraries such as whatsapp-web.js 
                                       qrcode-terminal &
                                       compromise
  Make sure to download the libraries within the project folder.
  Finally, you can run the code "node (filename).js" in your command prompt.
  Scan the QR with the linked devices feature in your whatsapp and run this project in your mobile/desktop.

Important note:
  This is only a prototype model it is not fully completed. Hence, it requries terminal to run continuously to make the bot active. If the terminal is closed then the bot will stop working.
  And also, the model has cooldown option with 2 minutes which makes the bot silent for 2 minutes after the owner's last message.
  


  
