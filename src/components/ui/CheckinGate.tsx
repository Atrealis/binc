"use client";

import { useEffect, useState } from "react";
import CheckinCard from "@/components/ui/CheckinCard";

export default function CheckinGate({
  action,
  children,
}: {
  action: (formData: FormData) => void;
  children: React.ReactNode;
}) {
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    // Always require check-in on fresh load
    setCheckedIn(false);
  }, []);

  if (!checkedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">

        <div className="w-full max-w-md">
          <CheckinCard
            action={async (formData) => {
              await action(formData);
              setCheckedIn(true);
            }}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
