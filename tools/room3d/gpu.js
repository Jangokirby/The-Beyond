/* Chromium launch flags for the drawing tools. Default: draw on the CPU (swiftshader), so no GPU memory is used (good on a shared AI machine
   where the model needs the VRAM). Set STUDIO_GPU=1 to let Chromium use the GPU instead (faster, uses a few hundred MB of VRAM; untested on the Den). */
module.exports = () => process.env.STUDIO_GPU === "1" ? ["--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--no-sandbox"] : ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
