import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pathlib import Path
import configparser
import logging
import html2text

app = Flask(__name__, static_folder="dist/test/browser", static_url_path="/")
CORS(app)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

cfg = configparser.ConfigParser()
cfg.read(Path(__file__).parent.parent / 'settings.ini')
BASE_DIR = cfg["general"]["base_dir"]
logger.warning(BASE_DIR)


@app.route("/", defaults={"path": ""}, methods=['GET'])
@app.route("/<path:path>")
def catch_all(path):
    return app.send_static_file("index.html")


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
    for item in sorted(directory.iterdir()):
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
    return jsonify(
        dict(
            fileName=os.path.basename(filepath),
            fileContents=f_value,
            filePath=filepath
            )
        )


@app.route('/api/save-file', methods=['POST'])
def save_file():
    data = request.get_json()
    filepath = data.get('filepath')
    content = data.get('content')

    logger.debug(filepath)
    logger.debug(content)

    with open(BASE_DIR + '/' + filepath, 'w') as f:
        f.write(html2text.html2text(content))

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
