"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { User, Lock, Bell, Shield, Mail, Phone, Camera, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/core/components/ui/switch";

interface ParentProfile {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  img: string | null;
}

export default function ParentSettingsPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Password change
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    attendanceAlerts: true,
    gradeAlerts: true,
    feeReminders: true,
    eventUpdates: true,
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [session]);

  async function loadProfile() {
    setLoading(true);
    try {
      if (!session?.user?.email) return;

      const res = await fetch(`/api/parents?email=${session.user.email}`);
      const data = await res.json();
      const parents = Array.isArray(data) ? data : [];
      
      if (parents.length > 0) {
        setProfile(parents[0]);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    if (!profile) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/parents/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.username,
          email: profile.email,
          phone: profile.phone,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    console.log("Starting photo upload:", file.name, file.size, file.type);

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (JPG, PNG, or GIF)");
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'parents');

      console.log("Uploading to /api/upload...");

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log("Upload response status:", uploadRes.status);

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        console.error("Upload failed:", error);
        throw new Error(error.error || 'Failed to upload photo');
      }

      const uploadData = await uploadRes.json();
      console.log("Upload successful:", uploadData);
      const { url } = uploadData;

      console.log("Updating parent profile with new photo URL:", url);

      // Update profile with new photo URL
      const updateRes = await fetch(`/api/parents/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ img: url }),
      });

      console.log("Profile update response status:", updateRes.status);

      if (!updateRes.ok) {
        const error = await updateRes.json();
        console.error("Profile update failed:", error);
        throw new Error('Failed to update profile photo');
      }

      const updatedProfile = await updateRes.json();
      console.log("Profile updated successfully:", updatedProfile);

      // Update local state to show new photo immediately
      setProfile(prev => prev ? { ...prev, img: url } : null);
      
      alert("Profile photo updated successfully! The page will reload.");
      
      // Reload the page to refresh all instances of the photo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Failed to upload photo:", error);
      alert(error.message || "Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSaveNotifications() {
    setSavingNotifications(true);
    try {
      // In a real app, you would save to database
      // For now, we'll just save to localStorage
      localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
      
      alert("Notification preferences saved successfully!");
    } catch (error) {
      console.error("Failed to save notifications:", error);
      alert("Failed to save notification preferences. Please try again.");
    } finally {
      setSavingNotifications(false);
    }
  }

  async function handleChangePassword() {
    if (!profile) return;

    // Validation
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert("Please fill in all password fields");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match");
      return;
    }

    if (passwords.new.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setChangingPassword(true);
    try {
      console.log("Changing password for parent:", profile.id);
      
      const res = await fetch(`/api/parents/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: passwords.new,
        }),
      });

      const data = await res.json();
      console.log("Password change response:", data);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      alert("Password changed successfully! Please login again with your new password.");
      setPasswords({ current: '', new: '', confirm: '' });
      
      // Sign out after password change
      setTimeout(() => {
        window.location.href = '/api/auth/signout';
      }, 2000);
    } catch (error: any) {
      console.error("Failed to change password:", error);
      alert(error.message || "Failed to change password. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  }

  // Load notification preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load notification preferences:", error);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  {profile?.img && (
                    <AvatarImage src={profile.img} alt={profile.username} />
                  )}
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {profile?.username?.substring(0, 2).toUpperCase() || "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    disabled={uploadingPhoto}
                  >
                    <Camera className="h-4 w-4" />
                    {uploadingPhoto ? "Uploading..." : "Change Photo"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Full Name</Label>
                  <Input
                    id="username"
                    value={profile?.username || ""}
                    onChange={(e) => setProfile(prev => prev ? {...prev, username: e.target.value} : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={profile?.email || ""}
                      onChange={(e) => setProfile(prev => prev ? {...prev, email: e.target.value} : null)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      value={profile?.phone || ""}
                      onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose how you want to receive updates about your children.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General Notifications */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">General</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({...prev, emailNotifications: checked}))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications via text message
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({...prev, smsNotifications: checked}))
                    }
                  />
                </div>
              </div>

              {/* Specific Alerts */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold">Alert Types</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Attendance Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when your child is absent
                    </p>
                  </div>
                  <Switch
                    checked={notifications.attendanceAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({...prev, attendanceAlerts: checked}))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Grade Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified about new grades and results
                    </p>
                  </div>
                  <Switch
                    checked={notifications.gradeAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({...prev, gradeAlerts: checked}))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fee Reminders</Label>
                    <p className="text-xs text-muted-foreground">
                      Get reminders about pending fee payments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.feeReminders}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({...prev, feeReminders: checked}))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Event Updates</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified about school events and announcements
                    </p>
                  </div>
                  <Switch
                    checked={notifications.eventUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({...prev, eventUpdates: checked}))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications} disabled={savingNotifications}>
                  {savingNotifications ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Change Password</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="current-password" 
                    type={showPasswords.current ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({...prev, current: e.target.value}))}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input 
                    id="new-password" 
                    type={showPasswords.new ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({...prev, new: e.target.value}))}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({...prev, confirm: e.target.value}))}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={changingPassword}>
                  {changingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Active Sessions</Label>
                  <p className="text-xs text-muted-foreground">
                    Manage devices where you're logged in
                  </p>
                </div>
                <Button variant="outline" size="sm">View Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
