param([string]$file, [string]$old, [string]$new)
$content = Get-Content -Raw $file -Encoding UTF8
$count = ([regex]::Matches($content, [regex]::Escape($old))).Count
$content = $content.Replace($old, $new)
Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
"Replaced $count occurrences in $file"
