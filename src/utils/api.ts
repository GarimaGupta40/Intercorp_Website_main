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
      if (!response.ok) {
        // Try to parse JSON error body (preferred) otherwise return status text
        try {
          const errBody = await response.json();
          // If server returned { error: 'msg' } or similar, forward it
          if (errBody && (errBody.error || errBody.message)) return { error: errBody.error || errBody.message };
          return { error: response.statusText };
        } catch (e) {
          return { error: response.statusText };
        }
      }
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${file}:`, error);
      return { error };
    }
  }
};
