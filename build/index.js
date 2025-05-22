require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN, {
    handlerTimeout: Infinity
  })

bot.on('new_chat_members', async (ctx) => {
    try {
        const chatId = ctx.message.chat.id
        if (ctx.message && ctx.message.message_id) {
            await bot.telegram.deleteMessage(chatId, ctx.message.message_id)
        }
    } catch (error) {
        console.error(`Error on new_chat_members event`, error)
    }        
});

async function startBot() {
    try {
        // Запуск бота
        bot.launch({
            allowedUpdates: ["message", 'chat_member']
        });
        console.log('Bot is running');
    } catch (error) {
        console.error('BOT START', error);
    }
}

startBot();