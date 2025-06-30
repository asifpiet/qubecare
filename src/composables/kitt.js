const { authService } = GLOBAL_VARIABLE.useAuth
import { Room, RoomEvent, Track } from "livekit-client";
import { AccessToken } from "livekit-server-sdk";
import { BASE_URL } from '../utils/constants';

import SignaturePad from 'signature_pad';
let routerInstance = null;
let routeInstance = null;
const signaturePadRef = ref(null);
const signatureData = ref(null);
const signatureInputData = ref(null);
class Kitt {
  constructor(tagline, endpointUrl, token) {
    this.tagline = tagline;
    this.endpointUrl = endpointUrl;
    this.token = token;

    // Bind event handlers to maintain 'this' context
    this.handleTrackSubscribed = this.handleTrackSubscribed.bind(this);
    this.handleTrackUnsubscribed = this.handleTrackUnsubscribed.bind(this);
    this.handleActiveSpeakerChange = this.handleActiveSpeakerChange.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleLocalTrackUnpublished =
      this.handleLocalTrackUnpublished.bind(this);
  }
  static async generateToken(
    apiKey,
    apiSecret,
    roomName,
    participantName,
    metadata = {}
  ) {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      metadata: JSON.stringify(metadata),
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return await at.toJwt();
  }
  async joinRoom(parentElement, onDisconnect = () => { }) {
    this.parentElement = parentElement;
    this.room = new Room({
      // Ensure audio is enabled
      audioCaptureDefaults: {
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
      },
      // Disable video
      videoCaptureDefaults: {
        resolution: { width: 0, height: 0 },
      },
      // Automatically subscribe to audio tracks
      adaptiveStream: true,
      dynacast: true,
    });

    this.room
      .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .on(RoomEvent.ActiveSpeakersChanged, this.handleActiveSpeakerChange)
      .on(RoomEvent.Disconnected, onDisconnect)
      .on(RoomEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished);

    console.log(this.endpointUrl);
    await this.room.connect(this.endpointUrl, this.token, {
      autoSubscribe: true, // Ensure we auto-subscribe to tracks
    });

    this.room.localParticipant.setCameraEnabled(false);
    await this.room.localParticipant.setMicrophoneEnabled(true);
    await this.registerRPC();
    return this.room;
  }

