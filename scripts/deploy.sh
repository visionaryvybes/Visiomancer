#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Starting deployment process...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed. Installing...${NC}"
    npm install -g vercel
fi

# Run type check
echo -e "${YELLOW}Running type check...${NC}"
npm run type-check || { echo -e "${RED}Type check failed!${NC}"; exit 1; }

# Run build locally to catch any issues
echo -e "${YELLOW}Running build...${NC}"
npm run build || { echo -e "${RED}Build failed!${NC}"; exit 1; }

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod

echo -e "${GREEN}Deployment complete!${NC}" 