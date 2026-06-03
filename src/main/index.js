import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 1. นำเข้าระบบ Auto Updater
import { autoUpdater } from 'electron-updater'

function createWindow() {
  // สร้างหน้าต่างเบราว์เซอร์หลัก
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true, // ซ่อนเมนูบาร์ด้านบนให้ดูเป็นแอปพลิเคชันมืออาชีพ
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // รอให้หน้าต่างพร้อมก่อนค่อยโชว์ เพื่อป้องกันจอกะพริบขาว
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // ถ้ามีการกดลิงก์ให้ออกไปเปิดในเบราว์เซอร์หลักของเครื่อง (เช่น Chrome)
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // โหลดไฟล์ UI ของเรา
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// เมื่อระบบ Electron เตรียมตัวเสร็จ จะเริ่มรันโค้ดส่วนนี้
app.whenReady().then(() => {
  // ตั้งค่า ID ของโปรแกรม
  electronApp.setAppUserModelId('com.ecocraft.pro')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // สร้างหน้าต่างโปรแกรมขึ้นมา
  createWindow()

  // สำหรับ Mac เวลาคลิกไอคอนที่ Dock
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 2. สั่งให้เช็กอัปเดตและแจ้งเตือนผู้ใช้ (ทำงานอยู่เบื้องหลังเงียบๆ)
  autoUpdater.checkForUpdatesAndNotify()
})

// ปิดโปรแกรมเมื่อหน้าต่างทั้งหมดถูกปิดลง
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
