import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UseVideoCall from "../stores/useVideoCall.js";
import { Peer } from "peerjs";

const VideoCall = () => {
  const [myVideoStream, setMyVideoStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [deviceNotFound, setDeviceNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [remoteAudioEnabled, setRemoteAudioEnabled] = useState(true);
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const connectionRef = useRef(null);
  const permissionCheckTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const { myPeerId, anotherPeerId } = UseVideoCall();

  useEffect(() => {
    if (!myPeerId || !anotherPeerId) {
      return;
    }

    const initPeer = async () => {
      const peer = new Peer(myPeerId, {
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      });
      peerRef.current = peer;

      peer.on("open", () => {
        setPermissionRequested(true);
        startCall();
      });
      peer.on("call", handleIncomingCall);
      peer.on("error", handleError);
      peer.on("close", () => handleEndCall());
    };

    initPeer();

    return () => {
      handleCleanup();
      if (permissionCheckTimeoutRef.current) {
        clearTimeout(permissionCheckTimeoutRef.current);
      }
    };
  }, [myPeerId, anotherPeerId]);

  const handleCleanup = () => {
    if (connectionRef.current) {
      connectionRef.current.close();
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (myVideoStream) {
      myVideoStream.getTracks().forEach((track) => track.stop());
    }
    setIsConnected(false);
  };

  const handleError = (error) => {
    console.log("Peer error:", error);
  };

  // Check if devices are available before requesting permissions
  const checkDevicesAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoInput = devices.some(
        (device) => device.kind === "videoinput",
      );
      const hasAudioInput = devices.some(
        (device) => device.kind === "audioinput",
      );

      if (!hasVideoInput && !hasAudioInput) {
        setDeviceNotFound(true);
        setErrorMessage("No camera or microphone found on your device.");
        return false;
      } else if (!hasVideoInput) {
        setDeviceNotFound(true);
        setErrorMessage("No camera found on your device.");
        return false;
      } else if (!hasAudioInput) {
        setDeviceNotFound(true);
        setErrorMessage("No microphone found on your device.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking devices:", error);
      setDeviceNotFound(true);
      setErrorMessage(
        "Unable to check for available devices. Please ensure your browser has permission to access media devices.",
      );
      return false;
    }
  };

  const getMediaStream = async () => {
    try {
      // First check if devices are available
      const devicesAvailable = await checkDevicesAvailability();
      if (!devicesAvailable) {
        throw new Error("Required devices not available");
      }

      // Try to get both audio and video
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setMyVideoStream(stream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      setPermissionDenied(false);
      setDeviceNotFound(false);
      setErrorMessage("");
      setPermissionRequested(true);
      return stream;
    } catch (error) {
      console.error("Media stream error:", error);

      // Handle specific errors
      if (error.name === "NotFoundError") {
        setDeviceNotFound(true);
        setErrorMessage(
          "Camera or microphone not found. Please check your device connections.",
        );
      } else if (error.name === "NotAllowedError") {
        setPermissionDenied(true);
        setDeviceNotFound(false);
        setErrorMessage("Permission to use camera and microphone was denied.");
      } else if (error.name === "AbortError") {
        setErrorMessage(
          "Hardware error occurred with your camera or microphone.",
        );
        setDeviceNotFound(true);
      } else {
        setPermissionDenied(true);
        setErrorMessage("Error accessing media devices: " + error.message);
      }

      setPermissionRequested(true);
      throw error;
    }
  };

  // Try with audio only if video+audio fails
  const tryAudioOnlyStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      setMyVideoStream(stream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      setPermissionDenied(false);
      setDeviceNotFound(false);
      setIsCameraOff(true); // Set camera off since we're audio only
      setErrorMessage("Video unavailable. Proceeding with audio only.");
      setPermissionRequested(true);
      return stream;
    } catch (error) {
      console.error("Audio-only stream error:", error);
      throw error;
    }
  };

  const requestPermissions = async () => {
    setPermissionRequested(true);
    setErrorMessage("");

    try {
      // First try with both audio and video
      await getMediaStream();

      // If stream obtained successfully, proceed with call
      if (peerRef.current && peerRef.current.id === myPeerId) {
        startCall();
      } else {
        // Re-initialize peer connection
        initPeer();
      }
    } catch (error) {
      // If failed with both, try audio only
      if (error.name === "NotFoundError") {
        try {
          await tryAudioOnlyStream();

          // If audio-only stream successful, proceed with call
          if (peerRef.current && peerRef.current.id === myPeerId) {
            startCall();
          } else {
            // Re-initialize peer connection
            initPeer();
          }
        } catch (audioError) {
          console.error("Failed to get audio-only stream:", audioError);
          // Both attempts failed, update UI accordingly
        }
      }
    }
  };

  const initPeer = async () => {
    const peer = new Peer(myPeerId, {
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });
    peerRef.current = peer;

    peer.on("open", startCall);
    peer.on("call", handleIncomingCall);
    peer.on("error", handleError);
    peer.on("close", () => handleEndCall());
  };

  const handleIncomingCall = async (call) => {
    try {
      let stream;
      try {
        stream = await getMediaStream();
      } catch (error) {
        if (error.name === "NotFoundError") {
          // Try with audio only if video fails
          stream = await tryAudioOnlyStream();
        } else {
          throw error;
        }
      }

      // Set initial track states before answering
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !isMuted;
      }

      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !isCameraOff;
      } else {
        setIsCameraOff(true);
      }

      call.answer(stream);

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
          setPermissionDenied(false);
          setDeviceNotFound(false);

          remoteStream.getAudioTracks().forEach((track) => {
            track.onmuted = () => setRemoteAudioEnabled(false);
            track.onunmuted = () => setRemoteAudioEnabled(true);
            setRemoteAudioEnabled(track.enabled);
          });

          remoteStream.getVideoTracks().forEach((track) => {
            track.onmuted = () => setRemoteVideoEnabled(false);
            track.onunmuted = () => setRemoteVideoEnabled(true);
            setRemoteVideoEnabled(track.enabled);
          });
        }
      });

      connectionRef.current = call;

      call.on("close", () => {
        setIsConnected(false);
        navigate("/");
      });
    } catch (error) {
      console.error("Error handling incoming call:", error);
      setPermissionDenied(true);
    }
  };

  const startCall = async () => {
    try {
      let stream;
      try {
        stream = await getMediaStream();
      } catch (error) {
        if (error.name === "NotFoundError") {
          // Try with audio only if video fails
          stream = await tryAudioOnlyStream();
        } else {
          throw error;
        }
      }

      // Set initial track states before calling
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !isMuted;
      }

      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !isCameraOff;
      } else {
        setIsCameraOff(true);
      }

      const call = peerRef.current.call(anotherPeerId, stream);

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
          setPermissionDenied(false);
          setDeviceNotFound(false);

          remoteStream.getAudioTracks().forEach((track) => {
            track.onmuted = () => setRemoteAudioEnabled(false);
            track.onunmuted = () => setRemoteAudioEnabled(true);
            setRemoteAudioEnabled(track.enabled);
          });

          remoteStream.getVideoTracks().forEach((track) => {
            track.onmuted = () => setRemoteVideoEnabled(false);
            track.onunmuted = () => setRemoteVideoEnabled(true);
            setRemoteVideoEnabled(track.enabled);
          });
        }
      });

      connectionRef.current = call;

      call.on("close", () => {
        setIsConnected(false);
        navigate("/");
      });
    } catch (error) {
      console.error("Error starting call:", error);
      setPermissionDenied(true);
    }
  };

  const toggleAudio = () => {
    const audioTrack = myVideoStream?.getAudioTracks()[0];
    if (audioTrack) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioTrack.enabled = !newMutedState;
    }
  };

  const toggleVideo = () => {
    const videoTrack = myVideoStream?.getVideoTracks()[0];
    if (videoTrack) {
      const newVideoState = !isCameraOff;
      setIsCameraOff(newVideoState);
      videoTrack.enabled = !newVideoState;
    }
  };

  const handleEndCall = () => {
    handleCleanup();
    navigate("/");
  };

  const AccessError = () => (
    <div className="fixed flex items-center justify-center h-screen w-screen z-50 backdrop-blur-lg">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-4 text-center">
        <h2 className="text-xl text-white font-semibold mb-4">
          {deviceNotFound ? "Device Not Found" : "Permission Required"}
        </h2>
        <p className="text-red-500 mb-6">
          {errorMessage ||
            "Please allow access to your camera and microphone to use the video call feature."}
        </p>
        <button
          onClick={requestPermissions}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
        >
          {deviceNotFound ? "Try Again" : "Request Access"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen w-full backdrop-blur-md">
      {(permissionDenied || deviceNotFound) && !isConnected && <AccessError />}
      <div className="relative w-full h-full md:h-auto md:aspect-video md:max-w-6xl md:mx-4 lg:mx-auto">
        <div className="relative w-full h-screen md:h-full bg-black md:rounded-lg overflow-hidden">
          {/* Main video (remote) */}
          <video
            ref={remoteVideoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            autoPlay
          />

          {/* Remote user status icons */}
          <div className="absolute top-4 left-4 flex gap-2">
            {!remoteAudioEnabled && (
              <div className="bg-gray-800 p-2 rounded-full">
                <MicOff className="w-5 h-5 text-white" />
              </div>
            )}
            {!remoteVideoEnabled && (
              <div className="bg-gray-800 p-2 rounded-full">
                <CameraOff className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* Picture-in-picture video (local) */}
          <div className="absolute top-4 right-4 w-32 sm:w-40 md:w-48 aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
            <video
              ref={myVideoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            {/* Show camera off indicator on PiP when camera is off */}
            {isCameraOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                <CameraOff className="w-8 h-8 text-white opacity-70" />
              </div>
            )}
          </div>

          {/* Control buttons */}
          <div className="fixed md:absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-800 bg-opacity-60 rounded-full backdrop-blur-sm shadow-lg">
            <button
              onClick={toggleAudio}
              className="p-3 rounded-full hover:bg-gray-700 transition-colors"
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-red-500" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={toggleVideo}
              className="p-3 rounded-full hover:bg-gray-700 transition-colors"
            >
              {isCameraOff ? (
                <CameraOff className="w-6 h-6 text-red-500" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Connection status message */}
          {permissionRequested &&
            !isConnected &&
            !permissionDenied &&
            !deviceNotFound && (
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-70 px-4 py-2 rounded-full text-white text-sm">
                Connecting...
              </div>
            )}

          {/* Audio-only mode indicator */}
          {myVideoStream && myVideoStream.getVideoTracks().length === 0 && (
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-blue-600 bg-opacity-80 px-4 py-2 rounded-full text-white text-sm">
              Audio-only mode
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
