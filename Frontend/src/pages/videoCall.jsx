import { useState, useEffect, useRef, useContext } from "react";
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";
import FlashMessageContext from "../context/flashMessageContext.jsx";
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
  IconPhone,
  IconPhoneOff,
} from "@tabler/icons-react";

const VideoCall = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peer = useRef(null);
  const currentCall = useRef(null);
  const { showErrorMessage } = useContext(FlashMessageContext);

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
          call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        })
        .catch((err) => console.error("Failed to get local stream:", err));
    });

    return () => {
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
        call.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
        });
      })
      .catch((err) => console.error("Failed to get local stream:", err));
  };

  const disconnectCall = () => {
    if (currentCall.current) {
      currentCall.current.close();
      currentCall.current = null;
      setRemoteStream(null);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white">
      <div className="relative w-full max-w-4xl aspect-video">
        {/* Main Video (Remote) */}
        <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full object-cover"
          ></video>
        </div>

        {/* Picture-in-Picture (Local) */}
        <div className="absolute bottom-4 right-4 w-48 aspect-video">
          <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            ></video>
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900/90 to-transparent">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {/* Audio Control */}
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full ${
                isAudioEnabled
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isAudioEnabled ? (
                <IconMicrophone className="w-6 h-6" />
              ) : (
                <IconMicrophoneOff className="w-6 h-6" />
              )}
            </button>

            {/* Video Control */}
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${
                isVideoEnabled
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isVideoEnabled ? (
                <IconVideo className="w-6 h-6" />
              ) : (
                <IconVideoOff className="w-6 h-6" />
              )}
            </button>

            {/* Call Control */}
            <button
              onClick={currentCall.current ? disconnectCall : makeCall}
              className={`p-3 rounded-full ${
                currentCall.current
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {currentCall.current ? (
                <IconPhoneOff className="w-6 h-6" />
              ) : (
                <IconPhone className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Peer ID Input Section */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <div className="mb-4">
          <p className="text-sm text-gray-400">Your Peer ID:</p>
          <p className="font-mono bg-gray-700 p-2 rounded">{peerId}</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Remote Peer ID"
            className="p-2 rounded bg-gray-700 text-white w-64"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
