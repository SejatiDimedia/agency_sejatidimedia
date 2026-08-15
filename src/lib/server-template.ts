import fs from 'fs';
import path from 'path';
import { TemplateId } from './templates';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src/data/site-settings.json');

export function getGlobalActiveTemplate(): TemplateId {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const content = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (data.activeTemplate === 'professional' || data.activeTemplate === 'classic') {
        return data.activeTemplate;
      }
    }
  } catch (error) {
    console.error('Error reading global template settings:', error);
  }
  return 'professional';
}

export function setGlobalActiveTemplate(template: TemplateId): boolean {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data = {
      activeTemplate: template,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving global template settings:', error);
    return false;
  }
}
