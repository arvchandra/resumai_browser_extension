export function getLinkedInJobUrl(url: string): (string | null) {
  const JOB_POSTING_PATH = "https://www.linkedin.com/jobs/view";

  try {
    console.log(url);
    const parsedUrl = new URL(url);

    // Only allow linkedin.com domains
    if (!parsedUrl.hostname.endsWith("linkedin.com")) {
      return null;
    }

    const urlPath = parsedUrl.pathname.toLowerCase();

    console.log(parsedUrl);
    console.log(urlPath);

    // Case 1: https://www.linkedin.com/jobs/view/1234567890/
    const jobViewMatch = urlPath.match(/^\/jobs\/view\/\d+/);
    if (jobViewMatch) {
      return `${parsedUrl}/${urlPath}`;
    }

    // Case 2: 
    // https://www.linkedin.com/jobs/search/?currentJobId=1234567890
    // https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4259433658
    const jobIdFromParams = parsedUrl.searchParams.get("currentJobId");
    if (jobIdFromParams && /^\d+$/.test(jobIdFromParams)) {
      return `${JOB_POSTING_PATH}/${jobIdFromParams}`;
    }

    // Not a recognized job posting URL
    return null;
  } catch {
    return null;
  }
}
