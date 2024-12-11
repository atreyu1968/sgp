import { existsSync, mkdirSync, copyFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { scheduleJob } from 'node-schedule';

export function setupBackups(dbPath, backupDir = 'backups') {
  // Ensure backup directory exists
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  // Schedule daily backup at midnight
  scheduleJob('0 0 * * *', () => {
    const date = new Date().toISOString().split('T')[0];
    const backupPath = join(backupDir, `backup_${date}.db`);
    
    try {
      copyFileSync(dbPath, backupPath);
      console.log(`Backup created: ${backupPath}`);
      
      // Keep only last 7 days of backups
      cleanupOldBackups(backupDir);
    } catch (error) {
      console.error('Backup failed:', error);
    }
  });
}

function cleanupOldBackups(backupDir, keepDays = 7) {
  const files = readdirSync(backupDir)
    .filter(f => f.startsWith('backup_'))
    .sort()
    .reverse();

  // Keep only the most recent backups
  files.slice(keepDays).forEach(file => {
    unlinkSync(join(backupDir, file));
  });
}