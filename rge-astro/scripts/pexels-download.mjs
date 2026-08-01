import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'img');
const API_KEY = process.env.PEXELS_API_KEY || 'pdOtAIRjuTrHavpI1JdpZTJS8ZPU9eOXvrrPWg7MMWK1kY3TUO4VqC5J';

const IMAGES = [
  {
    name: 'hero-bg',
    query: 'solar panel field panorama',
    orientation: 'landscape',
    size: { width: 1920 },
    perPage: 10,
    alt: 'Background hero energia solar'
  },
  {
    name: 'solar-panels',
    query: 'painel solar telhado residencia',
    orientation: 'landscape',
    size: { width: 1200 },
    perPage: 10,
    alt: 'Painéis solares residenciais'
  },
  {
    name: 'energy-pylons',
    query: 'subestacao eletrica torre energia',
    orientation: 'landscape',
    size: { width: 1200 },
    perPage: 10,
    alt: 'Subestação de energia'
  },
  {
    name: 'proj-urbano',
    query: 'instalacao painel solar casa',
    orientation: 'landscape',
    size: { width: 800 },
    perPage: 10,
    alt: 'Projeto residencial solar'
  },
  {
    name: 'proj-comercial',
    query: 'predio comercial moderno',
    orientation: 'landscape',
    size: { width: 800 },
    perPage: 10,
    alt: 'Projeto comercial solar'
  },
  {
    name: 'proj-rural',
    query: 'fazenda rural campo agricultura',
    orientation: 'landscape',
    size: { width: 800 },
    perPage: 10,
    alt: 'Projeto rural solar'
  }
];

async function searchPexels(query, orientation, perPage = 10) {
  const params = new URLSearchParams({
    query,
    orientation,
    per_page: perPage.toString(),
    locale: 'pt-BR'
  });

  const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: API_KEY }
  });

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function downloadImage(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
  return buffer.length;
}

async function convertToWebp(inputPath, outputPath, width) {
  const sharp = (await import('sharp')).default;
  await sharp(inputPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);
}

async function processImage(config) {
  console.log(`\n🔍 Buscando: "${config.query}" (${config.name})`);

  try {
    const data = await searchPexels(config.query, config.orientation, config.perPage || 10);
    const photos = data.photos;

    if (!photos || photos.length === 0) {
      console.log(`  ⚠️  Nenhuma imagem encontrada para "${config.query}"`);
      return false;
    }

    console.log(`  📸 ${photos.length} resultados encontrados`);

    const idx = Math.min(Math.floor(Math.random() * photos.length), 2);
    const bestPhoto = photos[idx];
    const imgUrl = bestPhoto.src.large2x || bestPhoto.src.large;
    const author = bestPhoto.photographer;
    const pexelsUrl = bestPhoto.url;

    console.log(`  🏆 Selecionada: #${bestPhoto.id} por ${author}`);
    console.log(`     ${pexelsUrl}`);

    const tmpPath = path.join(IMG_DIR, `${config.name}-tmp.jpg`);
    const webpPath = path.join(IMG_DIR, `${config.name}.webp`);

    const size = await downloadImage(imgUrl, tmpPath);
    console.log(`  ⬇️  Downloaded: ${(size / 1024).toFixed(0)}KB`);

    await convertToWebp(tmpPath, webpPath, config.size.width);
    fs.unlinkSync(tmpPath);

    const finalSize = fs.statSync(webpPath).size;
    console.log(`  ✅ Convertido para WebP: ${(finalSize / 1024).toFixed(0)}KB`);

    return true;
  } catch (err) {
    console.error(`  ❌ Erro: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║    RGE Energia - Pexels Image Downloader   ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`📁 Destino: ${IMG_DIR}`);
  console.log(`🖼️  ${IMAGES.length} imagens para baixar\n`);

  if (!fs.existsSync(IMG_DIR)) {
    fs.mkdirSync(IMG_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const img of IMAGES) {
    const ok = await processImage(img);
    if (ok) success++;
    else failed++;
  }

  console.log('\n══════════════════════════════════════════════');
  console.log(`✅ ${success} imagens baixadas com sucesso`);
  if (failed > 0) console.log(`❌ ${failed} falhas`);
  console.log('══════════════════════════════════════════════');
}

main().catch(console.error);
