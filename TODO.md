# TODO: Change datetime format to instant/UTC in MongoDB

**Status: Completed**

## Steps:
- [x] Create TODO.md
- [x] Edit backend/main.py: get_utc_time() → datetime.utcnow() (naive UTC instant, no tz offset)
- [x] Update all references
- [x] Comments fixed

## Test:
cd backend
uvicorn main:app --reload
POST http://localhost:8000/messages {"text":"test"} → createdAt without offset/+00:00 only if wanted, pure instant.

Backend updated. New MongoDB timestamps are UTC instants (no local conversion issues).
