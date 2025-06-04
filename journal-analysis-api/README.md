# Journal Analysis API

This is a FastAPI-based REST API for handling journal entries from a React Native application. The API provides CRUD operations for journal entries and will later include sentiment analysis and emotional trend analysis capabilities.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `POST /journal` - Create a new journal entry
- `GET /journal` - Get all journal entries
- `GET /journal/{entry_id}` - Get a specific journal entry
- `PUT /journal/{entry_id}` - Update a journal entry
- `DELETE /journal/{entry_id}` - Delete a journal entry

## API Documentation

Once the server is running, you can access:
- Interactive API documentation at `http://localhost:8000/docs`
- Alternative API documentation at `http://localhost:8000/redoc`

## Example Journal Entry Format

```json
{
    "title": "My Journal Entry",
    "content": "Today was a great day...",
    "mood": "happy"
}
```

## Future Features

- Sentiment analysis of journal entries
- Emotional trend analysis
- Natural language processing for journal content
- Data visualization of mood patterns 