from flask import Flask, jsonify, request
from flask_cors import CORS
from pathlib import Path
import logging
import configparser

app = Flask(__name__)
CORS(app)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

cfg = configparser.ConfigParser()
cfg.read(Path(__file__).parent.parent / 'settings.ini')
BASE_DIR = cfg["general"]["base_dir"]


@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello World"})


@app.route('/api/all', methods=['GET'])
def get_all():
    root_path = Path(BASE_DIR)
    if not root_path.exists():
        return jsonify({"error": "Base directory not found"}), 404

    folder_tree = get_folder_structure(root_path)
    logger.debug(folder_tree)
    return jsonify(folder_tree)


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
                "parent": parent_path
            })
    return tree


@app.route('/api/get-file', methods=['GET'])
def get_file():
    filepath = request.args.get('filepath')
    logger.debug(filepath)

    with open(BASE_DIR + '/' + filepath, 'r') as f:
        f_value = f.read()
    return jsonify(dict(fileContents=f_value))


if __name__ == '__main__':
    app.run(debug=True, port=5000)