  handleTrackSubscribed(track, publication, participant) {
    if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
      // attach it to a new HTMLVideoElement or HTMLAudioElement
      const element = track.attach();

      // Append the element to the parent if provided
      if (this.parentElement && element) {
        this.parentElement.appendChild(element);
      }
    }
  }

  handleTrackUnsubscribed(track, publication, participant) {
    // remove tracks from all attached elements
    track.detach();
  }

  handleLocalTrackUnpublished(publication, participant) {
    // when local tracks are ended, update UI to remove them from rendering
    publication.track.detach();
  }

  handleActiveSpeakerChange(speakers) {
    // show UI indicators when participant is speaking
    console.log("Active speakers:", speakers);
  }

  handleDisconnect() {
    console.log("disconnected from room");
  }

  // Add methods to control the room
  async setMicrophoneEnabled(enabled) {
    if (this.room && this.room.localParticipant) {
      return await this.room.localParticipant.setMicrophoneEnabled(enabled);
    }
    return false;
  }

  disconnect() {
    if (this.room) {
      this.room.disconnect();
    }
  }

  getParticipants() {
    if (this.room) {
      return Array.from(this.room.participants.values());
    }
    return [];
  }

  showJiraTicketInfo(data) {
    data = JSON.parse(data.payload);
    console.log(data);
    const ticketId = data.ticketId;
    const ticketUrl = data.ticketUrl;
    // Create a simple modal to display the ticket information
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#fff";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.zIndex = "1000";

    const content = `
      <h2>Jira Ticket Information</h2>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Ticket URL:</strong> <a href="${ticketUrl}" target="_blank">${ticketUrl}</a></p>
      <button id="closeModal">Close</button>
    `;
    modal.innerHTML = content;

    document.body.appendChild(modal);

    // Add event listener to close the modal
    document.getElementById("closeModal").addEventListener("click", () => {
      document.body.removeChild(modal);
    });
  }

  async showRegistrationPopup(data) {
    try {
      const userData = JSON.parse(data.payload);
      console.log("Showing user registration details:", userData);

      // Remove any existing popup first
      const existingModal = document.getElementById(
        "registration-confirmation-modal"
      );
      if (existingModal) {
        document.body.removeChild(existingModal);
      }

      // Create modal container
      const modal = document.createElement("div");
      modal.id = "registration-confirmation-modal";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.zIndex = "1000";

      // Create modal content
      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "#fff";
      modalContent.style.padding = "30px";
      modalContent.style.borderRadius = "8px";
      modalContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      modalContent.style.width = "500px";
      modalContent.style.maxWidth = "90%";
      modalContent.style.maxHeight = "90vh";
      modalContent.style.overflowY = "auto";

      // Create details display
      modalContent.innerHTML = `
        <h2 style="margin-top: 0; color: #333; text-align: center;">${userData.title || "Confirm Your Registration Details"
        }</h2>
        <p style="margin-bottom: 20px; text-align: center;">${userData.message || "Please review your registration details:"
        }</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; margin-bottom: 4px;">First Name:</div>
            <div style="padding: 8px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px;">${userData.firstName || ""
        }</div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Last Name:</div>
            <div style="padding: 8px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px;">${userData.lastName || ""
        }</div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Email Address:</div>
            <div style="padding: 8px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px;">${userData.email || ""
        }</div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Company Name:</div>
            <div style="padding: 8px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px;">${userData.company || ""
        }</div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Password:</div>
            <div style="padding: 8px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px;">
              ${userData.password}
            </div>
          </div>
        </div>
        
        <div style="text-align: center; color: #666; font-style: italic;">
          Please respond verbally to the assistant to confirm these details or request changes.
        </div>
      `;

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      return { success: true };
    } catch (error) {
      console.error("Error showing registration popup:", error);
      return { success: false, error: error.message };
    }
  }
  async openDashbord(data) {
    try {
      showLoader()
      const userData = JSON.parse(data.payload);
      console.log("Showing user registration details:", userData);
      await authService.value.login(userData.username, userData.password)
      hideLoader()
      await nextTick(() => {
        const redirectPath = routeInstance && routeInstance.query.to
          ? String(routeInstance.query.to)
          : '/provider/calendar';
        routerInstance.replace(redirectPath);
        return { success: true };
      });
    } catch (err) {
      hideLoader()
      addAlert(err.response?._data?.message ?? err.message, 'error');
      console.error(err);
      return { success: false, error: err.message };
    }
  }
  showFormUpload(data) {
    try {
      const popupData = JSON.parse(data.payload);
      console.log("Showing file upload popup:", popupData);

      // Remove any existing popup first
      const existingModal = document.getElementById("file-upload-modal");
      if (existingModal) {
        document.body.removeChild(existingModal);
      }

      // Create modal container
      const modal = document.createElement("div");
      modal.id = "file-upload-modal";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.zIndex = "1000";

      // Create modal content
      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "#fff";
      modalContent.style.padding = "30px";
      modalContent.style.borderRadius = "8px";
      modalContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      modalContent.style.width = "500px";
      modalContent.style.maxWidth = "90%";
      modalContent.style.maxHeight = "90vh";
      modalContent.style.overflowY = "auto";

      // Create file upload container
      modalContent.innerHTML = `
        <h2 style="margin-top: 0; color: #333; text-align: center;">${popupData.title || "Upload File"}</h2>
        <p style="margin-bottom: 20px; text-align: center;">${popupData.message || "Please select a file to upload."}</p>
        
        <div style="margin-bottom: 20px;">
          <div id="drop-zone" style="border: 2px dashed #49a38c; border-radius: 4px; padding: 20px; text-align: center; margin-bottom: 15px;">
            <div id="file-preview" style="display: none; margin-bottom: 10px;">
              <p style="margin: 0; font-weight: bold;">Selected file:</p>
              <p id="file-name" style="margin: 5px 0; word-break: break-all;"></p>
              <p id="file-size" style="margin: 0; color: #666;"></p>
            </div>
            <input type="file" id="file-input" style="display: none;" ${popupData.accept ? `accept="${popupData.accept}"` : ''}>
            <label for="file-input" style="display: inline-block; padding: 10px 20px; background-color: #49a38c; color: white; border-radius: 4px; cursor: pointer;">
              Browse Files
            </label>
            <p style="margin-top: 10px; color: #666;">or drag and drop file here</p>
          </div>
          
          <div id="file-validation-error" style="color: #f44336; margin-top: 5px; display: none;"></div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
          <button id="cancel-upload" style="padding: 10px 20px; background-color: #f5f5f5; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
          <button id="submit-upload" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Upload</button>
        </div>
      `;

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      // Initialize the file upload functionality
      setTimeout(() => {
        const fileInput = document.getElementById('file-input');
        const filePreview = document.getElementById('file-preview');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const validationError = document.getElementById('file-validation-error');
        const cancelButton = document.getElementById('cancel-upload');
        const submitButton = document.getElementById('submit-upload');
        const dropZone = document.getElementById('drop-zone');

        let selectedFile = null;

        // Format file size
        const formatFileSize = (bytes) => {
          if (bytes === 0) return '0 Bytes';
          const k = 1024;
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        // Validate file
        const validateFile = (file) => {
          // Check file type if accept attribute is provided
          if (popupData.accept) {
            const acceptedTypes = popupData.accept.split(',').map(type => type.trim());
            const fileType = file.type;
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

            const isValidType = acceptedTypes.some(type => {
              if (type.startsWith('.')) {
                // Extension check
                return fileExtension === type.toLowerCase();
              } else if (type.includes('/*')) {
                // MIME type group check (e.g., image/*)
                const typeGroup = type.split('/')[0];
                return fileType.startsWith(typeGroup + '/');
              } else {
                // Exact MIME type check
                return fileType === type;
              }
            });

            if (!isValidType) {
              validationError.textContent = `Invalid file type. Accepted types: ${popupData.accept}`;
              validationError.style.display = 'block';
              return false;
            }
          }

          // Check file size if maxSize is provided
          if (popupData.maxSize && file.size > popupData.maxSize) {
            validationError.textContent = `File is too large. Maximum size: ${formatFileSize(popupData.maxSize)}`;
            validationError.style.display = 'block';
            return false;
          }

          validationError.style.display = 'none';
          return true;
        };

        // Update file preview
        const updateFilePreview = () => {
          if (selectedFile) {
            filePreview.style.display = 'block';
            fileName.textContent = selectedFile.name;
            fileSize.textContent = formatFileSize(selectedFile.size);
          } else {
            filePreview.style.display = 'none';
          }
        };

        // Handle file selection
        fileInput.addEventListener('change', (event) => {
          validationError.style.display = 'none';
          selectedFile = null;

          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            if (validateFile(file)) {
              selectedFile = file;
            } else {
              event.target.value = '';
            }
          }

          updateFilePreview();
        });

        // Handle drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
          }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
          dropZone.addEventListener(eventName, () => {
            dropZone.style.borderColor = '#4CAF50';
            dropZone.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
          }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
          dropZone.addEventListener(eventName, () => {
            dropZone.style.borderColor = '#49a38c';
            dropZone.style.backgroundColor = 'white';
          }, false);
        });

        dropZone.addEventListener('drop', (e) => {
          validationError.style.display = 'none';
          selectedFile = null;

          if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
              selectedFile = file;

              // Update the file input to reflect the dropped file
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              fileInput.files = dataTransfer.files;
            }
          }

          updateFilePreview();
        }, false);

        // Cancel button event listener
        cancelButton.addEventListener('click', () => {
          document.body.removeChild(modal);
        });

        // Submit button event listener
        submitButton.addEventListener('click', async () => {
          if (!selectedFile) {
            validationError.textContent = 'Please select a file to upload.';
            validationError.style.display = 'block';
            return;
          }

          try {
            // Show loading state
            submitButton.disabled = false;
            //submitButton.textContent = 'Uploading...';

            // If we have an active room, publish the upload result
            if (activeKittInstance && activeKittInstance.room && activeKittInstance.room.localParticipant) {
              console.log('Uploading file and sending metadata through LiveKit RPC');

              // Create FormData to send file
              const formData = new FormData();

              // Add the file to the FormData
              formData.append('pdfFile', selectedFile);
              formData.append('formType', popupData.formType);
              formData.append('formName', popupData.formName);

              try {
                // Wait for the agent participant to join
                // We need to find an agent participant in the room
                const findAgentParticipant = async (maxAttempts = 20, delayMs = 1000) => {
                  let attempts = 0;

                  while (attempts < maxAttempts) {
                    // Check if we have remote participants
                    if (activeKittInstance.room.remoteParticipants.size > 0) {
                      // Find the agent participant
                      for (const [identity, participant] of activeKittInstance.room.remoteParticipants) {
                        console.log('Found remote participant:', identity);
                        if (identity.includes('agent') || identity.includes('Assistant')) {
                          console.log('Found agent participant:', identity);
                          return identity; // Return the identity string, not the participant object
                        }
                      }
                    }

                    console.log(`No agent participant found yet. Attempt ${attempts + 1}/${maxAttempts}`);
                    attempts++;

                    // Wait before trying again
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                  }

                  throw new Error('Could not find agent participant after multiple attempts');
                };

                // Find the agent participant identity
                const agentIdentity = await findAgentParticipant();

                if (!agentIdentity) {
                  throw new Error('No agent participant found in the room');
                }

                console.log('Sending RPC to agent:', agentIdentity);
                try {
                  const response = await fetch(`${BASE_URL}/assistant/form-pdf-save`, {
                    method: "POST",
                    headers: {
                      "authorization": `Bearer ${popupData.accessToken}`,
                      "accesstoken": `${popupData.accessToken}`
                      // Note: Don't set Content-Type header when using FormData
                    },
                    body: formData
                  });
                  const data = await response.json();
                  console.log(data.data)

                  const responsew = await activeKittInstance.room.localParticipant.performRpc({
                    destinationIdentity: agentIdentity,
                    method: 'onFormUpload',
                    payload: JSON.stringify({
                      data: data.data

                    }),
                    responseTimeout: 500000
                  })


                  console.log('RPC response:', responsew);
                } catch (error) {
                  console.error('RPC call failed:', error);
                }

                document.body.removeChild(modal);

                return true; // The response is already parsed by the LiveKit client
              } catch (error) {
                console.error('Error showing signature pad:', error);
                throw error;
              }
              document.body.removeChild(modal);
              // Close the modal after successful upload

            }
          } catch (error) {
            console.error('Error uploading file:', error);

            // Show error message
            validationError.textContent = 'An error occurred while uploading the file. Please try again.';
            validationError.style.display = 'block';

            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = 'Upload';
          }
        });
      }, 100); // Small delay to ensure DOM is updated

      return { success: true };
    } catch (error) {
      console.error("Error showing file upload popup:", error);
      return { success: false, error: error.message };
    }
  }
  showSignaturePad(data) {
    try {
      const popupData = JSON.parse(data.payload);
      console.log("Showing signature popup:", popupData);
      const signatureData = ref({});

      // Create modal container
      const modal = document.createElement("div");
      modal.id = "signature-modal";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.zIndex = "1000";

      // Create modal content
      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "#fff";
      modalContent.style.padding = "30px";
      modalContent.style.borderRadius = "8px";
      modalContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      modalContent.style.width = "500px";
      modalContent.style.maxWidth = "90%";
      modalContent.style.maxHeight = "90vh";
      modalContent.style.overflowY = "auto";

      // Create signature pad container
      modalContent.innerHTML = `
      <h2 style="margin-top: 0; color: #333; text-align: center;">${popupData.title || "Please Sign Below"}</h2>
      <p style="margin-bottom: 20px; text-align: center;">${popupData.message || "Draw your signature in the box below."}</p>
        <div class="signature-pad">
          <div class="canvas-wrapper" style="position: relative; width: 100%; height: 200px; border: 1px dashed #49a38c; border-radius: 4px; background-color: white; margin-bottom: 16px;">
            <canvas style="width: 100%; height: 100%;"></canvas>
            <input type="hidden" class="signature-hidden-input" />
          </div>
          <div class="signature-pad--footer">
            <div class="signature-pad--actions" style="display: flex; justify-content: space-between; margin-top: 10px;">
              <div class="column">
                <button type="button" class="button clear" data-action="clear" style="background-color: #f44336; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Clear</button>
              </div>
              <div class="column">
                <button type="button" class="button save" data-action="save" style="background-color: #4CAF50; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Save</button>
              </div>
            </div>
          </div>
        </div>
      `;

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      // Initialize the signature pad after the DOM is updated
      setTimeout(() => {
        const canvas = modal.querySelector('canvas');
        const clearButton = modal.querySelector('button[data-action="clear"]');
        const saveButton = modal.querySelector('button[data-action="save"]');
        const inputField = modal.querySelector('input.signature-hidden-input');

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Initialize SignaturePad
        const signaturePad = new SignaturePad(canvas, {
          backgroundColor: 'rgba(255, 255, 255, 0)',
          penColor: 'rgb(0, 0, 0)',
          throttle: 16
        });

        // Set up metadata
        const signatureMetadata = {
          timestamp: null,
          coordinates: [],
          ipAddress: null,
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          imageData: null,
          currentUser: popupData?.currentUser || { fullName: 'Guest User', time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone }
        };

        // Get IP address
        fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(data => {
            signatureMetadata.ipAddress = data.ip;
          })
          .catch(error => {
            console.error('Failed to get IP:', error);
            signatureMetadata.ipAddress = 'unknown';
          });

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

        // Event listener for when a stroke ends
        signaturePad.addEventListener('endStroke', () => {
          if (inputField) {
            inputField.value = signaturePad.toDataURL();
          }

          signatureMetadata.imageData = signaturePad.toDataURL();
          signatureData.value = {
            signature: {
              imageData: signatureMetadata.imageData,
              metadata: signatureMetadata,
              required: false
            }
          };

          console.log('Signature Data Updated:', signatureData.value);
        });

        // Clear button event listener
        clearButton.addEventListener('click', () => {
          signaturePad.clear();
          if (inputField) {
            inputField.value = '';
          }

          signatureData.value = {
            signature: {
              imageData: null,
              metadata: null,
              required: true
            }
          };
        });

        // Save button event listener
        saveButton.addEventListener('click', async () => {
          if (signaturePad.isEmpty()) {
            alert('Please provide a signature first.');
            return;
          }

          const signatureDataUrl = signaturePad.toDataURL('image/png');
          console.log('Signature saved:', signatureDataUrl);

          // If we have an active room, publish the signature data
          if (activeKittInstance && activeKittInstance.room && activeKittInstance.room.localParticipant) {
            try {
              let dataSig = signatureData.value
              const response = await fetch(`${BASE_URL}/assistant/save-signature`, {
                method: "POST",
                headers: {
                  "authorization": `Bearer ${popupData.accessToken}`,
                  "accesstoken": `${popupData.accessToken}`,
                  "content-type": "application/json",
                  "accept": "application/json"
                },
                body: JSON.stringify(signatureData.value)
              });
              const data = await response.json();
              // console.log("Signature data sent to agent:", result);

              // Close the modal after saving
              document.body.removeChild(modal);
            } catch (error) {
              console.error("Error sending signature data:", error);
              alert("Failed to save signature. Please try again.");
            }
            // activeKittInstance.room.localParticipant.publishData(
            //   JSON.stringify({
            //     action: 'signature_completed',
            //     signatureData: signatureDataUrl,
            //     metadata: signatureMetadata
            //   }),
            //   { reliable: true }
            // );
          }

          // Remove the modal
          document.body.removeChild(modal);
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (event) => {
          if (event.target === modal) {
            document.body.removeChild(modal);
          }
        });

      }, 100); // Small delay to ensure DOM is updated

      return { success: true };
    } catch (error) {
      console.error("Error showing signature pad:", error);
      return { success: false, error: error.message };
    }
  }
  closeRegistrationPopup() {
    try {
      const modal = document.getElementById("registration-confirmation-modal");
      if (modal) {
        // Add fade-out animation
        modal.style.opacity = "1";
        modal.style.transition = "opacity 0.3s ease";

        // Start fade out
        modal.style.opacity = "0";

        // Remove after animation completes
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        }, 300);
      }
      return { success: true };
    } catch (error) {
      console.error("Error closing registration popup:", error);
      return { success: false, error: error.message };
    }
  }
  saveSignatureData(data) {
    try {
      const signatureData = JSON.parse(data);
      console.log("Received signature data:", signatureData);

      if (!signatureData.dataSig || !signatureData.dataSig.signature) {
        throw new Error("Invalid signature data format");
      }

      // Extract the signature data and metadata
      const { imageData, metadata } = signatureData.dataSig.signature;





      return {
        success: true,
        message: "Signature data saved successfully",
        data: {
          timestamp: new Date().toISOString(),
          status: "completed"
        }
      };
    } catch (error) {
      console.error("Error saving signature data:", error);



      return { success: false, error: error.message };
    }
  }
  showNotification(data) {
    data = JSON.parse(data.payload);
    console.log("Showing notification:", data);

    // Create notification element
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.padding = "15px 20px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    notification.style.zIndex = "1001";
    notification.style.minWidth = "300px";
    notification.style.maxWidth = "400px";
    notification.style.display = "flex";
    notification.style.alignItems = "flex-start";
    notification.style.gap = "10px";

    // Set colors based on notification type
    switch (data.type) {
      case "success":
        notification.style.backgroundColor = "#4CAF50";
        notification.style.color = "white";
        notification.style.borderLeft = "5px solid #2E7D32";
        break;
      case "error":
        notification.style.backgroundColor = "#F44336";
        notification.style.color = "white";
        notification.style.borderLeft = "5px solid #B71C1C";
        break;
      case "warning":
        notification.style.backgroundColor = "#FF9800";
        notification.style.color = "white";
        notification.style.borderLeft = "5px solid #E65100";
        break;
      case "info":
      default:
        notification.style.backgroundColor = "#2196F3";
        notification.style.color = "white";
        notification.style.borderLeft = "5px solid #0D47A1";
        break;
    }

    // Create content
    notification.innerHTML = `
      <div style="flex-grow: 1;">
        <h3 style="margin: 0 0 5px 0; font-size: 16px;">${data.title || "Notification"
      }</h3>
        <p style="margin: 0; font-size: 14px;">${data.message || ""}</p>
      </div>
      <button id="closeNotification" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; line-height: 1;">×</button>
    `;

    document.body.appendChild(notification);

    // Auto-dismiss after 5 seconds
    const dismissTimeout = setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, data.duration || 5000);

    // Close button handler
    document
      .getElementById("closeNotification")
      .addEventListener("click", () => {
        clearTimeout(dismissTimeout);
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      });

    return true;
  }
  registerRPC() {

    this.room.localParticipant?.registerRpcMethod(
      "showJiraTicketInfo",
      this.showJiraTicketInfo.bind(this)
    );

    this.room.localParticipant?.registerRpcMethod(
      "disconnect",
      this.disconnect.bind(this)
    );
    this.room.localParticipant?.registerRpcMethod(
      "showRegistrationPopup",
      this.showRegistrationPopup.bind(this)
    );
    this.room.localParticipant?.registerRpcMethod(
      "closeRegistrationPopup",
      this.closeRegistrationPopup.bind(this)
    );
    this.room.localParticipant?.registerRpcMethod(
      "showNotification",
      this.showNotification.bind(this)
    );
    this.room.localParticipant?.registerRpcMethod(
      "openDashbord",
      this.openDashbord.bind(this)
    );
    this.room.localParticipant?.registerRpcMethod(
      "showSignaturePad",
      this.showSignaturePad.bind(this)
    );
    this.room.localParticipant?.registerRpcMethod(
      "saveSignatureData",
      this.saveSignatureData.bind(this)
    );
    this.room.localParticipant?.registerRpcMethod(
      "showFormUpload",
      this.showFormUpload.bind(this)
    );

  }


}


