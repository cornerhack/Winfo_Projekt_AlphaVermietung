import express from 'express';
import { dirname, join, extname } from 'path';
import fs from 'fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';
import cors from 'cors';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '../frontend')));
app.use(session({
  secret: 'geheimes_passwort', // Ändern für Produktion!
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 // 1 Tag
  }
}));
app.use('/html', express.static(join(__dirname, '../frontend/html')));
app.use('/pdfs', express.static(join(__dirname, 'pdfs')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/html/startseite.html'));
});

async function registerRoutes(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await registerRoutes(fullPath); // Rekursiv weitergehen
    }

    if (entry.isFile() && extname(entry.name) === '.js') {
      const routeModule = await import(pathToFileURL(fullPath).href);

      if (!routeModule.default || typeof routeModule.default !== 'function') {
        continue;
      }

      // Nur den ersten Verzeichnisnamen nach /routes/ als Mountpfad nehmen
      const relativePath = fullPath
        .replace(join(__dirname, 'routes'), '')
        .replace(/\\/g, '/') // Windows-Fix
        .replace('.js', '');

      const pathSegments = relativePath.split('/').filter(Boolean);
      const routePath = `/${pathSegments[0] || ''}`;

      app.use(routePath, routeModule.default);
      console.log(`✅ Route geladen: ${routePath}`);
    }
  }
}

await registerRoutes(join(__dirname, 'routes'));

app.listen(port, () => {

  console.log(`Server is running on http://localhost:${port}`);
});
