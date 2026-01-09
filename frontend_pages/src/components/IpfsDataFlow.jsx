import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCube, FaNetworkWired, FaServer } from "react-icons/fa";

const steps = [
  "Upload Data on IPFS",
  "Storing Hash of Data in Blockchain",
  "Data Division",
  "Request of Data With Hash",
  "Data Aggregation",
  "Get Data of Respective Hash",
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

const IpfsDataFlow = ({ currentStep }) => {
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
              Hash: 856981c36a2c64...a2b98045115
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <FaServer className="text-cyan-500 text-6xl mt-4" />
            </div>
            <div>Sink Node</div>
          </StepCard>
        )}

        {currentStep >= 5 && (
          <StepCard key={steps[4]} title={steps[4]}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <FaNetworkWired className="text-cyan-500 text-6xl mt-4" />
            </div>
            <div>IPFS Aggregator</div>
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
              Final Hash: 856981c36a2c64...a2b98045115
            </div>
          </StepCard>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IpfsDataFlow;
