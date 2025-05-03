import { promises as fs } from 'fs';
// ...
const uploadDir = path.join(process.cwd(), 'public/uploads');
await fs.mkdir(uploadDir, { recursive: true });