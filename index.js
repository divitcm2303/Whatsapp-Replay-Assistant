const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const nlp = require('compromise');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', () => console.log('✅ WhatsApp AI Assistant is active!'));

// Your personal daily schedule 
const schedule = [
  { start: "06:00", end: "08:00", activity: "🏃‍♂️ at the gym" },
  { start: "08:00", end: "10:00", activity: "🍳 having breakfast" },
  { start: "10:00", end: "12:00", activity: "💻 working on academics" },
  { start: "12:00", end: "14:00", activity: "🍽️ having lunch" },
  { start: "14:00", end: "18:00", activity: "🧍 doing personal activities" },
  { start: "18:00", end: "20:00", activity: "👨‍👩‍👦 family time" },
  { start: "20:00", end: "22:00", activity: "🎮 chilling or watching something" },
  { start: "22:00", end: "06:00", activity: "😴 sleeping" }
];

// Helper to check current activity
function getCurrentActivity() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    for (let i = 0; i < schedule.length; i++) {
        const { start, end, activity } = schedule[i];
        if (start > end) { // overnight case
            if (currentTime >= start || currentTime < end) return activity;
        } else {
            if (currentTime >= start && currentTime < end) return activity;
        }
    }
    return "💭 doing something at the moment";
}

// Listen to all messages
client.on('message', async message => {
    const chatId = message.from;

    // Skip groups, broadcasts, and business accounts
    if (chatId.endsWith('@g.us')) return;
    if (chatId.endsWith('@broadcast')) return;
    const contact = await message.getContact();
    if (contact.isBusiness) return;

    const now = new Date().getTime();

    // Track owner's messages to mark availability
    if (message.fromMe) {
        ownerLastMessage[chatId] = now;
        return; // bot does not process owner messages
    }

    const text = message.body ? message.body.toLowerCase().trim() : "";
    
    // Skip if message is empty and not media
    if (!text && !message.hasMedia) return;

    const doc = nlp(text || "");
    const normalized = doc.normalize().out('text');

    // --- Triggers ---
    const greetings = ["hi", "hey", "hello", "bro", "dude", "sup", "yo"];
    const isGreeting = greetings.some(word => normalized.split(/\s+/).includes(word));

    const askAvailable = /(when|what time).*avail|free|back|online/.test(normalized);
    const askToCall = /(tell|ask|remind).*(call|ring).*(him|her|them|me)/.test(normalized);
    const askDoing = /(doing|up to|busy with|where|gone|now)/.test(normalized);

    // --- Bot reply logic ---
    // GREETINGS: only if owner inactive for GREETING_DELAY
    if (isGreeting && (!ownerLastMessage[chatId] || now - ownerLastMessage[chatId] > GREETING_DELAY)) {
        await message.reply("Hey! I’m his personal assistant. He’s not available at the moment. What information would you like to share with him?");
    } 
    // ACTIONABLE questions always reply
    else if (askAvailable) {
        await message.reply("He’ll be there in about an hour ⏰");
    } 
    else if (askToCall) {
        await message.reply("Sure, I’ll remind him to call you 📞");
    } 
    else if (askDoing) {
        const activity = getCurrentActivity();
        await message.reply(`Right now, he’s ${activity}`);
    } 
    else if (message.hasMedia || ["document", "image", "video", "ptt", "contact"].includes(message.type)) {
        await message.reply("👍");
    }
});

client.initialize();
