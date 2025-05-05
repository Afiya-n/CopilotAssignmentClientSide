export const extractYouTubeId = (url: string) => {
    const regExp = /(?:youtube\.com.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };
  