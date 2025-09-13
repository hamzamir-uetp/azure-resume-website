# 🌐 Azure Resume Website

A modern, responsive resume website deployed on Microsoft Azure with a real-time visitor counter. Built as part of the Azure Resume Challenge to demonstrate cloud development skills.

## ✨ Features

- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Visitor Counter** - Real-time counter with localStorage persistence
- ✅ **Azure Deployment** - Hosted on Azure App Service with HTTPS
- ✅ **Modern UI** - Clean, professional design with smooth animations
- ✅ **Fast Loading** - Optimized for performance and SEO

## 🏗️ Architecture

```mermaid
azure-resume-website/
├── index.html # Main resume page
├── script.js # Visitor counter logic
├── api/
│ └── app.py # Flask API backend (ready for deployment)
├── .github/
│ └── workflows/
│ └── deploy.yml # GitHub Actions CI/CD
├── requirements.txt # Python dependencies
└── README.md # This file
```

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Python Flask (API ready)
- **Hosting:** Azure App Service
- **Database:** localStorage (CosmosDB ready)
- **CI/CD:** GitHub Actions
- **Security:** HTTPS/SSL enabled

## 📦 Azure Services

- **Azure App Service** - Web hosting with auto-scaling
- **Azure DNS** - Domain management and routing
- **Azure Monitor** - Performance monitoring and analytics
- **Azure Cosmos DB** - Ready for database integration

## 🚀 Getting Started

### Prerequisites
- Azure account (Free tier available)
- GitHub account
- Modern web browser

### Local Development
```bash
# Clone the repository
git clone https://github.com/hamzamir-uetp/azure-resume-website.git

# Navigate to project directory
cd azure-resume-website

# Install Python dependencies (if using API)
pip install -r requirements.txt

# Open in browser
open index.html
```

## Author
- **Hamza Mir**
- **GitHub:** @hamzamir-uetp
- **LinkedIn:** [https://www.linkedin.com/in/hamzamir~uetp/]
- **Website:** https://hamzamir-resume-app-gzgwc0d9f2csexgt.eastasia-01.azurewebsites.net

## Acknowledgments
- Inspired by the Azure Resume Challenge
- Built with Microsoft Azure cloud services
- Deployed using GitHub Actions CI/CD

## Demo
- **🌐 Live URL:** [Resume Website](https://hamzamir-resume-app-gzgwc0d9f2csexgt.eastasia-01.azurewebsites.net)
- **✅ Status:** Fully deployed and operational.
