FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential git \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
COPY requirements-auto.txt .

RUN pip install torch==2.7.1 --index-url https://download.pytorch.org/whl/cpu
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements-auto.txt

COPY . .

EXPOSE 8110

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8110"]
