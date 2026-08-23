
class RecorderProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      if (input && input.length > 0 && input[0].length > 0) {
        const channelData = input[0];
        this.port.postMessage(channelData);
      }
      return true;
    }
}
registerProcessor('recorder-worklet', RecorderProcessor);

class MicProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    // Copy the Float32Array (CRITICAL)
    const channelData = input[0];
    const pcmCopy = new Float32Array(channelData.length);
    pcmCopy.set(channelData);

    // Send safely to main thread
    this.port.postMessage(pcmCopy, [pcmCopy.buffer]);

    return true;
  }
}

registerProcessor('mic-processor', MicProcessor);
