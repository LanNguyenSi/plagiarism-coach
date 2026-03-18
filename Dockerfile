FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Make CLI executable
RUN chmod +x dist/cli/index.js

# Create symlink for global usage
RUN npm link

ENTRYPOINT ["plagiarism-coach"]
CMD ["--help"]
