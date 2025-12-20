import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useNavigationTracking() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const logNavigation = async () => {
      try {
        // Generate or get session ID
        let sessionId = sessionStorage.getItem("sp_session_id");
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          sessionStorage.setItem("sp_session_id", sessionId);
        }

        await supabase.from("navigation_logs").insert({
          user_id: user?.id || null,
          page_path: location.pathname,
          page_title: document.title,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: sessionId,
        });
      } catch (error) {
        // Silent fail - don't break the app for analytics
        console.error("Navigation tracking error:", error);
      }
    };

    logNavigation();
  }, [location.pathname, user?.id]);
}
