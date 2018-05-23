const Vote = require('./vote');
Vote.getChannelsListBySpecialGroup('gggg').then((result)=>{
    console.log(result)
})