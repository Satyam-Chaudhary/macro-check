# --- Stage 1: Build dependencies ---
# Use the more modern 'bookworm' version of Debian
FROM python:3.11-slim-bookworm AS builder

# Update packages to patch any remaining security vulnerabilities
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# We will use requirements.txt for Docker as it's simpler than Poetry
COPY requirements.txt .

# Install dependencies into a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# --- Stage 2: Final application image ---
FROM python:3.11-slim-bookworm

WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Set the PATH to include the virtual environment's binaries
ENV PATH="/opt/venv/bin:$PATH"

# Copy the application source code
COPY ./app ./app

# Command to run the application
# Use --host 0.0.0.0 to make it accessible from outside the container
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]