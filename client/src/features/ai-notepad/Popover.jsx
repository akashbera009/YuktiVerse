// Popover.jsx
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import AiHelpers from "./AiHelpers";
import "./Popover.css";
import axios from "axios";
import {
  DotsLoader,
  RingLoader,
  SquaresLoader,
  BarsLoader,
  OrbitLoader,
  ProgressLoader,
  HexagonLoader,
  OverlayLoader,
  InlineLoader,
  SmartLoader,
  useLoader,
  withLoading,
  LoaderShowcase,
} from "../../components/Loader";

const Popover = ({ anchorRef, onClose, children, text }) => {
  const popoverRef = useRef();

  const [shortResponse, setShortResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchShortResponse = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/ai-help/short-explain", {
        prompt: text,
      });
      console.log("AI short response:", response.data);
      setShortResponse(response.data);
    } catch (error) {
      console.error("Short response error:", error);
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };
  useEffect(() => {
    if (text) fetchShortResponse();
  }, [text]);
  const [copilotOpen, setCopilotOpen] = useState(false);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  // Compute position relative to the page
  const getPosition = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return { top: 0, left: 0 };
    return {
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
    };
  };
  const position = getPosition();

  // Render into the body
  return ReactDOM.createPortal(
    <div
      className="custom-popover"
      ref={popoverRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 2147483647, // ensure it’s on top
        // background: 'black',
        color: "white", // black text
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "6px",
        padding: "12px",
        minWidth: "200px",
      }}
    >
      <div className="ai-popover">
        <div className="ai-popover-content">
          <div className="ai-summary">
            {loading ? (
              <DotsLoader />
            ) : (
              <p>
                {shortResponse?.response ===
                "Error fetching response from Gemini."
                  ? "Something went wrong. Please try again."
                  : shortResponse?.response}
              </p>
            )}
          </div>
        </div>
        <div className="ai-popover-footer">
          <div className="ai-powered">Powered by AI</div>
          <div className="ai-actions">
            <button
              className="ai-action-btn secondary"
              onClick={() => {
                fetchShortResponse();
              }}
            >
              Improve
            </button>

            <button
              className="ai-action-btn primary"
              onClick={() => setCopilotOpen(true)}
            >
              Ask Assistant
            </button>
          </div>
        </div>
      </div>
      {copilotOpen && (
        <AiHelpers
          text={text}
          onClose={() => setCopilotOpen(false)}
          mode="notepad"
        />
      )}
    </div>,
    document.body
  );
};

export default Popover;
