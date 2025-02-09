import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path to your Firebase config
import { getAuth } from "firebase/auth";

const SelectRole = () => 
{
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();

    const handleRoleSelection = async () => 
    {
        if (!role) 
        {
            setError("Please select a role before proceeding.");
            return;
        }

    try 
    {
        const user = auth.currentUser;
        if (user) 
        {

            await setDoc(doc(db, "users", user.uid), 
            {
            role: role,
            }, { merge: true });
            console.log("User role updated successfully");
            navigate("/home");
        }
    } 
    catch (err) 
    {
        setError("Failed to save role. Please try again.");
        console.error("Error saving role:", err);
    }
  };

    const isRoleSelected = (selectedRole) => 
    {
        return role === selectedRole;
    };

return(
    <div className="select-role-container">
        <h1>Select Your Role</h1>
        <div className="role-options">
        <button
          className={`role-button ${isRoleSelected("Job Seeker") ? "selected" : ""}`}
          onClick={() => setRole("Job Seeker")}
        >
        Job Seeker
        </button>
        <button
          className={`role-button ${isRoleSelected("Recruiter") ? "selected" : ""}`}
          onClick={() => setRole("Recruiter")}
        >
          Recruiter
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button className="proceed-button" onClick={handleRoleSelection}>
        Proceed
      </button>
    </div>
  );
};

export default SelectRole;