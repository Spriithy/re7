export interface WorkOSAvailability {
  canUseWorkOSAuth: boolean;
  reason: "insecure-origin" | null;
  currentOrigin: string;
}

interface WorkOSAvailabilityInput {
  hostname: string;
  isSecureContext: boolean;
  origin: string;
}

function isLocalDevelopmentHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function evaluateWorkOSAvailability({
  hostname,
  isSecureContext,
  origin,
}: WorkOSAvailabilityInput): WorkOSAvailability {
  if (isSecureContext || isLocalDevelopmentHost(hostname)) {
    return {
      canUseWorkOSAuth: true,
      reason: null,
      currentOrigin: origin,
    };
  }

  return {
    canUseWorkOSAuth: false,
    reason: "insecure-origin",
    currentOrigin: origin,
  };
}

export function getWorkOSAvailability(): WorkOSAvailability {
  if (typeof window === "undefined") {
    return {
      canUseWorkOSAuth: false,
      reason: "insecure-origin",
      currentOrigin: "",
    };
  }

  return evaluateWorkOSAvailability({
    hostname: window.location.hostname,
    isSecureContext: window.isSecureContext,
    origin: window.location.origin,
  });
}
