import time
import threading
from fastapi import HTTPException, Request

# Max 20 concurrent active requests
MAX_CONCURRENT_USERS = 20
user_semaphore = threading.Semaphore(MAX_CONCURRENT_USERS)

# Per-IP rate limit (5 seconds)
RATE_LIMIT_SECONDS = 5
last_request_time = {}
lock = threading.Lock()


def acquire_user_slot():
    acquired = user_semaphore.acquire(blocking=False)
    if not acquired:
        raise HTTPException(
            status_code=503,
            detail="Server is busy. Please try again shortly."
        )


def release_user_slot():
    user_semaphore.release()


def check_rate_limit(request: Request):
    client_ip = request.client.host
    current_time = time.time()

    with lock:
        last_time = last_request_time.get(client_ip)

        if last_time and current_time - last_time < RATE_LIMIT_SECONDS:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please wait a few seconds."
            )

        last_request_time[client_ip] = current_time