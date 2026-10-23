# Path input lein
$ProjectPath = Read-Host "Project folder path enter karein (Ya khali chhor kar Enter dabayein)"
$ProjectPath = $ProjectPath.Trim('"').Trim("'")

if ([string]::IsNullOrWhiteSpace($ProjectPath)) {
    $ProjectPath = (Get-Location).Path
}

Write-Host "Target Directory: $ProjectPath" -ForegroundColor Cyan

# Public folder lazmi banayein ya check karein
$PublicFolder = Join-Path $ProjectPath "public"
if (!(Test-Path $PublicFolder)) {
    New-Item -ItemType Directory -Force -Path $PublicFolder | Out-Null
    Write-Host "Public folder successfully create ho gaya." -ForegroundColor Green
}

$WorkerFilePath = Join-Path $PublicFolder "_worker.js"

# File ka content safely array ki shakal mein likhein
$content = @(
    "const redirectMap = {",
    "  ""/9wiyjq2z"": ""https://datastudio.google.com/reporting/59aad0b0-25ba-4049-8c03-bd0ea03dce49"",",
    "  ""/i5ez7ba9"": ""https://datastudio.google.com/reporting/59aca455-b48a-4f54-ab37-dd055e15171a"",",
    "  ""/6a7ym92q"": ""https://datastudio.google.com/reporting/59ad7320-f426-41f8-a2d1-c33ab8910e23"",",
    "  ""/wjvnmy4w"": ""https://datastudio.google.com/reporting/59aedbf2-8662-4420-bc0e-72eb10d04fd9"",",
    "  ""/zia22yaw"": ""https://datastudio.google.com/reporting/59b86fee-c8b6-4fa2-96f2-2281eeb27492""",
    "};",
    "",
    "export default {",
    "  async fetch(request) {",
    "    const url = new URL(request.url);",
    "    const target = redirectMap[url.pathname];",
    "    if (target) {",
    "      return Response.redirect(target, 301);",
    "    }",
    "    return fetch(request);",
    "  }",
    "};"
)

# Try/Catch ke sath file write karein taaki error pata chale
try {
    $content | Out-File -FilePath $WorkerFilePath -Encoding utf8 -Force -ErrorAction Stop
    Write-Host "SUCCESS! _worker.js file yahan ban gayi hai:" -ForegroundColor Green
    Write-Host "$WorkerFilePath" -ForegroundColor Yellow
}
catch {
    Write-Host "ERROR: File nahi ban saki. Wajah: $_" -ForegroundColor Red
}
