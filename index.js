require('dotenv').load();

const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
// const redis = require('redis');
const telegram = new Telegram(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
const Vote = require('./dao/vote');
const VoteType = require('./dao/votetype');
// const vote = new Vote();
// const admin = require('./dao/admin');
// let admins = require('./admins');

// const winston = require('winston');

// client = redis.createClient();
// client.on('error', (err) =>{
//     console.log('Error ' + err );
// });

// bot.start((ctx) => {
//     ctx.reply('OK');
// })

// bot.help((ctx) => ctx.reply('Send me a sticker'))

// bot.command('/vip', (ctx) => {
//     if (ctx.message.from.username !== process.env.ADMIN) {
//         ctx.reply(`You are not admin! please refer to ${process.env.ADMIN} to use this command`);
//     } else {

//         let messArr = ctx.message.text.split(' ')
//         username = messArr[1]
//         status = messArr[2];

//         if (username === null || status === null || status === undefined || username === undefined || username.indexOf(0) != '@' && username.length <= 1 || status.length > 1) {
//             ctx.reply(`Noto'g'ri format\n/vip @username A - formatida kiriting`)
//         } else {
//             Vote.updateVIP(username, status).then(() => {
//                 ctx.reply('OK')
//             })
//         }
//     }
// });

// bot.command('/admin', ({
//     reply,
//     message
// }) => {
//     if (message.from.username !== process.env.ADMIN) {
//         ctx.reply(`You are not admin! please refer to ${process.env.ADMIN} to use this command`);
//     } else {
//         let messArr = message.text.split(' ')
//         username = messArr[1];
//         command = messArr[2];
//         if (username === null || username == undefined || username.indexOf(0) !== '@' && username.length <= 1) {
//             reply(`Notogri format\n/admin @username -/+ - formatida kiriting `);
//         } else {
//             if (command == '+') {
//                 admin.create({username})
//                 reply(`ok`);
//             } else if (command == '-') {
//                 reply(`ok`);
//             } else {
//                 reply(`Notogri format\n/admin @username - formatida kiriting `);
//             }
//         }
//     }
// })

bot.hears(/mega/i, ({reply,message,update}) => {
    let isActive = await Vote.getStatus(specialgroupid);
    let username = await message.from.username;
    let userid = await message.from.id;
    let specialgroup = await message.chat.title;
    let specialgroupid = await message.chat.id;
    let arr = await message.text.split('\n');

    if (await isActive) {
        if (message.text.match(/^(@.*)/gim) != null) {
            let channel = message.text.match(/^(@.*)/gim)[0];                   
            let link = arr[3];
            let votetext = arr[1];

            await telegram.getChatMember(specialgroupid, userid).then(r => console.log(r));
            console.log(userid, specialgroupid);

            Vote.create({username,userid,specialgroup,specialgroupid,channel,link,votetext})
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

// Method is done
bot.command('/start', async (ctx) => {
    try {
        let specialgroupid = await ctx.message.chat.id;
        await Vote.startActive(specialgroupid);
    } catch (error) { 

    }
});

// Method is done
bot.command('/ping', async (ctx) => {
        let username = await ctx.message.from.username
        if ( username == process.env.ADMIN) {
            await ctx.reply('PONG');
        }
    
});

// Method is done
bot.command('/Start_mega', async (ctx) => {
    let isAdmin = await ctx.message.from.username == process.env.ADMIN;
    if(isAdmin){
        let specialgroupid = await ctx.message.chat.id;
        let isActive = await Vote.getStatus(specialgroupid);
        if(!isActive){
            await Vote.activate(specialgroupid);
            await ctx.reply(`Megaga arizalar qabul qilish boshlandi`);
        } else {
            await ctx.reply(`yoqilgan`);
        }
    }
})

// Method is done
bot.command('/Stop_mega', async (ctx) => {

    let isAdmin = ctx.message.from.username == process.env.ADMIN;
    let specialgroupid = await ctx.message.chat.id;
    let isActive = await Vote.getStatus(specialgroupid);
    let isActiveIsAdmin = isAdmin && isActive
    let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);

    if(await isActiveIsAdmin){
        Vote.deactivate(specialgroupid).then(()=>{    
            ctx.reply(`Мегага қабул тугади бирозданг сўнг мега таййор бўлади
            Илтимос сабир билан кутинг`);   

            specialGroupList.map(async (el) => {
                let channelid = el.channelid;
                let chucbefore = await telegram.getChatMembersCount(channelid);
                await ctx.reply(`Megadan oldin @${el.channel} [${chucbefore}] `);
                await Vote.setChucBefore(channelid, parseInt(chucbefore));
            })
        });
      
    } else if(isAdmin) {
        ctx.reply(`Megaga arizalar qabulini yopib bo'lmaydi. Megaga yoqilmagan!`);
    }
})


bot.command('/Mega_1', async (ctx) => {
    let isAdmin = ctx.message.from.username == process.env.ADMIN;
    if(isAdmin){
        let specialgroupid = await ctx.message.chat.id;
        let isActive = await Vote.getStatus(specialgroupid)
        let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);

        if(isActive){
            let voteType = await VoteType.setType(specialgroupid, '1');

            specialGroupList.map(async (el) => {
                let channelid = el.channelid;
                let votetext = el.votetext;
                let link = el.link;
    
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
            })
        }
    }
})

bot.command('/Mega_2', async (ctx) => {
    let isAdmin = ctx.message.from.username == process.env.ADMIN;
    let specialgroupid = await ctx.message.chat.id;
    let isActive = await Vote.getStatus(specialgroupid)
    let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);

    if(!isActive && isAdmin){
        let voteType = await VoteType.setType(specialgroupid, '2');
      
    } else if(isAdmin) {
           
    }
})

bot.command('/Mega_3', async (ctx) => {
    let isAdmin = ctx.message.from.username == process.env.ADMIN;
    let specialgroupid = await ctx.message.chat.id;
    let isActive = await Vote.getStatus(specialgroupid)
    let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);

    if(!isActive && isAdmin){
        let voteType = await VoteType.setType(specialgroupid, '3');
       
    } else if(isAdmin) {
           
    }
})

bot.command('/Send_mega', async (ctx) => {
     let isAdmin = ctx.message.from.username == process.env.ADMIN;

        if(isAdmin){
            let isActive = await Vote.getStatus(specialgroupid);

            if(isActive){
                let specialgroupid = await ctx.message.chat.id;
               
                let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
                let voteType = await VoteType.getType(specialgroupid);

                     switch(voteType){
                        case '1': 

                             break;
                        case '2':

                             break;
                        case '3':

                            break;
                        }
              
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
                            let messageid = message_id;
                            await Vote.setMessageID({specialgroupid, channelid, messageid});
                        }
                    }
                    isdeleted = false;
            }
        }
})



