const Vote = require('./vote');
// Vote.updateVIP('jjj','VIP').then((result)=>{
//     console.log(result)
// })

Vote.deactivate('jjj').then((res)=>{
    console.log(res)
})