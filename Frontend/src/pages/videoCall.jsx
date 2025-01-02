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
    if (!myPeerId || !anotherPeerId) return;

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

      // Set a timeout to check if connection is established
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
    if (connectionRef.current) connectionRef.current.close();
    if (peerRef.current) peerRef.current.destroy();
    if (myVideoStream) {
      myVideoStream.getTracks().forEach((track) => track.stop());
    }
    setIsConnected(false);
  };

  const handleError = (error) => {
    console.log("Peer error:", error);
  };

  const getMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyVideoStream(stream);
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;
      setPermissionDenied(false);
      return stream;
    } catch (error) {
      console.error("Media stream error:", error);
      setPermissionDenied(true);
      throw error;
    }
  };

  const handleIncomingCall = async (call) => {
    try {
      const stream = await getMediaStream();

      // Set initial track states before answering
      stream.getAudioTracks()[0].enabled = !isMuted;
      stream.getVideoTracks()[0].enabled = !isCameraOff;

      call.answer(stream);

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
          setPermissionDenied(false);

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
      const stream = await getMediaStream();

      // Set initial track states before calling
      stream.getAudioTracks()[0].enabled = !isMuted;
      stream.getVideoTracks()[0].enabled = !isCameraOff;

      const call = peerRef.current.call(anotherPeerId, stream);

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
          setPermissionDenied(false);

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
      {permissionDenied && !isConnected && <NoPermission />}
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
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
