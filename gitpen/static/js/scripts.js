let contents = null;
let easyMDE = null;
let activeFileContent = null;
let activeFilePath = null;


window.onload = getDirs();
function getDirs() {
    const endpoint = '/get-dirs';

    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById("path-dropdown");
            Object.keys(data.dirs).forEach(dir => {
                let option = document.createElement("option");
                option.value = dir;
                option.textContent = dir;
                dropdown.appendChild(option);
            });
            getContent();
        })
        .catch(error => {
            console.error(error);
        });
};

document.getElementById('directory-update').addEventListener('click', () => {
    getContent();
});

function getContent() {
    let dropdown = document.getElementById("path-dropdown");
    fetch('/get-content', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path_alias: dropdown.value })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            contents = response.json();
            return contents;
        })
        .then(data => {
            showContent(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function showContent(parentNode) {
    const contentWindow = document.getElementById("content-navigation"); 

    contentWindow.innerHTML = '';

    Object.keys(parentNode.directories).forEach(dir => {
        const li = document.createElement('button');
        li.classList.add('folder-action');

        li.classList.add('list-group-item');
        li.classList.add('list-group-item-action');

        li.classList.add('d-flex');
        li.classList.add('justify-content-between');
        li.classList.add('align-items-center');
        li.textContent = dir;

        // Add folder icon
        const icon = document.createElement('img');
        icon.setAttribute('src', 'static/img/folder.svg');
        li.appendChild(icon);

        // Add action handler
        li.addEventListener('click', () => showContent(parentNode.directories[dir]));

        contentWindow.appendChild(li);
    });

    parentNode.files.forEach(file => {
        const li = document.createElement('li');
        li.classList.add('file-action'); 

        li.classList.add('list-group-item');
        li.classList.add('list-group-item-action');

        li.classList.add('d-flex');
        li.classList.add('justify-content-between');
        li.classList.add('align-items-center');
        li.textContent = file.name;

        // Add file icon
        const icon = document.createElement('img');
        icon.setAttribute('src', 'static/img/file-earmark-code.svg');

        // Add action handler
        li.addEventListener('click', () => fileAction(file.path));
        li.appendChild(icon);

        contentWindow.appendChild(li);
    });
}

function fileAction(path) {
    fetch('/read-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: path })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.body.innerText = 'Error: ' + data.error;
            } else {
                const md = window.markdownit(
                    {
                        html: true,
                        linkify: true,
                        typographer: true
                    }
                );
                activeFileContent = data.markdown;
                activeFilePath = path;
                const result = md.render(data.markdown);
                let activeFile = document.getElementById('activeFile');
                activeFile.style.display = 'block';
                activeFile.innerHTML = result;
                activeFile.setAttribute('data-file_path', path);
                addFileControlButtons();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.body.innerText = 'Error loading file.';
        });
        let mde = document.querySelector('.EasyMDEContainer');
        if (mde) {
            mde.remove();
        }
}

function addFileControlButtons() {
    const fileButtons = document.getElementById('fileControls');
    if (fileButtons.querySelectorAll('button').length === 0) {
        // Hide button
        const hideButton = document.createElement('button');
        hideButton.classList.add('btn');
        hideButton.classList.add('btn-dark');
        hideButton.setAttribute('id', 'hideFile');
        hideButton.textContent = "Hide";
        hideButton.addEventListener('click', hideFile);

        // Edit button
        const editButton = document.createElement('button');
        editButton.classList.add('btn');
        editButton.classList.add('btn-dark');
        editButton.setAttribute('id', 'editFile');
        editButton.textContent = "Edit";
        editButton.addEventListener('click', editFile);

        // Save button
        const saveButton = document.createElement('button');
        saveButton.classList.add('btn');
        saveButton.classList.add('btn-success');
        saveButton.setAttribute('id', 'saveFile');
        saveButton.textContent = "Save";
        saveButton.addEventListener('click', saveFile);

        fileButtons.appendChild(hideButton);
        fileButtons.appendChild(editButton);
        fileButtons.appendChild(saveButton);
    }
}

function hideFile() {
    // Hide file
    document.getElementById('activeFile').innerHTML = "";
    document.getElementById('activeFile').style.display = 'none';

    // Hide buttons
    const fileButtons = document.getElementById('fileControls');
    fileButtons.innerHTML = "";

    // Hide EasyMDE
    let mde = document.querySelector('.EasyMDEContainer');
    if (mde) {
        mde.remove();
    }
}

function editFile() {
    if (!document.querySelector('.EasyMDEContainer')) {
        easyMDE = new EasyMDE({
            element: document.getElementById('mde-area'),
            toolbar: [
                "bold",
                "italic",
                "heading",
                "code",
                "unordered-list",
                "ordered-list",
                "link",
                "preview"
            ]
        });

        // let fileContent = document.getElementById('activeFile').innerHTML
        // easyMDE.value(fileContent);

        easyMDE.value(activeFileContent);
        document.getElementById('activeFile').innerHTML = '';
    }
}

function saveFile (){
    let updateFile = activeFilePath; 
    let updateContent = easyMDE.value(); 

    fetch('/save-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            updateFile: updateFile,
            updateContent: updateContent
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            contents = response.json();
            return contents;
        })
        .then(data => {
            fileAction(updateFile);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
