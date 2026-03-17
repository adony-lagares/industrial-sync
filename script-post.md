    1..20 | ForEach-Object {
    $temp = (Get-Random -Minimum 20 -Maximum 95) + (Get-Random -Minimum 0 -Maximum 9)/10
    $press = (Get-Random -Minimum 5 -Maximum 55) + (Get-Random -Minimum 0 -Maximum 9)/10
    $eq = "AXIOS-$(Get-Random -Minimum 10 -Maximum 99)"
    
    $url = "http://localhost:5016/api/Telemetry?equipmentCode=$eq&temp=$temp&press=$press"

    try {
        Invoke-RestMethod -Uri $url -Method Post
        
        Write-Host "Enviado com sucesso: Eq $eq | Temp $temp | Press $press" -ForegroundColor Green
    }
    catch {
        Write-Host "Erro ao enviar: $_" -ForegroundColor Red
    }
    Start-Sleep -Seconds 1
    }
