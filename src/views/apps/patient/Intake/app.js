import SignaturePad from 'signature_pad';

const signatureMetadata = {
  timestamp: null,
  coordinates: [],
  ipAddress: null,
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  imageData: null,
  currentUser: {}
};

export default function loadSignature(node, currentUser, signatureData) {
  let canvas = node.querySelector('canvas');
  let clearButton = node.querySelector('button');
  let inputField = node.querySelector('input');
  if (node.value) {
    inputField.value = node.value
  }

  // Set the current user in metadata
  const signatureMetadata = {
    timestamp: null,
    coordinates: [],
    ipAddress: null,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    imageData: null,
    currentUser: {
      fullName: currentUser.fullName,
      time_zone: currentUser.time_zone
    }
  };

  // Initialize the signature pad
  const signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'transparent', // Ensure the background is transparent
    throttle: 16, // Adjust for smoother drawing
  });
  // function resizeCanvas() {
  //   const ratio = Math.max(window.devicePixelRatio || 1, 1);

  //   // Set canvas width/height attributes
  //   canvas.width = canvas.offsetWidth * ratio;
  //   canvas.height = canvas.offsetHeight * ratio;

  //   // Scale the context to ensure smooth drawing
  //   const ctx = canvas.getContext('2d');
  //   ctx.scale(ratio, ratio);

  //   // Clear and redraw the signature (if any)
  //   signaturePad.clear(); // Optional: Redraw existing signature if needed
  // }
  //resizeCanvas();
  // window.addEventListener('resize', resizeCanvas);
  // canvas.addEventListener('mousedown', (event) => {
  //   const rect = canvas.getBoundingClientRect();
  //   const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  //   const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  //   // Use x and y for drawing
  // });

  // canvas.addEventListener('touchstart', (event) => {
  //   const rect = canvas.getBoundingClientRect();
  //   const touch = event.touches[0];
  //   const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
  //   const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
  //   // Use x and y for drawing
  // });
  // Initialize metadata (e.g., IP address)
  async function initMetadata() {
    signatureMetadata.ipAddress = await getIPAddress();
  }
  initMetadata();

  // Event listener for when a stroke begins
  signaturePad.addEventListener('beginStroke', () => {
    signatureMetadata.timestamp = new Date().toISOString();
  });

  // Event listener for before updating the signature pad
  signaturePad.addEventListener('beforeUpdate', (event) => {
    signatureMetadata.coordinates.push({
      x: event.detail.point.x,
      y: event.detail.point.y,
      time: Date.now()
    });
  });

  // Update biometric data (signature image and metadata)
  function updateBiometricData() {
    signatureMetadata.imageData = signaturePad.toDataURL();
    console.log('Signature Image Data:', signatureMetadata.imageData);

    const biometricData = {
      signature: {
        imageData: signatureMetadata.imageData,
        metadata: signatureMetadata,
        required: true
      }
    };
    return biometricData;
  }

  // Event listener for when a stroke ends
  signaturePad.addEventListener('endStroke', () => {
    if (inputField) {
      inputField.value = signaturePad.toDataURL();
    }
    // Update signatureData with the latest signature

    signatureData.value = updateBiometricData();
    signatureData.value.signature.required = false
    console.log('Signature Data Updated:', signatureData.value);
  });

  // Clear the signature pad and input field
  clearButton.addEventListener('click', () => {

    signaturePad.clear();
    if (inputField) {
      inputField.value = '';
    }
    const biometricData = {
      signature: {
        imageData: null,
        metadata: null,
        required: true
      }
    };
    // Clear signatureData when the pad is cleared
    signatureData.value = biometricData;
  });

  // Get the user's IP address
  async function getIPAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Failed to get IP:', error);
      return 'unknown';
    }
  }

  // Expose a function to get the signature data
  function getData() {
    const data = updateBiometricData();
    console.log('Signature Data from getData:', data);
    return data;
  }

  return {
    getData
  };
}
