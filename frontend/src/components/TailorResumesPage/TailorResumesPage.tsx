import { useEffect, useState } from "react";

export default function TailorResumesPage() {
  const [jobPostingUrl, setJobPostingUrl] = useState<string | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_LINKED_IN_JOB_URL" }, (linkedInJobUrl) => {
      setJobPostingUrl(linkedInJobUrl);
    });
  }, []);

  const isValidLinkedInJobPosting = jobPostingUrl !== null;

  return (
    <div className="resume-tailor-form">
      {isValidLinkedInJobPosting ?
        (
          <button className="btn btn-primary">
            Tailor Resume
          </button>
        ) : (<span>Not a LinkedIn job posting page</span>)
      }
    </div>
  )
}
