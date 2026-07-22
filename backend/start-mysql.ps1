$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$environmentFile = Join-Path $projectRoot ".env"

if (-not (Test-Path -LiteralPath $environmentFile)) {
    throw "No se encontro $environmentFile. Crea el archivo .env con MYSQL_USER y MYSQL_PASSWORD."
}

Get-Content -LiteralPath $environmentFile | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) {
        return
    }

    $separator = $line.IndexOf("=")
    if ($separator -le 0) {
        return
    }

    $name = $line.Substring(0, $separator).Trim()
    $value = $line.Substring($separator + 1).Trim()
    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or
        ($value.StartsWith("'") -and $value.EndsWith("'"))) {
        $value = $value.Substring(1, $value.Length - 2)
    }

    [Environment]::SetEnvironmentVariable($name, $value, "Process")
}

if (-not $env:MYSQL_USER -or -not $env:MYSQL_PASSWORD) {
    throw "El archivo .env debe contener MYSQL_USER y MYSQL_PASSWORD."
}

Write-Host "Iniciando OXIPUR con MySQL (oxipur_inventory)..." -ForegroundColor Cyan
Push-Location $PSScriptRoot
try {
    & .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=mysql"
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
