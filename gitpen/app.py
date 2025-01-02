import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

dirs = {
    # "<alias for FE>" : "<full path used by BE>"
    "alias": "path",
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get-dirs", methods=['GET'])
def directory_update():
    return jsonify({"dirs": dirs}), 200


@app.route("/get-content", methods=['POST'])
def get_content():
    alias = request.json.get('path_alias')
    path = dirs[alias]

    def build_structure(path):
        structure = {
            "path": path,
            "files": [],
            "directories": {}
        }
        for item in os.listdir(path):
            if item.startswith("."):
                continue
            item_path = os.path.join(path, item)
            if os.path.isdir(item_path):
                if "GitPen" in item_path:
                    continue
                structure["directories"][item] = build_structure(item_path)
            else:
                structure["files"].append({"name": item, "path": item_path})
        return structure

    return jsonify(build_structure(path))


@app.route("/read-file", methods=['POST'])
def read_file():
    file_path = request.json.get('file_path')

    if not file_path or not os.path.isfile(file_path):
        return jsonify({'error': 'File not found'}), 400

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            file_content = file.read()

        # todo: host img files from Flask
        # dir_path = os.path.dirname(file_path)
        # pattern = r"!\[([^\]]*)\]\(([^)]+)\)"
        # file_content = re.sub(
        #     pattern,
        #     rf"![\1]({dir_path}/\2)",
        #     file_content
        # )

        return jsonify({'markdown': file_content})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/save-file", methods=['POST'])
def save_file():
    file_path = request.json.get('updateFile')
    file_content = request.json.get('updateContent')

    if not file_path or not os.path.isfile(file_path):
        return jsonify({'error': 'File not found'}), 400

    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            file_content = file.write(file_content)

        return jsonify({'action': 'success'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
