#!/bin/bash

echo "Starting Travel Tour Backend in Development Mode..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "⚠️  .env file not found. Creating from template..."
  cp .env.template .env
  echo "✅ .env file created. Please update with your configuration."
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Create logs directory if it doesn't exist
if [ ! -d logs ]; then
  mkdir logs
fi

# Start the development server
echo "🚀 Starting development server..."
npm run dev
