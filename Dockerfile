# Build stage for React frontend
FROM node:14 as build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM python:3.9-slim
WORKDIR /app

# Copy backend requirements and install
COPY democracy-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY democracy-api .

# Copy built frontend
COPY --from=build-frontend /app/build ./static

# Expose the port the app runs on
EXPOSE 5000

# Set the environment variable for Flask
ENV FLASK_APP=app.py

# Run the application
CMD ["flask", "run", "--host=0.0.0.0"]