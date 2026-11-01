/**
 * MuseFlow (26Flow) Packaging Script
 * Đóng gói tiện ích mở rộng Chrome Extension thành thư mục Unpacked và file .ZIP chuẩn cho Chrome Web Store.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Đọc thông tin từ manifest.json
const manifestPath = path.join(__dirname, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('Không tìm thấy manifest.json!');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const appName = manifest.name || '26Flow';
const appVersion = manifest.version || '0.5.2';
const zipName = `${appName}-v${appVersion}.zip`;

console.log(`Bắt đầu đóng gói ${appName} phiên bản ${appVersion}...`);

// 2. Thiết lập thư mục dist và thư mục staging
const distDir = path.join(__dirname, 'dist');
const unpackedDirName = `${appName}-v${appVersion}`;
const unpackedDir = path.join(distDir, unpackedDirName);
const zipPath = path.join(distDir, zipName);

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Xóa thư mục unpacked cũ nếu có
if (fs.existsSync(unpackedDir)) {
  fs.rmSync(unpackedDir, { recursive: true, force: true });
}
fs.mkdirSync(unpackedDir, { recursive: true });

// 3. Danh sách các file và thư mục cần đưa vào bản phát hành
const releaseFiles = [
  'manifest.json',
  'background.js',
  'muse-bridge.js',
  'app.html',
  'app.js',
  'styles.css',
  'i18n.js',
  'DANG_TIEN_DAO.jpg',
  'VERSION.txt',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md'
];

const releaseDirs = [
  'icons',
  'vendor',
  'templates',
  'licenses'
];

// Sao chép files
for (const file of releaseFiles) {
  const src = path.join(__dirname, file);
  const dest = path.join(unpackedDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  + Đã sao chép file: ${file}`);
  } else {
    console.warn(`  ! Cảnh báo: Không tìm thấy file ${file}`);
  }
}

// Sao chép thư mục đệ quy
function copyDirSync(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

for (const dir of releaseDirs) {
  const src = path.join(__dirname, dir);
  const dest = path.join(unpackedDir, dir);
  if (fs.existsSync(src)) {
    copyDirSync(src, dest);
    console.log(`  + Đã sao chép thư mục: ${dir}/`);
  } else {
    console.warn(`  ! Cảnh báo: Không tìm thấy thư mục ${dir}`);
  }
}

// 4. Tạo file ZIP bản phát hành trong dist/
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

console.log(`Đang nén file ZIP: ${zipName}...`);

try {
  // Dùng tar với flag -a (tự động nhận diện định dạng zip)
  execSync(`tar -a -c -f "${zipPath}" -C "${unpackedDir}" .`, { stdio: 'pipe' });
} catch (tarError) {
  console.log('Tar gặp lỗi, chuyển sang PowerShell Compress-Archive...');
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${unpackedDir}\\*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });
}

// 5. Cập nhật bản zip phân phối vào downloads/MuseFlow-extension.zip (theo tài liệu README)
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}
const legacyZipPath = path.join(downloadsDir, 'MuseFlow-extension.zip');
fs.copyFileSync(zipPath, legacyZipPath);

const stats = fs.statSync(zipPath);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`\n========================================`);
console.log(` ĐÓNG GÓI THÀNH CÔNG!`);
console.log(` - Thư mục Unpacked: dist/${unpackedDirName}`);
console.log(` - File ZIP Release: dist/${zipName} (${sizeMB} MB)`);
console.log(` - File ZIP Phân phối: downloads/MuseFlow-extension.zip`);
console.log(`========================================\n`);
