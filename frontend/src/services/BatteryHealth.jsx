export default function batteryHealth(cycleCount, maxCycles = 1000, degradationThreshold = 80) {
    if (cycleCount <= maxCycles) {
    // Linear degradation from 100% to threshold
    const degradationRate = (100 - degradationThreshold) / maxCycles;
    const healthPercentage = 100 - (cycleCount * degradationRate);
    return Math.max(degradationThreshold, healthPercentage);
  } else {
    // Continue degrading after threshold
    const excessCycles = cycleCount - maxCycles;
    const additionalDegradation = (excessCycles / maxCycles) * 10; // 10% per additional 1000 cycles
    return Math.max(0, degradationThreshold - additionalDegradation);
  }
}