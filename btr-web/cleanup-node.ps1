# Define the directories to clean
$directories = @(
    ".",
    ".\btr-layouts",
    ".\btr-main-app",
    ".\btr-common-components"
)

foreach ($dir in $directories) {
    # Remove node_modules
    $nodeModulesPath = Join-Path $dir "node_modules"
    if (Test-Path $nodeModulesPath) {
        Write-Host "Removing $nodeModulesPath"
        Remove-Item -Path $nodeModulesPath -Recurse -Force
    }

    # Remove pnpm-lock.yaml
    $lockFilePath = Join-Path $dir "pnpm-lock.yaml"
    if (Test-Path $lockFilePath) {
        Write-Host "Removing $lockFilePath"
        Remove-Item -Path $lockFilePath -Force
    }
}

Write-Host "Cleanup completed!"
