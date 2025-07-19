import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
if GROQ_API_KEY:
    GROQ_API_KEY = GROQ_API_KEY.strip()

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

print(f"Testing GROQ API with key: {GROQ_API_KEY[:10]}...")
print(f"Full API key: {GROQ_API_KEY}")

# Simple test request
response = requests.post(
    GROQ_API_URL,
    headers={
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    },
    json={
        'model': 'llama3-8b-8192',
        'messages': [{'role': 'user', 'content': 'Hello, can you respond with just "API working"?'}],
        'temperature': 0.1,
        'max_completion_tokens': 10
    },
    timeout=30
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code == 200:
    print("✅ GROQ API is working correctly!")
else:
    print("❌ GROQ API test failed!")
    
# Also test if we can list models
print("\nTesting model availability...")
models_response = requests.get(
    "https://api.groq.com/openai/v1/models",
    headers={
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    }
)
print(f"Models endpoint status: {models_response.status_code}")
if models_response.status_code == 200:
    models_data = models_response.json()
    available_models = [model['id'] for model in models_data.get('data', [])]
    print(f"Available models: {available_models}")
    if 'llama3-8b-8192' in available_models:
        print("✅ llama3-8b-8192 model is available")
    else:
        print("❌ llama3-8b-8192 model is NOT available")
else:
    print(f"Models endpoint error: {models_response.text}")