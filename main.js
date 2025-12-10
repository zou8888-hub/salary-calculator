const { app, BrowserWindow } = require('electron');
const path = require('path');

// 创建浏览器窗口
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 加载应用的index.html
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  // mainWindow.webContents.openDevTools();
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，通常在应用程序中重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭所有窗口时退出应用程序，macOS除外
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});