import os

PROJECT_NAME = "ai_multivendor_ecommerce"

folders = [
    # Backend
    "backend/app/core",
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/routes",
    "backend/app/services",
    "backend/app/ml",
    "backend/app/utils",
    "backend/migrations",
    "backend/tests",

    # Frontend
    "frontend/public",
    "frontend/src/components",
    "frontend/src/pages",
    "frontend/src/services",
    "frontend/src/styles",
]

files = {
    # Backend files
    "backend/app/main.py": "",
    "backend/app/core/config.py": "",
    "backend/app/core/security.py": "",
    "backend/app/core/database.py": "",
    "backend/app/models/__init__.py": "",
    "backend/app/schemas/__init__.py": "",
    "backend/app/routes/__init__.py": "",
    "backend/app/services/__init__.py": "",
    "backend/app/ml/__init__.py": "",
    "backend/app/utils/__init__.py": "",
    "backend/requirements.txt": "",
    "backend/README.md": "# Backend – AI Multi-Vendor E-Commerce\n",

    # Frontend files
    "frontend/public/index.html": "<!DOCTYPE html>\n<html><head><title>AI E-Commerce</title></head><body><div id='root'></div></body></html>",
    "frontend/src/App.jsx": "function App() {\n  return <h1>AI Multi-Vendor E-Commerce</h1>;\n}\nexport default App;",
    "frontend/src/main.jsx": "",
    "frontend/package.json": "{\n  \"name\": \"frontend\",\n  \"private\": true\n}",
    "frontend/README.md": "# Frontend – AI Multi-Vendor E-Commerce\n",

    # Root README
    "README.md": "# AI-Powered Multi-Vendor E-Commerce & Demand Forecasting System\n",
}

def create_project():
    print(f"Setting up project: {PROJECT_NAME}\n")

    for folder in folders:
        os.makedirs(folder, exist_ok=True)
        print(f"Created folder: {folder}")

    for filepath, content in files.items():
        if not os.path.exists(filepath):
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Created file: {filepath}")

    print("\nProject structure created successfully ✅")

if __name__ == "__main__":
    create_project()
