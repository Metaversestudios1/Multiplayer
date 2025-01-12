import React, { useState, useEffect, useRef, useContext } from "react";
import io from "socket.io-client";
import { UserAuthContext } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Configure socket connection
const socket = io("http://127.0.0.1:8000", {
  path: "/socket.io",
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});

function AviatorGame() {
  const [betAmount, setBetAmount] = useState(5);
  const [multiplier, setMultiplier] = useState(0);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [isBettingOpen, setIsBettingOpen] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [winnings, setWinnings] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 0 });
  const [isPlaneVisible, setIsPlaneVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [cashOutMultiplier, setCashOutMultiplier] = useState("");
  const [crashPoint, setCrashPoint] = useState("");
  const [isServerDisconnected, setIsServerDisconnected] = useState(false);

  const gameRef = useRef(null);
  const { userAuth, setUserAuth } = useContext(UserAuthContext);
  const navigate = useNavigate();

  // Emit userId on initial connection and reconnection
  useEffect(() => {
    if (userAuth?.user?._id) {
      socket.emit("join_game", { user_id: userAuth.user._id });
      console.log("User ID sent to socket:", userAuth.user._id);
    }

    socket.on("connect", () => {
      console.log("Connected to server");
      if (userAuth?.user?._id) {
        console.log("Reconnected, sending userId...");
        socket.emit("join_game", { user_id: userAuth.user._id });
      }
      setIsServerDisconnected(false);
    });

    socket.on("disconnect", () => {
      console.warn("Disconnected from server");
      setIsServerDisconnected(true);
    });

    socket.on("reconnect", () => {
      console.log("Reconnected to server");
      setIsServerDisconnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
    };
  }, [userAuth]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logoutuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt_user")}`,
        },
      });

      if (response.ok) {
        Cookies.remove("jwt_user");
        setUserAuth({ isAuthenticated: false, user: null });
        navigate("/loginuser");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    socket.on("multiplier_reset", () => {
      setIsBetPlaced(false);
      setBetAmount(0);
      setLoadingComplete(false);
      setIsPlaneVisible(false);
      setMultiplier(0);
      setIsCrashed(false);
      setMessage("");
      setCrashPoint("");
      setShowLoader(true);

      setTimeout(() => {
        setLoadingComplete(true);
        setShowLoader(false);
        setIsPlaneVisible(false);
        setWinnings(0);
      }, 5000);
    });

    socket.on("betting_open", () => {
      setIsBettingOpen(true);
    });

    socket.on("betting_close", () => {
      setIsBettingOpen(false);
    });

    socket.on("multiplier_update", (data) => {
      setMultiplier(data.multiplier);
      if (!isCrashed && !isPlaneVisible) {
        setIsPlaneVisible(true);
        movePlaneDiagonally();
      }
    });

    socket.on("plane_crash", ({ crashPoint }) => {
      setIsPlaneVisible(false);
      setIsCrashed(true);
      setShowLoader(true);
      setMessage(`Flew away`);
      setCrashPoint(crashPoint);
      resetPlanePosition();
    });

    socket.on("cash_out_success", (data) => {
      setCashOutMultiplier(data.message);
      setWinnings(data.winnings);
    });

    return () => {
      socket.off("multiplier_reset");
      socket.off("betting_open");
      socket.off("betting_close");
      socket.off("multiplier_update");
      socket.off("plane_crash");
      socket.off("cash_out_success");
    };
  }, [isPlaneVisible, isCrashed]);

  const resetPlanePosition = () => {
    setPlanePosition({ x: 0, y: 0 });
    setShowLoader(false);
  };

  const movePlaneDiagonally = () => {
    const gameWidth = gameRef.current.offsetWidth;
    const gameHeight = gameRef.current.offsetHeight;

    let xPos = 0;
    let yPos = 0;

    const animate = () => {
      xPos += gameWidth / 500;
      yPos += gameHeight / 500;

      setPlanePosition({ x: xPos, y: yPos });

      if (xPos < gameWidth - 70 && yPos < gameHeight - 95) {
        requestAnimationFrame(animate);
      } else {
        oscillatePlane(xPos, yPos);
      }
    };

    requestAnimationFrame(animate);
  };

  const oscillatePlane = (finalX, finalY) => {
    const oscillationAmplitude = 14;
    const oscillationFrequency = 0.05;
    let oscillationPhase = 0;

    const animateOscillation = () => {
      oscillationPhase += oscillationFrequency;
      const newY = finalY + oscillationAmplitude * Math.sin(oscillationPhase);

      setPlanePosition({ x: finalX, y: newY });

      if (!isCrashed) {
        requestAnimationFrame(animateOscillation);
      }
    };

    requestAnimationFrame(animateOscillation);
  };

  const handlePlaceBet = () => {
    if (betAmount > 0 && isBettingOpen) {
      socket.emit("place_bet", betAmount);
      setIsBetPlaced(true);
    }
  };

  const handleCashOut = () => {
    if (multiplier > 0 && !isCrashed) {
      socket.emit("cash_out");
      setIsBetPlaced(false);
    }
  };

  const renderActionButton = () => {
    if (isCrashed) {
      return (
        <button disabled className="bg-green-900 p-3 text-white rounded-lg">
          Place Bet
        </button>
      );
    }

    if (isBetPlaced) {
      return (
        <button
          onClick={handleCashOut}
          disabled={isCrashed}
          className="bg-green-900 p-3 text-white rounded-lg"
        >
          Cash Out
        </button>
      );
    }

    return (
      <button
        onClick={handlePlaceBet}
        disabled={!isBettingOpen || isBetPlaced}
        className="bg-green-900 p-3 text-white rounded-lg"
      >
        Place Bet
      </button>
    );
  };

  return (
    <div className="game-container">
      <div className="game-screen">
        {isServerDisconnected && (
          <div className="server-disconnected">
            Server Disconnected! Trying to reconnect...
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg text-white"
        >
          Logout
        </button>
        <div className="history text-xl">History of bets</div>
        <div
          className="game"
          ref={gameRef}
          style={{ position: "relative", overflow: "hidden" }}
        >
          {isPlaneVisible && (
            <img
              className="plane"
              src="/plane.png"
              alt="Flying Plane"
              style={{
                transform: `translate(${planePosition.x}px, -${planePosition.y}px)`,
                transition: "transform 50ms linear",
              }}
            />
          )}
          {!isCrashed && !showLoader ? (
            <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-50 text-5xl font-extrabold">
              {multiplier}x
            </div>
          ) : (
            <>
              <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-50 ">
                <div className="text-3xl font-bold">{message}</div>
                <div className="text-3xl text-[#de3232] font-bold">
                  {crashPoint ? crashPoint + "x" : ""}
                </div>
              </div>
            </>
          )}
          {showLoader && (
            <img
              src="/loading.png"
              alt="loading"
              className={`${showLoader ? "loading" : "hidden"}`}
            />
          )}
          <p
            className={`${
              showLoader ? "mt-36 text-[#d20637] text-lg" : "hidden"
            }`}
          >
            Loading...
          </p>
        </div>
        <div className="bet flex justify-center items-center">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="Place Bet"
            className="p-[10px] rounded-lg"
          />
          {renderActionButton()}
          <p className="text-lg text-white ml-5">
            {winnings
              ? `Your Winnings: ${winnings} at ${cashOutMultiplier}`
              : `Your Winnings: $0`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AviatorGame;
