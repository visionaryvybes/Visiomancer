interface Window {
  pintrk: (
    action: string,
    event: string,
    data?: Record<string, any>,
    options?: { em?: string } | undefined // Define structure for options, especially enhanced match
  ) => void;
} 