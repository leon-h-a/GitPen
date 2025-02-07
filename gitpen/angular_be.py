from flask import Flask, jsonify
from pathlib import Path

app = Flask(__name__)

BASE_DIR = "/path/to/your/root/folder"


def get_folder_structure(directory: Path, parent_path=""):
    tree = []

    for item in directory.iterdir():
        full_path = f"{parent_path}/{item.name}" if parent_path else item.name

        if item.is_dir():
            tree.append({
                "name": item.name,
                "type": "folder",
                "parent": parent_path,
                "children": get_folder_structure(item, full_path)
            })
        else:
            tree.append({
                "name": item.name,
                "type": "file",
                "parent": parent_path  # Store parent path
            })

    return tree


@app.route('/folders', methods=['GET'])
def get_folders():
    root_path = Path(BASE_DIR)
    if not root_path.exists():
        return jsonify({"error": "Base directory not found"}), 404

    folder_tree = get_folder_structure(root_path)
    return jsonify(folder_tree)


if __name__ == '__main__':
    app.run(debug=True)
