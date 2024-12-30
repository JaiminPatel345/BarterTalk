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
  const [isConnected, setIsConnected] = useState(false);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const connectionRef = useRef(null);
  const navigate = useNavigate();
  const { myPeerId, anotherPeerId } = UseVideoCall();

  // Initialize peer connection
  useEffect(() => {
    if (!myPeerId || !anotherPeerId) return;

    const initPeer = async () => {
      try {
        // Create new peer instance
        const peer = new Peer(myPeerId, {
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
            ],
          },
        });

        peerRef.current = peer;

        // Handle peer open event
        peer.on("open", (id) => {
          console.log("My peer ID is:", id);
          startCall();
        });

        // Handle incoming calls
        peer.on("call", handleIncomingCall);

        // Handle peer errors
        peer.on("error", (error) => {
          console.error("Peer connection error:", error);
          setIsConnected(false);
        });
      } catch (error) {
        console.error("Failed to initialize peer:", error);
      }
    };

    initPeer();

    // Cleanup
    return () => {
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (myVideoStream) {
        myVideoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [myPeerId, anotherPeerId]);

  // Get user media stream
  const getMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: 16 / 9,
        },
      });
      setMyVideoStream(stream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      setPermissionDenied(false);
      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      if (err.name === "NotAllowedError") {
        setPermissionDenied(true);
      }
      throw err;
    }
  };

  // Handle incoming calls
  const handleIncomingCall = async (call) => {
    try {
      const stream = await getMediaStream();
      call.answer(stream);

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
        }
      });

      connectionRef.current = call;
    } catch (error) {
      console.error("Error handling incoming call:", error);
    }
  };

  // Start outgoing call
  const startCall = async () => {
    if (!peerRef.current || !anotherPeerId) return;

    try {
      const stream = await getMediaStream();
      const call = peerRef.current.call(anotherPeerId, stream);

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
        }
      });

      connectionRef.current = call;
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  // Retry connection
  const retryConnection = () => {
    if (connectionRef.current) {
      connectionRef.current.close();
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    startCall();
  };

  const toggleAudio = () => {
    if (myVideoStream) {
      const audioTrack = myVideoStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (myVideoStream) {
      const videoTrack = myVideoStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!isCameraOff);
      }
    }
  };

  const handleEndCall = () => {
    if (myVideoStream) {
      myVideoStream.getTracks().forEach((track) => track.stop());
    }
    if (connectionRef.current) {
      connectionRef.current.close();
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    navigate("/");
  };

  const NoPermission = () => (
    <div className="fixed flex items-center justify-center h-screen w-screen z-50 backdrop-blur-lg">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-4 text-center">
        <h2 className="text-xl text-white font-semibold mb-4">
          Camera and Microphone Access Required
        </h2>
        <p className="text-red-500 mb-6">
          Please allow access to your camera and microphone in your browser
          settings to use the video call feature.
        </p>
        <div className="space-y-4">
          <button
            onClick={retryConnection}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen w-full backdrop-blur-md">
      {permissionDenied && <NoPermission />}
      <div className="relative w-full h-full md:h-auto md:aspect-video md:max-w-6xl md:mx-4 lg:mx-auto">
        <div className="relative w-full h-screen md:h-full bg-black md:rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            autoPlay
          />

          <div className="absolute top-4 right-4 w-32 sm:w-40 md:w-48 aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
            <video
              ref={myVideoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
          </div>

          <div className="fixed md:absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-800 bg-opacity-60 rounded-full backdrop-blur-sm shadow-lg">
            <button
              onClick={toggleAudio}
              className={`p-2 sm:p-4 rounded-full ${
                isMuted ? "bg-red-500" : "bg-gray-700"
              } hover:bg-opacity-80 transition-all active:scale-95`}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-2 sm:p-4 rounded-full ${
                isCameraOff ? "bg-red-500" : "bg-gray-700"
              } hover:bg-opacity-80 transition-all active:scale-95`}
              aria-label={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
            >
              {isCameraOff ? (
                <CameraOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </button>

            <button
              className="p-2 sm:p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all active:scale-95"
              onClick={handleEndCall}
              aria-label="End Call"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
