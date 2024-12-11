import { existsSync, copyFileSync } from 'fs';
import { execSync } from 'child_process';

export async function repairDatabase(dbPath) {
  try {
    // Create backup before attempting repair
    const backupPath = `${dbPath}.backup_${Date.now()}`;
    if (existsSync(dbPath)) {
      copyFileSync(dbPath, backupPath);
      console.log('Backup created:', backupPath);
    }

    // Try to dump and recreate
    const dumpPath = `${dbPath}.dump`;
    try {
      execSync(`sqlite3 "${dbPath}" ".dump" > "${dumpPath}"`);
      execSync(`sqlite3 "${dbPath}.new" < "${dumpPath}"`);
      
      // If successful, replace old db with new one
      copyFileSync(`${dbPath}.new`, dbPath);
      console.log('Database repaired successfully');
      return true;
    } catch (error) {
      console.error('Error during repair:', error);
      return false;
    }
  } catch (error) {
    console.error('Recovery failed:', error);
    return false;
  }
}