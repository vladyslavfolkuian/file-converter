document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const convertButton = document.getElementById('convertButton');
    const outputDiv = document.getElementById('output');

    // Предотвращаем стандартное поведение браузера при перетаскивании файла
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Подсвечиваем область при наведении
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    // Убираем подсветку при выходе из области
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Обрабатываем событие перетаскивания файла
    dropArea.addEventListener('drop', handleDrop, false);

    // Открываем диалог выбора файла при клике
    dropArea.addEventListener('click', () => fileInput.click());

    // Обрабатываем выбор файла через диалог выбора файла
    fileInput.addEventListener('change', handleFileSelect, false);

    // Обрабатываем нажатие кнопки конвертации
    convertButton.addEventListener('click', convertToJSON, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;

        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.txt')) {
                outputDiv.innerHTML = `<p>Выбран файл: ${file.name}</p>`;
            } else {
                outputDiv.innerHTML = '<p>Пожалуйста, выберите файл .txt</p>';
            }
        }
    }

    function convertToJSON() {
        const file = fileInput.files[0];
        if (!file || !file.name.endsWith('.txt')) {
            outputDiv.innerHTML = '<p>Выберите файл .txt перед конвертацией</p>';
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        fetch('/convert', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const jsonString = JSON.stringify(data, null, 2);
                outputDiv.innerHTML = `<pre>${jsonString}</pre>`;
            })
            .catch(error => {
                outputDiv.innerHTML = `<p>Произошла ошибка: ${error.message}</p>`;
            });
    }
});