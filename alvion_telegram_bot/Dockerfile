FROM python:3.10-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir --default-timeout=100 --retries 5 -r requirements.txt
COPY . .

CMD ["python", "main.py"]
