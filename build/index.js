require('dotenv').config();
const fs = require('fs');
const { Telegraf, Markup } = require('telegraf');
const AllowedChatsFilePath = '/app/config/chats.json';
const mainAdmin = parseInt(process.env.MAIN_ADMIN);
const botID = parseInt(process.env.BOT_ID);
let AllowedChats = [];

const bot = new Telegraf(process.env.BOT_TOKEN, {
    handlerTimeout: Infinity
  })



async function loadAllowedChats() {
    try {
        if (!fs.existsSync(AllowedChatsFilePath)) {
            AllowedChats = [];
            return [];
        }

        const data = fs.readFileSync(AllowedChatsFilePath, 'utf8');

        if (!data.trim()) {
            AllowedChats = [];
            return [];
        }

        AllowedChats = JSON.parse(data);
        return AllowedChats;
    } catch (err) {
        console.error(`Error when loading Allowed Chats File: `, err);
        return [];
    }
}

bot.on('my_chat_member', async (ctx) => {
    try {    
        const chatMember = ctx.myChatMember;
        const newChatMember = chatMember.new_chat_member;
        let chat_link = chatMember.chat.username ? "https://t.me/"+ chatMember.chat.username : "https://t.me/c/" + ctx.chat.id.toString().substring(4)

        if (newChatMember.status === 'member' && chatMember.chat.type !== 'private') {
            const addedBy = ctx.update.my_chat_member.from;

            if (addedBy.id !== mainAdmin) {
                try {
                    let first_name = addedBy.first_name ? addedBy.first_name : addedBy.id
                    let _user = addedBy.username ? "@"+addedBy.username : first_name
                    let text = `Bot was added to unlisted chat <a href="${chat_link}"><b>${chatMember.chat.title}</b></a>\nBy User: <a href="tg://user?id=${addedBy.id}">${_user}</a>\nGroup ID: <code>${ctx.chat.id}</code>`
                    await bot.telegram.sendMessage(mainAdmin, text, {
                        parse_mode: 'HTML'
                        }
                    );                

                    let msg = `Thank you for your interest in this bot\n\n`;
                    msg += `You cannot use this bot in your group\n\n`;
                    msg += `But you can use this bot by <a href="https://github.com/Bigmanekb/telegram-delete-newmember-notify-bot">running it yourself on your own server</a>`;
                    await ctx.replyWithHTML(msg);
                    console.error(`Bot was added to unlistet group ${chatMember.chat.title} ${chat_link} By User: ${addedBy.id}`, JSON.stringify(chatMember.chat))
                    await ctx.leaveChat();
                } catch (err) {
                    console.error(`Error while leaving unlisted group ${chatMember.chat.title} https://t.me/c/${ctx.chat.id.toString().substring(4)}`, err)
                }
            }
        }
    } catch (error) {
        console.error(`Error on my_chat_member`, error)
    }
});

bot.on('new_chat_members', async (ctx) => {
    try {
        const chatId = ctx.message.chat.id;
        const allowedChats = await loadAllowedChats();

        if (!allowedChats.includes(chatId)) return;

        const isBotAdded = ctx.message.new_chat_members.some(member => member.id === botID);
        if (isBotAdded) return;

        if (ctx.message && ctx.message.message_id) {
            await bot.telegram.deleteMessage(chatId, ctx.message.message_id);
        }
    } catch (error) {
        console.error(`Error on new_chat_members event`, error);
    }
});

async function startBot() {
    try {
        bot.launch({
            allowedUpdates: ["message", 'chat_member', "my_chat_member"]
        });
        console.log('Bot is running');
    } catch (error) {
        console.error('BOT START', error);
    }
}

startBot();