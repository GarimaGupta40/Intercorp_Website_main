export const api = {
  get: async (file: string) => {
    try {
      const response = await fetch(`/api/${file}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${file}:`, error);
      return null;
    }
  },
  post: async (file: string, data: any) => {
    try {
      const response = await fetch(`/api/${file}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) return { error: response.statusText };
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${file}:`, error);
      return { error };
    }
  }
};
