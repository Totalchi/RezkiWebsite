$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$source = Join-Path $repoRoot 'rm-bygg-website'

if (-not (Test-Path $source)) {
  throw "Source folder not found: $source"
}

$itemsToClear = @(
  'index.html',
  'about.html',
  'contact.html',
  'projects.html',
  'services.html',
  'testimonials.html',
  '400.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  '.htaccess',
  '.nojekyll',
  'README.md',
  'css',
  'images',
  'js'
)

foreach ($item in $itemsToClear) {
  $target = Join-Path $repoRoot $item
  if (Test-Path $target) {
    Remove-Item $target -Recurse -Force
  }
}

Get-ChildItem $source -Force | ForEach-Object {
  Copy-Item $_.FullName -Destination $repoRoot -Recurse -Force
}

Set-Content -Path (Join-Path $repoRoot '.nojekyll') -Value '' -NoNewline

Write-Output 'GitHub Pages publish files refreshed in repo root.'
