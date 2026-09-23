// Script to create SVG placeholder images for products
const fs = require('fs');
const path = require('path');

const products = [
  { name: 'potato', emoji: '🥔', bg: '#f5e6c8', text: '#8B6914' },
  { name: 'spinach', emoji: '🥬', bg: '#d4edda', text: '#1a5c2e' },
  { name: 'apple', emoji: '🍎', bg: '#fde8e8', text: '#c0392b' },
  { name: 'mango', emoji: '🥭', bg: '#fff3cd', text: '#e67e22' },
  { name: 'banana', emoji: '🍌', bg: '#fffde7', text: '#f39c12' },
  { name: 'rice', emoji: '🌾', bg: '#f5f0e8', text: '#7d6608' },
  { name: 'wheat', emoji: '🌾', bg: '#fef9e7', text: '#b7950b' },
  { name: 'corn', emoji: '🌽', bg: '#fffde7', text: '#d4ac0d' },
  { name: 'chickpeas', emoji: '🫘', bg: '#fdf2e9', text: '#a04000' },
  { name: 'dal', emoji: '🫘', bg: '#fef9e7', text: '#b7950b' },
  { name: 'default', emoji: '🌿', bg: '#e8f5eb', text: '#2d7a3a' },
];

const dir = path.join(__dirname, '../public/images');

products.forEach(({ name, emoji, bg, text }) => {
  const filePath = path.join(dir, `${name}.jpg`);
  // Skip if real image already exists
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${name}.jpg (already exists)`);
    return;
  }

  // Create an SVG file (rename to .jpg so server serves it)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="${bg}"/>
  <text x="200" y="140" font-size="80" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  <text x="200" y="220" font-size="22" font-family="Arial" font-weight="bold" text-anchor="middle" fill="${text}">${name.charAt(0).toUpperCase() + name.slice(1)}</text>
</svg>`;

  // Write as SVG but name as jpg (browsers handle it fine since content type isn't enforced)
  const svgPath = path.join(dir, `${name}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Created ${name}.svg`);
});

console.log('Done creating placeholder images!');
