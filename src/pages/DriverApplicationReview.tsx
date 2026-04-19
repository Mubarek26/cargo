import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDriverApplicationStatus } from "@/hooks/use-driver-application-status";

const DriverApplicationReview: React.FC = () => {
  const navigate = useNavigate();
  const { fetchStatus, isLoading, status } = useDriverApplicationStatus();

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchStatus(token).then((result) => {
      if (result.notFound) {
        navigate("/driver-application");
      }
    });
  }, [fetchStatus, navigate]);

  React.useEffect(() => {
    if (status === "APPROVED") {
      navigate("/home");
    }
  }, [navigate, status]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Checking application status...</div>
      </div>
    );
  }

  if (status === "APPROVED") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-10 flex flex-col items-center">
        <img src="/images/logo-DGT-qY52.svg" alt="Logo" className="h-12 w-auto mb-6" />
        <h1 className="text-2xl font-semibold mb-2 text-slate-900">Application Under Review</h1>
        <p className="text-slate-600 mb-4 text-center">
          Thank you for submitting your driver application.<br />
          Our team will review your request within 4-5 working days.<br />
          You will be notified by email once your application is approved.
        </p>
        <div className="flex gap-3 mt-2">
          <Button onClick={() => window.location.reload()} variant="outline">Check Status</Button>
          <Button onClick={() => navigate(-1)} variant="ghost">Go Back</Button>
        </div>
      </div>
    </div>
  );
};

export default DriverApplicationReview;
