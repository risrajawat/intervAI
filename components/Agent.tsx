'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface AgentProps {
  userName: string;
  userId: string;
  type: string;
}

const Agent = ({ userName, userId }: AgentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  /* -------------------- INIT SPEECH RECOGNITION -------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = () => {
      if (!isListeningRef.current) return;
      isListeningRef.current = false;
      nextQuestion();
    };

    recognition.onerror = () => {
      if (!isListeningRef.current) return;
      isListeningRef.current = false;
      nextQuestion();
    };

    recognitionRef.current = recognition;
  }, []);

  /* -------------------- TEXT TO SPEECH -------------------- */
  const speak = (text: string, afterSpeak?: () => void) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      recognitionRef.current?.stop(); // 🔴 mic OFF while AI speaks
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      afterSpeak?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  /* -------------------- ASK QUESTION -------------------- */
  const askQuestion = (index: number) => {
    speak(questions[index], () => {
      if (callStatus !== CallStatus.ACTIVE) return;
      isListeningRef.current = true;
      recognitionRef.current?.start(); // 🎙️ mic ON after AI stops
    });
  };

  /* -------------------- NEXT QUESTION -------------------- */
  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      askQuestion(nextIndex);
    } else {
      finishInterview();
    }
  };

  /* -------------------- FINISH -------------------- */
  const finishInterview = () => {
    recognitionRef.current?.stop();
    isListeningRef.current = false;

    speak("The interview is complete. Great job.", () => {
      setCallStatus(CallStatus.FINISHED);
    });
  };

  /* -------------------- START INTERVIEW -------------------- */
  const startCall = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      window.speechSynthesis.cancel();
      setCallStatus(CallStatus.CONNECTING);

      const res = await fetch("/api/retell/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "Frontend Developer",
          level: "Intermediate",
          techstack: "HTML CSS JavaScript",
          amount: 5,
          type: "technical",
          userid: userId,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch questions");

      const data = await res.json();

      setQuestions(data.questions);
      setCurrentIndex(0);
      setCallStatus(CallStatus.ACTIVE);

      askQuestion(0);
    } catch (err) {
      console.error(err);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  /* -------------------- END MANUALLY -------------------- */
  const endCall = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
    isListeningRef.current = false;
    setCallStatus(CallStatus.FINISHED);
  };

  /* -------------------- UI -------------------- */
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image src="/ai-avatar.png" alt="AI" width={65} height={54} />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="User"
              width={120}
              height={120}
              className="rounded-full"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button onClick={startCall} className="relative btn-call">
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus === CallStatus.CONNECTING && "hidden"
              )}
            />
            <span>
              {callStatus === CallStatus.CONNECTING ? "Connecting..." : "Call"}
            </span>
          </button>
        ) : (
          <button onClick={endCall} className="btn-disconnected">
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
