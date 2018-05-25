require('dotenv').load();
const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN);
const vote = require('./dao/vote');
const admin = require('./dao/admin');

bot.start((ctx) => {
   ctx.reply('OK');
})

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))


/**
 * setting vip status to a participant
 */
bot.hears(/vip/i,(ctx) =>{
   if(ctx.message.from.username !== process.env.ADMIN){
      ctx.reply(`You are not admin! please refer to ${process.env.ADMIN} to use this command`);
   } else {
     
      let messArr = ctx.message.text.split(' ')
      username = messArr[1]
      status  = messArr[2];

         if(username === null || status === null || status === undefined || username === undefined || username.indexOf(0) != '@' && username.length <= 1 || status.length > 1){
         ctx.reply(`Noto'g'ri format\n/vip @username A - formatida kiriting`)
      } else {
         ctx.reply('OK')
      }
 
      
      // vote.updateVIP(username, status).then(()=> ctx.reply('success'))
      
   }
});


/**
 * Providing a telegram info
 */
bot.hears(/info/i, (ctx) =>{
   ctx.reply('info');
   console.log(ctx.message);
});

/**
 * starts sending MEGA to bot participants
 */
bot.hears(/start/i, (ctx) =>{

})

/**
 * delete all MEGA from participant channels
 */

bot.hears(/stop/i, (ctx) =>{

})


bot.startPolling()