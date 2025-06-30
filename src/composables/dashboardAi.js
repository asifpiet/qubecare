
import { Room, RoomEvent, Track } from "livekit-client";
import { AccessToken } from "livekit-server-sdk";
import { BASE_URL } from '../utils/constants';

import SignaturePad from 'signature_pad';
let routerInstance = null;
let routeInstance = null;
const signaturePadRef = ref(null);
const signatureData = ref(null);
const currentUser = ref(null);

const signatureInputData = ref(null);
const authToken = getCurrentAccessToken();
class DashboardAi {
  constructor(tagline, endpointUrl, token) {
    this.tagline = tagline;
    this.endpointUrl = endpointUrl;
    this.token = token;
    this.authToken = authToken;
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
  openDataEntryForm(data) {
    // Parse the incoming data
    const payload = JSON.parse(data.payload);
    const formType = payload.form_type;
    const initialData = payload.initial_data || {};

    // Create a promise to handle the asynchronous form submission
    return new Promise((resolve, reject) => {
      try {
        // Different handling based on form type
        if (formType === "practitioner") {
          // Open the practitioner form modal
          this.showPractitionerForm(initialData, (formData) => {
            // This callback will be called when the form is submitted
            if (formData) {
              // Return the form data to the agent
              resolve({ formData });
            } else {
              // User cancelled
              resolve({ cancelled: true });
            }
          });
        } else if (formType === "availability") {
          // Open the availability form modal
          this.showAvailabilityForm(initialData, (formData) => {
            if (formData) {
              resolve({ formData });
            } else {
              resolve({ cancelled: true });
            }
          });
        } else {
          // Generic form handling for other form types
          this.showGenericForm(formType, initialData, (formData) => {
            if (formData) {
              resolve({ formData });
            } else {
              resolve({ cancelled: true });
            }
          });
        }
      } catch (error) {
        console.error("Error opening data entry form:", error);
        reject(error);
      }
    });
  }

  // Helper method to show the practitioner form
  showPractitionerForm(initialData, callback) {
    // Create modal or form element
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    // Create form content with pre-filled data
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Add New Practitioner</h2>
        <form id="practitionerForm">
          <div class="form-group">
            <label for="firstName">First Name*</label>
            <input type="text" id="firstName" name="firstName" value="${initialData.firstName || ''}" required>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name*</label>
            <input type="text" id="lastName" name="lastName" value="${initialData.lastName || ''}" required>
          </div>
          <div class="form-group">
            <label for="emailAddress">Email Address*</label>
            <input type="email" id="emailAddress" name="emailAddress" value="${initialData.emailAddress || ''}" required>
          </div>
          <div class="form-group">
            <label for="password">Password*</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div class="form-group">
            <label for="gender">Gender*</label>
            <select id="gender" name="gender" required>
              <option value="">Select Gender</option>
              <option value="Male" ${initialData.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Female" ${initialData.gender === 'Female' ? 'selected' : ''}>Female</option>
            </select>
          </div>
          <div class="form-group">
            <label for="dateOfBirth">Date of Birth</label>
            <input type="date" id="dateOfBirth" name="dateOfBirth" value="${initialData.dateOfBirth || ''}">
          </div>
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value="${initialData.phoneNumber || ''}">
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Save</button>
            <button type="button" class="btn-secondary" id="cancelBtn">Cancel</button>
          </div>
        </form>
      </div>
    `;

    // Add the modal to the DOM
    document.body.appendChild(modal);

    // Add event listeners
    const form = modal.querySelector('#practitionerForm');
    const cancelBtn = modal.querySelector('#cancelBtn');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect form data
      const formData = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        emailAddress: form.emailAddress.value,
        password: form.password.value,
        gender: form.gender.value,
        dateOfBirth: form.dateOfBirth.value || null,
        phoneNumber: form.phoneNumber.value || null
      };

      // Remove the modal
      document.body.removeChild(modal);

      // Call the callback with the form data
      callback(formData);
    });

    cancelBtn.addEventListener('click', () => {
      // Remove the modal
      document.body.removeChild(modal);

      // Call the callback with null to indicate cancellation
      callback(null);
    });
  }

  // Helper method to show the availability form
  showAvailabilityForm(initialData, callback) {
    // Similar implementation for availability form
    // ...
  }

  // Helper method for generic forms
  showGenericForm(formType, initialData, callback) {
    // Generic form implementation
    // ...
  }

  async startCall(data) {
    try {
      const userData = JSON.parse(data.payload);
      console.log("Showing user call details:", userData);

      // Remove any existing popup first
      const existingModal = document.getElementById("registration-confirmation-modal");
      if (existingModal) {
        existingModal.style.opacity = "0";
        setTimeout(() => {
          if (existingModal.parentNode) {
            existingModal.parentNode.removeChild(existingModal);
          }
        }, 300);
      }

      await nextTick(() => {
        const redirectPath = routeInstance && routeInstance.query.to
          ? String(routeInstance.query.to)
          : `/provider/call/${userData.patient_id}/${userData.appointment_id}`;

        // Open in a new tab and return success
        window.open(redirectPath, '_blank');
      });

      return { success: true };
    } catch (error) {
      console.error("Error starting call:", error);
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
      "startCall",
      this.startCall.bind(this)
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
      "openDataEntryForm",
      this.openDataEntryForm.bind(this)
    );

  }


}


let activeKittInstance = null;
export function setRouterInstancesDashboard(router, route) {
  routerInstance = router;
  routeInstance = route;
}


export function initAIAssistantDashBoard(buttonElement, user) {
  currentUser.value = user
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
    return { disconnect: disconnectKittDashBoard };
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


      const response = await fetch(`${baseUrl}?roomName=provider_dashBoard_room_${randomRoom}_${currentUser.value.id}&participantName=provider_dashBoard_particpant_${randomPartipitant}&type=provider_dashBoard_agent`, {
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



      activeKittInstance = new DashboardAi("", data.serverUrl, data.participantToken);


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

  return { disconnect: disconnectKittDashBoard };
}

/**
 * Disconnects the active Kitt instance if one exists
 * @returns {boolean} True if disconnection was successful, false if no active instance
 */
export function disconnectKittDashBoard() {
  if (activeKittInstance) {
    activeKittInstance.disconnect();
    activeKittInstance = null;
    return true;
  }
  console.warn("No active Kitt instance to disconnect");
  return false;
}

// Export the Kitt class for use as a module
export default DashboardAi;
