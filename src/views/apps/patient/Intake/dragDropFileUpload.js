

export default function initializeDragDropFileUpload(node) {

  console.log(node)
  const dragDropArea = node.querySelector('.drag-drop-area');
  const fileInput = node.querySelector('.file-input');
  const fileList = node.querySelector('.file-list');
  const fieldName = node.getAttribute('name');
  if (fieldName) {
    fileInput.setAttribute('name', fieldName); // Set the field name for the input
  }
  const isRequired = node.hasAttribute('required');
  if (isRequired) {
    fileInput.setAttribute('required', 'required'); // Make the file input required

  }
  // Handle file input change
  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files, fileList);
  });

  // Handle drag-and-drop events
  dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('dragover');
  });

  dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('dragover');
  });

  dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files, fileList);
  });

  // Handle click to open file dialog
  dragDropArea.addEventListener('click', () => {
    fileInput.click();
  });

  // Function to handle uploaded files
  const handleFiles = (files, fileList) => {
    fileList.innerHTML = ''; // Clear the file list
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }

      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
          <span>${file.name}</span>
          <span class="file-size">(${(file.size / 1024).toFixed(2)} KB)</span>
        `;
      fileList.appendChild(fileItem);
    });
  };

}

