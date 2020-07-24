const path = require('path')
const child_process = require('child_process');
const shell = require('shelljs');
// const workerProcess = child_process.exec(`scrapy crawl fril`,(error, stdout, stderr) => {
//     if(error){
//         console.log(stderr);
//     }else {
//         console.log(stdout);
//       }
// })
shell.exec("python main.py");
