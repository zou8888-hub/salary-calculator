const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

async function createInstaller() {
  try {
    await createWindowsInstaller({
      appDirectory: path.join(__dirname, 'dist', 'real-time-salary-calculator-win32-x64'),
      outputDirectory: path.join(__dirname, 'dist', 'installer'),
      authors: 'Salary Calculator',
      exe: 'real-time-salary-calculator.exe',
      setupExe: 'SalaryCalculatorInstaller.exe',
      setupIcon: null,
      noMsi: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      description: '实时工资计算器桌面应用程序',
      name: '实时工资计算器'
    });
    console.log('安装程序创建成功！');
  } catch (e) {
    console.error('创建安装程序失败:', e.message);
  }
}

createInstaller();