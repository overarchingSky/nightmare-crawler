const { app, Menu } = require("electron");

// const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  //   ...(isMac ? [{
  //     label: app.name,
  //     submenu: [
  //       { role: 'about' },
  //       { type: 'separator' },
  //       { role: 'services' },
  //       { type: 'separator' },
  //       { role: 'hide' },
  //       { role: 'hideothers' },
  //       { role: 'unhide' },
  //       { type: 'separator' },
  //       { role: 'quit' }
  //     ]
  //   }] : []),
//   {
//     label: '爬取商品',
//     name:'getProd',
//     click(menu, win,menuConfig){
        
//     }
//     // submenu: [isMac ? { role: "close" } : { role: "quit" }]
//   },
//   {
//     label: '定时发布',
//     name:'regularRelease'
//     // submenu: [isMac ? { role: "close" } : { role: "quit" }]
//   }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
