import * as TaskManager from "expo-task-manager";

const BACKGROUND_AUDIO_TASK = "BACKGROUND_AUDIO_TASK";

TaskManager.defineTask(BACKGROUND_AUDIO_TASK, async () => {
  console.log("Executando áudio em segundo plano...");
  return null;
});

export default BACKGROUND_AUDIO_TASK;
