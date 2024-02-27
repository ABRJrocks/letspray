import React, { useEffect, useState, useReducer } from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon, FaRegSun, FaCheck } from "react-icons/fa";
import Toast from "./Toast"; // Import the Toast component
import backgroundImage from "../../assets/background.jpg"; // Import your background image

const NamazPage = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [namazTimes, setNamazTimes] = useState([]);
  const [showToast, setShowToast] = useState(false); // State to control Toast visibility
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    const fetchNamazTimings = async () => {
      try {
        const date = new Date()
          .toISOString()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("-");
        const city = "Lahore";
        const country = "Pakistan";
        const method = 1; // Using method 1: University of Islamic Sciences, Karachi

        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=${country}&method=${method}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Namaz timings");
        }
        const data = await response.json();
        const timings = data.data.timings;

        const convertTo12HourFormat = (timeString) => {
          const [hours, minutes] = timeString.split(":");
          const AMPM = hours >= 12 ? "PM" : "AM";
          const hour12 = hours % 12 || 12;
          return `${hour12}:${minutes} ${AMPM}`;
        };

        const namazTimings = [
          {
            name: "Fajr",
            time: convertTo12HourFormat(timings.Fajr),
            icon: <FaRegSun />,
            completed: false,
          },
          {
            name: "Dhuhr",
            time: convertTo12HourFormat(timings.Dhuhr),
            icon: <FaSun />,
            completed: false,
          },
          {
            name: "Asr",
            time: convertTo12HourFormat(timings.Asr),
            icon: <FaSun />,
            completed: false,
          },
          {
            name: "Maghrib",
            time: convertTo12HourFormat(timings.Maghrib),
            icon: <FaSun />,
            completed: false,
          },
          {
            name: "Isha",
            time: convertTo12HourFormat(timings.Isha),
            icon: <FaMoon />,
            completed: false,
          },
        ];

        setNamazTimes(namazTimings);
      } catch (error) {
        console.error("Error fetching Namaz timings:", error.message);
      }
    };

    fetchNamazTimings();

    const fetchCurrentTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(timeString);
    };
    fetchCurrentTime();
  }, []);

  const handleNamazComplete = (index) => {
    const updatedNamazTimes = [...namazTimes];
    updatedNamazTimes[index].completed = !updatedNamazTimes[index].completed;
    setNamazTimes(updatedNamazTimes);

    // Force re-render
    forceUpdate();

    const completedNamaz = updatedNamazTimes[index].name;
    setShowToast({
      message: `${completedNamaz} ${
        updatedNamazTimes[index].completed
          ? "MashaAllah Well Done 💖"
          : "Prayed?"
      }`,
      show: true,
    });

    setTimeout(() => {
      setShowToast({ ...showToast, show: false });
    }, 3000);
  };

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.7, // Adjust opacity for overlay
        }}
      />
      <div className="container mx-auto p-8 bg-white backdrop-blur-md bg-opacity-40 rounded-3xl mt-16 sm:mt-24 ">
        {showToast && (
          <Toast
            message={showToast.message}
            onClose={() => setShowToast(false)}
          />
        )}{" "}
        {/* Render Toast */}
        <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">
          Namaz Times for Today
        </h2>
        <p className="mb-4 text-gray-600 text-center">
          Current Time: {currentTime}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {namazTimes.map((namaz, index) => (
            <motion.div
              key={index}
              className={`relative bg-white rounded-lg shadow-md p-4 cursor-pointer ${
                namaz.completed ? "bg-green-200" : ""
              } hover:${namaz.completed ? "" : "bg-blue-100"} `}
              onClick={() => handleNamazComplete(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {namaz.completed && (
                <FaCheck className="absolute top-2 right-2 text-green-500" />
              )}
              <div className="flex items-center justify-center">
                <span className="mr-2 text-2xl text-yellow-500">
                  {namaz.icon}
                </span>
                <h3 className="text-xl font-semibold text-blue-800">
                  {namaz.name}
                </h3>
              </div>
              <p className="text-gray-600 text-center mt-2">{namaz.time}</p>
              <span className="block text-center mt-2">
                {namaz.completed ? "MashaAllah Well Done 💖" : "Prayed?"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NamazPage;