let activeKittInstance = null;
export function setRouterInstances(router, route) {
  routerInstance = router;
  routeInstance = route;
}


export function initAIAssistant(buttonElement) {
  // Create audio container for the LiveKit connection
  const audioContainer = document.createElement("div");
  audioContainer.style.display = "none";
  document.body.appendChild(audioContainer);

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes scaleAnimation {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }
    .animate-scale {
      animation: scaleAnimation 0.6s infinite;
    }
  `;
  document.head.appendChild(style);

  const baseUrl = BASE_URL + "/emr/connection-details";

  // If there's already an active instance, don't create a new one
  if (activeKittInstance) {
    console.log("AI Assistant already active");
    return { disconnect: disconnectKitt };
  }

  console.log("Initializing AI Assistant");

  // Start the connection immediately instead of waiting for a click
  startConnection();

  async function startConnection() {
    buttonElement.classList.add("animate-scale");

    try {

      function generateRandomRoomName() {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const length = 5; // Change the length of the room name as needed
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return result;
      }
      let randomRoom = generateRandomRoomName()
      let randomPartipitant = generateRandomRoomName()
      const response = await fetch(`${baseUrl}?roomName=provider_onboarding_room_${randomRoom}&participantName=provider_onboarding_particpant_${randomPartipitant}&type=provider_register_agent`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      console.log(data);

      // Use the generated random room name

      // const token = await Kitt.generateToken(
      //   "APIV3tBUvYHuBCr", // LiveKit API key
      //   "NBDeHA1BAh2XefuDkqurGseU9D7zn1kHneah9A3h0naD", // LiveKit API secret
      //   roomName, // Room name Provider_Onboarding_Assistant_random
      //   roomName, // Participant identity Provider_Onboarding_particpant_random
      //   { tagline: "provider-register" } // Optional metadata
      // );


      console.log(data.participantToken);
      activeKittInstance = new Kitt("", data.serverUrl, data.participantToken);
      const room = await activeKittInstance.joinRoom(audioContainer, () => {
        console.log("Disconnected from room");
        buttonElement.classList.remove("animate-scale");
        activeKittInstance = null;
      });


      console.log("AI Assistant connected");



      return true;
    } catch (error) {
      console.error("Error connecting to AI Assistant:", error);
      buttonElement.classList.remove("animate-scale");
      activeKittInstance = null;
      return false;
    }
  }

  return { disconnect: disconnectKitt };
}

/**
 * Disconnects the active Kitt instance if one exists
 * @returns {boolean} True if disconnection was successful, false if no active instance
 */
export function disconnectKitt() {
  if (activeKittInstance) {
    activeKittInstance.disconnect();
    activeKittInstance = null;
    return true;
  }
  console.warn("No active Kitt instance to disconnect");
  return false;
}

// Export the Kitt class for use as a module
export default Kitt;
