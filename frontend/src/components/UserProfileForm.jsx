import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/Tabs";
import { User, Phone, Lock, Mail } from "lucide-react";
import { userService } from "../services/userService";
import { toast } from "react-hot-toast";

const UserProfileForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    userType: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const userProfile = await userService.getUserProfile();
      if (userProfile) {
        setProfileData({
          fullName: userProfile.fullName || "",
          email: userProfile.email || "",
          phoneNumber: userProfile.phoneNumber || "",
          userType: userProfile.userType || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load profile data");
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswordForm = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return false;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return false;
    }

    if (!passwordData.currentPassword) {
      toast.error("Current password is required");
      return false;
    }

    return true;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await userService.updateProfile({
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
      });

      // Dispatch a custom event for header component to refresh user data
      const profileUpdatedEvent = new CustomEvent("profileUpdated", {
        detail: { fullName: profileData.fullName },
      });
      window.dispatchEvent(profileUpdatedEvent);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsSaving(true);

    try {
      await userService.updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Clear password fields after successful update
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8">Loading profile data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basicInfo" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 border-b">
            <TabsTrigger value="basicInfo">Basic Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="basicInfo">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className="pl-10"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      name="email"
                      value={profileData.email}
                      className="pl-10 bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      className="pl-10"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userType">Account Type</Label>
                  <Input
                    id="userType"
                    name="userType"
                    value={
                      profileData.userType === "farmer" ? "Farmer" : "Buyer"
                    }
                    className="bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Account type cannot be changed
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="security">
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="pl-10"
                      placeholder="Enter your current password"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="pl-10"
                      placeholder="Enter your new password"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Minimum 6 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="pl-10"
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
