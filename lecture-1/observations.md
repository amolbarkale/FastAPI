FAST API - Python Framework to create APIs
It is super fastapi

Uvicorn is the engine -> Server

uvicorn fun;obj

pip -> python package manager
-->

Step 0 : Virtual environment -> isolated env where all packages managed project wise. `python -m venv .venv`

Step 1 : activate that virtual env `source /.venv/Script/activate` (for windows)

Step 2 : install python packages `pip install fastapi uvicorn`

Step 2 : install python packages `pip install fastapi uvicorn`

Step 3 : import FastAPI and run the server `uvicorn main:app --reload` (main -> filename, app is the instance inside main)

Uvicorn is an ASGI server - Asynchronous Server Gateway Interface

Step 4: check APIs with `http://127.0.0.1:8000/docs`
step 5: Pydentic -> used in FatAPI to validate the data like zod in JS

step 6: SQLAlchemy is the Python library
there are some databases like SQLite, MySQL ...