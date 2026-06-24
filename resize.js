import sharp from 'sharp';
import path from 'path';

const input = path.join(process.cwd(), 'public/Logo.PNG');
const output = path.join(process.cwd(), 'public/icon.png');

sharp(input)
  .resize(256, 256)
  .toFile(output)
  .then(() => console.log('Icon resized successfully'))
  .catch(err => console.error('Error resizing icon:', err));
