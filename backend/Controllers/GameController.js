// Controllers/GameController.js

const express = require("express");
const router = express.Router();
const PlaneCrash = require("../Models/PlaneCrash");
const User = require("../Models/User");
const Bet = require("../Models/Bet");
const GameHistory = require("../Models/Aviator/AviatorHistory");

const gameLogic = async (io) => {
  let users = {}; // Store user data by userId
  let socketToUserId = {}; // Map socket.id to userId
  let multiplier = 0; // Starting multiplier
  let crashPoint = 0; // Where the plane crashes
  let crashRanges = []; // Array to store crash ranges from DB

  // Function to fetch crash ranges from the database
  const fetchCrashRanges = async () => {
    try {
      const ranges = await PlaneCrash.find({ deleted_at: null }).exec();
      crashRanges = ranges.map((range) => ({
        range: [parseFloat(range.firstValue), parseFloat(range.secondValue)],
        probability: parseFloat(range.crashPercentage) / 100,
      }));
    } catch (error) {
      console.error("Error fetching crash ranges from database:", error);
    }
  };

  const saveBet = async (userId, betAmount) => {
    users[userId] = { betAmount, hasCashedOut: false };
    try {
      const newBet = new Bet({
        userId: userId,
        bet_amount: betAmount,
      });
      await newBet.save();
      console.log("Game bet saved successfully");
    } catch (error) {
      console.error("Error saving game bet:", error);
    }
  };

  const calculateGameResults = () => {
    let totalBet = 0;
    let totalWinningAmount = 0;
    let userResults = [];

    console.log("users:", users);

    for (const userId in users) {
      const user = users[userId];
      if (user.betAmount > 0) {
        totalBet += user.betAmount;

        const winnings = user.hasCashedOut ? user.betAmount * multiplier : 0;
        totalWinningAmount += winnings;

        userResults.push({
          userId,
          betAmount: user.betAmount,
          winnings: winnings.toFixed(2),
          hasCashedOut: user.hasCashedOut,
        });
      }
    }

    const adminProfit = totalBet - totalWinningAmount;
    return { totalBet, totalWinningAmount, adminProfit, userResults };
  };

  const saveGameHistory = async (gameResults) => {
    if (gameResults.totalBet === 0) {
      console.log("No bets placed, skipping game history save.");
      return; // Skip saving if no bets were placed
    }

    try {
      const newHistory = new GameHistory({
        users: gameResults.userResults,
        totalBet: gameResults.totalBet,
        adminProfit: gameResults.adminProfit,
        totalWinningAmount: gameResults.totalWinningAmount,
        // crashPoint: crashPoint.toFixed(2),
      });
      await newHistory.save();
      //console.log("Game history saved successfully");
      if (gameResults.totalWinningAmount > 0) {
        const userId = gameResults?.userResults[0]?.userId;
        //console.log("USERID", userId);
        const user = await User.findById(userId);
        if (user) {
          user.balance =
            (user.balance || 0) + parseFloat(gameResults.totalWinningAmount);
          await user.save();
          // console.log(
          //   `User ${gameResults?.userResults[0]?.userId} balance updated to ${user.balance}`
          // );
        } else {
          console.log(`User ${userResult.userId} not found`);
        }
      }
    } catch (error) {
      console.error("Error saving game history:", error);
    }
  };

  const startGame = async () => {
    console.log("Game started");
    await fetchCrashRanges();

    if (crashRanges.length === 0) {
      console.log("No crash ranges available, cannot start game.");
      return;
    }

    crashPoint = Math.random() * (4 - 1) + 1;
    console.log(`Crash point set at: ${crashPoint.toFixed(2)}x`);

    multiplier = 1;
    io.emit("multiplier_reset", { multiplier: 0 });
    io.emit("betting_open", { isBettingOpen: true });

    setTimeout(() => {
      io.emit("betting_close", { isBettingOpen: false });
      console.log("Betting closed. Game is starting.");

      let gameInterval = setInterval(() => {
        multiplier += 0.01;
        io.emit("multiplier_update", { multiplier: multiplier.toFixed(2) });

        if (multiplier >= crashPoint) {
          clearInterval(gameInterval);
          io.emit("plane_crash", { crashPoint: crashPoint.toFixed(2) });

          const gameResults = calculateGameResults();
          console.log("Game Result:", gameResults);
          saveGameHistory(gameResults);

          // Clear user data to prevent carrying over to the next game
          users = {};
          console.log("User data cleared for the next game.");

          for (const userId in users) {
            const user = users[userId];
            const socketId = Object.keys(socketToUserId).find(
              (key) => socketToUserId[key] === userId
            );

            if (user.betAmount > 0) {
              if (!user.hasCashedOut) {
                io.to(socketId).emit("bet_lost", {
                  message: `You lost $${
                    user.betAmount
                  } as the plane crashed at ${crashPoint.toFixed(2)}x.`,
                  crashPoint: crashPoint.toFixed(2),
                });
                console.log(`User ${userId} lost $${user.betAmount}`);
              }
            }
          }

          setTimeout(() => {
            startGame();
          }, 5000);
        }
      }, 80);
    }, 5000);
  };

  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    // const user_id = "677653e29f5c3672996dea01"; // Replace with actual logic to fetch userId
    // socketToUserId[socket.id] = user_id;
    // users[user_id] = { betAmount: 0, hasCashedOut: false };

    //console.log(`User ${user_id} connected`);

    socket.on("join_game", (data) => {
      console.log("User joined the game with ID:", data.user_id);
      //socket.user_id = data.user_id;
      const user_id = data.user_id;
      socketToUserId[socket.id] = user_id;
      users[user_id] = { betAmount: 0, hasCashedOut: false };
    });

    socket.on("place_bet", (betAmount) => {
      const userId = socketToUserId[socket.id];
      if (multiplier === 1 && userId) {
        // Initialize user data if it doesn't exist
        if (!users[userId]) {
          users[userId] = { betAmount: 0, hasCashedOut: false };
        }

        // Update bet amount
        users[userId].betAmount = betAmount;
        users[userId].hasCashedOut = false;

        // Save the bet to the database
        saveBet(userId, betAmount);
        console.log(`User ${userId} placed a bet of $${betAmount}`);
      }
    });

    socket.on("cash_out", () => {
      const userId = socketToUserId[socket.id];
      if (multiplier > 0 && userId && !users[userId].hasCashedOut) {
        const winnings = users[userId].betAmount * multiplier;
        io.to(socket.id).emit("cash_out_success", {
          winnings: winnings.toFixed(2),
          message: `${multiplier.toFixed(2)}x`,
        });
        users[userId].hasCashedOut = true;
        console.log(
          `User ${userId} cashed out with $${winnings.toFixed(
            2
          )} at ${multiplier.toFixed(2)}x`
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const userId = socketToUserId[socket.id];
      delete users[userId];
      delete socketToUserId[socket.id];
    });
  });

  await startGame();
};

module.exports = {
  gameLogic, // Initialize game logic with the Socket.IO instance
};
