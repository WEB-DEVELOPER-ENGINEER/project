
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