bot.command('/shareoff', async (ctx) => {
                if(!isdeleted){
                    if (ctx.message.from.username == process.env.ADMIN) {
                    let specialgroupid = await ctx.message.chat.id
                    let messageList = await Vote.getMessageID(specialgroupid);
                    let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);    
                    messageList.map(async (el)=>{
                        console.log(el)
                        let channelid = el.channelid;
                        let messageid = el.messageid;
                        await telegram.deleteMessage(channelid, messageid)
                    })
                   specialGroupList.map(async (el) => {
                    let channelid = el.channelid;
                    let chucafter = await telegram.getChatMembersCount(channelid);
                    await ctx.reply(`Megadan keyin ${el.channel} - ${chucafter} ta`);
                    })
                }
                    await Vote.deleteMessages();
                    isdeleted = true;
                } 
              })

bot.command('/deleteall', async (ctx) =>{
                if(parseInt(ctx.message.chat.id) > 0){
                if (ctx.message.from.username == process.env.ADMIN) {
                let res =  await Vote.deleteVotes();
                   if(res){
                        ctx.reply(`Hamma ma'lumot uchirildi`);
                     } else {
                        ctx.reply(`uchirish uchun ma'lumot yo'q`);
                     }
                    }
                }
            })

bot.use(async (ctx, bot) => {
                if (ctx.channelPost != null) {
                    let channelid = await ctx.channelPost.chat.id
                    let channel = await ctx.channelPost.chat.title
                    let up = await Vote.setChannelID(channel, channelid)
                }
            })


            
            // bot.command('/countbefore', async (ctx) =>{
            //     let specialgroupid = await ctx.message.chat.id;
            //     let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
            //     specialGroupList.map(async (el) => {
            //         let channelid = el.channelid;
            //         let chucbefore = await telegram.getChatMembersCount(channelid);
            //         await ctx.reply(`Megadan keyin ${el.channel} - ${chucbefore} ta`);
            //         await Vote.setChucBefore(channelid, parseInt(chucbefore));
            //     })
            // })

            // bot.command('/countbeforeinfo', async (ctx) =>{
            //     let countsList = await Vote.getChucListBefore();
            //     countsList.map(async (el) => {
            //         await ctx.reply(`Megadan oldin ${el.channel} - ${el.chucbefore} ta`);
            //     })
            // })

            // bot.command('/countafter', async (ctx) =>{
            //     let specialgroupid = await ctx.message.chat.id;
            //     let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
            //     specialGroupList.map(async (el) => {
            //         let channelid = el.channelid;
            //         let chucafter = await telegram.getChatMembersCount(channelid);
            //         await ctx.reply(`Megadan keyin ${el.channel} - ${chucafter} ta`);
            //         await Vote.setChucAfter(channelid, parseInt(chucafter));
            //     })
            // })

            // bot.command('/countafterinfo', async (ctx) =>{
            //     let countsList = await Vote.getChucListAfter();
            //     countsList.map(async (el) => {
            //         await ctx.reply(`Megadan keyin ${el.channel} - ${el.chucafter} ta`);
            //     })
            // })

            // bot.command('/list', async (ctx) => {
//     if(parseInt(ctx.message.chat.id) > 0){
//         if (ctx.message.from.username == process.env.ADMIN) {
//             let list = await Vote.getList();
//         list.map(async (el)=>{
//             ctx.reply(`username - @${el.username}\nguruh - ${el.specialgroup}\nkanal - ${el.channel}\nvip - ${el.channel}`)
//         })
//         }
//     }
// })

bot.startPolling();