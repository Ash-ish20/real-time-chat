import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authuser, isUpdatingProfile, updateProfile } = useAuthStore();

  const handleImageUpload = async (e) => {};
  return (
    <div className="pt-20 h-screen">
      <div className="max-w-2xl bg-black mx-auto p-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold ">Profile</h1>
          <p className="my-2">Your profile information</p>
        </div>

        {/* avatar upload section  */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={authuser.profilePic || authuser.profilePic || "/vite.svg"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
            />
            <label
              htmlFor="avatar-upload"
              className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* user info section  */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-500 flex items-center gap-2">
              <User className="size-4 " />
              Full name
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
              {authuser.fullName}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-zinc-500 flex items-center gap-2">
              <Mail className="size-4 " />
              Email
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
              {authuser.email}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
