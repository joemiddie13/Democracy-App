# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY democracy-api/requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY democracy-api .

# Expose the port that Flask runs on
EXPOSE 5000

# Set the environment variable for Flask
ENV FLASK_APP=app.py

# Use ENTRYPOINT to specify the command to run when the container starts
ENTRYPOINT ["flask", "run", "--host=0.0.0.0"]