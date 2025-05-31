import { useStudioSettingsSchema } from "@/schemas/studio-setting.schema";
import useZodForm from "./useZodForm";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateStudioSettings } from "@/lib/utils";
import { toast } from "sonner";

export const useStudioSettings = (
  id: string,
  screen?: string | null,
  audio?: string | null,
  preset?: "HD" | "SD"
) => {
  const [onPreset, setPreset] = useState<"HD" | "SD" | undefined>();
  const { register, watch } = useZodForm(useStudioSettingsSchema, {
    screen: screen!,
    audio: audio!,
    preset: preset!,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      screen: string;
      id: string;
      audio: string;
      preset: "HD" | "SD";
    }) => updateStudioSettings(data.id, data.screen, data.audio, data.preset),
    onSuccess: (data) => {
      return toast(
        data.status === 200
          ? "Hogaya bhai"
          : "Kuch to gadbad hai, abhi nahi ho raha",
        {
          description: data.error,
        }
      );
    },
  });

  useEffect(() => {
    if (screen && audio) window.ipcRenderer.send("media-sources", {
        screen,
        id:id,
        audio,
        preset,
    });
  }, [screen, audio]);

  useEffect(()=>{
const subscribe = watch((values)=>{
    setPreset(values.preset)
    mutate({
        screen: values.screen!,
        id,
        audio: values.audio!,
        preset: values.preset!
    })
    window.ipcRenderer.send("media-sources", {
        screen:values.screen,
        id,
        audio: values.audio,
        preset: values.preset
    });

})

return()=> subscribe.unsubscribe()
  }, [watch])
  return {register, isPending, onPreset };
};
