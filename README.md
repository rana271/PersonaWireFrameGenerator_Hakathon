# PersonaWireFrameGenerator_Hakathon
PersonaWireFrameGenerator Hakathon Project
How to setup the project init level
# 1. Create root directory and Solution
mkdir PersonaWireframeApp && cd PersonaWireframeApp
dotnet new sln -n PersonaWireframeApp

# 2. Create the Backend Projects inside src/
mkdir src && cd src
dotnet new webapi -n GatewayAPI -f net9.0
dotnet new webapi -n Service.WireframeAI -f net9.0
cd ..

# 3. Add Backend Projects to the Solution
dotnet sln add src/GatewayAPI/GatewayAPI.csproj
dotnet sln add src/Service.WireframeAI/Service.WireframeAI.csproj

# 4. Create the Frontend ClientApp using Vite + React + TypeScript
npm create vite@latest ClientApp -- --template react-ts
cd ClientApp && npm install && npm install @microsoft/signalr @reduxjs/toolkit react-redux axios
cd ..
cd C:\Users\ranac\PersonaWireframeApp\src\Service.WireframeAI
dotnet run --urls="http://localhost:5000"
C:\Users\ranac\PersonaWireframeApp\ClientApp>npm run dev
