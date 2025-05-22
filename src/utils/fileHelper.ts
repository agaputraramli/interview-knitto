import { promises as fs } from 'fs';
import path from 'path';

export async function saveJsonWithRetry(
  filePath: string,
  data: any,
  maxRetries = 3,
  delayMs = 1000
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
}