// Show preview of the source image (top right)
document.getElementById('image2').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview2');
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
        preview.style.display = 'block'; // Make the preview visible
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Show preview of the target image (bottom right)
  document.getElementById('image1').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview1 = document.getElementById('preview1');
    const preview1Target = document.getElementById('preview1-target');
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        preview1.src = reader.result;
        preview1.style.display = 'block'; // Make the preview visible
        preview1Target.src = reader.result;
        preview1Target.style.display = 'block'; // Make the preview visible
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Handle form submission and display swapped result
  document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const swapBtn = document.getElementById('swap-btn');
    const swapBtnText = document.getElementById('swap-btn-text');
    const swapSpinner = document.getElementById('swap-spinner');
  
    // Set the button to busy state
    swapBtn.disabled = true;
    swapBtnText.textContent = 'Swapping...';
    swapSpinner.style.display = 'inline-block';
  
    const formData = new FormData();
    formData.append('image1', document.getElementById('image1').files[0]); // Target image
    formData.append('image2', document.getElementById('image2').files[0]); // Source image
  
    try {
      // Send POST request to server to swap faces
      const response = await fetch('/swap', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
  
        // Update the left side (large image container) with the swapped result
        const preview1 = document.getElementById('preview1');
        preview1.src = url;  // Update to the swapped image
        preview1.style.display = 'block';  // Make sure it's visible
      } else {
        console.error('Error swapping faces:', response.statusText);
        alert('Face swapping failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('An error occurred while swapping faces.');
    } finally {
      // Reset the button state
      swapBtn.disabled = false;
      swapBtnText.textContent = 'Swap Faces';
      swapSpinner.style.display = 'none';
    }
  });
  
  // Function to clear the file input and preview image
document.querySelectorAll('.delete-btn').forEach((btn) => {
  btn.addEventListener('click', function () {
    const previewId = this.getAttribute('data-preview-id');
    const inputId = this.getAttribute('data-input-id');
    
    // Clear the input field
    document.getElementById(inputId).value = "";

    // Hide the preview image
    if(previewId == "preview1-target"){
      const preview1 = document.getElementById('preview1');
      preview1.src = "#";
      preview1.style.display = "none";
    }

    const previewImage = document.getElementById(previewId);
    previewImage.src = "#";
    previewImage.style.display = "none";
  });
});
