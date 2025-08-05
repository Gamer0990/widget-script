export const priorityOptions = [
  {
    value: "Low",
    textColor: "#667085", // blue
    backgroundColor: "#EAF5FF",
  },
  {
    value: "Medium",
    textColor: " #FF8040", // orange
    backgroundColor: "#FFFBFA",
  },
  {
    value: "High",
    textColor: "#DE474A", // red
    backgroundColor: "#FFEBEB",
  },
];

export const statusOptions = [
  {
    value: "Pending",
    textColor: "#8D5507",
    backgroundColor: "#FFF6F2",
  },
  {
    value: "Assigned",
    textColor: "#FFA500",
    backgroundColor: "#FFFDF8",
  },
  {
    value: "InProgress",
    textColor: "#007BFF",
    backgroundColor: "#E8F1FF",
  },
  {
    value: "Fixed",
    textColor: "#359119",
    backgroundColor: "#F0FFF5",
  },
];

export function generateUUID() {
  const data = new Uint8Array(16);
  crypto.getRandomValues(data);
  data[6] = (data[6] & 0x0f) | 0x40;
  data[8] = (data[8] & 0x3f) | 0x80;
  return data.reduce(
    (acc, value) => acc + value.toString(16).padStart(2, "0"),
    ""
  );
}

// get system info
export async function collectSystemInfo() {
  try {
    const timestamp = new Date()
      .toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2");

    const userAgent = navigator.userAgent;
    const osMatch = userAgent.match(/\(([^)]+)\)/);
    const os = osMatch ? osMatch[1] : "Unknown OS";

    const browserMatch = userAgent.match(/Chrome\/([0-9.]+)/);
    const browserVersion = browserMatch ? browserMatch[1] : "Unknown Version";
    const browser = `Chrome ${browserVersion}`;

    const windowSize = `${window.innerWidth}x${window.innerHeight}`;
    const screenDimensions = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`;

    let countryInfo = localStorage.getItem("country_info");

    if (!countryInfo) {
      try {
        const data = await fetch("https://ipapi.co/json/").then((res) =>
          res.json()
        );
        countryInfo = `${data.country_name} ${getCountryFlag(
          data.country_code
        )}`;
        localStorage.setItem("country_info", countryInfo);
      } catch {
        countryInfo = "Unknown";
      }
    }

    const systemInfo = {
      Timestamp: timestamp,
      OS: os,
      Browser: browser,
      Window_size: windowSize,
      Country: countryInfo,
      Screenshot_dimensions: screenDimensions,
    };

    return systemInfo;
  } catch (error) {
    console.error("Error collecting system information:", error);
    return null;
  }
}

function getCountryFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// handle api response based on type

export function handleApiResponse(dispatch, type) {
  switch (type) {
    case "GETCURRENTUSER":
      return dispatch({ type: type, data: "data" });
    default:
      return;
  }
}
