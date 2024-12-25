import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IconPhone, IconPhoneOff, IconUser } from "@tabler/icons-react";
import useVideoCall from "../stores/useVideoCall.js";
import rejectVideoCall from "../hooks/rejectVideoCall.js";
import FlashMessageContext from "../context/flashMessageContext.jsx";

const IncomingCall = () => {
  const [isRinging, setIsRinging] = useState(true);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const {
    withVideoCall,
    isIncomingCall,
    setIsIncomingCall,
    setWithVideoCall,
    setIsVideoCallConnected,
  } = useVideoCall();
  const { showSuccessMessage, showErrorMessage } =
    useContext(FlashMessageContext);

  useEffect(() => {
    // Start playing ringtone
    if (!audioRef.current) return;
    audioRef.current.play();

    // Loop the ringtone
    audioRef.current.addEventListener("ended", () => {
      if (isRinging) {
        audioRef.current.play();
      }
    });

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current?.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isRinging]);

  if (!isIncomingCall) {
    return null;
  }

  const handleAnswer = () => {
    setIsRinging(false);
    navigate("/video-call");
  };

  const handleReject = () => {
    setIsRinging(false);

    try {
      rejectVideoCall(isIncomingCall).then((data) => {
        showSuccessMessage(data.message);
        setIsIncomingCall(null);
        setWithVideoCall(null);
        setIsVideoCallConnected(false);
      });
    } catch (error) {
      showErrorMessage(error.message || "Failed to cut call");
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <audio ref={audioRef} src="/ringtone.mp3" />

      <div className="relative flex flex-col items-center">
        {/* Ripple Animation Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full border-4 border-white/20 animate-ping" />
          <div className="absolute w-40 h-40 rounded-full border-4 border-white/15 animate-ping [animation-delay:200ms]" />
          <div className="absolute w-48 h-48 rounded-full border-4 border-white/10 animate-ping [animation-delay:400ms]" />
        </div>

        {/* Caller Avatar */}
        <div className="relative z-10 w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6 border-2 border-white">
          <IconUser className="w-12 h-12 text-white" />
        </div>

        {/* Caller Information */}
        <div className="text-center mb-12 z-10">
          <h2 className="text-2xl font-semibold text-white mb-2">
            {withVideoCall || "Unknown Caller"}
          </h2>
          <p className="text-gray-300">Incoming video call...</p>
        </div>

        {/* Call Controls */}
        <div className="flex gap-8 z-10">
          {/* Reject Button */}
          <button
            onClick={handleReject}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
          >
            <IconPhoneOff className="w-8 h-8 text-white transform rotate-135 transition-transform group-hover:scale-110" />
          </button>

          {/* Accept Button */}
          <button
            onClick={handleAnswer}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"
          >
            <IconPhone className="w-8 h-8 text-white transform -rotate-45 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
