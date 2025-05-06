// Translation service using MyMemory Translation API
export const translationService = {
  translateToHindi: async (text) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|hi`
      );

      const data = await response.json();
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      } else {
        throw new Error("Translation failed");
      }
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  },
};
