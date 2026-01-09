const trackerManager = {
  sendError: (error: Error) => error,
};

export function getAllTracker() {
  return {
    getInstanaTracker: () => {
      return {
        sendErr: (error: unknown) => {
          console.error('sendErr', error);
          trackerManager.sendError(error as Error);
        },
      };
    },
  };
}
