#!/bin/bash
# deploy-infrastructure.sh - Azure Deployment Script for Linux/Mac

RESOURCE_GROUP_NAME="hamzamir-resume-rg"
LOCATION="eastasia"

echo "=============================================="
echo "🚀 Azure Resume Infrastructure Deployment"
echo "=============================================="

# Check if Azure CLI is installed
echo "🔍 Checking Azure CLI installation..."
if ! command -v az &> /dev/null; then
    echo "❌ ERROR: Azure CLI is not installed."
    echo "Please install Azure CLI from: https://aka.ms/installazurecli"
    exit 1
fi
echo "✅ Azure CLI is installed"

# Login to Azure (if not already logged in)
echo "🔍 Checking Azure login status..."
az account show --output none
if [ $? -ne 0 ]; then
    echo "🔐 Logging in to Azure..."
    az login
    if [ $? -ne 0 ]; then
        echo "❌ Azure login failed."
        exit 1
    fi
fi
echo "✅ Successfully logged in to Azure"

# Show current subscription
echo "📋 Current subscription:"
az account show --query "name" --output tsv

# Create resource group
echo "🛠️ Creating resource group: $RESOURCE_GROUP_NAME..."
az group create --name $RESOURCE_GROUP_NAME --location $LOCATION --output none
if [ $? -ne 0 ]; then
    echo "❌ Failed to create resource group."
    exit 1
fi
echo "✅ Resource group created successfully"

# Deploy infrastructure
echo "🚀 Starting deployment..."
echo "⏰ This may take 10-15 minutes..."

deployment_result=$(az deployment group create \
    --resource-group $RESOURCE_GROUP_NAME \
    --template-file "infrastructure/azuredeploy.json" \
    --parameters "infrastructure/azuredeploy.parameters.json" \
    --output json)

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed."
    echo "$deployment_result"
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "=============================================="

# Show outputs
echo "🌐 Your App Service URL:"
echo "$deployment_result" | jq -r '.properties.outputs.appServiceUrl.value'

echo "⚡ Your Function App URL:"
echo "$deployment_result" | jq -r '.properties.outputs.functionAppUrl.value'

echo "🗄️ Your Cosmos DB Connection String:"
echo "$deployment_result" | jq -r '.properties.outputs.cosmosDbConnectionString.value'

echo "=============================================="
echo "Next steps:"
echo "1. Deploy your code to the App Service and Function App"
echo "2. Test your resume website"  
echo "3. Celebrate! 🎉"