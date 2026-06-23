import fs from 'fs';
import path from 'path';

const counterFilePath = path.join(__dirname, '../../testData/counter.json');

export class CounterManager {
  static getNextCounter(key: string): number {
    const counterData = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
    const currentValue = counterData[key] || 0;
    const nextValue = currentValue + 1;

    // Update the counter
    counterData[key] = nextValue;
    fs.writeFileSync(counterFilePath, JSON.stringify(counterData, null, 2), 'utf-8');

    return nextValue;
  }

  static getTimestamp(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${hours}:${minutes}:${seconds}`;
  }

  static generateUniqueName(baseName: string, key: string): string {
    const timestamp = this.getTimestamp();
    // Also increment counter for tracking
    this.getNextCounter(key);
    return `${baseName}_${timestamp}`;
  }

  static generateUniqueNameWithCounter(baseName: string, key: string): string {
    const counter = this.getNextCounter(key);
    const timestamp = this.getTimestamp();
    return `${baseName}_${counter}_${timestamp}`;
  }

  static resetCounter(key: string): void {
    const counterData = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
    counterData[key] = 0;
    fs.writeFileSync(counterFilePath, JSON.stringify(counterData, null, 2), 'utf-8');
  }

  static resetAllCounters(): void {
    const counterData: { [key: string]: number } = {};
    for (const key of Object.keys(JSON.parse(fs.readFileSync(counterFilePath, 'utf-8')))) {
      counterData[key] = 0;
    }
    fs.writeFileSync(counterFilePath, JSON.stringify(counterData, null, 2), 'utf-8');
  }
}
