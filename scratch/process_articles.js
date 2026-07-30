const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const articlesDir = 'C:\\Users\\user\\Downloads\\project\\articles';
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.docx'));

console.log(`Found ${files.length} docx files.`);

const articles = [];

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const filePath = path.join(articlesDir, file);
  try {
    // Write ps script to temp file to avoid quotation escaping issues
    const tempPsFile = path.join(__dirname, 'temp_read.ps1');
    const psScript = `
Param([string]$DocPath)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($DocPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
if ($entry) {
  $stream = $entry.Open()
  $reader = New-Object System.IO.StreamReader($stream)
  $xml = $reader.ReadToEnd()
  $reader.Close()
  $stream.Close()
  $zip.Dispose()
  $matches = [regex]::Matches($xml, '<w:t[^>]*>(.*?)</w:t>')
  $text = ($matches | ForEach-Object { $_.Groups[1].Value }) -join ''
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  Write-Output $text
}
`;
    fs.writeFileSync(tempPsFile, psScript, 'utf8');

    const output = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempPsFile}" -DocPath "${filePath}"`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });

    const cleanName = file.replace('.docx', '');
    const isArabic = /[\u0600-\u06FF]/.test(cleanName);

    // Slug calculation
    let slug = (isArabic ? 'ar' : 'en') + '-' + (i + 1) + '-' + cleanName
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const paragraphs = output.split(/[\r\n]+/).map(p => p.trim()).filter(Boolean);
    const title = cleanName;
    const description = paragraphs.slice(0, 3).join(' ').slice(0, 250) || title;
    const content = paragraphs.join('\n\n');

    articles.push({
      id: i + 1,
      fileName: file,
      isArabic,
      title,
      slug,
      description,
      content,
      published_date: '2026-07-28',
      author: isArabic ? 'فريق خبراء جسور' : 'JUSOR Legal Experts'
    });

    console.log(`[${i + 1}/${files.length}] Processed: ${file.slice(0, 40)}...`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
}

fs.writeFileSync(
  path.join(__dirname, 'extracted_articles.json'),
  JSON.stringify(articles, null, 2),
  'utf8'
);

console.log(`\nSuccessfully processed all ${articles.length} articles!`);
