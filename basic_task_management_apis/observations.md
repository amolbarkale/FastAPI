# Explanation
# 1. We use FastAPI with Jinja2 templates to serve both API and basic UI.
# 2. Tasks are stored in a global list; new IDs are generated with a counter.
# 3. API endpoints support CRUD operations with proper status codes and error handling.
# 4. The UI (index.html) displays tasks, lets you add, mark complete/incomplete, and delete.
# 5. We simulate PUT/DELETE in forms by using a hidden `_method` field and JavaScript fetch overrides.
# 6. To run: install requirements and launch `uvicorn main:app --reload`.