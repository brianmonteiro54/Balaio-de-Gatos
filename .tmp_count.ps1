$root = (Get-Location).Path
Get-ChildItem -Recurse -Filter *.js | ForEach-Object {
    $content = Get-Content -Raw $_.FullName -Encoding UTF8
    $count = ([regex]::Matches($content, '—')).Count
    if ($count -gt 0) {
        $rel = $_.FullName.Substring($root.Length + 1)
        '{0,4} {1}' -f $count, $rel
    }
} | Sort-Object
