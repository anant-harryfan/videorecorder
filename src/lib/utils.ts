import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { BlockList } from "net";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

export const onCloseApp = () => window.ipcRenderer.send("closeApp");

export const fetchUserProfile = async (clerkId: string) => {
  const response = await httpClient.get(`/auth/${clerkId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  return response.data;
};

export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke("getSources");
  console.log(displays, "dsidfaddisplaydflfdsljslfkljdsfkl")
  const enumurateDevices =
    await window.navigator.mediaDevices.enumerateDevices();
  const audioInputs = enumurateDevices.filter(
    (devices) => devices.kind === "audioinput"
  );
  // console.log("getting sources");
  return { displays, audio: audioInputs };
};

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: "HD" | "SD"
) => {
  const response = await httpClient.post(
    `/studio/${id}`,
    {
      screen,
      audio,
      preset,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data
};

export const hidePluginWindow = (state: boolean)=>{
window.ipcRenderer.send('hide-plugin', {state})
}