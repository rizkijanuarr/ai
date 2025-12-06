# AI Project

## Overview
This repository holds a simple **backend / frontend** skeleton meant to demonstrate a clean, versioned-layer architecture in Python.

```text
├── app.py                # Main application entry-point
├── requirements.txt      # Python dependencies
├── backend/              # Core business logic
│   ├── controller/       # REST / RPC controllers
│   │   ├── advices/      # Exception & response handlers
│   │   └── v1/           # Versioned controller layer
│   │       ├── TestControllerV1.py
│   │       └── impl/
│   │           └── TestControllerImplV1.py
│   ├── service/          # Service layer (use-cases)
│   │   ├── v1/
│   │   │   ├── TestServiceV1.py
│   │   │   └── impl/
│   │   │       └── TestServiceImplV1.py
│   ├── request/          # Input DTOs
│   │   └── v1/
│   │       └── TestRequestV1.py
│   ├── response/         # Output DTOs
│   │   └── v1/
│   │       └── TestResponseV1.py
│   ├── model/            # Domain entities (empty for now)
│   ├── data/             # Data-access layer (empty for now)
│   ├── output/           # Persisted artefacts / reports
│   └── utils/            # Helpers & utilities
│       └── DateUtil.py
└── frontend/             # UI templates / static assets
    ├── components/
    └── templates/
```

## Getting Started
1. Create and activate a virtual environment.
2. `pip install -r requirements.txt`.
3. `python app.py`.

## Architectural Notes
- **Layered + Versioned**: every public API is namespaced by version (`v1`, `v2`, …).
- **Controller → Service → Model**: controllers handle transport concerns, services hold business rules, models represent domain objects/data.
- **DTO Separation**: `request/` and `response/` keep network contracts explicit and immutable.
- **Advices**: centralized exception / response wrappers.

## Contributing
Pull requests are welcome.
Follow [PEP 8](https://peps.python.org/pep-0008/) and keep commits atomic.
