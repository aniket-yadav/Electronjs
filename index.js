const electron = require('electron');
const url =require('url');
const path= require('path');

const {app,BrowserWindow,Menu,ipcMain} = electron;
process.env.NODE_ENV='production';
let mainwindow;
let addWindow;
app.on('ready',function(){
	mainwindow = new BrowserWindow({});
	mainwindow.loadURL(url.format({
		pathname:path.join(__dirname,'mainwindow.html'),
		protocol:'file',
		slashes:true
	}));

   mainwindow.on('closed',function(){
	app.quit();
});


	const mainMenu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(mainMenu);

});


function createAddWindow(){
addwindow = new BrowserWindow({
	width:300,
	height:200,
	title:'Add Shopping list Item'
});
	addwindow.loadURL(url.format({
		pathname:path.join(__dirname,'addwindow.html'),
		protocol:'file',
		slashes:true
	}));
	addwindow.on('close',function(){
   addwindow=null;
   
	});
}

ipcMain.on('item:add',function(e,item){
  mainwindow.webContents.send('item:add',item);
  addwindow.close();

});


let template =
 [{
 	label:'File',
 	submenu:[
 	{
 		label:'Add Item',
 		click(){
 			createAddWindow();
 		}
 	},
 	{
 		label:'Clear Item',
 		click(){
 			mainwindow.webContents.send('item:clear');

 		}
 	},
 	{
 		label:'Quit',
 		accelerator:process.platform=='darwin'?'Command+Q':'Ctrl+Q',
 		click(){
 			app.quit();
 		}
 	}]
 }]

 
 if(process.platform=='darwin'){

 	template.unshift({});
 }
 if(process.env.NODE_ENV !=='production'){
 	template.push({
 		label:'Developer Tools',
 		submenu:[{
 			label:'Toggle DevTools',
 			accelerator:process.platform=='darwin'?'Command+I':'Ctrl+I',
 			click(Item,focusedWindow){
 				focusedWindow.toggleDevTools();
 			}
 		},
 		{
 			role:'reload'
 		}]
 	})
 }