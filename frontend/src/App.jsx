import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

import LoginPage from "./auth/LoginPage";
import SignUp from "./auth/SignUp";

import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard";
import ManagePeople from "./pages/caregiver/ManagePeople";
import ManageReminders from "./pages/caregiver/ManageReminders";
import ManageMemories from "./pages/caregiver/ManageMemories";

import PatientDashboard from "./pages/patient/PatientDashboard";
import RecognizePeople from "./pages/patient/RecognizePeople";
import ViewReminders from "./pages/patient/ViewReminders";
import ViewMemories from "./pages/patient/ViewMemories";

import ProfilePage from "./pages/shared/ProfilePage";

function App() {

  const { user } = useAuth();

  return (
    <Routes>

      {/* Public routes */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" />}
      />

      <Route
        path="/signup"
        element={!user ? <SignUp /> : <Navigate to="/" />}
      />

      {/* Caregiver */}
      {user?.role === "caregiver" && (
        <>
          <Route path="/" element={<CaregiverDashboard />} />
          <Route path="/people" element={<ManagePeople />} />
          <Route path="/reminders" element={<ManageReminders />} />
          <Route path="/memories" element={<ManageMemories />} />
          <Route path="/profile" element={<ProfilePage />} />
        </>
      )}

      {/* Patient */}
      {user?.role === "patient" && (
        <>
          <Route path="/" element={<PatientDashboard />} />
          <Route path="/recognize" element={<RecognizePeople />} />
          <Route path="/reminders" element={<ViewReminders />} />
          <Route path="/memories" element={<ViewMemories />} />
          <Route path="/profile" element={<ProfilePage />} />
        </>
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />

    </Routes>
  );
}

export default App;