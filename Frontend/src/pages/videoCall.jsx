import { useState, useEffect, useRef, useContext } from "react";
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";
import {
  IconArrowAutofitHeight,
  IconPhone,
  IconPhoneOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
  IconUser,
} from "@tabler/icons-react";
import FlashMessageContext from "../context/flashMessageContext.jsx";
import useVideoCall from "../stores/useVideoCall.js";
import { useNavigate } from "react-router-dom";

const VideoCall = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [remoteStream, setRemoteStream] = useState(null);
  const [isLocalBig, setIsLocalBig] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peer = useRef(null);
  const currentCall = useRef(null);
  const { showErrorMessage } = useContext(FlashMessageContext);
  const { withVideoCall } = useVideoCall();
  const navigate = useNavigate();

  if (!withVideoCall) {
    showErrorMessage("call cut");
    navigate("/");
  }

  useEffect(() => {
    peer.current = new Peer(uuidv4());
    peer.current.on("open", (id) => {
      setPeerId(id);
    });

    peer.current.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          call.answer(stream);
          currentCall.current = call;
          setIsCallActive(true);

          call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
          });

          call.on("close", () => {
            disconnectCall();
          });
        })
        .catch((err) => console.error("Failed to get local stream:", err));
    });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      peer.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const makeCall = () => {
    if (!remotePeerId) {
      showErrorMessage("Please enter a peer ID to call.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        const call = peer.current.call(remotePeerId, stream);
        currentCall.current = call;
        setIsCallActive(true);

        call.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
        });

        call.on("close", () => {
          disconnectCall();
        });
      })
      .catch((err) => console.error("Failed to get local stream:", err));
  };

  const disconnectCall = () => {
    setIsCallActive(false);

    if (currentCall.current) {
      currentCall.current.close();
      currentCall.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    setRemoteStream(null);
    setIsVideoEnabled(true);
    setIsAudioEnabled(true);

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleVideoSize = () => {
    setIsLocalBig(!isLocalBig);
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // eslint-disable-next-line react/prop-types
  const VideoContainer = ({ isMain, videoRef, isMuted, stream, isLocal }) => (
    <div
      className={`relative ${isMain ? "w-full h-full" : "w-full h-full"} bg-gray-900 overflow-hidden`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        className={`w-full h-full object-cover ${
          !stream || (isLocal && !isVideoEnabled) ? "hidden" : "block"
        }`}
      />
      {(!stream || (isLocal && !isVideoEnabled)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          {/*TODO: set profile picture here*/}
          <IconUser className="w-1/4 h-1/4 text-gray-400" />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-transparent/80 text-white">
      <div className="relative w-full max-w-4xl aspect-video">
        {/* Main (big) video */}
        <div className="w-full h-full rounded-lg overflow-hidden bg-black border-2 border-white transition-all duration-300 ease-in-out">
          <VideoContainer
            isMain={true}
            videoRef={isLocalBig ? localVideoRef : remoteVideoRef}
            isMuted={isLocalBig}
            stream={isLocalBig ? localStream : remoteStream}
            isLocal={isLocalBig}
          />
        </div>

        {/* Overlay (small) video */}
        <div
          className="absolute top-4 right-4 w-48 aspect-video rounded-lg overflow-hidden bg-black cursor-pointer group border border-white transform transition-all duration-300 ease-in-out hover:scale-105"
          onClick={toggleVideoSize}
        >
          <VideoContainer
            isMain={false}
            videoRef={isLocalBig ? remoteVideoRef : localVideoRef}
            isMuted={!isLocalBig}
            stream={isLocalBig ? remoteStream : localStream}
            isLocal={!isLocalBig}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <IconArrowAutofitHeight className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Media controls */}
              <button
                onClick={toggleAudio}
                disabled={!isCallActive}
                className={`p-3 rounded-full transition-colors ${
                  !isCallActive
                    ? "opacity-50 cursor-not-allowed bg-gray-600"
                    : isAudioEnabled
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isAudioEnabled ? (
                  <IconMicrophone className="w-6 h-6" />
                ) : (
                  <IconMicrophoneOff className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={toggleVideo}
                disabled={!isCallActive}
                className={`p-3 rounded-full transition-colors ${
                  !isCallActive
                    ? "opacity-50 cursor-not-allowed bg-gray-600"
                    : isVideoEnabled
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isVideoEnabled ? (
                  <IconVideo className="w-6 h-6" />
                ) : (
                  <IconVideoOff className="w-6 h-6" />
                )}
              </button>

              {/* Call controls */}
              <input
                type="text"
                placeholder="Enter Remote Peer ID"
                className="p-2 rounded-md bg-gray-800/80 text-white w-64"
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
                disabled={isCallActive}
              />
              <button
                onClick={isCallActive ? disconnectCall : makeCall}
                className={`p-3 rounded-full transition-colors ${
                  isCallActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isCallActive ? (
                  <IconPhoneOff className="w-6 h-6" />
                ) : (
                  <IconPhone className="w-6 h-6" />
                )}
              </button>
            </div>
            <div className="text-sm opacity-70">
              Your Peer ID: <span className="font-mono">{peerId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
