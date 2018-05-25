/* const Vote = require('./vote');

    let a = async ()=>{
      let res = await Vote.getList();
       console.log(res);
      
    }

    a();
 
  
 */

//  let regExp = /..\n@.\n../igm;

 let regExp = /(.*[a-z].*)\n(.*@[a-z].*)\n(.*[a-z].*)/gim;

 let test =
 `sdff
  @sxdfsdf
  sdfdffs`;
 let result = test.match(regExp)

    console.log(test,'\n\n' ,result)

//  if(result === 0 ){
//      console.log('OK');
//  } else {
//      console.log('failed');
//  }