#!/usr/bin/env python3
import zipfile
import os

exclude_dirs = {'.git', 'node_modules', '__pycache__', '.pytest_cache', '.venv', 'venv', 'dist'}
exclude_files = {'FoodVerse-AI-Complete-Project.zip', 'FoodVerse-AI-Complete-Project.tar.gz'}

output_zip = 'FoodVerse-AI-Complete-Project.zip'

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            if f in exclude_files:
                continue
            path = os.path.join(root, f)
            arcname = os.path.relpath(path, '.')
            zipf.write(path, arcname)

print(f"Generated {output_zip} successfully: {os.path.getsize(output_zip)} bytes")
