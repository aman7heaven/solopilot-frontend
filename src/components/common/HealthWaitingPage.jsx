// // src/components/common/HealthWaitingPage.jsx
// import React from "react";

// export default function HealthWaitingPage({ waitedMs = 0, retry, onClose }) {
//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
//       <div className="max-w-xl w-full bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl p-8 text-white">
        
//         <div className="flex flex-col items-center gap-6">
          
//           <img
//             src="https://media.giphy.com/media/3oEduSbSGpGaRX2Vri/giphy.gif"
//             alt="Waking up"
//             className="w-40 h-40 object-cover rounded-xl shadow-lg border border-slate-700"
//           />

//           <h2 className="text-2xl font-bold text-center">
//             Our cloud service is waking up ☁️💤
//           </h2>

//           <p className="text-center text-slate-300">
//             The backend is currently asleep. We’re spinning it up — this can
//             take up to <strong>2 minutes</strong>.
//           </p>

//           <p className="text-sm text-slate-400">
//             Waiting for: <span className="font-semibold">{Math.floor(waitedMs / 1000)}s</span>
//           </p>

//           <div className="flex gap-3 mt-4">
//             <button
//               onClick={retry}
//               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow font-medium"
//             >
//               Retry Now
//             </button>

//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 font-medium"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/components/common/HealthWaitingPage.jsx
import React from "react";

const MAX_WAIT_MS = 2 * 60 * 1000; // 2 minutes

export default function HealthWaitingPage({ waitedMs = 0, retry, onClose }) {
  const isTimedOut = waitedMs >= MAX_WAIT_MS;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="max-w-xl w-full bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex flex-col items-center gap-6 text-center">

          {/* GIF */}
          <img
            src={
              isTimedOut
                ? "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTNtaHF4aDNsZG9kYml6c3Z1N3F5Z2F0N3Z3M21zNHpxbTJ1aGZ4dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0HlBO7eyXzSZkJri/giphy.gif"
                : "https://media.giphy.com/media/3oEduSbSGpGaRX2Vri/giphy.gif"
            }
            alt="Server status"
            className="w-40 h-40 object-cover rounded-xl shadow-lg border border-slate-700"
          />

          {/* Title */}
          <h2 className="text-2xl font-bold">
            {isTimedOut
              ? "Hmm… the server is still asleep 😴"
              : "Our cloud service is waking up ☁️"}
          </h2>

          {/* Message */}
          <p className="text-slate-300">
            {isTimedOut ? (
              <>
                We tried to wake up the backend, but it’s taking longer than
                expected.
                <br />
                Please try again in a moment.
              </>
            ) : (
              <>
                The backend is currently asleep. We’re spinning it up — this can
                take up to <strong>2 minutes</strong>.
              </>
            )}
          </p>

          {/* Timer */}
          {!isTimedOut && (
            <p className="text-sm text-slate-400">
              Waiting for{" "}
              <span className="font-semibold">
                {Math.floor(waitedMs / 1000)}s
              </span>
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={retry}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow font-medium"
            >
              Retry
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 font-medium"
            >
              Close
            </button>
          </div>

          {/* Footer hint */}
          <p className="text-xs text-slate-500 mt-2">
            This usually happens on free cloud tiers after inactivity.
          </p>
        </div>
      </div>
    </div>
  );
}
