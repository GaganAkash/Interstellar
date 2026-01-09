import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCube } from "react-icons/fa";

const steps = [
  "Receive Data Chunks",
  "Verify Chunk Integrity",
  "Reassemble Data",
  "Validate Reassembled Data",
  "Process Data",
  "Complete",
];

const animations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const StepCard = ({ title, children }) => (
  <motion.div
    variants={animations}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.8 }}
    style={{ textAlign: "center", marginBottom: "25px" }}
  >
    <h3 style={{ color: "#7dd3fc", fontSize: "20px" }}>{title}</h3>
    {children}
  </motion.div>
);

const IpfsDataReassembly = ({ currentStep }) => {
  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "800px",
        margin: "auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "transparent",
        color: "#e0f2fe",
      }}
    >
      <AnimatePresence>
        {currentStep >= 1 && (
          <StepCard key={steps[0]} title={steps[0]}>
            <div style={{ fontSize: "48px", color: "#7dd3fc", marginTop: "10px", display: "flex", justifyContent: "center" }}>
              <FaCube className="text-cyan-500 text-4xl" />
            </div>
          </StepCard>
        )}

        {currentStep >= 2 && (
          <StepCard key={steps[1]} title={steps[1]}>
            <div
              style={{
                background: "#1e40af",
                padding: "12px",
                borderRadius: "8px",
                display: "inline-block",
                color: "#fff",
                marginTop: "10px",
              }}
            >
              Verifying chunk integrity...
            </div>
          </StepCard>
        )}

        {currentStep >= 3 && (
          <StepCard key={steps[2]} title={steps[2]}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`chunk-${i}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  style={{
                    backgroundColor: "#0ea5e9",
                    padding: "10px",
                    borderRadius: "10px",
                    textAlign: "center",
                    width: "80px",
                    color: "white",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{i + 1}</div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/716/716784.png"
                    alt="Chunk"
                    style={{ width: "40px", margin: "8px auto" }}
                  />
                  <div>256 kB</div>
                </motion.div>
              ))}
            </div>
          </StepCard>
        )}

        {currentStep >= 4 && (
          <StepCard key={steps[3]} title={steps[3]}>
            <div
              style={{
                background: "#1e40af",
                padding: "12px",
                borderRadius: "8px",
                display: "inline-block",
                color: "#fff",
                marginTop: "10px",
              }}
            >
              Validating reassembled data...
            </div>
          </StepCard>
        )}

        {currentStep >= 5 && (
          <StepCard key={steps[4]} title={steps[4]}>
            <div
              style={{
                background: "#0ea5e9",
                padding: "12px",
                borderRadius: "8px",
                display: "inline-block",
                color: "#fff",
                marginTop: "10px",
              }}
            >
              Processing data...
            </div>
          </StepCard>
        )}

        {currentStep >= 6 && (
          <StepCard key={steps[5]} title={steps[5]}>
            <div
              style={{
                background: "#1e40af",
                padding: "12px",
                borderRadius: "8px",
                display: "inline-block",
                color: "#fff",
                marginTop: "10px",
              }}
            >
              Reassembly complete.
            </div>
          </StepCard>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IpfsDataReassembly;
