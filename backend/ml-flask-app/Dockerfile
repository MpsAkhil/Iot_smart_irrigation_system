# Use Python 3.10 (compatible with all your package versions)
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONFAULTHANDLER=1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y gcc && \
    rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Expose port (match your app's port)
EXPOSE 5001

# Run with Gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]