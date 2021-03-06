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

bot.hears(/mymega/i, async ({reply,message,update}) => {
    let specialgroupid = await message.chat.id;
    let isActive = await Vote.getStatus(specialgroupid);
    let username = await message.from.username;
    let userid = await message.from.id;
    let specialgroup = await message.chat.title;

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
    let specialgroupid = await ctx.message.chat.id;
    if(specialgroupid){
        try {
   
            await Vote.startActive(specialgroupid);
         
        } catch (error) { 
    
        }
    
        try{
            await VoteType.createType(specialgroupid);
        } catch (error){
    
        }
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
bot.command('/start_mega', async (ctx) => {
    let isAdmin = await ctx.message.from.username == process.env.ADMIN;
    let specialgroupid = await ctx.message.chat.id;
    if(isAdmin){
        console.log(specialgroupid)
        let isActive = await Vote.getStatus(specialgroupid);
        if(!isActive){
            await Vote.activate(specialgroupid);
            let message = await ctx.reply(`Megaga arizalar qabul qilish boshlandi`);
             } else {
            await ctx.reply(`yoqilgan`);
        }
    }
})

// Method is done
bot.command('/stop_mega', async (ctx) => {
    try{
        let isAdmin = ctx.message.from.username == process.env.ADMIN;
        let specialgroupid = await ctx.message.chat.id;
        let isActive = await Vote.getStatus(specialgroupid);
    
        if(await isActive){
            if(specialgroupid && isAdmin){
                let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
                let deactivate = await Vote.deactivate(specialgroupid);
               
                    ctx.reply(`Мегага қабул тугади бирозданг сўнг мега таййор бўлади
                    Илтимос сабир билан кутинг`);   
    
                    if(specialGroupList){
                        for(let el of specialGroupList){
                            let channelid = el.channelid;
                            let chucbefore = await telegram.getChatMembersCount(channelid);
                            ctx.reply(`${el.channel} [${chucbefore}] `);
                            Vote.setChucBefore(channelid, parseInt(chucbefore));
                        }
                    }
                }      
        } else if(isAdmin) {
            ctx.reply(`Megaga arizalar qabulini yopib bo'lmaydi. Mega yoqilmagan!`);
        }
    } catch (error){
        await ctx.reply(error);
    }
})


bot.command('/mega_1', async (ctx) => {
    try{
        let isAdmin = ctx.message.from.username == process.env.ADMIN;
        if(isAdmin){
    
            let specialgroupid = await ctx.message.chat.id;
            let isActive = await Vote.getStatus(specialgroupid)
            let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
    
            if(specialgroupid){
                if(!isActive){
                    let voteType = await VoteType.setType(specialgroupid, '1');
                    let inline_keyboard_arr = [];
                    for(el of specialGroupList){
                        inline_keyboard_arr.push([{"text": el.votetext, "url": el.link}])
                         }
    
                         let {message_id} = await telegram.sendMessage(specialgroupid, 'bu qiziqarli', {
                            reply_markup: {inline_keyboard:inline_keyboard_arr}}); 
                }
            }
        }
    } catch (error){
        await ctx.reply(error);
    }
})

bot.command('/mega_2', async (ctx) => {
    try{
        let isAdmin = ctx.message.from.username == process.env.ADMIN;
        if(isAdmin){
    
            let specialgroupid = await ctx.message.chat.id;
            let isActive = await Vote.getStatus(specialgroupid)
            let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
    
            if(specialgroupid){
                if(!isActive){
                    let voteType = await VoteType.setType(specialgroupid, '2');
                    
                    for (el of specialGroupList){
                        let {message_id} = await telegram.sendMessage(specialgroupid, `${el.link} \n ${el.votetext} \n`);
                    }
                }
            }
        }
    } catch (error){
        await ctx.reply(error);
    }
})

bot.command('/mega_3', async (ctx) => {
    try{
        let isAdmin = ctx.message.from.username == process.env.ADMIN;
        if(isAdmin){
    
            let specialgroupid = await ctx.message.chat.id;
            let isActive = await Vote.getStatus(specialgroupid)
            let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
    
            if(specialgroupid){
                if(!isActive){
                    let voteType = await VoteType.setType(specialgroupid, '3');
                    
                    for (el of specialGroupList){
                        let {message_id} = await telegram.sendMessage(specialgroupid, `${el.link}`);
                    }
    
                }
            }
        }
    } catch (error){
        await ctx.reply(error);
    }
})

bot.command('/send_mega', async (ctx) => {
    try{
        let isAdmin = ctx.message.from.username == process.env.ADMIN;
        let specialgroupid = await ctx.message.chat.id;
   
           if(isAdmin){
               let isActive = await Vote.getStatus(specialgroupid);
               if(!isActive){
                   let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
                   let voteType = await VoteType.getType(specialgroupid);
                   let inline_keyboard_arr = [];
   
                        switch(await voteType){
                           case '1': 
                           for(let el of specialGroupList){
                               inline_keyboard_arr.push([{"text": el.votetext, "url": el.link}])
                           }
                           for(let el of specialGroupList){
               
                               let {message_id} = await telegram.sendMessage(el.channelid, 'bu qiziqarli', {
                                   reply_markup: {inline_keyboard:inline_keyboard_arr}});
                               
                               await Vote.setMessageID({specialgroupid: el.specialgroupid, channelid: el.channelid, messageid: message_id});
                           }
                                break;
   
                           case '2':
                           for(let el of specialGroupList){
                               for (let item of specialGroupList){
                                   let {message_id} = await telegram.sendMessage(el.channelid, `${item.link} \n ${item.votetext} \n`);
                                   await Vote.setMessageID({specialgroupid: el.specialgroupid, channelid: el.channelid, messageid: message_id});
                               }
                           }
                                break;
   
                           case '3':
                           for(let el of specialGroupList){
                               for (let item of specialGroupList){
                                   let {message_id} = await telegram.sendMessage(el.channelid, `${item.link} \n ${item.votetext} \n ${item.channel}`);
                                   await Vote.setMessageID({specialgroupid: el.specialgroupid, channelid: el.channelid, messageid: message_id});
                               }
                           }
                               break;
                           }          
               }
           }
    } catch (error){
        await ctx.reply(error);
    }
})



bot.command('/end_mega', async (ctx) => {
    try{
        let isAdmin = ctx.message.from.username == process.env.ADMIN;
        if(isAdmin){
            let specialgroupid = await ctx.message.chat.id;
            let isActive = await Vote.getStatus(specialgroupid)
            if(!isActive){
                let specialGroupList = await Vote.getListBySpecialGroupID(specialgroupid);
               
                let messageList = await Vote.getMessageID(specialgroupid);
        
    
                for (let el of messageList){
                    let channelid = el.channelid;
                    let messageid = el.messageid;
                    if(messageid){
                        await telegram.deleteMessage(channelid, messageid)
                    }
            
                }
    
                await ctx.reply(`Megadan keyin ${el.channel} - ${chucafter} ta`);
    
                for (let el of specialGroupList){
                    let channelid = el.channelid;
                    let chucbefore = el.chucbefore;
                    let chucafter = await telegram.getChatMembersCount(channelid);
                    let difference = chucafter - chucbefore
                    await ctx.reply(`Megadan keyin ${el.channel} - [${difference}]`);
                }
       
                }
            }
    } catch (error){
        await ctx.reply(error);
    }
   
})

bot.command('/deleteall', async (ctx) =>{
    try{
        if(parseInt(ctx.message.chat.id) > 0){
            if (ctx.message.from.username == process.env.ADMIN) {
            let deleteVotes =  await Vote.deleteVotes();
            let deletemessages = await Vote.deleteMessages();
               if(await deleteVotes && deletemessages){
                    ctx.reply(`Hamma ma'lumot uchirildi`);
                 } else {
                    ctx.reply(`uchirish uchun ma'lumot yo'q`);
                 }
                }
            }
    } catch (error){
        await ctx.reply(error);
    }
})
 
bot.use(async (ctx, bot) => {
                if (ctx.channelPost != null) {
                    let channelid = await ctx.channelPost.chat.id
                    let channel = await ctx.channelPost.chat.username 
                    console.log('channel :', channel);
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