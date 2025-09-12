# deploy-infrastructure.ps1 - Azure Deployment Script for Windows
param(
    [string]$ResourceGroupName = "hamzamir-resume-rg",
    [string]$Location = "eastasia"
)

Write-Host "==============================================" -ForegroundColor Green
Write-Host "🚀 Azure Resume Infrastructure Deployment" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Check if Azure CLI is installed
Write-Host "Checking Azure CLI installation..." -ForegroundColor Yellow
$azVersion = az --version
if (-not $azVersion) {
    Write-Host "❌ ERROR: Azure CLI is not installed." -ForegroundColor Red
    Write-Host "Please install Azure CLI from: https://aka.ms/installazurecliwindows" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Azure CLI is installed" -ForegroundColor Green

# Login to Azure (if not already logged in)
Write-Host "Checking Azure login status..." -ForegroundColor Yellow
az account show --output none
if ($LASTEXITCODE -ne 0) {
    Write-Host "Logging in to Azure..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Azure login failed." -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Successfully logged in to Azure" -ForegroundColor Green

# Show current subscription
Write-Host "Current subscription:" -ForegroundColor Yellow
az account show --query "name" --output tsv

# Create resource group
Write-Host "Creating resource group: $ResourceGroupName..." -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location --output none
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create resource group." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Resource group created successfully" -ForegroundColor Green

# Deploy infrastructure
Write-Host "Starting deployment..." -ForegroundColor Yellow
Write-Host "This may take 10-15 minutes..." -ForegroundColor Yellow

$deploymentResult = az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file "infrastructure/azuredeploy.json" `
    --parameters "infrastructure/azuredeploy.parameters.json" `
    --output json

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed." -ForegroundColor Red
    Write-Host $deploymentResult -ForegroundColor Red
    exit 1
}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Show outputs
Write-Host "🌐 Your App Service URL:" -ForegroundColor Cyan
($deploymentResult | ConvertFrom-Json).properties.outputs.appServiceUrl.value

Write-Host "⚡ Your Function App URL:" -ForegroundColor Cyan  
($deploymentResult | ConvertFrom-Json).properties.outputs.functionAppUrl.value

Write-Host "🗄️ Your Cosmos DB Connection String:" -ForegroundColor Cyan
($deploymentResult | ConvertFrom-Json).properties.outputs.cosmosDbConnectionString.value

Write-Host "==============================================" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy your code to the App Service and Function App" -ForegroundColor White
Write-Host "2. Test your resume website" -ForegroundColor White
Write-Host "3. Celebrate! 🎉" -ForegroundColor White