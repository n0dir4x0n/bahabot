const AnnouncementDao = require('./vote');
AnnouncementDao.create({username: 'dockerized'}).then((result)=>{
    console.log(result)
})