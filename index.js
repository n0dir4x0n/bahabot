require('dotenv').load();
const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
const Vote = require('./dao/vote');
const vote = new Vote();
const admin = require('./dao/admin');
let isactive = false;

bot.start((ctx) => {
    ctx.reply('OK');
})

bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.command('/vip', (ctx) => {
    if (ctx.message.from.username !== process.env.ADMIN) {
        ctx.reply(`You are not admin! please refer to ${process.env.ADMIN} to use this command`);
    } else {

        let messArr = ctx.message.text.split(' ')
        username = messArr[1]
        status = messArr[2];

        if (username === null || status === null || status === undefined || username === undefined || username.indexOf(0) != '@' && username.length <= 1 || status.length > 1) {
            ctx.reply(`Noto'g'ri format\n/vip @username A - formatida kiriting`)
        } else {
            Vote.updateVIP(username, status).then(() => {
                ctx.reply('OK')
            })
        }
    }
});

bot.command('/admin', ({
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
    if (isactive) {
        if (message.text.match(/^(@.*)/gim) != null) {
            let channel = message.text.match(/^(@.*)/gim)[0]
            let username = message.from.username;
            let userid = message.from.id;
            let specialgroup = message.chat.title;
            let specialgroupid = message.chat.id;
            let arr = message.text.split('\n');
            let link = arr[3];
            let votetext = arr[1];
            telegram.getChatMember(specialgroupid, userid).then(r => console.log(r));
            console.log(userid, specialgroupid);
            Vote.create({
                    username,
                    userid,
                    specialgroup,
                    specialgroupid,
                    channel,
                    link,
                    votetext
                })
                .then(() => {
                    reply(`${channel} kanali qo'shildi`)
                })
        } else {
            reply(`Noto\'gri format: @${message.from.username}!`)
        }
    } else {
        reply(`Megaga qabulni ochilishini kuting`)
    }
})

bot.command('/list', async (ctx) => {
    if (ctx.message.from.username !== process.env.ADMIN) {
        ctx.reply(`You are not admin! please refer to @${process.env.ADMIN} to use this command`);
    } else {
        let list = await Vote.getList();
        for (item of list) {
            ctx.reply(item)
        }
    }
})

bot.command('/info', async (ctx) => {
    ctx.reply('info');

    let t = await telegram.getMe();
    console.log(ctx.message.chat)

});

bot.command('/yoqish', async (ctx) => {
    if (!isactive) {
        if (ctx.message.from.username == process.env.ADMIN) {
            // let res = await Vote.getList();
            // res.map(async (el) => {
            //     await telegram.sendMessage(el.specialgroupid, `Megaga qabul  boshlandi`);
            // })
            ctx.reply(`Megaga qabul yoqildi`)
            isactive = true;
        }
    } else {
        ctx.reply(`Megaga qabul yoqilgan`);
    }
})


bot.command('/ketti', async (ctx) => {
            if (ctx.message.from.username == process.env.ADMIN) {
                let specialgroupid = await ctx.message.chat.id
                let SpecialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);

                for (let i = 0; i < SpecialGroupList.length; i++) {
                    let channelid = SpecialGroupList[i].channelid;
                    for (let j = 0; j < SpecialGroupList.length; j++) {

                        let votetext = SpecialGroupList[j].votetext;
                        let link = SpecialGroupList[j].link;
                        let {message_id} = await telegram.sendMessage(channelid, votetext, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{
                                            "text": votetext,
                                            "url": link
                                        }]
                                    ]
                                }
                            })
                        }
                    }
                        
                        // SpecialGroupList.map(async (el) => {
                        //     let channelid = el.channelid;
                        //     let votetext = el.votetext;
                        //     let link = el.link;
                        //     let {
                        //         message_id
                        //     } = await telegram.sendMessage(channelid, votetext, {
                        //         reply_markup: {
                        //             inline_keyboard: [
                        //                 [{
                        //                     "text": votetext,
                        //                     "url": link
                        //                 }]
                        //             ]
                        //         }
                        //     })
                        //     console.log(message_id);

                        //     let messageid = message_id
                        //     await Vote.setMessageID(channelid, messageid);
                        // })
                    }
                })

            bot.command('/uchirish', async (ctx) => {
                if (ctx.message.from.username == process.env.ADMIN) {
                    console.log(isactive)
                    if (!isactive) {
                        ctx.reply(`Megaga qabul uchirilgan`);
                    } else {
                        isactive = false;
                        ctx.reply(`Megaga qabul uchirildi`);
                        let specialgroupid = ctx.message.chat.id;
                        let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
                        specialGroupList.map(async (el) => {
                            let channelid = el.channelid;
                            let chucbefore = await telegram.getChatMembersCount(channelid);
                            await Vote.setChucBefore(channelid, parseInt(chucbefore));
                        })
                        let countsList = await Vote.getChucListBefore();
                        countsList.map(async (el) => {
                            ctx.reply(`${el.channel} - ${el.chucbefore} ta`);
                        })
                    }
                }
            })

            bot.command('/sanash', async (ctx) => {
                if (ctx.message.from.username == process.env.ADMIN) {
                    let specialgroupid = await ctx.message.chat.id
                    let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);

                    specialGroupList.map(async (el) => {
                        let channelid = el.channelid;
                        let chucafter = await telegram.getChatMembersCount(channelid);
                        await Vote.setChucAfter(channelid, parseInt(chucafter));
                        let [{
                            messageid
                        }] = await Vote.getMessageID(channelid);
                        await telegram.deleteMessage(channelid, messageid)
                    })

                    let countsList = await Vote.getChucListAfter();
                    countsList.map(async (el) => {
                        ctx.reply(`Megadan keyin ${el.channel} - ${el.chucafter} ta`);
                    })
                }
            })

            bot.command('/test', async (ctx) => {
                await telegram.sendMessage('-1001172311320', 'Share:', {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                "text": 'Begoyimuz',
                                "url": "https://t.me/Begoyimuz"
                            }]
                        ]
                    }
                })
            })

            bot.use(async (ctx, bot) => {
                if (ctx.channelPost != null) {
                    let channelid = await ctx.channelPost.chat.id
                    let channel = await ctx.channelPost.chat.title
                    let up = await Vote.setChannelID(channel, channelid)
                    console.log(ctx.channelPost, bot)
                }
            })

            bot.startPolling();