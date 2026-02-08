import { mockCameras } from "@/data/mock/cameras";

export const cameraService = {
  getCameras: async () => {
    return Promise.resolve([...mockCameras]);
  },
};
