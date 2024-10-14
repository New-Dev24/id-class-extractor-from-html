    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('dropArea');
    const preview = document.getElementById('preview');
    const closeButton = document.getElementById('closeButton');
    const idCountDisplay = document.getElementById('idCount');
    const classCountDisplay = document.getElementById('classCount');
    const htmlTextarea = document.getElementById('htmlTextarea');
    const processButton = document.getElementById('processButton');

    const idsOnlyOption = document.getElementById('idsOnly');
    const classesOnlyOption = document.getElementById('classesOnly');

    const processingModal = document.getElementById('processingModal');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Highlight drop area when file is dragged over
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, () => {
        dropArea.classList.add('hover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, () => {
        dropArea.classList.remove('hover');
      });
    });

    // Handle file selection
    dropArea.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      handleFile(file);
    });

    processButton.addEventListener('click', () => {
      const htmlContent = htmlTextarea.value;
      if (htmlContent) {
        showModal();
        setTimeout(() => processHTMLContent(htmlContent), 1000); // Simulate delay
      }
    });

    function handleFile(file) {
      if (!file) return;

      showModal();
      const reader = new FileReader();

      reader.onload = () => {
        setTimeout(() => processHTMLContent(reader.result), 1000); // Simulate delay
      };

      reader.readAsText(file);
    }

    function processHTMLContent(content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      let result = '';
      let idCount = 0;
      let classCount = 0;
      let isIdsOnly = idsOnlyOption.checked;
      let isClassesOnly = classesOnlyOption.checked;
      
      if (isIdsOnly || !isClassesOnly) {
        const elementsWithId = doc.querySelectorAll('[id]');
        idCount = elementsWithId.length;
        elementsWithId.forEach(element => {
          const id = element.id;
          result += `document.getElementById("${id}");\n`;
        });
      }

      if (isClassesOnly || !isIdsOnly) {
        const elementsWithClass = doc.querySelectorAll('[class]');
        elementsWithClass.forEach(element => {
          const classes = element.className.split(' ');
          classCount += classes.length;
          classes.forEach(cls => {
            result += `document.querySelector(".${cls}");\n`;
          });
        });
      }

      const previewContent = document.createElement('pre');
      previewContent.textContent = result;
      preview.innerHTML = '';
      preview.appendChild(previewContent);
      closeButton.style.display = 'block';

      idCountDisplay.textContent = `IDs found: ${idCount}`;
      classCountDisplay.textContent = `Classes found: ${classCount}`;

      hideModal();
    }

    dropArea.addEventListener('click', () => {
      fileInput.click();
    });

    closeButton.addEventListener('click', () => {
      preview.innerHTML = `<p>Select a file or paste HTML content to preview the output.</p>`;
      closeButton.style.display = 'none';
      idCountDisplay.textContent = 'IDs found: 0';
      classCountDisplay.textContent = 'Classes found: 0';
    });

    function showModal() {
      processingModal.style.display = 'flex';
    }

    function hideModal() {
      processingModal.style.display = 'none';
    }