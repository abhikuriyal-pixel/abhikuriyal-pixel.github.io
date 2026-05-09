param (
    [string]$TargetFolder = "."
)

# Ensure we have a clean absolute path
$AbsPath = (Resolve-Path $TargetFolder).Path

Write-Host "Searching in: $AbsPath" -ForegroundColor Yellow

# Use -Filter with a simple loop to catch all extensions reliably
# This method is much faster and less 'picky' than -Include
$Extensions = "*.jpg", "*.jpeg", "*.png"
$images = foreach ($ext in $Extensions) {
    Get-ChildItem -Path "$AbsPath" -Filter $ext -File -Recurse
}

if (-not $images) {
    Write-Host "Still no files found. Check if the folder path is correct or if files are hidden." -ForegroundColor Red
} else {
    Write-Host "Found $($images.Count) images. Starting conversion..." -ForegroundColor Green

    foreach ($file in $images) {
        $output = [System.IO.Path]::ChangeExtension($file.FullName, ".webp")
        
        Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan

        # & is the call operator to run the ffmpeg command
        & ffmpeg -i "$($file.FullName)" -vcodec libwebp -compression_level 6 -q:v 10 -preset default "$output" -hide_banner -loglevel error
    }
    Write-Host "Done! Compression complete." -ForegroundColor Green
}
pause