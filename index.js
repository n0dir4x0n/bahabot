require('dotenv').load();
const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
const Vote = require('./dao/vote');
const vote = new Vote();
const admin = require('./dao/admin');

bot.start((ctx) => {
    ctx.reply('OK');
})

bot.help((ctx) => ctx.reply('Send me a sticker'))
// bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))


/**
 * setting vip status to a participant
 */
bot.hears(/vip/i, (ctx) => {
    if (ctx.message.from.username !== process.env.ADMIN) {
        ctx.reply(`You are not admin! please refer to ${process.env.ADMIN} to use this command`);
    } else {

        let messArr = ctx.message.text.split(' ')
        username = messArr[1]
        status = messArr[2];

        if (username === null || status === null || status === undefined || username === undefined || username.indexOf(0) != '@' && username.length <= 1 || status.length > 1) {
            ctx.reply(`Noto'g'ri format\n/vip @username A - formatida kiriting`)
        } else {
            Vote.updateVIP(username, status).then(()=>{
                ctx.reply('OK')
            })
       }
    }
});

bot.hears(/admin/i, ({
    reply,
    message
}) => {
    if (message.from.username !== process.env.ADMIN) {
        ctx.reply(`You are not admin! please refer to ${process.env.ADMIN} to use this command`);
    } else {
        let messArr = message.text.split(' ')
        username = messArr[1];
        command = messArr[2];
        if (username === null || username == undefined || username.indexOf(0) !== '@' && username.length <= 1) {
            reply(`Notogri format\n/admin @username -/+ - formatida kiriting `);
        } else {
            if (command == '+') {
                reply(`ok`);
            } else if (command == '-') {
                reply(`ok`);
            } else {
                reply(`Notogri format\n/admin @username - formatida kiriting `);
            }
        }
    }
})

bot.hears(/mega/i, ({
    reply,
    message,
    update
}) => {
    if (message.text.match(/^(@.*)/gim) != null) {
        let channel = message.text.match(/^(@.*)/gim)[0]
        let username = message.from.username;
        let userId = message.from.id;
        let specialgroup = message.chat.title;
        let specialgoupId = message.chat.id;
        let arr = message.text.split('\n')
        let link = arr[3];
        let votetext = arr[1];
            Vote.create({username, specialgroup, channel, link, votetext})
            .then(()=>{
                reply(`${channel} kanali qo'shildi`)
            })
    } else {
        reply(`Noto\'gri format: @${message.from.username}!`)
    }
})

bot.hears(/list/i, async (ctx) =>{
    if (ctx.message.from.username !== process.env.ADMIN) {
        ctx.reply(`You are not admin! please refer to @${process.env.ADMIN} to use this command`);
    } else {
        let list = await Vote.getList();
        // let JsonList = JSON.stringify(list);
        for(item of list){
            ctx.reply(item)
        }    
    } 
})


/**
 * Providing a telegram info
 */
bot.hears(/info/i, async (ctx) => {
    ctx.reply('info');
    //    console.log(ctx.update.message.from.id)
    // let a = ctx.getChatMember(ctx.update.message.chat.id, ctx.update.message.from.id)
    // a.then((res)=>{
    //     console.log(res)
    // })

    // console.log(ctx.telegram.options.agent._events)// console.log(ctx.message.chat, )

    // getChatMember

    // console.log(ctx)
    telegram.getChatMembersCount('-1001172311320').then(r=> console.log(r));
    let ch = await ctx.channelPost
    console.log(ch)

});

bot.use(async (ctx, bot) => {
    // const start = new Date()
    // await next()
    // const ms = new Date() - start
    // console.log('Response time %sms', ms)
    if(ctx.channelPost!= null){
        let ch = await ctx.channelPost.chat.id
        let cc = await ctx.getChatMembersCount(ch)
        console.log(cc);
        console.log(ctx.channelPost.chat);
        // ctx.reply('heyeheyeh');
    }



})

/**
 * starts sending MEGA to bot participants
 */
bot.hears(/start/i, (ctx) => {

})

/**
 * delete all MEGA from participant channels
 */

bot.hears(/stop/i, (ctx) => {

})

bot.startPolling();